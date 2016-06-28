'use strict';

var MV = MV || {};

if ( 'undefined' !== typeof exports && 'undefined' !== typeof module ) {
  MV.Progress = require('./Progress.js');
}

MV.ProgressBar = function(options) {
  MV.Progress.call(this);

  this.options = _.defaults(options || {}, MV.ProgressBar.OPTIONS);

  this._colors = this.options.colors;
  this._values = this.options.values;

  this.init(this.options);

  this._update();
};

MV.ProgressBar.OPTIONS = {
  bgColor: '#666666',
  colors: ['#9c27b0','#2196f3','#e91e63','#00bcd4'],
  values: [0],
  bg: true,
  width: 1,
  thickness: 0.05,
  rounded: true,
  lit: false,
  segments: 16,
  gradient: false
};

MV.ProgressBar.prototype = Object.create(MV.Progress.prototype);

MV.ProgressBar.prototype.init = function(options) {
  this._init(options, 'bar');
};

MV.ProgressBar.prototype._update = function() {
  this._draw(this.ctx, this.canvas, this._values, this._colors, this.options);

  this.texture.needsUpdate = true;
};

MV.ProgressBar.prototype.update = function(dt) {
  this._update();
};

if ( 'undefined' !== typeof exports && 'undefined' !== typeof module ) {
  module.exports = MV.ProgressBar;
}