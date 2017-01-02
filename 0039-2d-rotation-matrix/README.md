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

* Rotation Matrix

#### Multiplication Example

```
[      [          [
 x' =   a b c      x
 y' =   d e f   *  y
 z' =   g h i      z
   ]          ]     ]
```

```
x' = ax + by + cz
y' = dx + ey + fz
z' = gx + hy + iz
```

Compare to rotation from before:
```
x' = x cos B - y sin B
y' = x sin B + y cos B
z' = z
```

Set a = cos B, b = -sin B, c = 0
Set d = sin B, e = cos B, f = 0

We can use a 3x3 matrix here, but we'll use a 4x4 to stay consistent with the last episode.

Extrapolating out what we were doing, we'll have a our Matrix looks like this:
```
[
 cosB -sinB 0 0
 sinB +cosB 0 0
 0    0     1 0
 0    0     0 1
]
```

## RESOURCES:

* https://github.com/davidwparker/programmingtil-webgl/tree/master/0039-2d-rotation-matrix
