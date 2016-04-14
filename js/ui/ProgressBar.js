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
  canvas.width = 1;
  canvas.height = 512;
  this.canvas = canvas;

  var ctx = canvas.getContext('2d');
  this.ctx = ctx;

  var texture = new THREE.Texture(canvas);
  this.texture = texture;

  var MatType = options.lit ? THREE.MeshLambertMaterial : THREE.MeshBasicMaterial;


  //
  var segs = options.segments;
  var radius = thickness/2;

  var _width = options.rounded ? width - 2*radius : width;

  var geo = new THREE.CylinderGeometry(radius, radius, _width, segs, 1, true);
  geo.applyMatrix(new THREE.Matrix4().makeRotationZ( Math.PI / 2));

  var mat = new MatType( {
    map: this.texture
  } );

  var mesh = new THREE.Mesh(geo, mat);
  container.add(mesh);

  // end caps
  if (options.rounded) {
    var capGeo = new THREE.SphereGeometry(radius, segs, 8, 0, Math.PI*2, 0, Math.PI/2);

    var canvasL = document.createElement('canvas');
    this.CAP_RES = 32;
    canvasL.width = 1;
    canvasL.height = this.CAP_RES;
    this.canvasL = canvasL;
    this.ctxL = canvasL.getContext('2d');

    var textureL = new THREE.Texture(canvasL);
    this.textureL = textureL;

    var matL = new MatType( {
      map: textureL
    });
    var capMeshL = new THREE.Mesh(capGeo, matL);
    this.capMeshL = capMeshL;


    var canvasR = document.createElement('canvas');
    canvasR.width = 1;
    canvasR.height = this.CAP_RES;
    this.canvasR = canvasR;
    this.ctxR = canvasR.getContext('2d');

    var textureR = new THREE.Texture(canvasR);
    this.textureR = textureR;

    var matR = new MatType( {
      map: textureR
    });
    var capMeshR = new THREE.Mesh(capGeo, matR);
    this.capMeshR = capMeshR;

    capMeshL.rotation.set(Math.PI/segs, 0,  Math.PI/2);
    capMeshR.rotation.set(Math.PI/segs, 0, -Math.PI/2);
  } else {
    var capGeo = new THREE.CircleGeometry(radius, segs);

    var matL = new MatType( {
      color: options.bgColor
    });
    var capMeshL = new THREE.Mesh(capGeo, matL);

    var matR = new MatType( {
      color: options.bgColor
    });
    var capMeshR = new THREE.Mesh(capGeo, matR);

    capMeshL.rotation.set(0, -Math.PI/2, 0);
    capMeshR.rotation.set(0,  Math.PI/2, 0);
  }

  capMeshL.position.setX( -_width/2 );
  capMeshR.position.setX(  _width/2 );

  container.add(capMeshL);
  container.add(capMeshR);

  this.matL = matL;
  this.matR = matR;


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

MV.ProgressBar.prototype._update = function(pc) {
  pc = pc || 0;

  var opts = this.options;
  var ctx = this.ctx;
  var w = this.canvas.width, h = this.canvas.height;

  var d = opts.thickness / opts.width;

  var pcM = pc;

  if (opts.rounded) {
    pcM = THREE.Math.mapLinear( pc, 0+d,1-d, 0,1 );
    pcM = THREE.Math.clamp( pcM, 0,1 );
  }

  ctx.fillStyle = opts.bgColor;
  ctx.fillRect( 0,0, w,h );

  ctx.fillStyle = opts.activeColor;
  ctx.fillRect( 0,0, w,h*pcM );

  this.texture.needsUpdate = true;


  if (opts.rounded) {
    var pcL = THREE.Math.mapLinear( pc, 0,d, 0,1 );
    pcL = THREE.Math.clamp( pcL, 0,1 );

    this.ctxL.fillStyle = opts.bgColor;
    this.ctxL.fillRect( 0,0, 1,this.CAP_RES );

    this.ctxL.fillStyle = opts.activeColor;
    this.ctxL.fillRect( 0,0, 1,this.CAP_RES*pcL );


    var pcR = THREE.Math.mapLinear( pc, 1-d,1, 0,1 );
    pcR = THREE.Math.clamp( pcR, 0,1 );

    this.ctxR.fillStyle = opts.bgColor;
    this.ctxR.fillRect( 0,0, 1,this.CAP_RES );

    this.ctxR.fillStyle = opts.activeColor;
    var _h = this.CAP_RES*pcR;
    this.ctxR.fillRect( 0,(1-pcR)*this.CAP_RES, 1,_h );


    this.textureL.needsUpdate = true;
    this.textureR.needsUpdate = true;
  } else {
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
  }

  //this.progressC.scale.setX(pc);
  //this.seekC.scale.setX(1-pc);
};

MV.ProgressBar.prototype.update = function(dt) {

};
