https://github.com/jasondavies/d3-cloud

<a name="canvas" href="#canvas">#</a> <b>canvas</b>([<i>canvas</i>])

If specified, sets the **canvas** generator function, which is used internally
to draw text.  If not specified, returns the current generator function, which
defaults to:

```js
function() { return document.createElement("canvas"); }
```

When using Node.js, you will almost definitely override this default, e.g.
using the [canvas module](https://www.npmjs.com/package/canvas).



SPRITES
m = pixels[3+((j * w + i)<<2)] ? 1 << (31 - (i % 32)) : 0; fourth value for each pixel is alpha, != 0 if there's text. This gives true. Then, the value must be set on the proper bit with 32 chunks
sprite[k] |= m; For each bit, x  = x | y. So the k position will be filled in each iteration if a 1 value is detected
return sprite.slice(0, (y1 - y0) * w32); return all lines from 0 to end of text, so is easier to compare.
