/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var MV = MV || {};

	MV.ProgressBar = __webpack_require__(1);
	MV.ProgressBar2D = __webpack_require__(3);
	MV.ProgressRadial = __webpack_require__(5);
	MV.ProgressRadial2D = __webpack_require__(6);

	if (typeof AFRAME === 'undefined') {
	  throw new Error('Component attempted to register before AFRAME was available.');
	}

	AFRAME.registerComponent('progress-bar', {
	  schema: {
	    values: {
	      default: '0.1',
	      parse: function(value) {
	        if (typeof value == 'string')
	          return value.split(' ').map(parseFloat);
	        else if (Array.isArray(value))
	          return value.map(parseFloat);
	        else
	          return [value];
	      }
	    },
	    colors: {
	      default: ['#9c27b0','#2196f3','#e91e63','#00bcd4'],
	      parse: function(value) {
	        return value.split(' ');
	      }
	    },
	    backgroundColor: { default: '#666666' },
	    background: { default: true },
	    width: { default: 1 },
	    thickness: { default: 0.04 },
	    rounded: { default: true },
	    lit: { default: false },
	    segments: { default: 16 },
	    gradient: { default: false }
	  },

	  update: function(oldData) {
	    var data = this.data;

	    var diff = _.reduce(data, function(result, value, key) {
	      return _.isEqual(value, oldData[key]) ?
	        result : result.concat(key);
	    }, []);

	    diff = _.without(diff, ["values", "colors"]);
	    if (diff.length === 0) {
	      this.progressBar.setColors(data.colors);
	      this.progressBar.setValues(data.values);
	      return;
	    }

	    this.progressBar = new MV.ProgressBar( {
	      bgColor: data.backgroundColor,
	      bg: data.background,
	      values: data.values,
	      colors: data.colors,
	      width: data.width,
	      thickness: data.thickness,
	      rounded: data.rounded,
	      lit: data.lit,
	      segments: data.segments,
	      gradient: data.gradient } );

	    this.el.setObject3D('mesh', this.progressBar.getObject());
	  },

	  remove: function() {
	    this.el.removeObject3D('mesh');
	  }
	});

	AFRAME.registerComponent('progress-radial', {
	  schema: {
	    values: {
	      default: '0.1',
	      parse: function(value) {
	        if (typeof value == 'string')
	          return value.split(' ').map(parseFloat);
	        else if (Array.isArray(value))
	          return value.map(parseFloat);
	        else {
	          return [parseFloat(value)];
	        }
	      }
	    },
	    colors: {
	      default: ['#9c27b0','#2196f3','#e91e63','#00bcd4'],
	      parse: function(value) {
	        return value.split(' ');
	      }
	    },
	    backgroundColor: { default: '#666666' },
	    background: { default: true },
	    width: { default: 1 },
	    thickness: { default: 0.04 },
	    rounded: { default: true },
	    lit: { default: false },
	    segments: { default: 52 },
	    radialSegments: { default: 24 },
	    arc: { default: Math.PI*2 },
	    gradient: { default: false }
	  },

	  update: function(oldData) {
	    var data = this.data;

	    var diff = _.reduce(data, function(result, value, key) {
	      return _.isEqual(value, oldData[key]) ?
	        result : result.concat(key);
	    }, []);

	    diff = _.without(diff, ["values", "colors"]);
	    if (diff.length === 0) {
	      this.progressRadial.setColors(data.colors);
	      this.progressRadial.setValues(data.values);
	      return;
	    }

	    this.progressRadial = new MV.ProgressRadial( {
	      bgColor: data.backgroundColor,
	      bg: data.background,
	      values: data.values,
	      colors: data.colors,
	      width: data.width,
	      thickness: data.thickness,
	      rounded: data.rounded,
	      lit: data.lit,
	      segments: data.segments,
	      gradient: data.gradient } );

	    this.el.setObject3D('mesh', this.progressRadial.getObject());
	  },

	  remove: function() {
	    this.el.removeObject3D('mesh');
	  }
	});



/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var MV = MV || {};

	if ( true ) {
	  MV.RoundedBarGeometry = __webpack_require__(2);
	}

	MV.ProgressBar = function(options) {
	  this.options = _.defaults(options || {}, MV.ProgressBar.OPTIONS);

	  this._colors = this.options.colors;
	  this._values = this.options.values;

	  this.init(this.options);

	  this._update();
	};

	MV.ProgressBar.OPTIONS = {
	  bgColor: '#666666',
	  colors: ['#9c27b0','#2196f3','#e91e63','#00bcd4'],
	  values: [0],
	  bg: true,
	  width: 1,
	  thickness: 0.04,
	  rounded: true,
	  lit: false,
	  segments: 16,
	  gradient: false
	};

	Object.defineProperties(MV.ProgressBar.prototype, {
	  'value': {
	    get: function() {
	      return this._values.length ? this._values[0] : 0;
	    },
	    set: function( val ) {
	      if ( val !== this._value ) {
	        //this._value = THREE.Math.clamp( val, 0, 1 );
	        //this._update( );
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

	  var MatType = options.lit ? THREE.MeshStandardMaterial : THREE.MeshBasicMaterial;


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
	    map: this.texture,
	    transparent: !options.bg,
	    roughness: 1,
	    metalness: 0
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
	    ctx.fillRect( 0,h*vals[0], w,h );
	  } else {
	    if (vals.length && vals.length <= this._colors.length) {
	      var start = 0;

	      for (var i = 0; i < vals.length; i++) {
	        var val = vals[i];

	        ctx.fillStyle = this._colors[i];
	        ctx.fillRect( 0,h*start, w,h*val );

	        start += val;
	      }
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

	if ( true ) {
	  module.exports = MV.ProgressBar;
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var MV = MV || {};

	MV.RoundedBarGeometry = function ( width, size, segments ) {

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

	  this.applyMatrix(new THREE.Matrix4().makeRotationZ( Math.PI / 2));

	  this.computeFaceNormals();
	  this.computeVertexNormals();

	};

	MV.RoundedBarGeometry.prototype = Object.create( THREE.Geometry.prototype );
	MV.RoundedBarGeometry.prototype.constructor = THREE.RoundedBarGeometry;

	MV.RoundedBarGeometry.prototype.clone = function () {

	  var parameters = this.parameters;

	  return new MV.RoundedBarGeometry(
	    parameters.width,
	    parameters.size,
	    parameters.segments
	  );

	};

	if ( true ) {
	  module.exports = MV.RoundedBarGeometry;
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var MV = MV || {};

	if ( true ) {
	  MV.RoundedBarGeometry2D = __webpack_require__(4);
	}

	MV.ProgressBar2D = function(options) {
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

	if ( true ) {
	  module.exports = MV.ProgressBar2D;
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var MV = MV || {};

	MV.RoundedBarGeometry2D = function ( width, size, segments ) {

	  THREE.Geometry.call( this );

	  this.type = 'RoundedBarGeometry2D';

	  this.parameters = {
	    width: width,
	    size: size,
	    segments: segments
	  };

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

	  //this.fromBufferGeometry( new MV.RoundedBarBufferGeometry( width, size, segments ) );

	};

	MV.RoundedBarGeometry2D.prototype = Object.create( THREE.Geometry.prototype );
	MV.RoundedBarGeometry2D.prototype.constructor = THREE.RoundedBarGeometry2D;

	MV.RoundedBarGeometry2D.prototype.clone = function () {

	  var parameters = this.parameters;

	  return new MV.RoundedBarGeometry(
	    parameters.width,
	    parameters.size,
	    parameters.segments
	  );

	};

	if ( true ) {
	  module.exports = MV.RoundedBarGeometry2D;
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var MV = MV || {};

	MV.ProgressRadial = function(options) {
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

	  var MatType = options.lit ? THREE.MeshStandardMaterial : THREE.MeshBasicMaterial;

	  var mat = new MatType({
	    map: this.texture,
	    transparent: !options.bg,
	    roughness: 1,
	    metalness: 0
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

	MV.ProgressRadial.prototype.update = function(dt) {

	};

	if ( true ) {
	  module.exports = MV.ProgressRadial;
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var MV = MV || {};

	MV.ProgressRadial2D = function(options) {
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

	Object.defineProperties(MV.ProgressRadial2D.prototype, {
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

	MV.ProgressRadial2D.prototype.init = function(options) {
	  var container = new THREE.Group();

	  var width = options.width, height = options.width;

	  var canvas = document.createElement('canvas');
	  canvas.width = 512;
	  canvas.height = canvas.width;
	  this.canvas = canvas;

	  var ctx = canvas.getContext('2d');
	  this.ctx = ctx;

	  var texture = new THREE.Texture(canvas);
	  this.texture = texture;

	  // RingGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength)
	  var geo = new THREE.RingGeometry(width/2 - options.thickness, width/2, options.segments, 1, -Math.PI/2, options.arc);

	  var MatType = options.lit ? THREE.MeshStandardMaterial : THREE.MeshBasicMaterial;

	  var mat = new MatType({
	    map: this.texture,
	    transparent: !options.bg,
	    roughness: 1,
	    metalness: 0
	  });

	  var mesh = new THREE.Mesh(geo, mat);
	  container.add(mesh);

	  this.container = container;
	};

	MV.ProgressRadial2D.prototype.getObject = function() {
	  return this.container;
	};

	// set colors for parts
	// arr: array of color strings
	MV.ProgressRadial2D.prototype.setColors = function( arr ) {
	  this._colors = [];

	  for (var i = 0; i < arr.length; i++) {
	    this._colors.push( arr[i] );
	  }
	};

	// set multiple values to display
	// arr: array of values where values sum to <=1
	// e.g. [ 0.3, 0.1, 0.6 ]
	MV.ProgressRadial2D.prototype.setValues = function( arr ) {
	  this._values = [];

	  for (var i = 0; i < arr.length; i++) {
	    this._values.push( arr[i] );
	  }

	  this._update();
	};

	MV.ProgressRadial2D.prototype._update = function( ) {
	  var ctx = this.ctx;
	  var opts = this.options;
	  var vals = this._values;
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
	  if (opts.gradient && this._colors.length > 1) {
	    var grd = ctx.createLinearGradient( 0,0, w,h );
	    grd.addColorStop(0, this._colors[0]);
	    grd.addColorStop(1, this._colors[1]);

	    ctx.beginPath();
	    ctx.arc(cxy, cxy, radius, startAngle, startAngle+Math.PI*2*vals[0], false);

	    if (opts.rounded) {
	      ctx.lineCap = 'round';
	    }

	    ctx.strokeStyle = grd;
	    ctx.stroke();
	  } else {
	    if (vals.length && vals.length <= this._colors.length) {
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

	        ctx.strokeStyle = this._colors[i];
	        ctx.stroke();

	        length -= val;
	      }
	    }
	  }

	  this.texture.needsUpdate = true;
	};

	MV.ProgressRadial2D.prototype.update = function(dt) {

	};

	if ( true ) {
	  module.exports = MV.ProgressBar2D;
	}


/***/ }
/******/ ]);