
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



### shape2path.xad(attr)

A convenience for users of the `xmlattrdict` module,
equivalent to `shape2path(attr[''], attr)`.



### shape2path.supportedShapes

This is a dictionary object that holds the implementations for supported
shapes:

* `circle({ cx, cy, r })`
* `ellipse({ cx, cy, rx, ry })`
* `polygon({ points })`
* `rect({ x, y, widht, height })`



### shape2path.scaleOneSvgTag(how, attr[, tagName])

`how` must be an object with properties `x` and `y`,
or it must be a number, in which case that number is used as `x` and `y`.
Those are the scaling factors for the X axis and the Y axis.
They are expected to be numbers.
If both are equal to 1, the original `attr` is immediately returned.

Otherwise, returns `out`, which is a shallow copy of `attr` where
numbers in supported attributes have been scaled on their respective axis.

Argument `attr` is expected as with `shape2path`,
with the empty-named property (`attr['']`) set to the shape name
(as would be returned by `xmlattrdict`).
If the empty-named property is false-y,
and `tagName` is a non-empty string,
the latter will be used instead.

The empty-named property of the result (`out['']`) will be set
to the resulting shape name, which may be different from the original
tag name (e.g. `'circle'` &harr; `ellipse`).

Numbers in the input are expected to be given without a unit suffix,
i.e. in user units, which usually means pixels.
Numbers in the result may have been rounded to whole user units.







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
