'use strict';

import { Progress } from './ui/Progress.js';

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
    bgColor: { default: '#666666' },
    bg: { default: true },
    width: { default: 1 },
    thickness: { default: 0.1 },
    rounded: { default: true },
    lit: { default: false },
    gradient: { default: false },
    segments: { default: 16 }, // todo: higher (52) based on type (radial)?
    radialSegments: { default: 24 },
    arc: { default: Math.PI*2 },
  },

  multiple: false,

  init: function() {
    this.firstRun = true; // temp?

    this.progress = new Progress( this.data );
    this.el.setObject3D('mesh', this.progress.getObject());
  },

  update: function(oldData) {
    if (!this.firstRun) {
      this.firstRun = false;
      return;
    }

    var data = this.data;
    var diff = AFRAME.utils.diff(oldData, data);

    // TODO: check that only values/colors changed for early exit
    if ('values' in diff || 'colors' in diff) {
      if ('values' in diff) {
        this.progress.setValues(data.values);
      }
      if ('colors' in diff) {
        this.progress.setColors(data.colors);
      }
      return;
    }

    this.progress = new Progress( data );
    this.el.setObject3D('mesh', this.progress.getObject());
  },

  remove: function() {
    this.el.removeObject3D('mesh');
  }
});
