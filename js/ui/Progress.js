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

// set colors for parts
// arr: array of color strings
MV.Progress.prototype.setColors = function(arr) {
  this._colors = [];

  for (var i = 0; i < arr.length; i++) {
    this._colors.push( arr[i] );
  }
};

// set multiple values to display
// arr: array of values where values sum to <=1
// e.g. [ 0.3, 0.1, 0.6 ]
MV.Progress.prototype.setValues = function(arr)  {
  this._values = [];

  for (var i = 0; i < arr.length; i++) {
    this._values.push( arr[i] );
  }

  this._update();
};

// draw segments & gradients
MV.Progress.prototype._draw = function(ctx, canvas, vals, colors, opts) {
  var w = canvas.width, h = canvas.height;

  if (!opts.bg) {
    ctx.clearRect( 0,0, w,h );
  } else {
    ctx.fillStyle = opts.bgColor;
    ctx.fillRect( 0,0, w,h );
  }

  if (opts.gradient && colors.length > 1) {
    var grd = ctx.createLinearGradient( 0,0, w,h );
    for (var i = 0; i < colors.length; i++) {
      var stop = (1/(colors.length-1))*i;
      grd.addColorStop(stop, colors[i]);
    }

    ctx.fillStyle = grd;
    ctx.fillRect( 0,0, w,h );

    ctx.fillStyle = opts.bgColor;
    ctx.fillRect( w*vals[0],0, w,h );
  } else {
    if (vals.length && vals.length <= this._colors.length) {
      var start = 0;

      for (var i = 0; i < vals.length; i++) {
        var val = vals[i];

        ctx.fillStyle = colors[i];
        ctx.fillRect( w*start,0, w*val,h );

        start += val;
      }
    }
  }
};

MV.Progress.prototype._update = function(pc) {

};

MV.Progress.prototype.update = function(dt) {

};

if ( 'undefined' !== typeof exports && 'undefined' !== typeof module ) {
  module.exports = MV.Progress;
}
