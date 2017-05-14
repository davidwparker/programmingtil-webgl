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

* Back-face Culling
*   Determine whether a polygon is front or back facing. Meaning, triangle drawn clockwise or counterclockwise.
*   If culling back-facing polygons (drawn counterclockwise), then it's facing away, and will not drawn.
*   Makes rendering faster.

## RESOURCES:

* https://github.com/davidwparker/programmingtil-webgl/tree/master/0096-culling
* https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/cullFace
* https://en.wikipedia.org/wiki/Back-face_culling
