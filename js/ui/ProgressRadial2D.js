'use strict';

var MV = MV || {};

MV.ProgressRadial2D = function(options) {
  this.options = _.defaults(options || {}, MV.ProgressRadial2D.OPTIONS);

  this._colors = this.options.colors;
  this._values = this.options.values;

  this.init(this.options);

  //this.value = this.options.values[0];
  this._update();
};

MV.ProgressRadial2D.OPTIONS = {
  bgColor: '#666666',
  colors: ['#9c27b0','#2196f3','#e91e63','#00bcd4'],
  values: [0],
  bg: true,
  thickness: 0.1,
  rounded: true,
  width: 1,
  lit: false,
  segments: 52,
  arc: Math.PI*2,
  gradient: false
};

Object.defineProperties(MV.ProgressRadial2D.prototype, {
  'value': {
    get: function() {
      return this._values.length ? this._values[0] : 0;
    },
    set: function(val) {
      if (val !== this._value) {
        val = THREE.Math.clamp( val, 0, 1 );
        this.setValues( [ val ] );
        this._update( );
      }
    }
  }
});

MV.ProgressRadial2D.prototype.init = function(options) {
  var container = new THREE.Group();

  var width = options.width, height = options.width;

  var canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = canvas.width;
  this.canvas = canvas;

  var ctx = canvas.getContext('2d');
  this.ctx = ctx;

  var texture = new THREE.Texture(canvas);
  this.texture = texture;

  // RingGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength)
  var geo = new THREE.RingGeometry(width/2 - options.thickness, width/2, options.segments, 1, -Math.PI/2, options.arc);

  var MatType = options.lit ? THREE.MeshStandardMaterial : THREE.MeshBasicMaterial;

  var mat = new MatType({
    map: this.texture,
    transparent: !options.bg,
    roughness: 1,
    metalness: 0
  });

  var mesh = new THREE.Mesh(geo, mat);
  container.add(mesh);

  this.container = container;
};

MV.ProgressRadial2D.prototype.getObject = function() {
  return this.container;
};

// set colors for parts
// arr: array of color strings
MV.ProgressRadial2D.prototype.setColors = function( arr ) {
  this._colors = [];

  for (var i = 0; i < arr.length; i++) {
    this._colors.push( arr[i] );
  }
};

// set multiple values to display
// arr: array of values where values sum to <=1
// e.g. [ 0.3, 0.1, 0.6 ]
MV.ProgressRadial2D.prototype.setValues = function( arr ) {
  this._values = [];

  for (var i = 0; i < arr.length; i++) {
    this._values.push( arr[i] );
  }

  this._update();
};

MV.ProgressRadial2D.prototype._update = function( ) {
  var ctx = this.ctx;
  var opts = this.options;
  var vals = this._values;
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
  if (opts.gradient && this._colors.length > 1) {
    var grd = ctx.createLinearGradient( 0,0, w,h );
    grd.addColorStop(0, this._colors[0]);
    grd.addColorStop(1, this._colors[1]);

    ctx.beginPath();
    ctx.arc(cxy, cxy, radius, startAngle, startAngle+Math.PI*2*vals[0], false);

    if (opts.rounded) {
      ctx.lineCap = 'round';
    }

    ctx.strokeStyle = grd;
    ctx.stroke();
  } else {
    if (vals.length && vals.length <= this._colors.length) {
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

        ctx.strokeStyle = this._colors[i];
        ctx.stroke();

        length -= val;
      }
    }
  }

  this.texture.needsUpdate = true;
};

MV.ProgressRadial2D.prototype.update = function(dt) {

};

if ( 'undefined' !== typeof exports && 'undefined' !== typeof module ) {
  module.exports = MV.ProgressBar2D;
}
