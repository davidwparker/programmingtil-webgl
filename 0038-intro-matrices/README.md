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

* https://www.davidwparker.com
* https://www.codenameparkerllc.com
* https://www.programmingtil.com

* Matrices
  * Rectangle array of numbers arranged in rows (horizontal) and columns (vertical)
  * Example:
  ```
  [
    a b c
    d e f
    g h i
  ]
  ```
* Vector
  * object represented by n-tuple numbers, such as coordinates `(x, y, z)`
* Matrix multiplication
  * Noncommunative (A*B != B*A)
* APIs
  * GLSL `uniform mat4`
  * gl.uniformMatrix4fv

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

Compare to translation from before:
```
x' = ax + by = cz
x' = x + Tx
```

We need a constant, which we don't have. So in the above formula, we change to
a 4x4 matrix, and add our constant of 1 to the vectors.

```
[      [          [
 x' =   a b c d     x
 y' =   e f g h  *  y
 z' =   i j k l     z
 1  =   m n o p     1
   ]           ]     ]
```

```
x' = ax + by + cz + d
y' = ex + fy + gz + h
z' = ix + jy + kz + l
1  = mx + ny + oz + p
```

We can easily see that m=0, n=0, o=0, and p=1.
For x', a=1, b=0, c=0, d=Tx.
For y', e=0, f=1, g=0, h=Ty
For z', i=0, j=0, k=1, l=Tz

So our Matrix looks like this:
```
[
 1 0 0 Tx
 0 1 0 Ty
 0 0 1 Tz
 0 0 0 1
]
```

#### Row Major order vs Column Major order

WebGL requires column major order, meaning storing elements of a matrix in a downwards direction.
```
[
 a b c d
 e f g h
 i j k l
 m n o p
        ]
```
Here, we would store a e i m b f... and so on, rather than row major order, which is a b c d ...

* https://www.davidwparker.com
* https://www.codenameparkerllc.com
* https://www.programmingtil.com

## RESOURCES:

* https://github.com/davidwparker/programmingtil-webgl/tree/master/0038-intro-matrices
