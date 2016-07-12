'use strict';

var MV = MV || {};

MV.RoundedBarBufferGeometry = function ( width, size, segments ) {

  THREE.Geometry.call( this );

  this.type = 'RoundedBarBufferGeometry';

  this.parameters = {
    width: width,
    size: size,
    segments: segments
  };

};

MV.RoundedBarGeometry.prototype = Object.create( THREE.Geometry.prototype );
MV.RoundedBarGeometry.prototype.constructor = MV.RoundedBarBufferGeometry;

MV.RoundedBarGeometry.prototype.clone = function () {

  var parameters = this.parameters;

  return new MV.RoundedBarGeometry(
    parameters.width,
    parameters.size,
    parameters.segments
  );

};
