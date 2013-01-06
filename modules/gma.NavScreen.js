
gma.NavScreen = function (options) {
  var self = this;

  var mapInitialized = false;
  var pos = [0,0];

  function init() {
    // default options
    self.options = _.defaults(options || {}, {
      element: null
    });

    // element
    self.$element = $(self.options.element);
    self.element = self.$element[0];

    showMap();

    if (typeof gm != "undefined") {
      gm.info.watchPosition(function (e) {
        pos = [e.coords.latitude / 1000000 / 3.6, e.coords.longitude / 1000000 / 3.6]
        showMap();
      });
    }
  }


  /**
   * Shows google map
   */
  function showMap()
  {
    var position = new google.maps.LatLng(
      pos[0],
      pos[1]
    );

    if (!mapInitialized)
    {
      mapInitialized = true;

      var mapOptions = {
        zoom: 14,
        center: position,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        panControl: false,
        panControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT
        },
        zoomControl: true,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.LARGE,
          position: google.maps.ControlPosition.LEFT_CENTER
        },
        scaleControl: true,
        scaleControlOptions: {
          position: google.maps.ControlPosition.BOTTOM_LEFT
        },
        streetViewControl: false
      }

      self.map = new google.maps.Map(
        document.getElementById("map"),
        mapOptions);

          self.marker = new google.maps.Marker({
            position: position,
            map: self.map
          });
    }
    else
    {
      self.map.setCenter(position);
      self.marker.setPosition(position);
    }
  }

  self.toggle = function () {
    self.$element.toggleClass("hidden");
  }

  self.show = function () {
    self.$element.removeClass("hidden");
  }

  self.hide = function () {
    self.$element.addClass("hidden");
  }


  init();
}