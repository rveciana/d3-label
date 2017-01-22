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
  var spriteProperties = sprites.pointLabelsSprite(context, label);

  test.equal('width' in spriteProperties, true, "width property in result");
  test.equal('height' in spriteProperties, true, "height property in result");
  test.equal('y0' in spriteProperties, true, "y0 property in result");
  test.equal('y1' in spriteProperties, true, "y1 property in result");

  var width0 = spriteProperties.width;
  var height0 = spriteProperties.height;

  label['padding'] = 2;
  spriteProperties = sprites.pointLabelsSprite(context, label);

  test.equal(width0 + 2, spriteProperties.width, "Padding adds 2*padding in width");
  test.equal(height0 + 2, spriteProperties.height, "Padding adds 2*padding in height");

  test.equal(spriteProperties.height,
    spriteProperties.y1 - spriteProperties.y0,
    "Height is properly calculated");


  test.end();
});
