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

View at: http://localhost:8080/0047-intro-texture

* NOTE: moved vendor and images out of folder.
  * Running from main directory instead inside this directory.

## CONCEPTS:

Introduction to Textures
* texture mapping
* texel (texture elements) (texture pixels)

4 steps:
* prepare image
* specify image mapping
* load texture image and configure for webgl
* extract texels from image in fragment shader

Texture coordinates
* [0,0] lower left
* [0,1] upper left
* [1,0] lower right
* [1,1] upper right

## RESOURCES:

* https://github.com/davidwparker/programmingtil-webgl/tree/master/0047-intro-texture
