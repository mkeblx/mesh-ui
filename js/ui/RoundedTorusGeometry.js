'use strict';

var MV = MV || {};

if ( 'undefined' !== typeof exports && 'undefined' !== typeof module ) {
  MV.RoundedTorusBufferGeometry = require('./RoundedTorusBufferGeometry.js');
}

MV.RoundedTorusGeometry = function ( radius, tube, radialSegments, tubularSegments, arc ) {

  THREE.Geometry.call( this );

  this.type = 'RoundedTorusGeometry';

  this.parameters = {
    radius: radius,
    tube: tube,
    radialSegments: radialSegments,
    tubularSegments: tubularSegments,
    arc: arc
  };

  this.fromBufferGeometry( new MV.RoundedTorusBufferGeometry( radius, tube, radialSegments, tubularSegments, arc ) );

};

MV.RoundedTorusGeometry.prototype = Object.create( THREE.Geometry.prototype );
MV.RoundedTorusGeometry.prototype.constructor = MV.RoundedTorusGeometry;

MV.RoundedTorusGeometry.prototype.clone = function () {

  var parameters = this.parameters;

  return new MV.RoundedTorusGeometry(
    parameters.width,
    parameters.size,
    parameters.segments
  );

};

if ( 'undefined' !== typeof exports && 'undefined' !== typeof module ) {
  module.exports = MV.RoundedTorusGeometry;
}
