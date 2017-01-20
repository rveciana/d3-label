import {createWriteStream} from "fs";
var cw = 1 << 11 >> 5,
    ch = 1 << 11;

export function labelsSprite(context, label) {
  context.canvas.width = (cw << 5);
  context.canvas.height = ch;
  context.clearRect(0, 0, (cw << 5), ch);

  context.save();
  context.font = label.style + " " + label.weight + " " + ~~(label.size + 1) + "px " + label.font;
  var w = context.measureText(label.text + "m").width ,
  h = label.size << 1;
  w = (w + 0x1f) >> 5 << 5;
  console.info(context.measureText(label.text + "m"));
  //context.translate(w >> 1, h >> 1);
  context.translate(0, label.size);
  context.fillText(label.text, 0, 0);
  if (label.padding) {
    context.lineWidth = 2 * label.padding;
    context.strokeText(label.text, 0, 0);
  }
  context.restore();
  context.canvas.pngStream().pipe(createWriteStream("/tmp/test.png"));
  label.width = w;
  label.height = h;

  var pixels = context.getImageData(0, 0, cw << 5, ch).data,
  sprite = [];
  // -----> if (!d.hasText) continue;
  var w32 = w >> 5;
  for (var i = 0; i < h * w32; i++) {sprite[i] = 0;}
  var seen = 0,
      seenRow = -1,
      y = 0, x = 0;
  var y0 = h >> 1;
  var y1 = y0;

  for (var j = 0; j < h; j++) {
    for (var i = 0; i < w; i++) {
      var k = w32 * j + (i >> 5),
          m = pixels[((y + j) * (cw << 5) + (x + i)) << 2] ? 1 << (31 - (i % 32)) : 0;
      sprite[k] |= m;
      seen |= m;
    }
    if (seen) {seenRow = j;}
    else {
      y0++;
      h--;
      j--;
      y++;
    }
  }
  y1 = y0 + seenRow;
  return sprite.slice(0, (y1 - y0) * w32);
}
