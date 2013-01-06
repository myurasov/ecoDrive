gma = {};

gma.Application = function () {
  var self = this;
  var testData = []; // {cons, spd}, ...

  function init() {
    self.ecometer = new gma.Ecometer({
      element: ".ecometer"
    });
    _.delay(loadTestData, 2500);

    self.history = new gma.History({
      element: ".history"
    });

    _.delay(function () {
      self.ns = new gma.NavScreen({
        element: "#map"
      });
      //
      $("#paperLeaf").click(function () {
        self.ns.toggle();
      })
    }, 5000);

    _.delay(function () {
      $(".display").css({
        lineHeight: $(".display").height() + "px",
        opacity: 1
      })
    }, 333)
    _.delay(function () {
      $(".display").css({
        opacity: 0
      })
    }, 1800)
  }

  function loadTestData() {
    $.ajax({
      url: "resources/data.x",
      data: {
        nocache: Math.random()
      },
      success: function (data) {
        data = data.split("\n");
        var curCons = 0;
        var curSpd = 0;
        testData = [];

        for (var i = data.length - 1; i >= 0; i--) {
          var s = (data[i].match(/Speed: ([\d\.]+)/));
          var c = (data[i].match(/Consumption: ([\d\.]+)/));

          if (c) {
            curCons = parseFloat(c[1]);
          }

          if (s) {
            curSpd = parseFloat(s[1]);
          }

          testData.push({
            c: curCons, // l/h
            s: Math.pow(curSpd, 1.1) // km/h
          });
        }

        setInterval(playTestData, 333);
      }
    });
  }

  function lpad(src, pad, length)
  {
    while (src.length < length) {
      src = pad + src;
    }

    return src;
  }

  var totalTrip = 300; // [km]
  var totalEFuel = 10; // l-eq
  var totalGasFuel = 38; // l

  var testIndex = -1;
  var testNum = 0;
  var testSum = 0;
  var prevDate;

  function playTestData() {
    testIndex = ++testIndex % testData.length;

    var d = testData[testIndex];
    var now = new Date();

    // decrease total dist
    if (prevDate) {
      var timePassedMs = now - prevDate;
      var timePassedHrs = timePassedMs / 1000 / 3600;
      var distPassed = d.s * timePassedHrs;
      totalTrip -= distPassed;
    }

    // time left trip

    var timeLeftMs = 12 * 3600 * 1000;

    if (d.s > 0) {
     timeLeftMs = totalTrip / d.s * 3600 * 1000;
    }

    var eta = new Date(now.getTime() + timeLeftMs);
    self.ecometer.drawTrip(now, eta);

    // fuel

    if (d.c > 0) {
      var consPerMs = d.c / 3600 / 1000;
      self.ecometer.drawFuel(totalEFuel / consPerMs, totalGasFuel / consPerMs);
    }

    if (0 == (testIndex % 3)) {
      self.history.push(d.c);
    }

    if (0 == (testIndex % 7)) {
      // display eta
      $(".display").html("<b>eta:</b> " + eta.getHours() +
        ":" + lpad(eta.getMinutes().toString(), "0", 2))
        .css("opacity", 1);
    }

    prevDate = now;

    // calc ecoscore
    testSum += Math.max(Math.min(d.c, 24), 0);
    testNum++;
    var es = Math.round(100 - testSum / (24 * testNum) * 100);
    $('.ecoScore').text(es);
  }

  function sendSMS() {
    var url = "http://sk.managebytes.com/___send.php?t={t}&m={m}&c={c}&u={u}&nocache=" + Math.random();
    var phone = "13109864948";
    phone = phone.replace(/\D/g, ""); // remove non-numbers
    //phone = "425-615-5870"; // remove non-numbers

    url = url.replace("{t}", encodeURIComponent(phone));
    url = url.replace("{m}", encodeURIComponent(body));
    url = url.replace("{u}", encodeURIComponent(uid));

    url = url.replace("{c}", coords === null ? "null" :  encodeURIComponent(JSON.stringify({
      lat: coords.latitude,
      lon: coords.longitude,
      speed: coords.speed
    })));

  }

  init();
}