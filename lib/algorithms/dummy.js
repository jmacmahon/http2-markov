var Dummy = module.exports = function Dummy (toReturn) {
  this.toReturn = toReturn !== undefined ? toReturn : '/';
};

Dummy.prototype.after = function () {
  return this.toReturn;
};
