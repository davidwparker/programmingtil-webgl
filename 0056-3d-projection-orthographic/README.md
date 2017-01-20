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

* 3d: Projection Matrix
* Projection Matrix:
  * Responsible for converting a 3D world into the homogeneous screen space (-1, 1) that you see on your screen. This is the matrix used to represent your view frustum, and is usually represented as an orthographic or perspective projection.
* Orthographic Projection
  * When the human eye looks at a scene, objects in the distance appear smaller than objects close by. Orthographic projection ignores this effect to allow the creation of to-scale drawings for construction and engineering.

## RESOURCES:

* https://github.com/davidwparker/programmingtil-webgl/tree/master/0056-3d-projection-orthographic
* https://en.wikipedia.org/wiki/3D_projection
* https://en.wikipedia.org/wiki/Orthographic_projection
* http://gamedev.stackexchange.com/questions/56201/opengl-understanding-the-relationship-between-model-view-and-world-matrix
