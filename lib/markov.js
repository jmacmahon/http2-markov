exports.Static = function (allProbabilities) {
  if (allProbabilities === undefined) {
    throw TypeError("Need to provide argument: probabilities");
  }
  return {
    after: function (before, rand) {
      if (before === undefined) {
        throw TypeError("Need to provide argument: before");
      }
      // assume the key exists for the static table -- make this part of sanity check
      var ourProbabilities = allProbabilities[before];
      rand = (rand === undefined) ? Math.random() : rand;
      for (var possibleResult in ourProbabilities) {
        rand -= ourProbabilities[possibleResult];
        if (rand < 0) {
          return possibleResult;
        }
      }
      return possibleResult;
    },
    // put this in a mixin for when we do dynamic things too?
    chain: function (start, length) {
      var out = [start];
      var current = start;
      while ((--length) > 0) {
        current = this.after(current);
        out.push(current);
      }
      return out;
    },
  };
};

exports.Dynamic = function (trainingData) {
  trainingData = trainingData || {};
  return  {
    trainingData: trainingData,
    trainOne: function (before, after) {
      if (before === undefined || after === undefined) {
        throw TypeError("Need to provide arguments: before and after");
      }
      if (! trainingData[before] ) {
        trainingData[before] = { total: 0, counts: {} };
      }
      if (! trainingData[before].counts[after] ) {
        trainingData[before].counts[after] = 0;
      }
      trainingData[before].total ++;
      trainingData[before].counts[after] ++;

      return trainingData;
    },
    after: function (before, rand) {
      if (before === undefined) {
        throw TypeError("Need to provide argument: before");
      }
      var ourData;
      if ((ourData = trainingData[before])) {
        // TODO check if rand is [0,1) as assumed
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
    },
    // put this in a mixin for when we do dynamic things too?
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
};
