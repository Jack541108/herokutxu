var _map = new (function() {

    var canvasName = "map-canvas",
        $map = $("#" + canvasName),
        map = null,
        overlays = [];

    this.show = show;
    this.destroy = destroy;
    this.addPoint = addPoint;

    /**
     * Initialises map
     */
    function show() {
        $map.parent().show();
        var mapOptions = {
            zoom: 2,
            center: new google.maps.LatLng(30.212418, 9.555476),
            mapTypeId: google.maps.MapTypeId.SATELLITE
        };

        map = new google.maps.Map(document.getElementById(canvasName), mapOptions);
    }

    function addPoint(geo) {
        if (map) {
            var swBound = new google.maps.LatLng(geo[0], geo[1]),
                neBound = new google.maps.LatLng(geo[0], geo[1]),
                bounds = new google.maps.LatLngBounds(swBound, neBound);
            overlays.push(new USGSOverlay(bounds));
        }
    }

    function destroy () {
        $map.html("");
        $map.parent().hide();
        overlays = [];
        map = null;
    }
    USGSOverlay.prototype = new google.maps.OverlayView();

    /** @constructor */
    function USGSOverlay(bounds) {

        // Initialize all properties.
        this.bounds_ = bounds;

        // Define a property to hold the image's div. We'll
        // actually create this div upon receipt of the onAdd()
        // method so we'll leave it null for now.
        this.div_ = null;

        // Explicitly call setMap on this overlay.
        this.setMap(map);
    }

    /**
     * onAdd is called when the map's panes are ready and the overlay has been
     * added to the map.
     */
    USGSOverlay.prototype.onAdd = function() {
        this.div_ = $("<div />", {
            "class": "map-point"
        });

        // Add the element to the "overlayLayer" pane.
        var panes = this.getPanes();
        panes.overlayLayer.appendChild(this.div_[0]);
    };

    USGSOverlay.prototype.draw = function() {

        // We use the south-west and north-east
        // coordinates of the overlay to peg it to the correct position and size.
        // To do this, we need to retrieve the projection from the overlay.
        var overlayProjection = this.getProjection();

        // Retrieve the south-west and north-east coordinates of this overlay
        // in LatLngs and convert them to pixel coordinates.
        // We'll use these coordinates to resize the div.
        var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());

        var self = this;
        this.div_.css({
            left: (sw.x - 25) + "px",
            top: (sw.y - 25)+ "px"
        });
        this.div_.append($("<div />", {
            "class": "circle"
        }));
        setTimeout(function () {
            self.div_.addClass("open");
            setTimeout(function () {
                self.div_.remove();
            }, 500);
        }, 50);
    };

    /**
     * The onRemove() method will be called automatically from the API if
     * we ever set the overlay's map property to 'null'.
     */
    USGSOverlay.prototype.onRemove = function() {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    };
});