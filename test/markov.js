var chai = require('chai');
var should = chai.should();
var assert = chai.assert;

var markov = require('../lib/markov');
describe('markov', function () {
  describe('Static', function () {
    it('should throw an error when no probabilities argument is passed', function () {
      (function () {
        var s = new markov.Static();
      }).should.throw(TypeError, 'Need to provide argument: probabilities');
    });
    describe('after', function () {
      it('should throw an error when no before argument is passed', function () {
        var s = new markov.Static({});
        (function () {
          s.after();
        }).should.throw(TypeError, 'Need to provide argument: before');
      });
      var tests = [
        {
          probabilities: {'a': {'a': 1.0}},
          cases: [
            { before: 'a', rand: 0.5, after: 'a' },
            { before: 'a', rand: 0.0, after: 'a' },
            { before: 'a', rand: 0.99, after: 'a' },
          ]
        },
        {
          probabilities: {'a': {'a': 0.3, 'b': 0.7}, 'b': {'a': 0.7, 'b': 0.3}},
          cases: [
            { before: 'a', rand: 0.0, after: 'a' },
            { before: 'a', rand: 0.29, after: 'a' },
            { before: 'a', rand: 0.3, after: 'b' },
            { before: 'a', rand: 0.99, after: 'b' },
            { before: 'b', rand: 0.0, after: 'a' },
            { before: 'b', rand: 0.69, after: 'a' },
            { before: 'b', rand: 0.7, after: 'b' },
            { before: 'b', rand: 0.99, after: 'b' },
          ]
        }
      ];
      tests.forEach(function (test) {
        describe('probabilities = ' + JSON.stringify(test.probabilities), function () {
          var s = new markov.Static(test.probabilities);
          test.cases.forEach(function (case_) {
            it('should return ' + case_.after + ' after ' + case_.before + '; rand = ' + case_.rand, function () {
              s.after(case_.before, case_.rand).should.equal(case_.after);
            });
          });
        });
      });
    });
    describe('chain', function () {
      var s = new markov.Static({'a': {'a': 0.3, 'b': 0.7}, 'b': {'a': 0.7, 'b': 0.3}});
      it('should return an array of the correct length', function () {
        s.chain('a', 20).should.have.property('length', 20);
      });
      it('should contain both "a" and "b" (unless we are very unlucky)', function () {
        s.chain('a', 500).should.contain('a').and.contain('b');
      });
    });
  });
  describe('Dynamic', function () {
    it('should use a default trainingData object when no argument is passed', function () {
      var d = new markov.Dynamic();
      should.exist(d.trainingData);
      d.trainingData.should.deep.equal({});
    });
    describe('after', function () {
      it('should throw an error when no before argument is passed', function () {
        var d = new markov.Dynamic({});
        (function () {
          d.after();
        }).should.throw(TypeError, 'Need to provide argument: before');
      });
    });
    describe('trainOne', function () {
      var d;
      beforeEach(function () {
        d = new markov.Dynamic({});
      });
      it('should throw an error when no before or after arguments are passed', function () {
        (function () {
          d.trainOne();
        }).should.throw(TypeError, 'Need to provide arguments: before and after');
        (function () {
          d.trainOne('a');
        }).should.throw(TypeError, 'Need to provide arguments: before and after');
      });
      it('should initialise new training values', function () {
        d.trainOne('a', 'b');
        d.trainingData.should.have.deep.property('a.total', 1);
        d.trainingData.should.have.deep.property('a.counts.b', 1);
      });
      it('should add training data properly', function () {
        d.trainOne('a', 'b');
        d.trainOne('a', 'b');
        d.trainOne('a', 'a');
        d.trainingData.should.have.deep.property('a.total', 3);
        d.trainingData.should.have.deep.property('a.counts.a', 1);
        d.trainingData.should.have.deep.property('a.counts.b', 2);
      });
    });
    describe('after', function () {
      // TODO
    });
    describe('chain', function () {
      var d = new markov.Dynamic({
        'a': {
          total: 10,
          counts: {'a': 3, 'b': 7},
        },
        'b': {
          total: 10,
          counts: {'a': 7, 'b': 3}
        }
      });
      it('should return an array of the correct length', function () {
        d.chain('a', 20).should.have.property('length', 20);
      });
      it('should contain both "a" and "b" (unless we are very unlucky)', function () {
        d.chain('a', 500).should.contain('a').and.contain('b');
      });
      it('should handle terminating items correctly', function () {
        d = new markov.Dynamic({
          'a': {
            total: 1,
            counts: {'b': 1},
          },
        });
        d.chain('a', 20).should.deep.equal(['a', 'b']);
      });
    });
  });
});
