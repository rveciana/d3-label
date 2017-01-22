var tape = require("tape"),
Canvas = require("canvas"),
sprites = require("./output/sprites");

tape("Point labels sprite test", function(test) {

  var label = {text: "Hello",
  geometry: [10, 10],
  font: "serif",
  style: "normal",
  weight: "normal",
  size: 200,
  padding: 1};
  var context = new Canvas(1, 1).getContext("2d");
  var sprite = sprites.labelsSprite(context, label);

  console.info("SPRITES", sprite.length);
  console.info("LABEL", label);
  test.end();
});
