'use strict';

var MV = MV || {};

MV.ProgressBar2D = function(options) {
  this.options = _.defaults(options || {}, MV.ProgressBar2D.OPTIONS);

  this.init(this.options);

  this._colors = this.options.colors;
  this._values = [];

  this.value = this.options.values[0];
};

MV.ProgressBar2D.OPTIONS = {
  bgColor: '#666666',
  colors: ['#9c27b0','#2196f3','#e91e63','#00bcd4'],
  values: [0],
  bg: false,
  width: 1,
  thickness: 0.02,
  rounded: true,
  lit: false,
  segments: 16,
  gradient: false
};

Object.defineProperties(MV.ProgressBar2D.prototype, {
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

MV.ProgressBar2D.prototype.init = function(options) {
  var group = new THREE.Object3D();
  var container = new THREE.Object3D();
  group.add(container);

  var width = options.width,
      thickness = options.thickness;

  var canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 2;
  this.canvas = canvas;

  var ctx = canvas.getContext('2d');
  this.ctx = ctx;

  var texture = new THREE.Texture(canvas);
  this.texture = texture;

  var MatType = options.lit ? THREE.MeshLambertMaterial : THREE.MeshBasicMaterial;


  var segs = options.segments;

  var geo;
  if (options.rounded) {
    geo = new MV.RoundedBarGeometry2D(width, thickness, segs);
  } else {
    geo = new THREE.PlaneGeometry(width, thickness, 1, 1);
  }

  var mat = new MatType( {
    map: this.texture,
    transparent: !options.bg
  } );

  var mesh = new THREE.Mesh(geo, mat);
  container.add(mesh);

  /* progress
  var progressC = new THREE.Object3D();

  var geo = new THREE.PlaneGeometry(width, height);
  var mat = new THREE.MeshBasicMaterial({ color: options.activeColor });

  var mesh = new THREE.Mesh(geo, mat);
  mesh.position.setX(width/2);
  progressC.add(mesh);
  progressC.position.setX(-width/2);

  progressC.scale.setX(0.001);

  this.progressC = progressC;
  container.add(progressC);

  // background
  var seekC = new THREE.Object3D();

  var geo = new THREE.PlaneGeometry(width, height);
  var mat = new THREE.MeshBasicMaterial({ color: options.bgColor });

  var mesh = new THREE.Mesh(geo, mat);
  mesh.position.setX(-width/2);
  seekC.add(mesh);
  seekC.position.setX(width/2);

  seekC.scale.setX(0.9999);

  this.seekC = seekC;
  container.add(seekC);*/

  this.mesh = mesh;
  this.container = container;
  this.group = group;
};

MV.ProgressBar2D.prototype.getObject = function() {
  return this.group;
};

// set colors for parts
// arr: array of color strings
MV.ProgressBar2D.prototype.setColors = function( arr ) {
  this._colors = [];

  for (var i = 0; i < arr.length; i++) {
    this._colors.push( arr[i] );
  }
};

// set multiple values to display
// arr: array of values where values sum to <=1
// e.g. [ 0.3, 0.1, 0.6 ]
MV.ProgressBar2D.prototype.setValues = function( arr ) {
  this._values = [];

  for (var i = 0; i < arr.length; i++) {
    this._values.push( arr[i] );
  }

  this._update();
};

MV.ProgressBar2D.prototype._update = function() {
  var opts = this.options;
  var ctx = this.ctx;
  var vals = this._values;
  var w = this.canvas.width, h = this.canvas.height;

  if (!opts.bg) {
    ctx.clearRect( 0,0, w,h );
  } else {
    ctx.fillStyle = opts.bgColor;
    ctx.fillRect( 0,0, w,h );
  }

  if (opts.gradient && this._colors.length > 1) {
    var grd = ctx.createLinearGradient( 0,0, w,h );
    grd.addColorStop(0, this._colors[0]);
    grd.addColorStop(1, this._colors[1]);

    ctx.fillStyle = grd;
    ctx.fillRect( 0,0, w,h );

    ctx.fillStyle = opts.bgColor;
    ctx.fillRect( w*vals[0],0, w,h );
  } else {
    if (vals.length && vals.length <= this._colors.length) {
      var start = 0;

      for (var i = 0; i < vals.length; i++) {
        var val = vals[i];

        ctx.fillStyle = this._colors[i];
        ctx.fillRect( w*start,0, w*val,h );

        start += val;
      }
    }
  }

  this.texture.needsUpdate = true;
};

MV.ProgressBar2D.prototype.update = function(dt) {

};
