'use strict';

var RoundedBarBufferGeometry2D = function ( width, size, segments ) {

  THREE.Geometry.call( this );

  this.type = 'RoundedBarBufferGeometry';

  this.parameters = {
    width: width,
    size: size,
    segments: segments
  };

};

RoundedBarBufferGeometry2D.prototype = Object.create( THREE.Geometry.prototype );
RoundedBarBufferGeometry2D.prototype.constructor = RoundedBarBufferGeometry2D;

RoundedBarBufferGeometry2D.prototype.clone = function () {

  var parameters = this.parameters;

  return new RoundedBarBufferGeometry2D(
    parameters.width,
    parameters.size,
    parameters.segments
  );

};

export default RoundedBarBufferGeometry2D;
