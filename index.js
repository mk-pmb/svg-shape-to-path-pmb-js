'use strict';
(function namespace() {

  const EX = function shape2path(tag, attr) {
    if (tag['']) { return EX(tag[''], tag); }
    const impl = EX.supportedShapes[tag];
    // ^-- If your SVG has <toString> tags, you're doing it wrong.
    if (impl && impl.call) { return impl(attr); }
    return (tag['<>'] || '');
  };


  function rxBody(rx) { return rx.source || String(rx).slice(1, -1); }

  EX.numRxBody = rxBody(/[\+\-]?(?:\d*\.|)\d+(?:[eE][\+\-]?\d+|)/);
  // ^-- see `docs/numRxBody.md` for a breakdown of this RegExp.


  function words(s) { return String(s).match(/\S+/g) || 0; }

  function ellipse({ cx, cy, rx, ry }) {
    const deltaY = ((+ry || 0) * 2).toFixed(0); /*
      If you need sub-pixel precision, please file a feature request. */
    const arc = ' a ' + rx + ' ' + ry + ' 0 0 0 0 '; /*
      The four zeroes are:
        * X axis rotation. We want X to point right.
        * large arc flag: Set to 1 to prefer the longer arc (> 180 deg)
        * sweep: 0 = clockwise, 1 = counterclockwise
        * deltaX: How far to arc. We only use ±deltaY in order to avoid
          an additional string concatenation operation between the arcs.
      */
    return ("<path d='M " + cx + ' ' + cy
      + ' m 0,-' + ry // verified: SVG doesn't allow negative radii.
      + arc + deltaY // left half
      + arc + '-' + deltaY // right half
      + " Z' />");
  }

  Object.assign(EX, {

    supportedShapes: {
      circle({ cx, cy, r }) { return ellipse({ cx, cy, rx: r, ry: r }); },
      ellipse,

      polygon({ points }) {
        const p = words(points);
        if (!p.length) { return ''; }
        return "<path d='M " + p.join(' L ') + " Z' />";
      },

      rect({ x, y, width, height }) {
        return ("<path d='M " + x + ',' + y
          + ' h ' + width + ' v ' + height
          + ' h -' + width + ' v -' + height
          + " ' />");
      },

    },


  });


















  (function unifiedExport(e) {
    /* global define */
    const d = ((typeof define === 'function') && define);
    const m = ((typeof module === 'object') && module);
    if (d && d.amd) { d(function f() { return e; }); }
    if (m && m.exports) { m.exports = e; }
  }(EX));
}());
