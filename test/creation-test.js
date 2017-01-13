var tape = require("tape"),
Canvas = require("canvas"),
labels = require("../");

tape("Default values change test", function(test) {
  var instance = labels.labels();
  test.deepEqual(instance.size(), [256, 256], "Default size");
  test.deepEqual(instance.size([300, 300]).size(),[300, 300], "Change size");

  instance.canvas(function() { return new Canvas(1, 1); });

  test.deepEqual(instance.canvas()(), new Canvas(1, 1), "Set canvas");

  test.end();
});

tape("Test empty labels array start", function(test) {
  var instance = labels.labels().start();
  test.equal(instance.places().length, 0, "Start with no places maintains 0 places");

  test.end();
});

tape("Test default labels setting", function(test) {
  var locations = [{text: "Hello"}, {text: "World"}];
  var instance = labels.labels()
    .places(locations)
    .start();

  test.equal(instance.places().length, locations.length, "Labels length must be the initial");
  instance.places().map(function(d, i){
    test.equal(d.text, locations[i].text, "Texts must be equal");
    test.equal(d.font, "serif", "Default font");
    test.equal(d.style, "normal", "Default font style");
    test.equal(d.weight, "normal", "Default font weight");
    test.equal(d.size, 10, "Default font size");
    test.equal(d.padding, 1, "Default padding");
  });

  test.end();
});
