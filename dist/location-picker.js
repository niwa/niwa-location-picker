"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationPicker = void 0;
var Map_1 = require("ol/Map");
var View_js_1 = require("ol/View.js");
var proj_1 = require("ol/proj");
var control_js_1 = require("ol/control.js");
var Feature_js_1 = require("ol/Feature.js");
var Point_js_1 = require("ol/geom/Point.js");
var layer_js_1 = require("ol/layer.js");
var style_js_1 = require("ol/style.js");
var OSM_js_1 = require("ol/source/OSM.js");
var lonlat_helper_1 = require("./lonlat-helper");
var nominatim_helper_1 = require("./nominatim-helper");
var lonLat_1 = require("./lonLat");
var Vector_js_1 = require("ol/source/Vector.js");
var proj = require("ol/proj.js");
var extent_1 = require("ol/extent");
var extent_2 = require("ol/extent");
var LocationPicker = /** @class */ (function () {
    function LocationPicker(elementRef, options) {
        var _this = this;
        this.listeners = [];
        this.height = 200;
        this.toggleSearchField = function () {
            if (document.getElementById('searchField').classList.contains('searchField_invisible')) {
                document.getElementById('searchField').classList.remove('searchField_invisible');
                document.getElementById('searchField').classList.add('searchField_visible');
            }
            else {
                document.getElementById('searchField').classList.remove('searchField_visible');
                document.getElementById('searchField').classList.add('searchField_invisible');
            }
            // document.getElementById('searchField')
        };
        this.getLocation = function () {
            if (document.getElementById('locations') !== null) {
                document.getElementById('locations').remove();
            }
            _this.findLocation();
        };
        this.createMap = function (elementRef) {
            var boundingBox = [-37.3644738, -35.6983921, 173.8963284, 175.9032151];
            _this.markerSource = new Vector_js_1.default({
                features: []
            });
            _this.markerLayer = new layer_js_1.Vector({
                source: _this.markerSource
            });
            _this.view = new View_js_1.default({
                zoom: 6,
                center: (0, proj_1.fromLonLat)([174.763336, -40.848461])
            });
            // adding in geolocate button
            var mapContainer = document.querySelector('#' + elementRef);
            var geoLocateButton = document.createElement('span');
            geoLocateButton.addEventListener('click', function () {
                _this.getGeolocation();
            });
            geoLocateButton.setAttribute('id', 'findMe');
            geoLocateButton.innerHTML = '&#9737';
            var attribution = new control_js_1.Attribution({
                collapsible: false
            });
            _this.map = new Map_1.default({
                layers: [
                    new layer_js_1.Tile({
                        source: new OSM_js_1.default()
                    }),
                    _this.markerLayer
                ],
                controls: (0, control_js_1.defaults)({ attribution: false }).extend([attribution]),
                target: elementRef,
                view: _this.view
            });
            mapContainer.appendChild(geoLocateButton);
            _this.map.on('click', function (evt) {
                if (document.getElementById('locations')) {
                    document.getElementById('locations').remove();
                }
                var reprojCoorindates = proj.transform(evt.coordinate, _this.map.getView().getProjection(), 'EPSG:4326');
                // SV-257 this was causing issues post openlayers6
                // this.removeMarker(this.geolocatedFeature);
                var lonLat = new lonLat_1.LonLat(reprojCoorindates[0], reprojCoorindates[1]);
                lonLat.lon = _this.lonlatHelper.adjustLongitude(lonLat.lon);
                if (typeof _this.defaultIcon !== 'undefined') {
                    _this.geolocatedFeature = _this.addMarker(lonLat.lon, lonLat.lat, '#ff0000', _this.defaultIcon);
                }
                else {
                    _this.geolocatedFeature = _this.addMarker(lonLat.lon, lonLat.lat, '#ff0000');
                }
                _this.dispatchEvent(new CustomEvent("CLICKED_ON_LONLAT", {
                    "bubbles": true,
                    "cancelable": false,
                    "detail": { coords: lonLat }
                }));
            });
        };
        this.moveToLonLat = function (lonLat) {
            var lontLatProj = (0, proj_1.fromLonLat)([lonLat.lon, lonLat.lat]);
            if (typeof lonLat.boundingBox !== 'undefined') {
                var extent = _this.lonlatHelper.boundingBoxtoExtent(lonLat.boundingBox);
                var proj_extent = proj.transformExtent(extent, 'EPSG:4326', 'EPSG:3857');
                _this.view.animate({
                    zoom: 17,
                    duration: 500,
                });
                _this.view.fit(proj_extent, {
                    maxZoom: 17,
                    duration: 1000
                });
            }
            else {
                _this.view.animate({
                    zoom: 13,
                    center: lontLatProj,
                    duration: 500
                });
            }
        };
        this.addMarker = function (lon, lat, color, url) {
            var lontLatProj = (0, proj_1.fromLonLat)([lon, lat]);
            var locationMarker = new Feature_js_1.default({
                type: 'locationFound',
                geometry: new Point_js_1.default(lontLatProj)
            });
            if (typeof url === 'undefined') {
                var markerVectorStyle = new style_js_1.Style({
                    image: new style_js_1.Circle({
                        fill: new style_js_1.Fill({
                            color: color
                        }),
                        stroke: new style_js_1.Stroke({ color: 'black', width: 0.5 }),
                        radius: 5,
                    })
                });
                locationMarker.setStyle(markerVectorStyle);
            }
            else {
                var markerIconStyle = new style_js_1.Style({
                    image: new style_js_1.Icon({
                        src: url,
                        color: 'white',
                        scale: 0.5
                    })
                });
                locationMarker.setStyle(markerIconStyle);
            }
            _this.markerSource.addFeature(locationMarker);
            setTimeout(function () {
                _this.moveToLonLat(new lonLat_1.LonLat(lon, lat));
            }, 20);
            return locationMarker;
        };
        this.removeMarker = function (feature) {
            if (typeof feature !== 'undefined') {
                _this.markerSource.removeFeature(feature);
            }
        };
        this.getGeolocation = function () {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    _this.dispatchEvent(new CustomEvent("BROWSER_GEOLOCATED", {
                        "bubbles": true,
                        "cancelable": false,
                        "detail": { msg: position.coords }
                    }));
                });
            }
        };
        this.findLocation = function (searchExpression) {
            var searchExp = typeof searchExpression === 'undefined' ? document.getElementById('nwLocationField').value : searchExpression;
            var lonLat = _this.lonlatHelper.getLonLat(searchExp);
            if (lonLat.lat !== undefined && lonLat.lon !== undefined) {
                _this.dispatchEvent(new CustomEvent("MAP_CENTERED_ON_LONLAT", {
                    "bubbles": true,
                    "cancelable": false,
                    "detail": { lonLat: lonLat }
                }));
                _this.moveToLonLat(lonLat);
            }
            else {
                var locations = _this.nominatim.getLonLatByAddress(searchExp).subscribe(function (lonLats) {
                    if (document.getElementById('locations') !== null) {
                        document.getElementById('locations').remove();
                    }
                    var locationListRoot = document.createElement('ul');
                    locationListRoot.setAttribute('id', 'locations');
                    lonLats.forEach(function (lonLat) {
                        var locationListElement = document.createElement('li');
                        locationListElement.innerHTML = lonLat.displayName;
                        locationListElement.addEventListener('click', function () {
                            locationListRoot.remove();
                            _this.dispatchEvent(new CustomEvent("MAP_CENTERED_ON_ADDRESS", {
                                "bubbles": true,
                                "cancelable": false,
                                "detail": { lonLat: lonLat }
                            }));
                            document.getElementById('searchField').classList.remove('searchField_visible');
                            document.getElementById('searchField').classList.add('searchField_invisible');
                            _this.moveToLonLat(lonLat);
                        });
                        locationListRoot.appendChild(locationListElement);
                    });
                    document.getElementById('niwaLocationPicker').appendChild(locationListRoot);
                });
            }
        };
        this.addEventListener = function (type, callback) {
            if (!(type in this.listeners)) {
                this.listeners[type] = [];
            }
            this.listeners[type].push(callback);
        };
        this.removeEventListener = function (type, callback) {
            if (!(type in this.listeners)) {
                return;
            }
            var stack = this.listeners[type];
            for (var i = 0, l = stack.length; i < l; i++) {
                if (stack[i] === callback) {
                    stack.splice(i, 1);
                    return;
                }
            }
        };
        this.dispatchEvent = function (event) {
            if (!(event.type in this.listeners)) {
                return true;
            }
            var stack = this.listeners[event.type].slice();
            for (var i = 0, l = stack.length; i < l; i++) {
                stack[i].call(this, event);
            }
            return !event.defaultPrevented;
        };
        this.fitFeaturesIntoView = function (features) {
            var coordinates = [];
            features.forEach(function (feature) {
                coordinates.push((0, extent_2.getCenter)(feature.getGeometry().getExtent()));
            });
            var extent = (0, extent_1.boundingExtent)(coordinates);
            _this.view.fit(extent, {
                duration: 1000
            });
        };
        this.removeAllMarkers = function () {
            _this.markerSource.clear();
        };
        this.clearAddressField = function () {
            var element = document.getElementById('nwLocationField');
            element.value = '';
        };
        if (typeof options !== 'undefined') {
            this.countryCode = options.countryCode;
            this.defaultIcon = options.defaultIcon;
            this.height = (typeof options.height !== "undefined") ? options.height : this.height;
        }
        this.lonlatHelper = new lonlat_helper_1.LonlatHelper();
        this.nominatim = new nominatim_helper_1.NominatimHelper(this.countryCode);
        // main container
        var rootElement = document.querySelector(elementRef);
        // container holding the map
        var mapContainer = document.createElement('div');
        mapContainer.setAttribute('id', 'niwaLocationPicker');
        if (this.height) {
            mapContainer.style.height = this.height + 'px';
        }
        var searchFieldContainer = document.createElement('div');
        searchFieldContainer.setAttribute('id', 'searchField');
        searchFieldContainer.setAttribute('class', 'searchField_invisible');
        var searchButton = document.createElement('button');
        searchButton.setAttribute('id', 'search');
        searchButton.setAttribute('type', 'button');
        searchButton.innerHTML = 'Search';
        searchButton.addEventListener('click', this.getLocation);
        searchFieldContainer.appendChild(searchButton);
        // input field for text
        var textInput = document.createElement('input');
        textInput.setAttribute('value', '');
        textInput.setAttribute('type', 'text');
        textInput.setAttribute('id', 'nwLocationField');
        searchFieldContainer.appendChild(textInput);
        searchFieldContainer.appendChild(searchButton);
        rootElement.appendChild(searchFieldContainer);
        rootElement.appendChild(mapContainer);
        this.createMap('niwaLocationPicker');
    }
    return LocationPicker;
}());
exports.LocationPicker = LocationPicker;
//# sourceMappingURL=location-picker.js.map