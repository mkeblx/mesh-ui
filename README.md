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


### Properties

| Name | Value | Default |
| ---- | ----- | ------- |
| type | One of 'bar', 'radial' or for 2D versions 'bar-2d', 'radial-2d' | 'bar' |
| bgColor | Background color of mesh, visible when a value doesn't cover | |
| colors | Array of colors for segments: segment i with value=values[i] uses colors[i] | ['#9c27b0','#2196f3','#e91e63','#00bcd4'] |
| values | Array of values for segments, sum <= 1 | [0] |
| bg | draw the background color. If false, background transparent | true |
| width | Width of progress element (outer width) | 1 |
| thickness | Thickness dimension | 0.1 |
| lit | use lighting for material | false |
| rounded | use rounded endcaps for geometry | true |
| gradient | draw gradient using all colors; will use only first value | false |
| segments | number of geometry segments | 16 for bar, 52 for radial |
| arc | for radial type, arc angle | 2*pi radians (360&deg;) |


