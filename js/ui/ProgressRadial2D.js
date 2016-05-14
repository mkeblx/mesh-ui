'use strict';

var MV = MV || {};

MV.ProgressRadial2D = function(options) {
  this.options = _.defaults(options || {}, MV.ProgressRadial2D.OPTIONS);

  this.init(this.options);

  this._colors = [ this.options.activeColor ];
  this._values = [];

  this.value = this.options.value;
};

MV.ProgressRadial2D.OPTIONS = {
  activeColor: '#2196f3',
  bgColor: '#666666',
  bg: true,
  value: 0,
  thickness: 0.1,
  rounded: true,
  width: 1,
  segments: 52
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

  var geo = new THREE.RingGeometry(width/2 - options.thickness, width/2, options.segments, 1);
  var mat = new THREE.MeshBasicMaterial({
    map: this.texture
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

  ctx.clearRect(0,0, this.canvas.width, this.canvas.height);


  // arc(x, y, radius, startAngle, endAngle, anticlockwise)

  var a = -Math.PI/2; // initial angle: -90deg

  var lineWidth = this.options.thickness / this.options.width * this.canvas.width;

  var radius = this.canvas.width/2 - lineWidth/2 - 0.5;

  var cxy = this.canvas.width/2;

  // bg
  if (this.options.bg) {
    ctx.fillStyle = this.options.bgColor;
    ctx.fillRect( 0,0, this.canvas.width,this.canvas.height );
  }

  ctx.lineWidth = lineWidth + 3;

  if (this._values.length && this._values.length <= this._colors.length) {
    var total = 0;
    for (var i = 0; i < this._values.length; i++) {
      total += this._values[i];
    }

    var startAngle = -Math.PI/2;
    var endAngle;

    var length = total;
    for (var i = this._values.length-1; i >= 0; i--) {
      var val = this._values[i];

      ctx.beginPath();
      var angleVal = Math.PI*2 * val;
      endAngle = Math.PI*2 * length;

      ctx.arc(cxy, cxy, radius, startAngle, startAngle+endAngle, false);

      if (this.options.rounded) {
        ctx.lineCap = 'round';
      }

      ctx.strokeStyle = this._colors[i];
      ctx.stroke();

      length -= val;
    }
  }

  this.texture.needsUpdate = true;
};

MV.ProgressRadial2D.prototype.update = function(dt) {

};
