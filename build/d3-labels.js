// d3-labels Version 0.0.1. Copyright 2017 Roger Veciana i Rovira.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.d3 = global.d3 || {})));
}(this, (function (exports) { 'use strict';

var labels = function() {
  var size = [256, 256],
  timer = null,
  places = [],
  text = defaultText,
  font = defaultFont,
  fontSize = defaultFontSize,
  fontStyle = defaultFontNormal,
  fontWeight = defaultFontNormal,
  padding = defaultPadding,
  timeInterval = Infinity,
  canvas = defaultCanvas;

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
    var n = places.length,
    i = -1;
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
        console.info(i, n);
      }
      i = 2000;
      if (i >= n) {
        labels.stop();
        //event.call("end", cloud, tags, bounds);
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


  return labels();
};


function defaultCanvas() {
  return document.createElement("canvas");
}

function defaultText(d) {
  return d.text;
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

exports.labels = labels;

Object.defineProperty(exports, '__esModule', { value: true });

})));
