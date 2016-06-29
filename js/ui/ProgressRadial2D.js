'use strict';

var MV = MV || {};

if ( 'undefined' !== typeof exports && 'undefined' !== typeof module ) {
  MV.Progress = require('./Progress.js');
}

MV.ProgressRadial2D = function(options) {
  MV.Progress.call(this, options);

  this.options = _.defaults(options || {}, MV.ProgressRadial2D.OPTIONS);

  this._colors = this.options.colors;
  this._values = this.options.values;

  this.init(this.options);

  //this.value = this.options.values[0];
  this._update();
};


MV.ProgressRadial2D.prototype = Object.create(MV.Progress.prototype);

MV.ProgressRadial2D.prototype._update = function( ) {
  this._draw(this.ctx, this.canvas, this._values, this._colors, this.options);

  this.texture.needsUpdate = true;
  return;

  var ctx = this.ctx;
  var opts = this.options;
  var vals = this._values;
  var colors = this._colors;
  var w = this.canvas.width, h = this.canvas.height;

  ctx.clearRect(0,0, w,h);

  // arc(x, y, radius, startAngle, endAngle, anticlockwise)

  var a = -Math.PI/2; // initial angle: -90deg

  var lineWidth = opts.thickness / opts.width * w;

  var radius = w/2 - lineWidth/2 - 0.5;

  var cxy = w/2;

  // bg
  if (opts.bg) {
    ctx.fillStyle = opts.bgColor;
    ctx.fillRect( 0,0, w,h );
  }

  ctx.lineWidth = lineWidth + 3;

  var startAngle = -Math.PI/2;
  var endAngle;

  // TODO: fix gradient mode, gradient is in screen space
  if (opts.gradient && colors.length > 1) {
    var grd = ctx.createLinearGradient( 0,0, w,h );
    grd.addColorStop(0, colors[0]);
    grd.addColorStop(1, colors[1]);

    ctx.beginPath();
    ctx.arc(cxy, cxy, radius, startAngle, startAngle+Math.PI*2*vals[0], false);

    if (opts.rounded) {
      ctx.lineCap = 'round';
    }

    ctx.strokeStyle = grd;
    ctx.stroke();
  } else {
    if (vals.length && vals.length <= colors.length) {
      var total = 0;
      for (var i = 0; i < vals.length; i++) {
        total += vals[i];
      }

      var frac = opts.arc / (Math.PI*2);

      var length = total * frac;
      for (var i = vals.length-1; i >= 0; i--) {
        var val = vals[i] * frac;

        ctx.beginPath();
        var angleVal = Math.PI*2 * val;
        endAngle = Math.PI*2 * length;

        ctx.arc(cxy, cxy, radius, startAngle, (startAngle+endAngle), false);

        if (opts.rounded) {
          ctx.lineCap = 'round';
        }

        ctx.strokeStyle = colors[i];
        ctx.stroke();

        length -= val;
      }
    }
  }

  this.texture.needsUpdate = true;
};

MV.ProgressRadial2D.prototype.update = function(dt) {
  this._update();
};

if ( 'undefined' !== typeof exports && 'undefined' !== typeof module ) {
  module.exports = MV.ProgressRadial2D;
}
