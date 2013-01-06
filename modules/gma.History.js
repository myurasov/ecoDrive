
gma.History = function (options) {
  var self = this;

  self.data = [];

  function init() {
    // default options
    self.options = _.defaults(options || {}, {
      element: null,
      max: 24,
      bars: 19,
      gap: 5,
      lowLimit: 1
    });

    // element
    self.$element = $(self.options.element);
    self.element = self.$element[0];

    // pre-fill data
    for (var i = 0; i < self.options.bars; i++) {
      self.data[i] = 0*Math.random() * self.options.max;
    }

    initDraw();
  }

  self.push = function (value) {
    self.data.push(Math.min(Math.max(value, self.options.lowLimit), self.options.max));
    self.data.shift();
    draw();
  }

  var w, h;
  var paper;
  var barWidth;
  var barFullWidth;
  var emptyBars = [];
  var valueBars = [];

  function initDraw() {
    w = self.$element.width();
    h = self.$element.height();
    paper = Raphael("paperHistory", w, h);

    barFullWidth = (w + self.options.gap)  / self.options.bars;
    barWidth = barFullWidth - self.options.gap;

    // init bars

    for (var i = 0; i < self.options.bars; i++) {
      var emptyBar = paper.rect(barFullWidth * i, 0, barWidth, h * 0)
        .attr({
          fill: "white",
          opacity: 0.2,
          stroke: 0
        });

      var valueBar = paper.rect(barFullWidth * i, h - 0, barWidth, 0)
        .attr({
          fill: "lime",
          opacity: 0.4,
          stroke: 0
        });

      emptyBars.push(emptyBar);
      valueBars.push(valueBar);

      paper.add(emptyBar);
      paper.add(valueBar);
    }

    for (var i = 0; i < self.options.bars; i++) {
      emptyBars[i].animate({
        height: h
      }, 1000, "linear");
    }

  }

  function getColor(val) {
    var h = 120 - 100 * val;
    return Raphael.hsl(h, 100, 50);
  }

  function draw() {
    for (var i = 0; i < self.options.bars; i++) {
      var d = self.data[i];
      valueBars[i].attr({
        height: h * (d / self.options.max),
        y: h - h * (d / self.options.max),
        fill: getColor(d / self.options.max)
      });
    }
  }

  init();
}