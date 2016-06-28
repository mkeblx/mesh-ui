'use strict';

var MV = MV || {};

if ( 'undefined' !== typeof exports && 'undefined' !== typeof module ) {
  MV.Progress = require('./Progress.js');
}

MV.ProgressRadial = function(options) {
  MV.Progress.call(this);

  this.options = _.defaults(options || {}, MV.ProgressRadial.OPTIONS);

  this._colors = this.options.colors;
  this._values = this.options.values;

  this.init(this.options);

  this._update();
};

MV.ProgressRadial.OPTIONS = {
  bgColor: '#666666',
  colors: ['#9c27b0','#2196f3','#e91e63','#00bcd4'],
  values: [0],
  bg: true,
  thickness: 0.1,
  rounded: true,
  width: 1,
  lit: false,
  segments: 52,
  radialSegments: 24,
  arc: Math.PI*2,
  gradient: false
};

MV.ProgressRadial.prototype = Object.create(MV.Progress.prototype);

MV.ProgressRadial.prototype.init = function(options) {
  this._init(options, 'radial');
};

MV.ProgressRadial.prototype._update = function() {
  this._draw(this.ctx, this.canvas, this._values, this._colors, this.options);

  this.texture.needsUpdate = true;
};

MV.ProgressRadial.prototype.update = function(dt) {
  this._update();
};

if ( 'undefined' !== typeof exports && 'undefined' !== typeof module ) {
  module.exports = MV.ProgressRadial;
}
