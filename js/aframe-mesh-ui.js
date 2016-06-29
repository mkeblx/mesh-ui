var MV = MV || {};

MV.Progress = require('./ui/Progress.js');

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

    this.progressBar = new MV.Progress( {
      type: 'bar',
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

    this.progressRadial = new MV.Progress( {
      type: 'radial',
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

