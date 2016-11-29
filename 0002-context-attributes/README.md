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

* API: getContextAttributes

## Attributes:

* alpha
  * If the value is true, the drawing buffer has an alpha channel for the purposes of performing OpenGL destination alpha operations and compositing with the page. If the value is false, no alpha buffer is available.
* depth
  * If the value is true, the drawing buffer has a depth buffer of at least 16 bits. If the value is false, no depth buffer is available.
* stencil
  * If the value is true, the drawing buffer has a stencil buffer of at least 8 bits. If the value is false, no stencil buffer is available.
* antialias
  * If the value is true and the implementation supports antialiasing the drawing buffer will perform antialiasing using its choice of technique (multisample/supersample) and quality. If the value is false or the implementation does not support antialiasing, no antialiasing is performed.
* premultipliedAlpha
  * If the value is true the page compositor will assume the drawing buffer contains colors with premultiplied alpha. If the value is false the page compositor will assume that colors in the drawing buffer are not premultiplied. This flag is ignored if the alpha flag is false. See Premultiplied Alpha for more information on the effects of the premultipliedAlpha flag.
* preserveDrawingBuffer
  * If false, once the drawing buffer is presented as described in theDrawing Buffer section, the contents of the drawing buffer are cleared to their default values. All elements of the drawing buffer (color, depth and stencil) are cleared. If the value is true the buffers will not be cleared and will preserve their values until cleared or overwritten by the author.
  * On some hardware setting the preserveDrawingBuffer flag to true can have significant performance implications.
* preferLowPowerToHighPerformance
  * Provides a hint to the implementation suggesting that, if possible, it creates a context that optimizes for power consumption over performance. For example, on hardware that has more than one GPU, it may be the case that one of them is less powerful but also uses less power. An implementation may choose to, and may have to, ignore this hint.
* failIfMajorPerformanceCaveat
  * If the value is true, context creation will fail if the implementation determines that the performance of the created WebGL context would be dramatically lower than that of a native application making equivalent OpenGL calls. This could happen for a number of reasons, including:
  * An implementation might switch to a software rasterizer if the user's GPU driver is known to be unstable.
  * An implementation might require reading back the framebuffer from GPU memory to system memory before compositing it with the rest of the page, significantly reducing performance.
  * Applications that don't require high performance should leave this parameter at its default value of false. Applications that require high performance may set this parameter to true, and if context creation fails then the application may prefer to use a fallback rendering path such as a 2D canvas context. Alternatively the application can retry WebGL context creation with this parameter set to false, with the knowledge that a reduced-fidelity rendering mode should be used to improve performance.

## console.log(gl) attributes:

* canvas:
  * a reference to the canvas element which created this context
* drawingBufferWidth:
  * the actual width of the drawing buffer, which may differ from the with attribute of the HTMLCanvasElement if the implementation is unable to satisfy the requested width or height
* drawingBufferHeight:
  * the actual height of the drawing buffer, which may differ from the with attribute of the HTMLCanvasElement if the implementation is unable to satisfy the requested width or height

## RESOURCES:

https://github.com/davidwparker/programmingtil-webgl/tree/master/0002-context-attributes
https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.2
