'use strict';

var MV = MV || {};

MV.ProgressRadial = function(options) {
  this.options = _.defaults(options || {}, MV.ProgressRadial.OPTIONS);

  this.init(this.options);

  this._colors = [ this.options.activeColor ];
  this._values = [];

  this.value = this.options.value;
};

MV.ProgressRadial.OPTIONS = {
  activeColor: '#2196f3',
  bgColor: '#666666',
  bg: true,
  value: 0,
  thickness: 0.1,
  rounded: true,
  width: 1,
  lit: false,
  segments: 52,
  radialSegments: 24,
  arc: Math.PI*2
};

Object.defineProperties(MV.ProgressRadial.prototype, {
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

MV.ProgressRadial.prototype.init = function(options) {
  var container = new THREE.Group();

  var width = options.width;

  var canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 2;
  this.canvas = canvas;

  var ctx = canvas.getContext('2d');
  this.ctx = ctx;

  var texture = new THREE.Texture(canvas);
  this.texture = texture;

  var tubeDiameter = options.thickness / 2;
  var radius = (width-options.thickness) / 2;

  // TorusGeometry(radius, tube, radialSegments, tubularSegments, arc)
  var geo = new THREE.TorusGeometry(radius, tubeDiameter, options.radialSegments, options.segments, options.arc);

  var MatType = options.lit ? THREE.MeshLambertMaterial : THREE.MeshBasicMaterial;

  var mat = new MatType({
    map: this.texture
  });

  var mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.set(0, Math.PI, Math.PI/2);

  container.add(mesh);

  this.container = container;
};

MV.ProgressRadial.prototype.getObject = function() {
  return this.container;
};

// set colors for parts
// arr: array of color strings
MV.ProgressRadial.prototype.setColors = function( arr ) {
  this._colors = [];

  for (var i = 0; i < arr.length; i++) {
    this._colors.push( arr[i] );
  }
};

// set multiple values to display
// arr: array of values where values sum to <=1
// e.g. [ 0.3, 0.1, 0.6 ]
MV.ProgressRadial.prototype.setValues = function( arr ) {
  this._values = [];

  for (var i = 0; i < arr.length; i++) {
    this._values.push( arr[i] );
  }

  this._update();
};

MV.ProgressRadial.prototype._update = function() {
  var opts = this.options;
  var ctx = this.ctx;
  var w = this.canvas.width, h = this.canvas.height;

  ctx.fillStyle = opts.bgColor;
  ctx.fillRect( 0,0, w,h );

  if (this._values.length && this._values.length <= this._colors.length) {
    var start = 0;

    for (var i = 0; i < this._values.length; i++) {
      var val = this._values[i];

      ctx.fillStyle = this._colors[i];
      ctx.fillRect( w*start,0, w*val,h );

      start += val;
    }
  }

  this.texture.needsUpdate = true;
};

MV.ProgressRadial.prototype.update = function(dt) {

};
