
<!--#echo json="package.json" key="name" underline="=" -->
svg-shape-to-path-pmb
=====================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Convert popular SVG shape tags (circle, ellipse, polygon, rect) to path tags.
<!--/#echo -->



API
---

This module exports one function:

### shape2path(tag, attr)

`tag` should be a shape name as a string, ideally one of
`['circle', 'ellipse', 'polygon', 'rect']`.
`attr` should be a dictionary object with the shape tag attributes.

For supported shapes, return a string representation of a `<path>` element.
For all others, returns `(attr['<>'] || '')`, i.e. usually an empty string.

* As a convenience for users of the `xmlattrdict` module,
  if `tag['']` is truthy, the function will behave as if it were invoked as
  `shape2path(tag[''], tag)`.


### shape2path.supportedShapes

This is a dictionary object that holds the implementations for supported
shapes:

* `circle({ cx, cy, r })`
* `ellipse({ cx, cy, rx, ry })`
* `polygon({ points })`
* `rect({ x, y, widht, height })`








Usage
-----

see [test/usage.mjs](test/usage.mjs).

<!--#toc stop="scan" -->



Known issues
------------

* Needs more/better tests and docs.




&nbsp;


License
-------
<!--#echo json="package.json" key="license" -->
ISC
<!--/#echo -->
