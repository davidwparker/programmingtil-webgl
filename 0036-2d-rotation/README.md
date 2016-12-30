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

* Rotating an object in 2d space.

Rotation Axis
Rotation Direction
Rotation Angle

For 2d, going to rotate around the z axis, counterclockwise, B degrees.

Want p' (x',y',z').
p (x,y) = (r cos a, r sin a), where
r is the distance from origin to p
a is the rotation angle from the x-axis

p' = (r cos a+B, r sin a+B)
x' = x cos B - y sin B
y' = x sin B + y cos B
z' = z

## RESOURCES:

* https://github.com/davidwparker/programmingtil-webgl/tree/master/0036-2d-rotation
