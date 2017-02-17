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

* Blending
  * When drawing blended and unblended objects together, first enable DEPTH_TEST,
  draw all the opaque objects (alpha = 1), then turn depth mask read only gl.depthMask(false),
  and finally draw all transparent objects (from furthest back to closest) and turn
  the depth mask back on

## RESOURCES:

* https://github.com/davidwparker/programmingtil-webgl/tree/master/0082-blending-part-1
