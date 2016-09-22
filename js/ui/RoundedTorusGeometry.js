'use strict';

import RoundedTorusBufferGeometry from './RoundedTorusBufferGeometry.js';

var RoundedTorusGeometry = function ( radius, tube, radialSegments, tubularSegments, arc ) {

  THREE.Geometry.call( this );

  this.type = 'RoundedTorusGeometry';

  this.parameters = {
    radius: radius,
    tube: tube,
    radialSegments: radialSegments,
    tubularSegments: tubularSegments,
    arc: arc
  };

  this.fromBufferGeometry( new RoundedTorusBufferGeometry( radius, tube, radialSegments, tubularSegments, arc ) );

};

RoundedTorusGeometry.prototype = Object.create( THREE.Geometry.prototype );
RoundedTorusGeometry.prototype.constructor = RoundedTorusGeometry;

RoundedTorusGeometry.prototype.clone = function () {

  var parameters = this.parameters;

  return new RoundedTorusGeometry(
    parameters.width,
    parameters.size,
    parameters.segments
  );

};

export default RoundedTorusGeometry;

