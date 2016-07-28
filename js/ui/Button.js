'use strict';

var MV = MV || {};

if ( 'undefined' !== typeof exports && 'undefined' !== typeof module ) {
  //var __ = require('../../node_modules/lodash/core.min.js');
  MV.RoundedBarGeometry2D = require('./RoundedBarGeometry2D.js');
}

MV.Button = function(options) {
  this.options = _.defaults(options || {}, MV.Button.OPTIONS);

  this.type = 'mv.button';

  this._state = 'default';

  this.init(this.options);
};

MV.Button.OPTIONS = {
  color: 0x2196f3,
  type: 'rect',
  transparent: false,
  value: 0,
  width: 0.1,
  height: 0.1,
  image: null,
  rounded: true
};

MV.Button.TYPES = [ 'rect', 'circle' ];
MV.Button.STATES = [ 'default', 'hover', 'clicked', 'disabled' ];

MV.Button.prototype.init = function(options) {
  var container = new THREE.Group();

  var geo;
  if (options.type == 'circle') {
    var radius = options.width / 2;
    geo = new THREE.CircleGeometry(radius, 23);
  } else if (options.type == 'rect') {
    if (options.rounded) {
      geo = new MV.RoundedBarGeometry2D(options.width, options.height, 10);
    } else {
      geo = new THREE.BoxGeometry(options.width, options.height, 0.1);
    }
  }

  var mat;
  var texture = null;
  if (options.image)
    texture = new THREE.TextureLoader().load(options.image, function(){ mat.opacity = 1; });

  mat = new THREE.MeshBasicMaterial({
    color: options.color,
    map: texture,
    transparent: true,
    opacity: 0
  });
  this.material = mat;

  var mesh = new THREE.Mesh(geo, mat);
  mesh.userData.object = this;
  this.mesh = mesh;

  container.add(mesh);

  this.container = container;
};

// TODO: better state handling ?
MV.Button.prototype.changeState = function(state) {
  if (this._state === state)
    return;

  this._state = state;

  if (this._state === 'hover') {
    this.material.opacity = 0.8;
  } else if (this._state === 'default') {
    this.material.opacity = 1.0;
  }

  return;
};

MV.Button.prototype._update = function() {

};

MV.Button.prototype.update = function(dt) {

};

MV.Button.prototype.getObject = function() {
  return this.container;
};

if ( 'undefined' !== typeof exports && 'undefined' !== typeof module ) {
  module.exports = MV.Button;
}
