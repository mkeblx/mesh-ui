'use strict';

var MV = MV || {};

if ( 'undefined' !== typeof exports && 'undefined' !== typeof module ) {
  MV.Progress = require('./Progress.js');
}

MV.ProgressRadial2D = function(options) {
  MV.Progress.call(this);

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

MV.ProgressRadial2D.prototype = Object.create(MV.Progress.prototype);

MV.ProgressRadial2D.prototype.init = function(options) {
  var width = options.width, height = options.width;

  var canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 2;
  this.canvas = canvas;

  this.ctx = canvas.getContext('2d');

  this.texture = new THREE.Texture(canvas);

  // RingGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength)
  var geo = new THREE.RingGeometry(width/2 - options.thickness, width/2, options.segments, 1, -Math.PI/2, options.arc);
  this._remapUVs( geo );

  var MatType = options.lit ? THREE.MeshStandardMaterial : THREE.MeshBasicMaterial;

  var mat = new MatType({
    map: this.texture,
    transparent: !options.bg,
    roughness: 1,
    metalness: 0
  });

  var mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.set(0, 0, -Math.PI/2);
  this.group.add(mesh);
};

MV.ProgressRadial2D.prototype._remapUVs = function(geo, size) {

  geo.computeBoundingBox();

  var max = geo.boundingBox.max,
      min = geo.boundingBox.min;
  var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
  var range = new THREE.Vector2(max.x - min.x, max.y - min.y);

  geo.faceVertexUvs[0] = [];
  for (var i = 0; i < geo.faces.length; i++) {
    var v1 = geo.vertices[geo.faces[i].a],
        v2 = geo.vertices[geo.faces[i].b],
        v3 = geo.vertices[geo.faces[i].c];

    var t1 = (Math.atan2(v1.y, v1.x) + Math.PI) / (Math.PI*2);
    var t2 = (Math.atan2(v2.y, v2.x) + Math.PI) / (Math.PI*2);
    var t3 = (Math.atan2(v3.y, v3.x) + Math.PI) / (Math.PI*2);

    var n = i / (geo.faces.length-1);
    geo.faceVertexUvs[0].push(
      [
        new THREE.Vector2(1-t1, 1-t1),
        new THREE.Vector2(1-t2, 1-t2),
        new THREE.Vector2(1-t3, 1-t3)
      ]);
  }

  geo.uvsNeedUpdate = true;

  geo.computeFaceNormals();
  geo.computeVertexNormals();
};

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
  module.exports = MV.ProgressBar2D;
}
