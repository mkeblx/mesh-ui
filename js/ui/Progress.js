'use strict';

var MV = MV || {};

MV.Progress = function(options) {
  this.options = _.defaults(options || {}, MV.Progress.OPTIONS);

  this.init(this.options);

  this._value;
  this.value = this.options.value;
};

MV.Progress.OPTIONS = {

};


MV.Progress.prototype.init = function(options) {

};

MV.Progress.prototype.getObject = function() {

};


MV.Progress.prototype._update = function(pc) {

};

MV.Progress.prototype.update = function(dt) {

};
