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

#### Framebuffers
* Use a framebuffer to perform different types of processing before displaying content.
* Use a framebuffer as a texture image.
  * "Offscreen drawing"
* FBO (Framebuffer Objects) have attachments (color, depth, stencil), like the depth and stencil buffers.

#### RenderBuffers
* general purpose drawing area

#### 8 steps
* create FBO
* create texture object
* create render object
* bind render object to the target and set size
* attach texture object to color attachment of FBO
* attach render object to the depth attachment of FBO
* check status of FBO
* draw frame using FBO

## RESOURCES:

* https://github.com/davidwparker/programmingtil-webgl/tree/master/0090-framebuffer-part-1
