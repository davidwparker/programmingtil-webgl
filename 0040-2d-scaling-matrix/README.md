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

* 2d scaling with matrices

```
x' = sx * x
y' = sy * y
z' = sz * z
```

```
x' = ax + by + cz + d
y' = ex + fy + gz + h
z' = ix + jy + kz + l
1  = mx + ny + oz + p
```

a = sx
f = sy
k = sz
rest = 0, p = 1

So our Matrix looks like this:
```
[
 sx 0  0  0
 0  sy 0  0
 0  0  sz 0
 0  0  0  1
]
```

## RESOURCES:

* https://github.com/davidwparker/programmingtil-webgl/tree/master/0040-2d-scaling-matrix
