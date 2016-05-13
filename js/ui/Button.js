'use strict';

var MV = MV || {};

MV.Button = function(options) {
  this.options = _.defaults(options || {}, MV.Button.OPTIONS);

  this._state = 'default';

  this.init(this.options);
};

MV.Button.OPTIONS = {
  color: 0x2196f3,
  shape: 'circle',
  transparent: false,
  value: 0,
  width: 0.1,
  height: 0.1,
  image: null
};

MV.Button.prototype.init = function(options) {
  var container = new THREE.Group();

  var geo;
  if (options.shape == 'circle') {
    var radius = options.width / 2;
    geo = new THREE.CircleGeometry(radius, 23);
  } else {
    console.log('box');
    geo = new THREE.BoxGeometry(options.width, options.height, 0.1);
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

  var mesh = new THREE.Mesh(geo, mat);
  mesh.userData.type = 'button';
  this.mesh = mesh;

  container.add(mesh);

  this.container = container;
};

MV.Button.prototype.changeState = function(state) {
  if (this._state === state)
    return;

  return;
};

MV.Button.prototype._update = function() {

};

MV.Button.prototype.getObject = function() {
  return this.container;
};
