'use strict';
(function namespace() {
  const numFin = Number.isFinite;


  function errDeprecatedXmlAttrDictConvenience() {
    const msg = ('The shape2path invocation for xmlattrdict convenience'
      + ' has changed in v0.2.0. Please update your code accordingly.');
    throw new Error(msg);
  }


  const EX = function shape2path(tag, attr) {
    if (tag['']) { errDeprecatedXmlAttrDictConvenience(); }
    const impl = EX.supportedShapes[tag];
    // ^-- If your SVG has <toString> tags, you're doing it wrong.
    if (impl && impl.call) { return impl(attr); }
    return (tag['<>'] || '');
  };


  function rxBody(rx) { return rx.source || String(rx).slice(1, -1); }

  EX.numRxBody = rxBody(/[\+\-]?(?:\d*\.|)\d+(?:[eE][\+\-]?\d+|)/);
  // ^-- see `docs/numRxBody.md` for a breakdown of this RegExp.

  EX.numPairRxBody = '(' + EX.numRxBody + ')\\s*,\\s*(' + EX.numRxBody + ')';


  function isStr(x, no) { return (((typeof x) === 'string') || no); }
  function isset(x) { return (!!x) || (x === 0); }
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

    xad(attr) {
      const tn = attr[''];
      if (isStr(tn)) { return EX(tn, attr); }
      throw new TypeError('xmlattrdict tag name must be a string');
    },


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


    transformPoints: (function compile() {
      function f(n, s) { return ((+n || 0) * s).toFixed(0); }
      const t = function transformPoints(scaleFactors, origPoints) {
        const { x, y } = scaleFactors;
        function g(m, px, py) { return f(px, x) + ',' + f(py, y); }
        return String(origPoints || '').replace(t.rx, g);
      };
      t.rx = new RegExp(EX.numPairRxBody, 'g');
      return t;
    }()),


    scaleOneSvgTag: (function compile() {
      function easyScale(o, k, s) {
        const v = +o[k];
        if (!v) { return; }
        o[k] = (v * s).toFixed(0); // eslint-disable-line no-param-reassign
      }
      easyScale.x = ['x', 'width', 'cx', 'rx'];
      easyScale.y = ['y', 'height', 'cy', 'ry'];

      const circ = 'circle';
      const elli = 'ellipse';
      const sost = function scaleOneSvgTag(how, attr, tagName) {
        const cfg = (numFin(how) ? { x: how, y: how } : { ...how });
        if ((cfg.x === 1) && (cfg.y === 1)) { return attr; }
        const out = { ...attr };
        out[''] ||= isStr(tagName, '') && tagName;
        if (isset(out.r)) {
          if (out[''] === circ) { out[''] = elli; }
          out[''] ||= elli;
          out.rx = out.r;
          out.ry = out.r;
          delete out.r;
        }
        easyScale.x.forEach(k => easyScale(out, k, cfg.x));
        easyScale.y.forEach(k => easyScale(out, k, cfg.y));
        if ((out[''] === elli) && (out.rx === out.ry)) {
          out[''] = circ;
          out.r = out.rx;
          delete out.rx;
          delete out.ry;
        }
        if (out.points) { out.points = EX.transformPoints(cfg, out.points); }
        return out;
      };
      return sost;
    }()),




  });


















  (function unifiedExport(e) {
    /* global define */
    const d = ((typeof define === 'function') && define);
    const m = ((typeof module === 'object') && module);
    if (d && d.amd) { d(function f() { return e; }); }
    if (m && m.exports) { m.exports = e; }
  }(EX));
}());
