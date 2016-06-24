'use strict';

var MV = MV || {};

MV.Progress = function(options) {
  //this.options = _.defaults(options || {}, MV.Progress.OPTIONS);

  this.group = new THREE.Object3D();
};

MV.Progress.OPTIONS = {

};

MV.Progress.prototype.getObject = function() {
  return this.group;
};


MV.Progress.prototype._update = function(pc) {

};

MV.Progress.prototype.update = function(dt) {

};

if ( 'undefined' !== typeof exports && 'undefined' !== typeof module ) {
  module.exports = MV.Progress;
}
