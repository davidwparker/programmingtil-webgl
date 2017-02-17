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

* Lighting
* Surface color by diffuse reflection = light color * base color of surface * cos A
  * Diffuse reflection = reflection differs by light position
  * Angle(A) = between the light and surface
* Surface color by ambient reflection = light color * base color of surface
  * Ambient reflection = same reflection at any position
* Surface color by diffuse and ambient reflection = surface color by diffuse + surface color by ambient

#### Examples:

* if light source is white (1.0,1.0,1.0) such as the sun
* base color is green (0.0,1.0,0.0)
* angle is 0.0 (perpendicular), then cos A = 1.0

R = 1 * 0 * 1 = 0.0
G = 1 * 1 * 1 = 1.0
B = 1 * 0 * 1 = 0.0

* if light source is white (1.0,1.0,1.0) such as the sun
* base color is green (0.0,1.0,0.0)
* angle is 60 degrees, then cos A = 0.5

R = 1 * 0 * 0.5 = 0.0
G = 1 * 1 * 0.5 = 0.5
B = 1 * 0 * 0.5 = 0.0

#### Calculating Cos A

Cos A = light direction (dot) orientation of a surface

* Dot product
* Normalization (vector lengths must be 1.0)

#### Normals

Surfaces have two normals- front and back.

## RESOURCES:

* https://github.com/davidwparker/programmingtil-webgl/tree/master/0075-lighting-part-4-transformations
