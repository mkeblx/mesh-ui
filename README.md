mesh-ui
=======

VR-focused 3D UI


### Usage

In a three.js scene.

```javascript

<script src="dist/mesh-ui.bundle.js"></script>

<script>

var progressRadial = new MV.Progress( {
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

var colors = [ '#9c27b0', '#2196f3', '#e91e63' ];
var values = [ 0.1, 0.2, 0.3 ];

progressRadial.setColors( colors );
progressRadial.setValues( values );

scene.add( progressRadial.getObject() );

</script>

```

#### Aframe

Or can use the Aframe component.

```html
<script src="dist/aframe-mesh-ui.bundle.js"></script>

<a-scene>

  <a-entity id="progress-radial" progress="type: radial; values: 0.1 0.5 0.1; width: 1.3; thickness: 0.1; lit: true" position="0.75 2.2 0"></a-entity>

</a-scene>

<script>
var pr = document.getElementById('progress-radial');

pr.setAttribute('progress', 'values', '0.1 0.2 0.3');
</script>
```