'use strict';

var clock = new THREE.Clock();

var scene, camera;
var renderer, element;

var raycaster, mouse = new THREE.Vector2();

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
  camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 0.01, 100 );
  //camera = new THREE.PerspectiveCamera(75, 2/1, 0.01, 100);
  camera.position.z = 2;

  setupRendering();

  setupWorld();

  setupEvents();
}

function setupRendering() {
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setClearColor( 0xaaaaaa );

  var U = 640;
  renderer.setSize(U, U);

  element = renderer.domElement;

  document.getElementById('ui-canvas').appendChild(element);
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
    height: 0.1,
    type: 'circle',
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

var mouseEl = document.getElementById('mouse');
function setupEvents() {
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.getElementById('ui-canvas').addEventListener( 'click', onDocumentClick, false );
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

  function onDocumentMouseMove( event ) {
    event.preventDefault();

    mouse.x = ( ( event.clientX - renderer.domElement.offsetLeft ) / renderer.domElement.width ) * 2 - 1;
    mouse.y = - ( ( event.clientY - (renderer.domElement.offsetTop - document.body.scrollTop ) ) / renderer.domElement.height ) * 2 + 1;

    mouseEl.innerHTML = ( mouse.x.toFixed(3) + ',' + mouse.y.toFixed(3) );
  }

  function onDocumentClick( event ) {
    event.preventDefault();

    if (selection && selection.userData.object.type == 'mv.button') {
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
var intersectionEl = document.getElementById('intersection');
function processUi() {
  if (mouse.x === 0)
    return;

  //reset
  if (selection) {
    if (selection.userData.object.type == 'mv.button') {
      selection.userData.object.changeState('default');
    }
  }

  raycaster.setFromCamera( mouse, camera );

  var intersects = raycaster.intersectObjects( scene.children , true );

  if ( intersects.length > 0 ) {
    intersectionEl.innerHTML = 'intersection';
    selection = intersects[0].object;

    if (selection.userData.object.type === 'mv.button') {
      selection.userData.object.changeState('hover');
    }
  } else {
    intersectionEl.innerHTML = '';

    selection = null;
  }
}

function animate(t) {
  requestAnimationFrame(animate);

  var dt = clock.getDelta();

  update(dt, t);
  render(dt, t);
}

function update(dt, t) {
  processUi();

  TWEEN.update(t);
}

function render(dt, t) {
  renderer.render(scene, camera);
}
