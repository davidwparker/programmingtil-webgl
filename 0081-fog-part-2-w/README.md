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

* Fog

#### Equations

Fog factor = (end point - distance from eye point) / (end point - starting point)

Where

starting point <= distance from eye point <= end point

if fog factor == 1, then object is completely shown; if fog factor == 0, object completely hidden

fragment color = surface color * fog factor + fog color * (1-fog factor)

## RESOURCES:

* https://github.com/davidwparker/programmingtil-webgl/tree/master/0081-fog-part-2-w
