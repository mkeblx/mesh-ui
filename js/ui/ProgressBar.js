'use strict';

var MV = MV || {};

MV.ProgressBar = function(options) {
  this.options = _.defaults(options || {}, MV.ProgressBar.OPTIONS);

  this.init(this.options);

  this.flat = this.options.flat;

  this._colors = [ this.options.activeColor ];
  this._values = [];

  this.value = this.options.value;
};

MV.ProgressBar.OPTIONS = {
  activeColor: '#2196f3',
  bgColor: '#666666',
  value: 0,
  width: 1,
  thickness: 0.04,
  flat: false,
  rounded: true,
  lit: false,
  segments: 16
};

Object.defineProperties(MV.ProgressBar.prototype, {
  'value': {
    get: function() {
      return this._value;
    },
    set: function( val ) {
      if ( val !== this._value ) {
        this._value = THREE.Math.clamp( val, 0, 1 );
        this._update( this._value );
      }
    }
  },
  'flat': {
    get: function() {
      return this._flat;
    },
    set: function(val) {
      if (val !== this._flat) {
        this._flat = val;
        this.container.scale.set( 1, 1, val ? 0.0001 : 1 );
      }
    }
  }
});

MV.ProgressBar.prototype.init = function(options) {
  var group = new THREE.Object3D();
  var container = new THREE.Object3D();
  group.add(container);

  var width = options.width,
      thickness = options.thickness;

  var canvas = document.createElement('canvas');
  canvas.width = 2;
  canvas.height = 1024;
  this.canvas = canvas;

  var ctx = canvas.getContext('2d');
  this.ctx = ctx;

  var texture = new THREE.Texture(canvas);
  this.texture = texture;

  var MatType = options.lit ? THREE.MeshLambertMaterial : THREE.MeshBasicMaterial;


  var segs = options.segments;
  var radius = thickness/2;

  var geo;
  if (options.rounded) {
    geo = new MV.RoundedBarGeometry(width, thickness, segs);
  } else {
    geo = new THREE.CylinderGeometry(radius, radius, width, segs, 1, true);
    geo.applyMatrix(new THREE.Matrix4().makeRotationZ( Math.PI / 2));
  }

  var mat = new MatType( {
    map: this.texture
  } );

  var mesh = new THREE.Mesh(geo, mat);
  container.add(mesh);

  this.mesh = mesh;
  this.container = container;
  this.group = group;
};

MV.ProgressBar.prototype.getObject = function() {
  return this.group;
};

// set colors for parts
// arr: array of color strings
MV.ProgressBar.prototype.setColors = function( arr ) {
  this._colors = [];

  for (var i = 0; i < arr.length; i++) {
    this._colors.push( arr[i] );
  }
};

// set multiple values to display
// arr: array of values where values sum to <=1
// e.g. [ 0.3, 0.1, 0.6 ]
MV.ProgressBar.prototype.setValues = function( arr ) {
  this._values = [];

  for (var i = 0; i < arr.length; i++) {
    this._values.push( arr[i] );
  }

  this._update();
};

MV.ProgressBar.prototype._update = function() {
  var opts = this.options;
  var ctx = this.ctx;
  var vals = this._values;
  var w = this.canvas.width, h = this.canvas.height;

  ctx.fillStyle = opts.bgColor;
  ctx.fillRect( 0,0, w,h );

  if (vals.length && vals.length <= this._colors.length) {
    var start = 0;

    for (var i = 0; i < vals.length; i++) {
      var val = vals[i];

      ctx.fillStyle = this._colors[i];
      ctx.fillRect( 0, h*start, w,h*val );

      start += val;
    }
  }

  this.texture.needsUpdate = true;

  /* else {
    var colorL, colorR;

    if (pc === 1) {
      colorL = opts.activeColor;
      colorR = opts.activeColor;
    } else if (pc !== 0) {
      colorL = opts.activeColor;
      colorR = opts.bgColor;
    } else { // pc === 0
      colorL = opts.bgColor;
      colorR = opts.bgColor;
    }

    this.matL.color.setStyle( colorL );
    this.matR.color.setStyle( colorR );
  }*/

  //this.progressC.scale.setX(pc);
  //this.seekC.scale.setX(1-pc);
};

MV.ProgressBar.prototype.update = function(dt) {

};
