
CSS real numbers regexp
=======================

As I understand the SVG spec, it defines its `<length>`s based on CSS,
which uses `<number>`s, which in the CSS spec are defined in
[chapter 4.3. "Real Numbers: the `<number>` type"][css-number-type].

  [css-number-type]: https://www.w3.org/TR/css3-values/#numbers

That spec is not very intuitive for RegExp writing, giving a road fork
that is optimized for conceptual understanding rather than machine parsing.
Let's split their definition into named parts:

* [w] When written literally, a number is either
* [a]
  * [i] an integer,
* [c] or
  * [z] zero or more decimal digits followed by a dot (.) followed by
  * [d] one or more decimal digits
* [e] ; optionally, it can be concluded by… *(an exponent)*

In my understanding, [i] is the same as [d]. We can thus rewrite [a] as:

* [w] When written literally, a number is either
* [a]
  * [d] one or more decimal digits
* [c] or
  * [z] zero or more decimal digits followed by a dot (.) followed by
  * [d] one or more decimal digits
* [e] ; optionally, it can be concluded by… *(an exponent)*

We can now insert a no-op at the start of [a]:

* [w] When written literally, a number is either
* [a]
  * [n] empty string followed by
  * [d] one or more decimal digits
* [c] or
  * [z] zero or more decimal digits followed by a dot (.) followed by
  * [d] one or more decimal digits
* [e] ; optionally, it can be concluded by… *(an exponent)*

… and move all instances of "followed by" preceeding [d] into their [d]:

* [w] When written literally, a number is either
* [a]
  * [n] empty string
  * [d] followed by one or more decimal digits
* [c] or
  * [z] zero or more decimal digits followed by a dot (.)
  * [d] followed by one or more decimal digits
* [e] ; optionally, it can be concluded by… *(an exponent)*

Since [a] and [c] now have the same tail [d], we can pull that out
and deduplicate it:

* [w] When written literally, a number is either
* [a]
  * [n] empty string
* [c] or
  * [z] zero or more decimal digits followed by a dot (.)
* [d] followed by one or more decimal digits
* [e] ; optionally, it can be concluded by… *(an exponent)*

We can then switch the order of [a] and [c], and merge them:

* [w] When written literally, a number is either
* [ca]
  * [z] zero or more decimal digits followed by a dot (.)
  * [n] or empty string
* [d] followed by one or more decimal digits
* [e] ; optionally, it can be concluded by… *(an exponent)*

Finally! We now have the definition in a form that can be efficiently
translated to a RegExp:

* Optional sign: `[\+\-]?`
* [ca]: `(?:\d*\.|)`
* [d]: `\d+`
* [e]: `(?:[eE][\+\-]?\d+|)`

Combined: `[\+\-]?(?:\d*\.|)\d+/(?:[eE][\+\-]?\d+|)`












