import {createWriteStream} from "fs";

export function labelsSprite(context, label) {
  context.save();
  context.font = label.style + " " + label.weight + " " + ~~(label.size + 1) + "px " + label.font;

  var w = context.measureText(label.text).width;
  var h = label.size << 1;
  if (label.padding) {
    w += label.padding * 2;
    h += label.padding * 2;
  }

  context.canvas.height = h;

  context.canvas.width = w;
  context.clearRect(0, 0, w, h);
  context.translate(0, label.size);
  context.fillText(label.text, 0, 0);
  if (label.padding) {
    context.lineWidth = 2 * label.padding;
    context.strokeText(label.text, 0, 0);
  }
  context.restore();
  context.canvas.pngStream().pipe(createWriteStream("/tmp/test.png"));

  var pixels = context.getImageData(0, 0, w, h).data,
  sprite = [];

  var w32 = w >> 5;
  for (var i = 0; i < h * w32; i++) {sprite[i] = 0;}
  var seen = 0;
  var y0 = null;
  var y1 = y0;

  for (var j = 0; j < h; j++) {
    seen = 0;
    for (i = 0; i < w; i++) {
      var k = w32 * j + (i >> 5),
          m = pixels[3+((j * w + i)<<2)] ? 1 << (31 - (i % 32)) : 0;
      sprite[k] |= m;
      seen |= m;
    }

    if (seen) {
      if(!y0){y0 = j;}
      y1 = j;
    }
  }

  label.width = w;
  label.height = y1-y0;
  label.y0 = y0;
  label.y1 = y1;

  return sprite.slice(0, (y1 + 1) * w32);
}
