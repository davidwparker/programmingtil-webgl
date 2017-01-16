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

* Texture APIs: texParameteri
* gl.texParameteri, gl.getTexParameter, gl.generateMipmap
* Mipmaps are used to create distance with objects.
  * A higher-resolution mipmap is used for objects that are closer, and a lower-resolution mipmap is used for objects that are farther away.
  * It starts with the resolution of the texture image and halves the resolution until a 1x1 dimension texture image is created.
  * For example, if you have a 64x64 texture, the next smaller mipmap is 16x16, then 4x4, then 1x1
  * We'll be looking at these in more detail in a later episode.
* TEXTURE_MAG_FILTER
  * A texture filter constant to use when a surface is rendered larger than the corresponding texture bitmap (such as for close-up objects). Initial value is gl.LINEAR.
* TEXTURE_MIN_FILTER
  * A texture filter constant to use when a surface is rendered smaller than the corresponding texture bitmap (such as for distant objects). Initial value is gl.NEAREST_MIPMAP_LINEAR.
* TEXTURE_WRAP_S
* TEXTURE_WRAP_T

## RESOURCES:

* https://github.com/davidwparker/programmingtil-webgl/tree/master/0052-texture-apis
* https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture
* https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter
* https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/generateMipmap
* https://msdn.microsoft.com/en-us/library/dn302437(v=vs.85).aspx
