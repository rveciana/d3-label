var tape = require("tape"),
Canvas = require("canvas"),
labels = require("../");

tape("Point labels test", function(test) {

  var locations = [{text: "Hello"}, {text: "World"}]
  var instance = labels.labels()
    .places(locations)
    .start();

  //console.info(instance.places());
  test.end();
});
