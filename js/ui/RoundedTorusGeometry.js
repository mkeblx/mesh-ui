'use strict';

var MV = MV || {};

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

  console.log(this.parameters);

  var segments = tubularSegments;
  var _width = tube;

  var capRadius = tube;

  var capArc = 4 * capRadius; // approx., do better

  var geo = new THREE.Geometry();
  var mainGeo = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc - capArc);
  mainGeo.applyMatrix( new THREE.Matrix4().makeRotationZ( Math.atan2(capRadius, radius*1.05) ) );

  // todo: translate caps based on arc and radius
  var capGeoL = new THREE.SphereGeometry(capRadius, segments, 8, 0, Math.PI*2, Math.PI/2, Math.PI/2);
  capGeoL.applyMatrix( new THREE.Matrix4().makeTranslation( 0, capRadius, 0) );
  capGeoL.applyMatrix( new THREE.Matrix4().makeTranslation( radius, 0, 0 ) );

  var capGeoR = new THREE.SphereGeometry(capRadius, segments, 8, 0, Math.PI*2, 0, Math.PI/2);
  capGeoR.applyMatrix( new THREE.Matrix4().makeTranslation( 0, -capRadius, 0) );
  capGeoR.applyMatrix( new THREE.Matrix4().makeTranslation( radius, 0, 0 ) );
  capGeoR.applyMatrix( new THREE.Matrix4().makeRotationZ( arc ) );

  geo.merge(mainGeo);
  geo.merge(capGeoL);
  geo.merge(capGeoR);

  this.copy( geo );

  //this.mergeVertices(); // align better

  //this.applyMatrix(new THREE.Matrix4().makeRotationZ( Math.PI / 2));

  // remap UVS
  this.computeBoundingBox();

  var max = this.boundingBox.max,
      min = this.boundingBox.min;
  var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
  var range = new THREE.Vector2(max.x - min.x, max.y - min.y);

  this.faceVertexUvs[0] = [];
  for (var i = 0; i < this.faces.length; i++) {
    var v1 = this.vertices[this.faces[i].a],
        v2 = this.vertices[this.faces[i].b],
        v3 = this.vertices[this.faces[i].c];

    var t1 = (Math.atan2(v1.y, v1.x) + Math.PI) / (Math.PI*2);
    var t2 = (Math.atan2(v2.y, v2.x) + Math.PI) / (Math.PI*2);
    var t3 = (Math.atan2(v3.y, v3.x) + Math.PI) / (Math.PI*2);

    var n = i / (this.faces.length-1);
    this.faceVertexUvs[0].push(
      [
        new THREE.Vector2(1-t1, 1-t1),
        new THREE.Vector2(1-t2, 1-t2),
        new THREE.Vector2(1-t3, 1-t3)
      ]);
  }

  this.uvsNeedUpdate = true;

  this.computeFaceNormals();
  this.computeVertexNormals();

};

MV.RoundedTorusGeometry.prototype = Object.create( THREE.Geometry.prototype );
MV.RoundedTorusGeometry.prototype.constructor = THREE.RoundedBarGeometry;

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
