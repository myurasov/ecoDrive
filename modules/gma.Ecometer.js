gma = gma || {};

gma.Ecometer = function (options) {
  var self = this;

  var w, h;
  var paperTrip;
  var arcTrip;
  var strokeTrip = 70;
  var paperEFuel, arcEFuel;
  var paperGasFuel, arcGasFuel;
  var strokeFuel = 35;
  var rotateStart;

  function init() {
    // default options
    self.options = _.defaults(options || {}, {
      element: null
    });

    // element
    self.$element = $(self.options.element);
    self.element = self.$element[0];

    initDraw();

    //

    var d = new Date();
    var diffMs = 3600 * 12 * 1000;
    self.drawTrip(d, new Date(d.getTime() + 0));

    _.delay(function () {
      self.drawTrip(d, new Date(d.getTime() + diffMs), ">", 1000);
      self.drawFuel(1000 * 3600 * 3, 1000 * 3600 * 9)
    }, 100)

    _.delay(function () {
      self.drawTrip(d, new Date(d.getTime() + 0), ">", 1000);
      self.drawFuel(1000 * 3600 * 0, 1000 * 3600 * 0)
    }, 1100);
//    self.drawTrip(d, new Date(d.getTime() + diffMs));

    //

//    drawFuel(1000 * 3600 * 1.5, 1000 * 3600 * 4.8)
  }

  function arcAttribute(xloc, yloc, value, total, R) {

    if (value > total) {
      value =  total;
    }

    var alpha = 360 / total * value,
      a = (90 - alpha) * Math.PI / 180,
      x = xloc + R * Math.cos(a),
      y = yloc - R * Math.sin(a),
      path;

    if (total == value) {
      path = [
        ["M", xloc, yloc - R],
        ["A", R, R, 0, 1, 1, xloc - 0.01, yloc - R]
      ];
    } else {
      path = [
        ["M", xloc, yloc - R],
        ["A", R, R, 0, +(alpha > 180), 1, x, y]
      ];
    }
    return {
      path: path
    };
  };

  function initDraw() {
    // dimensions
    w = self.$element.width();
    h = self.$element.height();
  }

  self.drawTrip = function(starTime, endTime, easing, duration) {
    var diffMs = endTime.getTime() - starTime.getTime();

    if (easing === undefined) {
      easing = "linear";
    }

    if (duration === undefined) {
      duration = 1000;
    }

    if (!paperTrip) {
      paperTrip = Raphael("paperTrip", w, h);
      paperTrip.ca.arc = arcAttribute;
    }

    if (!arcTrip) {
      arcTrip = paperTrip.path().attr({
        "opacity": "0.6",
        "stroke": "#fff",
        "stroke-width": strokeTrip,
        arc: [w / 2, h / 2, diffMs, 12 * 3600 * 1000, w / 2 - strokeTrip / 2]
      });

      // pic
      var picScale = 0.7;
      paperTrip.image(
        "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4wLjIsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMjBweCIgaGVpZ2h0PSI1MHB4IiB2aWV3Qm94PSIwIDAgMjAgNTAiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDIwIDUwIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxwYXRoIGQ9Ik0xMy44MTksNDIuMzg1Yy0wLjM2NSwwLTAuNjYyLDAuMTM0LTAuODksMC40MDJjLTAuMjI5LDAuMjY4LTAuNDM3LDAuNjA0LTAuNjI1LDEuMDFzLTAuMzgzLDAuODQ1LTAuNTgyLDEuMzE4DQoJCWMtMC4yLDAuNDc0LTAuNDQ1LDAuOTEzLTAuNzM3LDEuMzE4Yy0wLjI5MSwwLjQwNS0wLjY1MywwLjc0Mi0xLjA4NywxLjAxYy0wLjQzNCwwLjI2OS0wLjk4NywwLjQwMi0xLjY2MSwwLjQwMg0KCQljLTAuNTgyLDAtMS4wODctMC4wOTctMS41MTUtMC4yOTFjLTAuNDI4LTAuMTkzLTAuNzg1LTAuNDcxLTEuMDctMC44M2MtMC4yODUtMC4zNTktMC40OTYtMC43ODUtMC42MzMtMS4yNzUNCgkJYy0wLjEzNy0wLjQ5MS0wLjIwNi0xLjAzOS0wLjIwNi0xLjY0NGMwLTAuNjk2LDAuMDYtMS4zNTMsMC4xOC0xLjk2OWMwLjEyLTAuNjE2LDAuMjk0LTEuMTI0LDAuNTIyLTEuNTI0bDEuOTY5LDAuNzM2DQoJCWMtMC4xNiwwLjI1MS0wLjMwNSwwLjYyOC0wLjQzNywxLjEzYy0wLjEzMSwwLjUwMy0wLjE5NywxLjA0NS0wLjE5NywxLjYyN2MwLDAuNTQ4LDAuMTA4LDAuOTY3LDAuMzI1LDEuMjU4UzcuNjg1LDQ1LjUsOC4wNSw0NS41DQoJCWMwLjM0MiwwLDAuNjI4LTAuMTM0LDAuODU2LTAuNDAyYzAuMjI5LTAuMjY4LDAuNDM5LTAuNjA0LDAuNjM0LTEuMDFjMC4xOTQtMC40MDUsMC4zOTQtMC44NDUsMC41OTktMS4zMTgNCgkJczAuNDU0LTAuOTEzLDAuNzQ1LTEuMzE4YzAuMjkyLTAuNDA0LDAuNjUxLTAuNzQxLDEuMDc5LTEuMDFjMC40MjktMC4yNjksMC45NjItMC40MDIsMS42MDEtMC40MDJjMC42NCwwLDEuMTksMC4xMDUsMS42NTIsMC4zMTYNCgkJYzAuNDYyLDAuMjEyLDAuODQ4LDAuNTA4LDEuMTU1LDAuODkxYzAuMzA5LDAuMzgzLDAuNTM3LDAuODQ1LDAuNjg2LDEuMzg3YzAuMTQ3LDAuNTQyLDAuMjIyLDEuMTM5LDAuMjIyLDEuNzg5DQoJCWMwLDAuODU1LTAuMDc5LDEuNjA5LTAuMjM5LDIuMjZzLTAuMzE5LDEuMTMtMC40NzksMS40MzhsLTIuMDAzLTAuNzU0YzAuMDY4LTAuMTI1LDAuMTQzLTAuMjg4LDAuMjIzLTAuNDg3DQoJCWMwLjA4LTAuMiwwLjE1NC0wLjQyNiwwLjIyMy0wLjY3N3MwLjEyNi0wLjUxNywwLjE3MS0wLjc5NmMwLjA0Ni0wLjI3OSwwLjA2OC0wLjU2NywwLjA2OC0wLjg2NGMwLTAuNjk2LTAuMTE2LTEuMjMtMC4zNTEtMS42MDINCgkJQzE0LjY1NSw0Mi41NywxNC4yOTksNDIuMzg1LDEzLjgxOSw0Mi4zODV6Ii8+DQoJPHBhdGggZD0iTTcuMTQzLDI5Ljk3MnYzLjQ5Mmg5Ljg5NnYyLjM0Nkg3LjE0M3YzLjUxSDUuMDU0di05LjM0OEg3LjE0M3oiLz4NCgk8cGF0aCBkPSJNMTQuMzg1LDI0LjE4NnYzLjY4MWwyLjY1MywwLjkwN3YyLjM0NmwtMTIuMDctNC4zMTR2LTEuNzI5bDEyLjA3LTQuMzE0djIuNDY1TDE0LjM4NSwyNC4xODZ6IE0xMi41MDEsMjcuMjY3di0yLjU2Nw0KCQlsLTIuNjcsMC44OWwtMS44ODMsMC4zNnYwLjA4NWwxLjksMC4zNTlMMTIuNTAxLDI3LjI2N3oiLz4NCgk8cGF0aCBkPSJNNS4xNzQsMTkuNzM0Yy0wLjA0NS0wLjI2Mi0wLjA4OC0wLjU0NS0wLjEyOC0wLjg0N3MtMC4wNzEtMC42MDUtMC4wOTQtMC45MDhjLTAuMDIzLTAuMzAyLTAuMDQtMC41OTYtMC4wNTEtMC44ODENCgkJUzQuODgzLDE2LjU1LDQuODgzLDE2LjMxYzAtMC41NTksMC4wNTEtMS4xMSwwLjE1NC0xLjY1MmMwLjEwMy0wLjU0MiwwLjI4LTEuMDI3LDAuNTMxLTEuNDU1YzAuMjUxLTAuNDI4LDAuNTk3LTAuNzcxLDEuMDM2LTEuMDI3DQoJCWMwLjQ0LTAuMjU3LDAuOTkxLTAuMzg1LDEuNjUyLTAuMzg1YzAuOTgyLDAsMS43OCwwLjIyOSwyLjM5NywwLjY4NWMwLjYxNiwwLjQ1NywxLjA0NCwxLjA2NywxLjI4NCwxLjgzMmwwLjUzLTAuODM5bDQuNTcxLTIuNzM5DQoJCXYyLjcwNWwtNC42OSwyLjcyMmwtMC4yMjMsMS4yMzNoNC45MTN2Mi4zNDVINS4xNzR6IE02Ljk3MSwxNi4xMzljMCwwLjI0LDAuMDA2LDAuNDc3LDAuMDE3LDAuNzENCgkJYzAuMDEyLDAuMjM0LDAuMDM0LDAuNDE0LDAuMDY5LDAuNTRoMy40NzV2LTAuOTkzYzAtMC42NS0wLjE0OC0xLjE3LTAuNDQ1LTEuNTU4QzkuNzkxLDE0LjQ1LDkuMywxNC4yNTUsOC42MTUsMTQuMjU1DQoJCWMtMC41MTQsMC0wLjkxNiwwLjE2LTEuMjA3LDAuNDc5QzcuMTE3LDE1LjA1NSw2Ljk3MSwxNS41MjIsNi45NzEsMTYuMTM5eiIvPg0KCTxwYXRoIGQ9Ik03LjE0MywxLjc1OFY1LjI1aDkuODk2djIuMzQ1SDcuMTQzdjMuNTFINS4wNTRWMS43NThINy4xNDN6Ii8+DQo8L2c+DQo8L3N2Zz4NCg==",
        w / 2 + 2, (strokeTrip - 50 * picScale) / 2, 20 * picScale, 50 * picScale)
        .attr("opacity", 0.8);
    } else {
      arcTrip.animate({
        arc: [w / 2, h / 2, diffMs, 12 * 3600 * 1000, w / 2 - strokeTrip / 2]
      }, duration, easing)
    }

    // rotate
    rotateStart = ((starTime.getHours() % 12) * 60 + starTime.getMinutes()) / (12 * 60) * 360;
    rotateStart = Math.round(rotateStart);
    $(paperTrip.canvas).css({
      transform: "rotate(" + rotateStart + "deg) translate3d(0, 0, 0)"
    });
  }

  self.drawFuel = function (eDurationMs, gasDurationMs) {
    var msPerDeg = 120000;

    if (eDurationMs + gasDurationMs > 12 * 3600 * 1000) {
      gasDurationMs = 12 * 3600 * 1000 - eDurationMs - msPerDeg;
    }

    var padding = 5;

    if (!paperEFuel) {
      paperEFuel = Raphael("paperEFuel", w, h);
      paperEFuel.ca.arc = arcAttribute;
      paperGasFuel = Raphael("paperGasFuel", w, h);
      paperGasFuel.ca.arc = arcAttribute;
    }

    // electricity
    if (!arcEFuel) {
      arcEFuel = paperEFuel.path().attr({
        "opacity": "0.75",
        "stroke": "#40ff76",
        "stroke-width": strokeFuel,
        arc: [w / 2, h / 2, Math.max(0,  eDurationMs - msPerDeg ), 12 * 3600 * 1000,
          w / 2 - strokeFuel / 2 - strokeTrip - padding]
      });

      // pic
      paperEFuel.image(
        "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4wLjIsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDE2IDE2IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxwYXRoIGQ9Ik0xNC45ODEsMTAuMTAyYy0wLjI2Ny0wLjYwMS0wLjE3Ni0xLjIyNC0wLjA4LTEuODI2YzAuMTQzLTAuOTMsMC4zMTItMi4wNjgtMS4xNjgtMi43MzYNCgkJYzAuMTAxLTAuMzU0LDAuMDktMC43NjMtMC4yMDctMC45MDdsLTEuNzY2LTAuODQ4Yy0wLjM4Ni0wLjE4OC0xLjM5LTAuMTQ2LTEuNTA3LDAuMDk3cy0wLjQ0MywwLjc1MywwLjM4MSwwLjk0Mw0KCQljMC44MjgsMC4xOSwxLjU5LDEuMTUzLDEuNTksMS4xNTNjMC4yNzgsMC4yNjksMC41OTUsMC40MywwLjg0NiwwLjQzNmMwLjk4NSwwLjM0NSwwLjkzMiwwLjc1LDAuNzg3LDEuNzAzDQoJCWMtMC4xMDcsMC42ODItMC4yMzYsMS41MzEsMC4xNjEsMi40MmMwLjUzNSwxLjE5MiwwLjU2NiwxLjg5NiwwLjEwNiwyLjM1Yy0wLjU2NywwLjU1Ny0xLjMyOSwwLjM4MS0xLjgxMiwwLjA1OQ0KCQljLTAuNjUyLTAuNDMxLTAuNjYxLTEuMjMtMC42MDEtMi40OTJjMC4wMjktMC43MTcsMC4wNjUtMS40NjEtMC4xNDYtMi4wOTNDMTEuMDk5LDYuOTYxLDkuNjU3LDYuOTQyLDkuNTksNi45NDJsMCwwTDguOTUsNi45NDENCgkJVjIuMTg5YzAtMC4yOTEtMC4yMzgtMC41MjctMC41MjgtMC41MjdIMi4wODVjLTAuMjksMC0wLjUyOCwwLjIzNy0wLjUyOCwwLjUyN3YxMS4wOTNIMS4wMjhjMCwwLTAuNTI4LDAtMC41MjgsMC41MjcNCgkJczAsMC41MjcsMCwwLjUyN2gwLjUyOGgwLjUyOWgwLjUyOGg2LjMzN0g4Ljk1aDAuNTI5aDAuNTI5VjEzLjgxYzAsMCwwLTAuNTI3LTAuNTI5LTAuNTI3SDguOTVWOGgwLjYzOA0KCQljMC4wNzUsMC4wMDMsMC43NTQsMC4wMzYsMC45NzYsMC42OTZjMC4xNTIsMC40NDYsMC4xMjMsMS4wNTQsMC4wOTQsMS43MDNjLTAuMDYxLDEuMjM0LTAuMTI5LDIuNjM0LDEuMDY5LDMuNDI2DQoJCWMwLjQ4MywwLjMyMSwxLjAwMywwLjQ3OSwxLjUxMSwwLjQ3OWMwLjYwMiwwLDEuMTgxLTAuMjI0LDEuNjI2LTAuNjYzQzE2LjA0OCwxMi40ODIsMTUuMjczLDEwLjc1NCwxNC45ODEsMTAuMTAyeiBNMTIuNTc2LDUuNzIzDQoJCWMtMC4xNDUsMC0wLjI2NC0wLjExOC0wLjI2NC0wLjI2NGMwLTAuMTQ2LDAuMTE5LTAuMjY1LDAuMjY0LTAuMjY1YzAuMTQ2LDAsMC4yNjQsMC4xMTksMC4yNjQsMC4yNjUNCgkJQzEyLjg0LDUuNjA1LDEyLjcyMyw1LjcyMywxMi41NzYsNS43MjN6IE0yLjYxMywzLjI0NWMwLTAuMjg5LDAuMjM3LTAuNTI4LDAuNTI4LTAuNTI4aDQuMjI1YzAuMjkyLDAsMC41MjcsMC4yMzksMC41MjcsMC41MjgNCgkJdjMuMTY5YzAsMC4yOTMtMC4yMzQsMC41MjgtMC41MjcsMC41MjhIMy4xNDFjLTAuMjkxLDAtMC41MjgtMC4yMzUtMC41MjgtMC41MjhWMy4yNDV6Ii8+DQo8L2c+DQo8L3N2Zz4NCg==",
        w / 2 + 3, strokeTrip + padding + (strokeFuel - 20) / 2, 20, 20)
        .attr("opacity", 0.8);
    } else {
      arcEFuel.animate({
        arc: [w / 2, h / 2, Math.max(0,  eDurationMs - msPerDeg), 12 * 3600 * 1000,
          w / 2 - strokeFuel / 2 - strokeTrip - padding]
      }, 1000, "linear");
    }

    // gas
    if (!arcGasFuel) {
      arcGasFuel = paperGasFuel.path().attr({
        "opacity": "0.6",
        "stroke": "#00f6ff",
        "stroke-width": strokeFuel,
        arc: [w / 2, h / 2, gasDurationMs, 12 * 3600 * 1000,
          w / 2 - strokeFuel / 2 - strokeTrip - padding]
      });
    } else {
      arcGasFuel.animate({
        arc: [w / 2, h / 2, gasDurationMs, 12 * 3600 * 1000,
          w / 2 - strokeFuel / 2 - strokeTrip - padding]
      }, 1000, "linear");
    }

    // rotate
    $(paperEFuel.canvas).css({
      transform: "rotate(" + rotateStart + "deg) translate3d(0, 0, 0)"
    });
    var rotateGas = rotateStart + eDurationMs / (12 * 3600 * 1000) * 360;
    $(paperGasFuel.canvas).css({
      transform: "rotate(" + rotateGas + "deg) translate3d(0, 0, 0)"
    });

  }

  var paperLeaf;
  function drawLeaf() {
    if (!paperLeaf) {
      paperLeaf = Raphael("paperLeaf", w, h);
    }

//    paperLeaf.text(w/2, h/2, "á").attr({
//      fill: "white",
//      opacity: 0.8,
//      "font-size": 80,
//      "font-family": "AwesomeCustom"
//    })

      var s = 90;

      paperLeaf.image(
//        "images/gm.svg",
        "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4wLjIsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iNTBweCIgaGVpZ2h0PSI1MHB4IiB2aWV3Qm94PSIwIDAgNTAgNTAiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDUwIDUwIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxnPg0KCQk8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZmlsbD0iI0ZGRkZGRiIgZD0iTTI1LDBDMTEuMTkzLDAsMCwxMS4xOTMsMCwyNWMwLDEzLjgwOCwxMS4xOTMsMjUsMjUsMjUNCgkJCWMxMy44MDgsMCwyNS0xMS4xOTIsMjUtMjVDNTAsMTEuMTkzLDM4LjgwOCwwLDI1LDB6IE0xMS42NjQsMjIuOTg0di01LjA3OGMwLTUuMjA4LDIuMzg5LTYuMzE0LDUuMDc5LTYuMzE0DQoJCQljMi41NTQsMCw1LjAxNCwwLjgwNiw1LjE1NCw0LjIzMWwtMC4wMDQsMi4zMThoLTIuOTc5bDAuMDA1LTEuNTA1Yy0wLjA4Ny0xLjczNy0wLjU3MS0yLjEzNi0yLjE3Ni0yLjIxNQ0KCQkJYy0yLjM0MSwwLTIuMDE1LDMuMzYtMi4wMTUsNC44MTJ2NS4yMDdjLTAuMDI0LDIuNDQ4LTAuMDI4LDQuMjE3LDIuMDE1LDQuMjE3YzEuMTc0LDAsMi4xNi0wLjMzNSwyLjE2LTIuMTU3bDAuMDAyLTMuNDk2aC0yLjA2Mw0KCQkJVjIwLjI1SDIxLjh2MTEuMTMzaC0yLjg2NWwwLjAwNS0xLjE2OWMtMC42MTEsMC44OTUtMi4xNTIsMS4zNTctMi45MzQsMS40MjlDMTEuMTExLDMxLjY0MywxMS43MDksMjguNDU5LDExLjY2NCwyMi45ODR6DQoJCQkgTTM4LjM0NiwzOC40MDhIMTEuNjJWMzQuMjRoMjYuNzI2VjM4LjQwOHogTTM4LjM4LDMxLjM2MmgtMi44OTZsMC4wMDYtMTIuODY5bC0yLjU3OCwxMi44NjloLTIuMzQ1bC0yLjQ0Mi0xMi44MDVsMC4wMDEsMTIuODA1DQoJCQloLTIuODkzVjEyLjA0OGg0LjAzMWwyLjUzOCwxMi44MjVsMi41NC0xMi44MjVoNC4wMzdWMzEuMzYyeiIvPg0KCTwvZz4NCjwvZz4NCjwvc3ZnPg0K",
        w / 2 - s/2, h / 2 - s/2, s, s)
        .attr("opacity", 0.5);

//    $(paperLeaf.canvas).css({
//      transform: "rotate(360deg) translate3d(0, 0, 0)",
//      transition: "1000ms",
//      opacity: 1
//    });
  }

  init();
  drawLeaf();
}