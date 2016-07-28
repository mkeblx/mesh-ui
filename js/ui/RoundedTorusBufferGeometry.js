'use strict';

var MV = MV || {};

MV.RoundedTorusBufferGeometry = function ( radius, tube, radialSegments, tubularSegments, arc ) {

  THREE.BufferGeometry.call( this );

  this.type = 'RoundedTorusBufferGeometry';

  this.parameters = {
    radius: radius,
    tube: tube,
    radialSegments: radialSegments,
    tubularSegments: tubularSegments,
    arc: arc
  };

  radius = radius || 100;
  tube = tube || 40;
  radialSegments = Math.floor( radialSegments ) || 8;
  tubularSegments = Math.floor( tubularSegments ) || 6;
  arc = arc || Math.PI * 2;

  // TODO cleanup
  var segmentsPerCap = 12;
  var mainSegments = tubularSegments;
  tubularSegments += segmentsPerCap * 2;

  // used to calculate buffer length
  var vertexCount = ( ( radialSegments + 1 ) * ( tubularSegments + 1 ) );
  var indexCount = radialSegments * tubularSegments * 2 * 3;

  // buffers
  var indices = new ( indexCount > 65535 ? Uint32Array : Uint16Array )( indexCount );
  var vertices = new Float32Array( vertexCount * 3 );
  var normals = new Float32Array( vertexCount * 3 );
  var uvs = new Float32Array( vertexCount * 2 );

  // offset variables
  var vertexBufferOffset = 0;
  var uvBufferOffset = 0;
  var indexBufferOffset = 0;

  // helper variables
  var center = new THREE.Vector3();
  var vertex = new THREE.Vector3();
  var normal = new THREE.Vector3();

  var j, i;

  // generate vertices, normals and uvs

  var us = [];
  var capArc = tube;
  var mainArc = arc - (4 * capArc);
  var capInc = tube / segmentsPerCap * 2;
  var mainInc = mainArc / mainSegments;

  var pc = 0;


  var cs = [];
  //var cx = 1 / (segmentsPerCap-1);
  for ( var i = 0; i <= tubularSegments; i++ ) {
    us.push( pc );

    if (i < segmentsPerCap) {
      pc += ( capInc );
      var len = 1 - (1 / (segmentsPerCap-1)) * i;
      var bsq = 1 - len*len;
      var b = Math.sqrt( bsq );
      cs.push( b );
    } else if (i >= segmentsPerCap && i < (tubularSegments - segmentsPerCap)) {
      pc += ( mainInc );
      cs.push( 1 );
    } else {
      pc += ( capInc );
      cs.push( cs[ Math.abs(i - tubularSegments) ] );
    }

  }

  for ( j = 0; j <= radialSegments; j ++ ) {

    var v = j / radialSegments * Math.PI * 2;
    var z = tube * Math.sin( v );



    var _r = Math.cos( v ) * tube;

    for ( i = 0; i <= tubularSegments; i ++ ) {

      var u = us[ i ];

      // vertex
      vertex.x = ( radius + _r * cs[i] ) * Math.cos( u );
      vertex.y = ( radius + _r * cs[i] ) * Math.sin( u );
      vertex.z = z;

      vertices[ vertexBufferOffset ] = vertex.x;
      vertices[ vertexBufferOffset + 1 ] = vertex.y;
      vertices[ vertexBufferOffset + 2 ] = vertex.z;

      // this vector is used to calculate the normal
      center.x = radius * Math.cos( u );
      center.y = radius * Math.sin( u );

      // normal
      normal.subVectors( vertex, center ).normalize();

      normals[ vertexBufferOffset ] = normal.x;
      normals[ vertexBufferOffset + 1 ] = normal.y;
      normals[ vertexBufferOffset + 2 ] = normal.z;

      // uv
      uvs[ uvBufferOffset ] = u / arc;
      uvs[ uvBufferOffset + 1 ] = j / radialSegments;

      // update offsets
      vertexBufferOffset += 3;
      uvBufferOffset += 2;

    }

  }

  // generate indices

  for ( j = 1; j <= radialSegments; j ++ ) {

    for ( i = 1; i <= tubularSegments; i ++ ) {

      // indices
      var a = ( tubularSegments + 1 ) * j + i - 1;
      var b = ( tubularSegments + 1 ) * ( j - 1 ) + i - 1;
      var c = ( tubularSegments + 1 ) * ( j - 1 ) + i;
      var d = ( tubularSegments + 1 ) * j + i;

      // face one
      indices[ indexBufferOffset ] = a;
      indices[ indexBufferOffset + 1 ] = b;
      indices[ indexBufferOffset + 2 ] = d;

      // face two
      indices[ indexBufferOffset + 3 ] = b;
      indices[ indexBufferOffset + 4 ] = c;
      indices[ indexBufferOffset + 5 ] = d;

      // update offset
      indexBufferOffset += 6;

    }

  }

  // build geometry
  this.setIndex( new THREE.BufferAttribute( indices, 1 ) );
  this.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
  this.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
  this.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

};

MV.RoundedTorusBufferGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
MV.RoundedTorusBufferGeometry.prototype.constructor = MV.RoundedTorusBufferGeometry;

if ( 'undefined' !== typeof exports && 'undefined' !== typeof module ) {
  module.exports = MV.RoundedTorusBufferGeometry;
}
