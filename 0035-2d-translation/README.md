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

* Translating an object in 2d space.

Reminder:

* attribute – Global variables that may change per vertex, that are passed from the WebGL application to vertex shaders. This qualifier can only be used in vertex shaders. For the shader this is a read-only variable.
* uniform – Global variables that may change per primitive [...], that are passed from the WebGL application to the shaders. This qualifier can be used in both vertex and fragment shaders. For the shaders this is a read-only variable.
* varying – used for interpolated data between a vertex shader and a fragment shader. Available for writing in the vertex shader, and read-only in a fragment shader.

(via http://www.lighthouse3d.com/tutorials/glsl-tutorial/data-types-and-variables/)

## RESOURCES:

* https://github.com/davidwparker/programmingtil-webgl/tree/master/0035-2d-translation
* http://www.lighthouse3d.com/tutorials/glsl-tutorial/data-types-and-variables/
