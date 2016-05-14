'use strict';

var MV = MV || {};

MV.ProgressBar2D = function(options) {
  this.options = _.defaults(options || {}, MV.ProgressBar2D.OPTIONS);

  this.init(this.options);

  this._colors = [ this.options.activeColor ];
  this._values = [];

  this.value = this.options.value;
};

MV.ProgressBar2D.OPTIONS = {
  activeColor: '#2196f3',
  bgColor: '#666666',
  value: 0,
  width: 1,
  thickness: 0.02,
  rounded: true,
  lit: false,
  segments: 16
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
  var radius = thickness/2;

  var _width = options.rounded ? width - 2*radius : width;

  var geo = new THREE.PlaneGeometry(_width, thickness, 1, 1);

  var mat = new MatType( {
    map: this.texture
  } );

  var mesh = new THREE.Mesh(geo, mat);
  container.add(mesh);


  if (options.rounded) {
    // main
    var pc = (width - thickness) / width;
    var rep = (1 - pc) / 2;

    mat.map.repeat.x = pc;
    mat.map.offset.x = rep;

    // end caps
    var capGeo = new THREE.CircleGeometry(radius, segs, Math.PI/2, Math.PI);

    var textureL = new THREE.Texture(canvas);
    this.textureL = textureL;

    var matL = new MatType( {
      map: textureL
    });
    matL.map.repeat.x = rep * 2;
    matL.map.offset.x = 0;
    var capMeshL = new THREE.Mesh(capGeo, matL);
    this.capMeshL = capMeshL;


    var textureR = new THREE.Texture(canvas);
    this.textureR = textureR;

    var matR = new MatType( {
      map: textureR
    });
    matR.map.repeat.x = rep * 2;
    matR.map.offset.x = pc;
    capGeo = new THREE.CircleGeometry(radius, segs, -Math.PI/2, Math.PI);
    var capMeshR = new THREE.Mesh(capGeo, matR);
    this.capMeshR = capMeshR;

    capMeshL.position.setX( -_width/2 );
    capMeshR.position.setX(  _width/2 );

    container.add(capMeshL);
    container.add(capMeshR);

    this.matL = matL;
    this.matR = matR;
  }

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

  if (opts.rounded) {
    this.textureL.needsUpdate = true;
    this.textureR.needsUpdate = true;
  }
};

MV.ProgressBar2D.prototype.update = function(dt) {

};
