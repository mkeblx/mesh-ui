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

  //this.value = this.options.values[0];
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

  var MatType = options.lit ? THREE.MeshStandardMaterial : THREE.MeshBasicMaterial;

  var mat = new MatType({
    map: this.texture,
    transparent: !options.bg,
    roughness: 1,
    metalness: 0
  });

  var mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.set(0, Math.PI, Math.PI/2);

  this.group.add(mesh);
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
  this._draw(this.ctx, this.canvas, this._values, this._colors, this.options);

  this.texture.needsUpdate = true;
};

MV.ProgressRadial.prototype.update = function(dt) {
  this._update();
};

if ( 'undefined' !== typeof exports && 'undefined' !== typeof module ) {
  module.exports = MV.ProgressRadial;
}
