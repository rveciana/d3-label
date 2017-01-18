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

  context.translate(w >> 1, h >> 1);
  context.fillText(label.text, 0, 0);
  if (label.padding) {
    context.lineWidth = 2 * label.padding;
    context.strokeText(label.text, 0, 0);
  }
  context.restore();
  context.canvas.pngStream().pipe(createWriteStream("/tmp/test.png"));
  label.width = w;
  label.height = h;
  return null;
}
