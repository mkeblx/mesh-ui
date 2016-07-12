'use strict';

var MV = MV || {};

MV.RoundedBarGeometry = function ( width, size, segments ) {

  THREE.Geometry.call( this );

  this.type = 'RoundedBarGeometry';

  this.parameters = {
    width: width,
    size: size,
    segments: segments
  };

  var thickness = size;
  var radius = thickness/2;
  var _width = width - 2*radius;

  var geo = new THREE.Geometry();
  var mainGeo = new THREE.CylinderGeometry(radius, radius, _width, segments, 1, true);
  var capGeoL = new THREE.SphereGeometry(radius, segments, 8, 0, Math.PI*2, 0, Math.PI/2);
  capGeoL.applyMatrix( new THREE.Matrix4().makeTranslation( 0, _width/2, 0) );
  var capGeoR = new THREE.SphereGeometry(radius, segments, 8, 0, Math.PI*2, Math.PI/2, Math.PI/2);
  capGeoR.applyMatrix( new THREE.Matrix4().makeTranslation( 0, -_width/2, 0) );
  geo.merge(mainGeo);
  geo.merge(capGeoL);
  geo.merge(capGeoR);

  this.copy( geo );

  //this.mergeVertices(); // align better

  this.applyMatrix(new THREE.Matrix4().makeRotationZ( Math.PI / 2));

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
    this.faceVertexUvs[0].push(
      [
        new THREE.Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
        new THREE.Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
        new THREE.Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
      ]);
  }

  this.uvsNeedUpdate = true;

  this.computeFaceNormals();
  this.computeVertexNormals();

};

MV.RoundedBarGeometry.prototype = Object.create( THREE.Geometry.prototype );
MV.RoundedBarGeometry.prototype.constructor = MV.RoundedBarGeometry;

MV.RoundedBarGeometry.prototype.clone = function () {

  var parameters = this.parameters;

  return new MV.RoundedBarGeometry(
    parameters.width,
    parameters.size,
    parameters.segments
  );

};

if ( 'undefined' !== typeof exports && 'undefined' !== typeof module ) {
  module.exports = MV.RoundedBarGeometry;
}
