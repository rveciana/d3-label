import dispatch from "d3-dispatch";
import {pointLabelsSprite} from "./sprites";

export default function() {
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
    var context = canvas().getContext("2d"),
    board = zeroArray((size[0] >> 5) * size[1]),
    bounds = null,
    n = places.length,
    i = -1,
    placedLabels = [];
    var data = places.map(function(d, i) {
          d.text = text.call(this, d, i);
          d.geometry = geometry.call(this, d, i);
          d.font = font.call(this, d, i);
          d.style = fontStyle.call(this, d, i);
          d.weight = fontWeight.call(this, d, i);
          d.size = ~~fontSize.call(this, d, i);
          d.padding = padding.call(this, d, i);
          console.info("---->", d.geometry);
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
        var sprite = pointLabelsSprite(context, d);
        var cc = collide(sprite, d, board, size[0]);
        console.info("COLLIDE", cc);
        placedLabels.push(d);
      }
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

  return labels();
}


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
  while (++i < n) {a[i] = 0;}
  return a;
}

function collide(spriteObj, label, board, xSize){
  console.info("GEOME", label['geometry']);
  var sprite = spriteObj.sprite,
  h = spriteObj['y1'],
  w = spriteObj['width'];
/*
  var w = spriteObj['width'] >> 5,
     lx = label.geometry[0] - (w << 4),
     sx = lx & 0x7f,
     msx = 32 - sx,
     h = spriteObj.y1 - spriteObj.y0,
     x = (label.geometry[1] + spriteObj.y0) * xSize + (lx >> 5);
*/
  for (var j = 0; j < h; j++) {
    for (var i = 0; i <= w; i++) {
      //if(board[x + i]) return true;
    }
  }

  /*
    last = 0;
    for (var i = 0; i <= w; i++) {
      if (((last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0))
          & board[x + i]) return true;
    }
    x += sw;
}
*/
  return false;
}
