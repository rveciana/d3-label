var tape = require("tape"),
Canvas = require("canvas"),
labels = require("../");

tape("Point labels test", function(test) {

  var locations = [{text: "Hello", geometry: [10, 10]}, {text: "World", geometry: [100, 100]}]
  var instance = labels.labels()
    .canvas(function() { return new Canvas(1, 1); })
    .places(locations)
    .start();

  //console.info(instance.places());
  test.end();
});
