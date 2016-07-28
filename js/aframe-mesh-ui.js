var MV = MV || {};

MV.Progress = require('./ui/Progress.js');

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerComponent('progress', {
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

    this.progress = new MV.Progress( {
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
