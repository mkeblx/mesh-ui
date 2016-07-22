(function(global){
'use strict';

global = global === undefined ? window : global;

global.MV = global.MV || {};

class Text {
  constructor(options) {
    this.options = _.defaults(options || {}, this.constructor.OPTIONS);

    this.init(this.options);

    this.type = 'mv.text';

    this._value;
    this.value = this.options.value;
  }

  get value() {
    return this._value;
  }
  set value(val) {
    if (val !== this._value) {
      this._value = val;
      this._update(this._value);
    }
  }


  static get CANVAS_WIDTH() {
    return 1024;
  }

  static get OPTIONS() {
    return {
      value: '',
      color: '#000000',
      font: 'Roboto',
      fontSize: 48,
      fontWeight: 300,
      textAlign: 'center',
      x: Text.CANVAS_WIDTH/2,
      y: 48,
      width: 1,
      height: 1/8
    }
  }

  init(options) {
    var container = new THREE.Object3D();

    var aspect = THREE.Math.nextPowerOfTwo(options.width / options.height);

    var canvas = document.createElement('canvas');
    canvas.width = Text.CANVAS_WIDTH;
    canvas.height = canvas.width / aspect;
    this.canvas = canvas;

    var ctx = canvas.getContext('2d');
    this.ctx = ctx;

    var texture = new THREE.Texture(canvas);
    this.texture = texture;

    var planeGeo = new THREE.PlaneGeometry(options.width, options.height);
    var planeMat = new THREE.MeshBasicMaterial({
      map: this.texture,
      color: 0xffffff,
      transparent: true
    });
    var mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.userData.object = this;
    this.mesh = mesh;

    container.add(mesh);

    this.container = container;
  }

  _drawText(text) {
    var options = this.options;
    var ctx = this.ctx;

    var x = x || options.x;
    var y = y || options.y;

    ctx.save();

    ctx.font = options.fontWeight + ' ' + options.fontSize + 'px ' + options.font;
    ctx.fillStyle = options.color;
    ctx.textAlign = options.textAlign;

    ctx.fillText(text, x, y);

    ctx.restore();
  }

  getObject() {
    return this.container;
  }

  _update(text) {
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);

    this._drawText(text);

    this.texture.needsUpdate = true;
  }

  update(dt) {

  }

}

global.MV.Text = Text;

})(window);
