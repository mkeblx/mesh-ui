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
    // main
    var pc = (width - thickness) / width;
    var rep = (1 - pc) / 2;

    mat.map.repeat.y = pc;
    mat.map.offset.y = rep;

    // endcaps
    var capGeo = new THREE.SphereGeometry(radius, segs, 8, 0, Math.PI*2, 0, Math.PI/2);

    var textureL = new THREE.Texture(canvas);
    this.textureL = textureL;

    var matL = new MatType( {
      map: textureL
    });
    matL.map.repeat.y = rep * 2;
    matL.map.offset.y = 1;
    var capMeshL = new THREE.Mesh(capGeo, matL);
    this.capMeshL = capMeshL;

    var textureR = new THREE.Texture(canvas);
    this.textureR = textureR;

    var matR = new MatType( {
      map: textureR
    });
    matR.map.repeat.y = rep * 2;
    matR.map.offset.y = 0;
    capGeo = new THREE.SphereGeometry(radius, segs, 8, 0, Math.PI*2, Math.PI, Math.PI);
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

MV.ProgressBar.prototype._update = function() {
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
      ctx.fillRect( 0, h*start, w,h*val );

      start += val;
    }
  }

  this.texture.needsUpdate = true;

  if (opts.rounded) {
    this.textureL.needsUpdate = true;
    this.textureR.needsUpdate = true;
  }
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
