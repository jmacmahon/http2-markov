_ = require('underscore');

var chainMixin = {
  chain: function (start, length) {
    var out = [start];
    var current = start;
    while ((--length) > 0) {
      current = this.after(current);
      if (current === null) {
        return out;
      }
      out.push(current);
    }
    return out;
  }
};

var Static = exports.Static = function (allProbabilities) {
  if (allProbabilities === undefined) {
    throw TypeError("Need to provide argument: probabilities");
  }
  this.allProbabilities = allProbabilities;
};

_.extend(Static.prototype, chainMixin);

Static.prototype.after = function (before, rand) {
  if (before === undefined) {
    throw TypeError("Need to provide argument: before");
  }
  // assume the key exists for the static table -- make this part of sanity check
  var ourProbabilities = this.allProbabilities[before];
  rand = (rand === undefined) ? Math.random() : rand;
  for (var possibleResult in ourProbabilities) {
    rand -= ourProbabilities[possibleResult];
    if (rand < 0) {
      return possibleResult;
    }
  }
  return possibleResult;
};

var Dynamic = exports.Dynamic = function (trainingData) {
  this.trainingData = trainingData || {};
};

_.extend(Dynamic.prototype, chainMixin);

Dynamic.prototype.trainOne = function (before, after) {
  if (before === undefined || after === undefined) {
    throw TypeError("Need to provide arguments: before and after");
  }

  var dataBefore = this.trainingData[before];

  if (! dataBefore ) {
    dataBefore = this.trainingData[before] = { total: 0, counts: {} };
  }
  if (! dataBefore.counts[after] ) {
    dataBefore.counts[after] = 0;
  }
  dataBefore.total ++;
  dataBefore.counts[after] ++;

  return this.trainingData;
};

Dynamic.prototype.after = function (before, rand) {
  if (before === undefined) { throw TypeError("Need to provide argument: before"); }

  var ourData;
  if ((ourData = this.trainingData[before])) {
    rand = (rand === undefined) ? Math.random() : rand;
    rand *= ourData.total;
    for (var possibleResult in ourData.counts) {
      rand -= ourData.counts[possibleResult];
      if (rand < 0) {
        return possibleResult;
      }
    }
  } else {
    // a valid situation, just not one we can return meaningful data from
    return null;
  }
};
