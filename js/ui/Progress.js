'use strict';

import RoundedBarGeometry from './RoundedBarGeometry.js';
import RoundedBarGeometry2D from './RoundedBarGeometry2D.js';
import RoundedTorusGeometry from './RoundedTorusGeometry.js';

var Progress = function(options) {
  this.options = _.defaults(options || {}, Progress.OPTIONS);
  var opts = (this.options.type == 'bar' || this.options.type == 'bar-2d')
    ? Progress.BAR_OPTIONS : Progress.RADIAL_OPTIONS;
  this.options = _.defaults(this.options || {}, opts);

  this.type = 'mv.progress';

  this.group = new THREE.Object3D();

  this._colors = this.options.colors;
  this._values = this.options.values;

  this.init(this.options);

  this._update();
};

Progress.OPTIONS = {
  type: 'bar',
  bgColor: '#666666',
  colors: ['#9c27b0','#2196f3','#e91e63','#00bcd4'],
  values: [0],
  bg: true,
  width: 1,
  thickness: 0.1,
  lit: true,
  rounded: true,
  gradient: false,
  border: false,
  borderWidth: 0.01,
  borderColor: '#666666'
};

Progress.BAR_OPTIONS = {
  segments: 16
};

Progress.RADIAL_OPTIONS = {
  segments: 52,
  radialSegments: 24,
  arc: Math.PI*2
};

Progress.prototype.init = function(options) {
  var container = new THREE.Object3D();
  this.group.add(container);

  var width = options.width,
      thickness = options.thickness;

  this.canvas = document.createElement('canvas');
  this.canvas.width = 1024;
  this.canvas.height = (options.border) ? 32 : 1;

  this.ctx = this.canvas.getContext('2d');

  this.texture = new THREE.Texture(this.canvas);

  var segs = options.segments;
  var radius = thickness/2;

  var geo;

  // TODO: add rounded options to radials (< arc=2pi)
  if (options.type == 'bar') {
    if (options.rounded) {
      geo = new RoundedBarGeometry(width, thickness, segs);
    } else {
      geo = new THREE.CylinderGeometry(radius, radius, width, segs, 1, true);
      geo.applyMatrix(new THREE.Matrix4().makeRotationZ( Math.PI / 2));
    }
  } else if (options.type == 'bar-2d') {
    if (options.rounded) {
      geo = new RoundedBarGeometry2D(width, thickness, segs);
    } else {
      geo = new THREE.PlaneGeometry(width, thickness, 1, 1);
    }
  } else if (options.type == 'radial') {
    var tubeDiameter = thickness / 2;
    var radius = (width-thickness) / 2;

    if (options.rounded && options.arc !== Math.PI*2) {
      geo = new RoundedTorusGeometry(radius, tubeDiameter, options.radialSegments, options.segments, options.arc);
    } else {
      geo = new THREE.TorusGeometry(radius, tubeDiameter, options.radialSegments, options.segments, options.arc);
    }
    geo.applyMatrix( new THREE.Matrix4().makeRotationY( Math.PI ) );
    geo.applyMatrix( new THREE.Matrix4().makeRotationZ( -Math.PI/2 ) );
  } else { // radial-2d
    // RingGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength)
    var geo = new THREE.RingGeometry((width/2) - options.thickness, width/2, options.segments, 1, -Math.PI/2, options.arc);
    this._remapUVs( geo );
    geo.applyMatrix( new THREE.Matrix4().makeRotationZ( -Math.PI/2 ) );
  }

  var MatType = options.lit ? THREE.MeshStandardMaterial : THREE.MeshBasicMaterial;

  var matOptions = {
    map: this.texture,
    transparent: !options.bg
  };
  if (options.lit) {
    matOptions.roughness = 1;
    matOptions.metalness = 0;
  }
  var mat = new MatType( matOptions );

  var mesh = new THREE.Mesh(geo, mat);
  mesh.userData.object = this;
  container.add(mesh);

  this.mesh = mesh;
  this.container = container;
};

// radial2D
Progress.prototype._remapUVs = function(geo, size) {

  geo.computeBoundingBox();

  geo.faceVertexUvs[0] = [];
  for (var i = 0; i < geo.faces.length; i++) {
    var v1 = geo.vertices[geo.faces[i].a],
        v2 = geo.vertices[geo.faces[i].b],
        v3 = geo.vertices[geo.faces[i].c];

    var t1 = (Math.atan2(v1.y, v1.x) + Math.PI) / (Math.PI*2);
    var t2 = (Math.atan2(v2.y, v2.x) + Math.PI) / (Math.PI*2);
    var t3 = (Math.atan2(v3.y, v3.x) + Math.PI) / (Math.PI*2);

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

Progress.prototype.getObject = function() {
  return this.group;
};

// set colors for parts
// arr: array of color strings
Progress.prototype.setColors = function(arr) {
  arr = Array.isArray(arr) ? arr : [arr];
  this._colors = [];

  for (var i = 0; i < arr.length; i++) {
    this._colors.push( arr[i] );
  }

  this._update();
};

// set multiple values to display
// arr: array of values where values sum to <=1
// e.g. [ 0.3, 0.1, 0.6 ]
Progress.prototype.setValues = function(arr)  {
  arr = Array.isArray(arr) ? arr : [arr];
  this._values = [];

  for (var i = 0; i < arr.length; i++) {
    this._values.push( arr[i] );
  }

  this._update();
};

// draw segments & gradients
Progress.prototype._draw = function(ctx, canvas, vals, colors, opts) {
  var w = canvas.width, h = canvas.height;

  //console.log( w, h );

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
    var totalVal = 0;
    for (var k = 0; k < vals.length; k++) {
      totalVal += vals[k];
    }
    ctx.fillRect( w*totalVal,0, w,h );
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

  if (opts.border && (opts.type === 'bar-2d' || opts.type === 'radial-2d')) {
    var borderWidthRatio = opts.borderWidth / opts.thickness;

    ctx.fillStyle = opts.borderColor;
    ctx.fillRect( 0,0, w,h*borderWidthRatio );
    ctx.fillRect( 0,h-h*borderWidthRatio, w,h*borderWidthRatio );

    // TODO: endcaps
    if (0 && opts.type === 'radial-2d' && opts.arc !== Math.PI*2) {

    } else if (0 && opts.type === 'bar-2d') {
      if (opts.rounded) {
        ctx.beginPath();
        ctx.lineWidth = borderWidthRatio;
        ctx.strokeStyle = opts.borderColor;

        //ctx.arc(x, y, radius, startAngle, endAngle, counterClockwise);

        ctx.stroke();
      } else {
        // ctx.fillRect( * );
        // ctx.fillRect( * );
      }
    }
  }
};

Progress.prototype._update = function() {
  this._draw(this.ctx, this.canvas, this._values, this._colors, this.options);

  this.texture.needsUpdate = true;
};

Progress.prototype.update = function(dt) {
  this._update();
};

export { Progress };
