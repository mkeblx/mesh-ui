'use strict';

var clock = new THREE.Clock();

var scene, camera;
var renderer, element;

var effect, controls;

var dolly;

var raycaster;

var uiElements = [];

load();

function load() {
  init();
  animate();
}

function init() {
  scene = new THREE.Scene();

  raycaster = new THREE.Raycaster();

  var width = 2.2, height = 2.2;
  //camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 0.01, 100 );
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);

  var crosshair = new THREE.Mesh(
    new THREE.RingGeometry( 0.02, 0.04, 32 ),
    new THREE.MeshBasicMaterial( {
      color: 0xffffff,
      opacity: 0.5,
      transparent: true
    } )
  );
  crosshair.position.set( 0, 0, -1.2 );
  camera.add( crosshair );

  dolly = new THREE.Object3D();
  dolly.add( camera );

  dolly.position.z = 1.5;

  scene.add( dolly );

  setupRendering();

  setupWorld();

  setupEvents();

  controls = new THREE.VRControls( camera );
}

function setupRendering() {
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setClearColor( 0xaaaaaa );

  renderer.setSize( window.innerWidth, window.innerHeight );

  effect = new THREE.VREffect(renderer);

  var container = document.createElement( 'div' );
  document.body.appendChild( container );

  element = renderer.domElement;
  container.appendChild(element);

  window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

var progressBar;
var progressBar2D;
var progressBarLabel;
var progressRadial;
var progressRadial2D;
var progressRadialLabel;
var button;
var buttonLabel;
function setupWorld() {
  // env
  var gridHelper = new THREE.GridHelper( 1, 0.1 );
  gridHelper.rotation.set(Math.PI/2, 0, 0);
  //scene.add( gridHelper );

  var light = new THREE.AmbientLight(0xffffff);
  scene.add( light );
  var light = new THREE.DirectionalLight( 0xffffff, 0.3 );
  light.position.set(1,1,1).normalize();
  scene.add( light );


  // ProgressBar
  var colors = [
    '#9c27b0',
    '#2196f3',
    '#e91e63',
    '#00bcd4'];
  var values = [0.1, 0.2, 0.3];

  var progressBarGroup = new THREE.Group();

  progressBar2D = new MV.Progress( {
    type: 'bar-2d',
    width: 1,
    thickness: 0.05,
    rounded: true,
    gradient: false } );
  //progressBar.getObject().rotation.set(0.3,1,0.3);
  progressBarGroup.add( progressBar2D.getObject() );

  progressBar2D.setColors(colors);
  progressBar2D.setValues(values);

  uiElements.push(progressBar2D);

  progressBarLabel = new MV.Text( {
    value: 'ProgressBar',
    fontSize: 96,
    textAlign: 'left',
    x: 0,
    y: 96 } );
  var labelObj = progressBarLabel.getObject();
  labelObj.position.set(0, 0.10, 0);
  progressBarGroup.add( labelObj );

  uiElements.push(progressBarLabel);

  progressBarGroup.position.set(0, 0.8, 0);
  scene.add(progressBarGroup);

  progressBar = new MV.Progress( {
    type: 'bar',
    width: 1,
    thickness: 0.05,
    rounded: true,
    lit: true,
    gradient: false } );
  progressBar.getObject().position.set(0, -0.08, 0);
  progressBarGroup.add( progressBar.getObject() );

  progressBar.setColors(colors);
  progressBar.setValues(values);

  uiElements.push(progressBar);


  // ProgressRadial
  var progressRadialGroup = new THREE.Group();
  progressRadial2D = new MV.Progress( {
    type: 'radial-2d',
    width: 1,
    thickness: 0.05,
    rounded: true,
    lit: true,
    gradient: false
     } );

  progressRadial2D.setColors(colors);
  progressRadial2D.setValues(values);

  progressRadial2D.getObject().scale.set(0.85, 0.85, 0.85);
  progressRadialGroup.add( progressRadial2D.getObject() );
  uiElements.push( progressRadial2D );

  progressRadialLabel = new MV.Text( {
    value: 'ProgressRadial',
    fontSize: 96,
    textAlign: 'left',
    x: 0,
    y: 96 } );
  var radialLabelObj = progressRadialLabel.getObject();
  radialLabelObj.position.set(0, 0.60, 0);
  progressRadialGroup.add( radialLabelObj );

  progressRadialGroup.position.set(0, -0, 0);
  scene.add(progressRadialGroup);


  progressRadial = new MV.Progress( {
    type: 'radial',
    width: 1,
    thickness: 0.05,
    rounded: true,
    lit: true,
    gradient: false,
    arc: Math.PI*2,
    segments: 42,
    radialSegments: 8
     } );

  progressRadial.setColors(colors);
  progressRadial.setValues(values);


  progressRadialGroup.add( progressRadial.getObject() );
  uiElements.push( progressRadial );

  // Button
  var buttonGroup = new THREE.Group();
  button = new MV.Button( {
    id: 'update',
    title: 'Update',
    width: 0.2,
    image: 'textures/buttons/refresh_button.png'
  } );
  buttonGroup.add( button.mesh );
  uiElements.push( button );

  buttonLabel = new MV.Text( {
    value: 'Button',
    fontSize: 96,
    textAlign: 'left',
    x: 0,
    y: 96 } );
  var buttonLabelObj = buttonLabel.getObject();
  buttonLabelObj.position.set(0, 0.15, 0);
  buttonGroup.add( buttonLabelObj );

  buttonGroup.position.set(0, -0.8, 0);
  scene.add(buttonGroup);
}

function setupEvents() {
  document.addEventListener('keydown', function(event){
    console.log(event.keyCode);
    if (event.keyCode == 82) { // R
      buttonClick();
    } else if (event.keyCode == 71) { // G
      progressBar.options.gradient = !progressBar.options.gradient;
      progressBar2D.options.gradient = !progressBar2D.options.gradient;
      progressRadial.options.gradient = !progressRadial.options.gradient;
      progressRadial2D.options.gradient = !progressRadial2D.options.gradient;

      progressBar.update();
      progressBar2D.update();
      progressRadial.update();
      progressRadial2D.update();
    }
  }, false );


  document.addEventListener( 'keydown', onKeyDown, false );

  function onKeyDown(e) {
    console.log(e.keyCode);
    if (e.keyCode == 30) {

    } else if (e.keyCode == 70) { // f
      effect.setFullScreen(true);
    } else if (e.keyCode == 74) { // j

    } else if (e.keyCode == 75) { // k

    }
  }

  document.addEventListener( 'click', onDocumentClick, false );
  function onDocumentClick( event ) {
    event.preventDefault();

    if (selection && selection.userData.type == 'button') {
      buttonClick();
    }
  }

  var buttonClick = function(e){

    var curr = progressBar._values;
    var values = [ Math.random(), Math.random(), Math.random() ];

    var sum = _.sum(values);
    if (true) {
      values = _.map(values, function(v){ return v / 3 });
    }

    var tween = new TWEEN.Tween( { v1: curr[0], v2: curr[1], v3: curr[2] } )
      .to( { v1: values[0], v2: values[1], v3: values[2] }, 400 )
      .easing( TWEEN.Easing.Quintic.Out )
      .onUpdate(function(){
        var vals = [ this.v1, this.v2, this.v3 ];
        var value = vals[0];

        progressBar.setValues( vals );
        progressBar2D.setValues( vals );
        progressRadial.setValues( vals );
        progressRadial2D.setValues( vals );
        progressBarLabel.value = 'ProgressBar: ' + Math.round( value*100 );
        progressRadialLabel.value = 'ProgressRadial: ' + Math.round( value*100 );
      })
      .onComplete(function(){

      })
      .start();
  };
}

var selection = null;
function processUi() {
  raycaster.setFromCamera( { x:0, y:0 }, camera );

  var intersects = raycaster.intersectObjects( scene.children , true );

  if ( intersects.length > 0 ) {
    selection = intersects[0].object;
  } else {
    selection = null;
  }

}

function animate(t) {
  effect.requestAnimationFrame(animate);

  var dt = clock.getDelta();

  update(dt, t);
  render(dt, t);
}

function update(dt, t) {
  processUi();

  controls.update();

  TWEEN.update(t);
}

function render(dt, t) {
  effect.render(scene, camera);
}
