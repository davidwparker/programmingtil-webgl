## STARTING OFF:

Make sure you have npm installed.
Run:
```
npm install http-server -g
```

Run:
```
http-server
```

View at: http://localhost:8080/

## CONCEPTS:

* 3d: Z-Fighting
  * When two-primitives have the same / identical values in the z-buffer

* APIs
  * gl.POLYGON_OFFSET_FILL //Activates adding an offset to depth values of polygon's fragments.
  * gl.polygonOffset //The offset is added before the depth test is performed and before the value is written into the depth buffer.

## RESOURCES:

* https://github.com/davidwparker/programmingtil-webgl/tree/master/0060-3d-zfighting
* https://en.wikipedia.org/wiki/Z-fighting
