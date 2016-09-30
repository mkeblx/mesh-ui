(function () {
'use strict';

var RoundedBarGeometry = function ( width, size, segments ) {

  THREE.Geometry.call( this );

  this.type = 'RoundedBarGeometry';

  this.parameters = {
    width: width,
    size: size,
    segments: segments
  };

  var thickness = size;
  var radius = thickness/2;
  var _width = width - 2*radius;

  var geo = new THREE.Geometry();
  var mainGeo = new THREE.CylinderGeometry(radius, radius, _width, segments, 1, true);
  var capGeoL = new THREE.SphereGeometry(radius, segments, 8, 0, Math.PI*2, 0, Math.PI/2);
  capGeoL.applyMatrix( new THREE.Matrix4().makeTranslation( 0, _width/2, 0) );
  var capGeoR = new THREE.SphereGeometry(radius, segments, 8, 0, Math.PI*2, Math.PI/2, Math.PI/2);
  capGeoR.applyMatrix( new THREE.Matrix4().makeTranslation( 0, -_width/2, 0) );
  geo.merge(mainGeo);
  geo.merge(capGeoL);
  geo.merge(capGeoR);

  this.copy( geo );

  //this.mergeVertices(); // align better

  this.applyMatrix(new THREE.Matrix4().makeRotationZ( Math.PI / 2));

  this.computeBoundingBox();
  var max = this.boundingBox.max,
      min = this.boundingBox.min;
  var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
  var range = new THREE.Vector2(max.x - min.x, max.y - min.y);

  this.faceVertexUvs[0] = [];
  for (var i = 0; i < this.faces.length; i++) {
    var v1 = this.vertices[this.faces[i].a],
        v2 = this.vertices[this.faces[i].b],
        v3 = this.vertices[this.faces[i].c];
    this.faceVertexUvs[0].push(
      [
        new THREE.Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
        new THREE.Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
        new THREE.Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
      ]);
  }

  this.uvsNeedUpdate = true;

  this.computeFaceNormals();
  this.computeVertexNormals();

};

RoundedBarGeometry.prototype = Object.create( THREE.Geometry.prototype );
RoundedBarGeometry.prototype.constructor = RoundedBarGeometry;

RoundedBarGeometry.prototype.clone = function () {

  var parameters = this.parameters;

  return new RoundedBarGeometry(
    parameters.width,
    parameters.size,
    parameters.segments
  );

};

var RoundedBarGeometry2D = function ( width, size, segments ) {

  THREE.Geometry.call( this );

  this.type = 'RoundedBarGeometry2D';

  this.parameters = {
    width: width,
    size: size,
    segments: segments
  };

  segments = segments !== undefined ?  Math.max( 3, segments ) : 6;

  var thickness = size;
  var radius = thickness/2;
  var _width = width - 2*radius;

  var geo = new THREE.Geometry();
  var mainGeo = new THREE.PlaneGeometry(_width, thickness, 1, 1);
  var capGeoL = new THREE.CircleGeometry(radius, segments, Math.PI/2, Math.PI);
  capGeoL.applyMatrix( new THREE.Matrix4().makeTranslation(-_width/2, 0, 0) );
  var capGeoR = new THREE.CircleGeometry(radius, segments, -Math.PI/2, Math.PI);
  capGeoR.applyMatrix( new THREE.Matrix4().makeTranslation( _width/2, 0, 0) );
  geo.merge(mainGeo);
  geo.merge(capGeoL);
  geo.merge(capGeoR);

  this.copy( geo );

  //this.mergeVertices(); // align better

  this.computeBoundingBox();
  var max = this.boundingBox.max,
      min = this.boundingBox.min;
  var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
  var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
  this.faceVertexUvs[0] = [];
  for (var i = 0; i < this.faces.length; i++) {
    var v1 = this.vertices[this.faces[i].a], v2 = this.vertices[this.faces[i].b], v3 = this.vertices[this.faces[i].c];
    this.faceVertexUvs[0].push(
      [
          new THREE.Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
          new THREE.Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
          new THREE.Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
      ]);

  }

  this.uvsNeedUpdate = true;

  //this.fromBufferGeometry( new RoundedBarBufferGeometry( width, size, segments ) );

};

RoundedBarGeometry2D.prototype = Object.create( THREE.Geometry.prototype );
RoundedBarGeometry2D.prototype.constructor = RoundedBarGeometry2D;

RoundedBarGeometry2D.prototype.clone = function () {

  var parameters = this.parameters;

  return new RoundedBarGeometry2D(
    parameters.width,
    parameters.size,
    parameters.segments
  );

};

var RoundedTorusBufferGeometry = function ( radius, tube, radialSegments, tubularSegments, arc ) {

  THREE.BufferGeometry.call( this );

  this.type = 'RoundedTorusBufferGeometry';

  this.parameters = {
    radius: radius,
    tube: tube,
    radialSegments: radialSegments,
    tubularSegments: tubularSegments,
    arc: arc
  };

  radius = radius || 100;
  tube = tube || 40;
  radialSegments = Math.floor( radialSegments ) || 8;
  tubularSegments = Math.floor( tubularSegments ) || 6;
  arc = arc || Math.PI * 2;

  // TODO cleanup
  var segmentsPerCap = 12;
  var mainSegments = tubularSegments;
  tubularSegments += segmentsPerCap * 2;

  // used to calculate buffer length
  var vertexCount = ( ( radialSegments + 1 ) * ( tubularSegments + 1 ) );
  var indexCount = radialSegments * tubularSegments * 2 * 3;

  // buffers
  var indices = new ( indexCount > 65535 ? Uint32Array : Uint16Array )( indexCount );
  var vertices = new Float32Array( vertexCount * 3 );
  var normals = new Float32Array( vertexCount * 3 );
  var uvs = new Float32Array( vertexCount * 2 );

  // offset variables
  var vertexBufferOffset = 0;
  var uvBufferOffset = 0;
  var indexBufferOffset = 0;

  // helper variables
  var center = new THREE.Vector3();
  var vertex = new THREE.Vector3();
  var normal = new THREE.Vector3();

  var j, i;

  // generate vertices, normals and uvs

  var us = [];
  var capArc = tube;
  var mainArc = arc - (4 * capArc);
  var capInc = tube / segmentsPerCap * 2;
  var mainInc = mainArc / mainSegments;

  var pc = 0;


  var cs = [];
  //var cx = 1 / (segmentsPerCap-1);
  for ( var i = 0; i <= tubularSegments; i++ ) {
    us.push( pc );

    if (i < segmentsPerCap) {
      pc += ( capInc );
      var len = 1 - (1 / (segmentsPerCap-1)) * i;
      var bsq = 1 - len*len;
      var b = Math.sqrt( bsq );
      cs.push( b );
    } else if (i >= segmentsPerCap && i < (tubularSegments - segmentsPerCap)) {
      pc += ( mainInc );
      cs.push( 1 );
    } else {
      pc += ( capInc );
      cs.push( cs[ Math.abs(i - tubularSegments) ] );
    }

  }

  for ( j = 0; j <= radialSegments; j ++ ) {

    var v = j / radialSegments * Math.PI * 2;
    var z = tube * Math.sin( v );



    var _r = Math.cos( v ) * tube;

    for ( i = 0; i <= tubularSegments; i ++ ) {

      var u = us[ i ];

      // vertex
      vertex.x = ( radius + _r * cs[i] ) * Math.cos( u );
      vertex.y = ( radius + _r * cs[i] ) * Math.sin( u );
      vertex.z = z;

      vertices[ vertexBufferOffset ] = vertex.x;
      vertices[ vertexBufferOffset + 1 ] = vertex.y;
      vertices[ vertexBufferOffset + 2 ] = vertex.z;

      // this vector is used to calculate the normal
      center.x = radius * Math.cos( u );
      center.y = radius * Math.sin( u );

      // normal
      normal.subVectors( vertex, center ).normalize();

      normals[ vertexBufferOffset ] = normal.x;
      normals[ vertexBufferOffset + 1 ] = normal.y;
      normals[ vertexBufferOffset + 2 ] = normal.z;

      // uv
      uvs[ uvBufferOffset ] = u / arc;
      uvs[ uvBufferOffset + 1 ] = j / radialSegments;

      // update offsets
      vertexBufferOffset += 3;
      uvBufferOffset += 2;

    }

  }

  // generate indices

  for ( j = 1; j <= radialSegments; j ++ ) {

    for ( i = 1; i <= tubularSegments; i ++ ) {

      // indices
      var a = ( tubularSegments + 1 ) * j + i - 1;
      var b = ( tubularSegments + 1 ) * ( j - 1 ) + i - 1;
      var c = ( tubularSegments + 1 ) * ( j - 1 ) + i;
      var d = ( tubularSegments + 1 ) * j + i;

      // face one
      indices[ indexBufferOffset ] = a;
      indices[ indexBufferOffset + 1 ] = b;
      indices[ indexBufferOffset + 2 ] = d;

      // face two
      indices[ indexBufferOffset + 3 ] = b;
      indices[ indexBufferOffset + 4 ] = c;
      indices[ indexBufferOffset + 5 ] = d;

      // update offset
      indexBufferOffset += 6;

    }

  }

  // build geometry
  this.setIndex( new THREE.BufferAttribute( indices, 1 ) );
  this.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
  this.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
  this.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

};

RoundedTorusBufferGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
RoundedTorusBufferGeometry.prototype.constructor = RoundedTorusBufferGeometry;

RoundedTorusBufferGeometry.prototype.clone = function () {

  var parameters = this.parameters;

  return new RoundedTorusBufferGeometry(
    parameters.radius,
    parameters.tube,
    parameters.radialSegments,
    parameters.tubularSegments,
    parameters.arc
  );

};

var RoundedTorusGeometry = function ( radius, tube, radialSegments, tubularSegments, arc ) {

  THREE.Geometry.call( this );

  this.type = 'RoundedTorusGeometry';

  this.parameters = {
    radius: radius,
    tube: tube,
    radialSegments: radialSegments,
    tubularSegments: tubularSegments,
    arc: arc
  };

  this.fromBufferGeometry( new RoundedTorusBufferGeometry( radius, tube, radialSegments, tubularSegments, arc ) );

};

RoundedTorusGeometry.prototype = Object.create( THREE.Geometry.prototype );
RoundedTorusGeometry.prototype.constructor = RoundedTorusGeometry;

RoundedTorusGeometry.prototype.clone = function () {

  var parameters = this.parameters;

  return new RoundedTorusGeometry(
    parameters.width,
    parameters.size,
    parameters.segments
  );

};

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

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerComponent('progress', {
  schema: {
    values: {
      default: ['0.1'].join(' '),
      type: 'string',
      parse: function(value) {
        if (typeof value == 'string')
          return value.split(' ').map(parseFloat);
        else
          return [value];
      }
    },
    colors: {
      default: ['#9c27b0','#2196f3','#e91e63','#00bcd4'].join(' '),
      type: 'string',
      parse: function(value) {
        return value.split(' ');
      }
    },
    type: { default: 'bar' },
    backgroundColor: { default: '#666666' },
    background: { default: true },
    width: { default: 1 },
    thickness: { default: 0.1 },
    rounded: { default: true },
    lit: { default: false },
    segments: { default: 16 }, // todo: higher (52) based on type (radial)?
    gradient: { default: false },
    radialSegments: { default: 24 },
    arc: { default: Math.PI*2 },
  },

  update: function(oldData) {
    var data = this.data;

    var diff = _.reduce(data, function(result, value, key) {
      return _.isEqual(value, oldData[key]) ?
        result : result.concat(key);
    }, []);

    if (_.without(diff, ["values"]).length === 0) {
      this.progress.setValues(data.values);
      return;
    }
    if (_.without(diff, ["colors"]).length === 0) {
      this.progress.setColors(data.colors);
      return;
    }

    this.progress = new Progress( {
      type: data.type,
      bgColor: data.backgroundColor,
      bg: data.background,
      values: data.values,
      colors: data.colors,
      width: data.width,
      thickness: data.thickness,
      rounded: data.rounded,
      lit: data.lit,
      segments: data.segments,
      gradient: data.gradient,
      radialSegments: data.radialSegments,
      arc: data.arc } );

    this.el.setObject3D('mesh', this.progress.getObject());
  },

  remove: function() {
    this.el.removeObject3D('mesh');
  }
});

}());
