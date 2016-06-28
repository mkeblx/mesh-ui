'use strict';

var MV = MV || {};

if ( 'undefined' !== typeof exports && 'undefined' !== typeof module ) {
  MV.RoundedBarGeometry = require('./RoundedBarGeometry.js');
}

MV.Progress = function(options) {
  //this.options = _.defaults(options || {}, MV.Progress.OPTIONS);

  this.group = new THREE.Object3D();
};

MV.Progress.OPTIONS = {

};

MV.Progress.prototype._init = function(options, type) {
  var container = new THREE.Object3D();
  this.group.add(container);

  var width = options.width,
      thickness = options.thickness;

  this.canvas = document.createElement('canvas');
  this.canvas.width = 1024;
  this.canvas.height = 2;

  this.ctx = this.canvas.getContext('2d');

  this.texture = new THREE.Texture(this.canvas);

  var MatType = options.lit ? THREE.MeshStandardMaterial : THREE.MeshBasicMaterial;


  var segs = options.segments;
  var radius = thickness/2;

  var geo;

  if (type == 'bar') {
    if (options.rounded) {
      geo = new MV.RoundedBarGeometry(width, thickness, segs);
    } else {
      geo = new THREE.CylinderGeometry(radius, radius, width, segs, 1, true);
      geo.applyMatrix(new THREE.Matrix4().makeRotationZ( Math.PI / 2));
    }
  } else { // radial
    var tubeDiameter = thickness / 2;
    var radius = (width-thickness) / 2;

    geo = new THREE.TorusGeometry(radius, tubeDiameter, options.radialSegments, options.segments, options.arc);
    // geo.applyMatrix( new THREE.Matrix4().makeRotationFromEuler( { x:0, y: 0, z: 0 } ) );
  }

  var mat = new MatType( {
    map: this.texture,
    transparent: !options.bg,
    roughness: 1,
    metalness: 0
  } );

  var mesh = new THREE.Mesh(geo, mat);
  container.add(mesh);

  if (type == 'radial')
    mesh.rotation.set(0, Math.PI, Math.PI/2);

  this.mesh = mesh;
  this.container = container;
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
    var grd = ctx.createLinearGradient( 0,0, w,0 );
    for (var i = 0; i < colors.length; i++) {
      var stop = (1/(colors.length-1))*i;
      grd.addColorStop(stop, colors[i]);
    }

    ctx.fillStyle = grd;
    ctx.fillRect( 0,0, w,h );

    ctx.fillStyle = opts.bgColor;
    ctx.fillRect( w*vals[0],0, w,h );
  } else {
    if (vals.length && vals.length <= colors.length) {
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
