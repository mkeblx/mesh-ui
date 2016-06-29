'use strict';

var MV = MV || {};

if ( 'undefined' !== typeof exports && 'undefined' !== typeof module ) {
  MV.Progress = require('./Progress.js');
  MV.RoundedBarGeometry2D = require('./RoundedBarGeometry2D.js');
}

MV.ProgressBar2D = function(options) {
  MV.Progress.call(this, options);

  this.options = _.defaults(options || {}, MV.ProgressBar2D.OPTIONS);

  this._colors = this.options.colors;
  this._values = this.options.values;

  this.init(this.options);

  this._update();
};

MV.ProgressBar2D.OPTIONS = {
  bgColor: '#666666',
  colors: ['#9c27b0','#2196f3','#e91e63','#00bcd4'],
  values: [0],
  bg: true,
  width: 1,
  thickness: 0.02,
  rounded: true,
  lit: false,
  segments: 16,
  gradient: false
};

MV.ProgressBar2D.prototype = Object.create(MV.Progress.prototype);

MV.ProgressBar2D.prototype.init = function(options) {
  var container = new THREE.Object3D();
  this.group.add(container);

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

  var MatType = options.lit ? THREE.MeshStandardMaterial : THREE.MeshBasicMaterial;


  var segs = options.segments;

  var geo;
  if (options.rounded) {
    geo = new MV.RoundedBarGeometry2D(width, thickness, segs);
  } else {
    geo = new THREE.PlaneGeometry(width, thickness, 1, 1);
  }

  var mat = new MatType( {
    map: this.texture,
    transparent: !options.bg,
    roughness: 1,
    metalness: 0
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
};

MV.ProgressBar2D.prototype._update = function() {
  this._draw(this.ctx, this.canvas, this._values, this._colors, this.options);

  this.texture.needsUpdate = true;
};

MV.ProgressBar2D.prototype.update = function(dt) {
  this._update();
};

if ( 'undefined' !== typeof exports && 'undefined' !== typeof module ) {
  module.exports = MV.ProgressBar2D;
}