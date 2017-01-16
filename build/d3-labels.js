// d3-labels Version 0.0.1. Copyright 2017 Roger Veciana i Rovira.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-dispatch')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-dispatch'], factory) :
  (factory((global.d3 = global.d3 || {}),global.dispatch));
}(this, (function (exports,dispatch) { 'use strict';

dispatch = 'default' in dispatch ? dispatch['default'] : dispatch;

var cw = 1 << 11 >> 5;
var ch = 1 << 11;

var fs = require("fs");
var labels = function() {
  var size = [256, 256],
  timer = null,
  places = [],
  text = defaultText,
  geometry = defaultGeometry,
  font = defaultFont,
  fontSize = defaultFontSize,
  fontStyle = defaultFontNormal,
  fontWeight = defaultFontNormal,
  padding = defaultPadding,
  timeInterval = Infinity,
  canvas = defaultCanvas,
  event = dispatch.dispatch("label", "end");

  function labels(){

    return labels;
  }

  labels.places = function(_) {
    return arguments.length ? (places = _, labels) : places;
  };

  labels.size = function(_) {
    return arguments.length ? (size = [+_[0], +_[1]], labels) : size;
  };

  labels.text = function(_) {
    return arguments.length ? (text = functor(_), labels) : text;
  };

  labels.canvas = function(_) {
    return arguments.length ? (canvas = functor(_), labels) : canvas;
  };

  labels.start = function(){
    var contextAndRatio = getContext(canvas()),
    board = zeroArray((size[0] >> 5) * size[1]),
    bounds = null,
    n = places.length,
    i = -1,
    placedLabels = [];
    var data = places.map(function(d, i) {
          d.text = text.call(this, d, i);
          d.font = font.call(this, d, i);
          d.style = fontStyle.call(this, d, i);
          d.weight = fontWeight.call(this, d, i);
          d.size = ~~fontSize.call(this, d, i);
          d.padding = padding.call(this, d, i);
          return d;
        }).sort(function(a, b) { return b.size - a.size; });


    if (timer) {clearInterval(timer);}
    timer = setInterval(step, 0);
    step();
    return labels;

    function step() {
      var start = Date.now();
      while (Date.now() - start < timeInterval && ++i < n && timer) {
        var d = data[i];
        labelsSprite(contextAndRatio, d, data, i);

        placedLabels.push();
        console.info(i, n);
      }
      i = 2000;
      if (i >= n) {
        labels.stop();
        event.call("end", labels, placedLabels, bounds);
      }
    }
  };

  labels.stop = function() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    return labels;
  };

  function getContext(canvas) {
    canvas.width = canvas.height = 1;
    var ratio = Math.sqrt(canvas.getContext("2d").getImageData(0, 0, 1, 1).data.length >> 2);
    canvas.width = (cw << 5) / ratio;
    canvas.height = ch / ratio;

    var context = canvas.getContext("2d");
    context.fillStyle = context.strokeStyle = "red";
    context.textAlign = "center";

    return {context: context, ratio: ratio};
  }


  return labels();
};


function defaultCanvas() {
  return document.createElement("canvas");
}

function defaultText(d) {
  return d.text;
}

function defaultGeometry(d) {
  return d.geometry;
}

function defaultFont() {
  return "serif";
}

function defaultFontNormal() {
  return "normal";
}

function defaultFontSize() {
  return "10";
}

function defaultPadding() {
  return 1;
}

function functor(d) {
  return typeof d === "function" ? d : function() { return d; };
}

function zeroArray(n) {
  var a = [],
      i = -1;
  while (++i < n) a[i] = 0;
  return a;
}

// Fetches a monochrome sprite bitmap for the specified text.
// Load in batches for speed.
function labelsSprite(contextAndRatio, d, data, di) {
  if (d.sprite) {return;}
  var c = contextAndRatio.context,
      ratio = contextAndRatio.ratio;

  c.clearRect(0, 0, (cw << 5) / ratio, ch / ratio);

  var x = 0,
      y = 0,
      maxh = 0,
      n = data.length;
  --di;
  while (++di < n) {
    d = data[di];
    c.save();
    c.font = d.style + " " + d.weight + " " + ~~((d.size + 1) / ratio) + "px " + d.font;
    var w = c.measureText(d.text + "m").width * ratio,
    h = d.size << 1;

    w = (w + 0x1f) >> 5 << 5;
    if (h > maxh) {maxh = h;}
    if (x + w >= (cw << 5)) {
      x = 0;
      y += maxh;
      maxh = 0;
    }
    if (y + h >= ch) {break;}
    c.translate((x + (w >> 1)) / ratio, (y + (h >> 1)) / ratio);

    c.fillText(d.text, 0, 0);
    //c.canvas.pngStream().pipe(fs.createWriteStream("/tmp/test"+d.text+"-"+di+".png"));
    if (d.padding) {
      c.lineWidth = 2 * d.padding;
      c.strokeText(d.text, 0, 0);
      console.info("ITER",d.text, di);
    }
    c.restore();
    d.width = w;
    d.height = h;
    d.xoff = x;
    d.yoff = y;
    d.x1 = w >> 1;
    d.y1 = h >> 1;
    d.x0 = -d.x1;
    d.y0 = -d.y1;
    d.hasText = true;
    x += w;

    }

    var pixels = c.getImageData(0, 0, (cw << 5) / ratio, ch / ratio).data,
        sprite = [];
    while (--di >= 0) {
      d = data[di];
      if (!d.hasText) continue;
      var w = d.width,
          w32 = w >> 5,
          h = d.y1 - d.y0;
      // Zero the buffer
      for (var i = 0; i < h * w32; i++) sprite[i] = 0;
      x = d.xoff;
      if (x == null) return;
      y = d.yoff;
      var seen = 0,
          seenRow = -1;
      for (var j = 0; j < h; j++) {
        for (var i = 0; i < w; i++) {
          var k = w32 * j + (i >> 5),
              m = pixels[((y + j) * (cw << 5) + (x + i)) << 2] ? 1 << (31 - (i % 32)) : 0;
          sprite[k] |= m;
          seen |= m;
        }
        if (seen) seenRow = j;
        else {
          d.y0++;
          h--;
          j--;
          y++;
        }
      }
      d.y1 = d.y0 + seenRow;
      d.sprite = sprite.slice(0, (d.y1 - d.y0) * w32);
  }
  return null;
}

exports.labels = labels;

Object.defineProperty(exports, '__esModule', { value: true });

})));
