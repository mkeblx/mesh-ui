if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerComponent('sky-gradient', {
  schema: {
    values: {
      default: '0.1',
      parse: function(value) {
        return value.split(' ').map(parseFloat);
      }
    },
    colors: {
      default: ['#9c27b0','#2196f3','#e91e63','#00bcd4'],
      parse: function(value) {
        return value.split(' ');
      }
    }
  },

  update: function(oldData) {
    var data = this.data;

    var w = 2, h = 512;
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    this.canvas = canvas;

    var ctx = canvas.getContext('2d');
    this.ctx = ctx;

    var grd = ctx.createLinearGradient( 0,0, w,h );
    grd.addColorStop(0, data.colors[0]);
    grd.addColorStop(1, data.colors[data.colors.length-1]);

    ctx.fillStyle = grd;
    ctx.fillRect( 0,0, w,h );

    var texture = new THREE.Texture(canvas);
    this.texture = texture;

    var size = 30;
    var geo = new THREE.SphereGeometry(size, size, size, 20, 20);
    var mat = new THREE.MeshBasicMaterial({
      map: this.texture
    });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.scale.set(-1, 1, 1);

    this.el.setObject3D('mesh', this.mesh);
      this.texture.needsUpdate = true;
  },

  remove: function() {
    this.el.removeObject3D('mesh');
  }
});
