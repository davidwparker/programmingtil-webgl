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

* Intro to 3d: View and Model Matrix
* Model Matrix (also known as the world matrix):
  * Unique for every object within your world, and is responsible for transforming the vertices of an object from its own local space, to a common coordinate system called model space.
* View Matrix:
  * Provides the concept of a mobile camera, when it reality the camera is actually the only constant point of reference within the world. The view matrix is a transformation that is applied to every object in the scene (but is not unique to each object), and provides the illusion of a camera. The view matrix is basically the inverse of what could be considered a model matrix for the camera. Yet instead of moving the camera itself, it provides the opposite movements to the rest of the scene.

### Equations:
We want to view rotated triangles from a specific eye position. So we need to rotate the
vertex coordinates (the rotated triangle) as we look at them from a specific position.

To rotate a shape:
```
<rotated vertex coords> = <rotation matrix> * <original vertex coords>
```

Then we can use that to get the rotated vertex coordinates from a specific point:
```
<rotated vertex coords view from position> = <view matrix> * <rotated vertex coords>
```

Substituting the first equation into the second:
```
<rotated vertex coords view from position> = <view matrix> * <rotation matrix> * <original vertex coords>
```

This is known as the Model Matrix. Substituting that in, you get:
```
<view matrix> * <model matrix> * <vertex coords>
```

## RESOURCES:

* https://github.com/davidwparker/programmingtil-webgl/tree/master/0054-3d-view-model
* http://www.3dgep.com/understanding-the-view-matrix/
* http://gamedev.stackexchange.com/questions/56201/opengl-understanding-the-relationship-between-model-view-and-world-matrix
