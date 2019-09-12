import OlMap from 'ol/Map';
import View from 'ol/View.js';

import {fromLonLat, toLonLat, transform} from 'ol/proj';
import {defaults as defaultControls, Attribution} from 'ol/control.js';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {Circle as CircleStyle, Fill, Icon, Stroke, Style} from 'ol/style.js';
import OSM from 'ol/source/OSM.js';
import {LonlatHelper} from "./lonlat-helper";
import {NominatimHelper} from "./nominatim-helper";
import {LonLat} from "./lonLat";
import markerSource from 'ol/source/Vector.js';
import * as proj  from 'ol/proj.js';

export class LocationPicker implements EventTarget {

    public map: OlMap;
    public markerLayer: VectorLayer;
    public markerSource: markerSource;
    private listeners = [];
    public lonlatHelper: LonlatHelper;
    private nominatim: NominatimHelper;

    private geolocatedFeature: Feature;

    constructor(elementRef) {

        this.lonlatHelper = new LonlatHelper();
        this.nominatim = new NominatimHelper();
        // main container
        const rootElement = document.querySelector(elementRef);

        // container holding the map
        const mapContainer = document.createElement('div');
        mapContainer.setAttribute('id', 'niwaLocationPicker');
        const searchFieldContainer = document.createElement('div');
        const searchButton = document.createElement('button');
        searchButton.setAttribute('id', 'searchInput');
        searchButton.setAttribute('type', 'button');
        searchButton.innerHTML = 'Search';
        searchButton.addEventListener('click', this.findLocation);
        searchFieldContainer.appendChild(searchButton);


        // input field for text
        const textInput = document.createElement('input');
        textInput.setAttribute('value', '');
        textInput.setAttribute('type', 'text');
        textInput.setAttribute('id', 'nwLocationField');
        searchFieldContainer.appendChild(textInput);

        rootElement.appendChild(searchFieldContainer);
        rootElement.appendChild(mapContainer);
        this.createMap('niwaLocationPicker')
    }


    private createMap = (elementRef: string) => {

        this.markerSource = new markerSource({
            features: []
        })

        this.markerLayer = new VectorLayer({
            source: this.markerSource
        });


        // adding in geolocate button
        const mapContainer = document.querySelector('#' + elementRef);
        const geoLocateButton = document.createElement('span');
        geoLocateButton.addEventListener('click', () => {
            this.getGeolocation();

        })
        geoLocateButton.setAttribute('id', 'findMe');
        geoLocateButton.innerHTML = '&#9737';


        const attribution = new Attribution({
            collapsible: false
        });
        this.map = new OlMap({
            layers: [
                new TileLayer({
                    source: new OSM()
                }), this.markerLayer
            ],
            controls: defaultControls({attribution: false}).extend([attribution]),
            target: elementRef,
            view: new View({
                zoom: 6,
                center: fromLonLat([174.763336, -40.848461])
            })
        });

        mapContainer.appendChild(geoLocateButton);
        // this.getGeolocation();

        this.map.on('click', () => {
            if (document.getElementById('locations')) {
                document.getElementById('locations').remove();
            }


        })
    }

    public addMarker = (lon: number, lat: number, color: string): Feature => {
        const lontLatProj = fromLonLat([lon, lat]);
        this.map.getView().setCenter(lontLatProj);


        const markerStyle = new Style({
            image: new CircleStyle({
                fill: new Fill({
                    color: color
                }),
                stroke: new Stroke({color: 'black', width: 0.5}),
                radius: 5,
            })
        });

        const locationMarker = new Feature({
            type: 'locationFound',
            geometry: new Point(lontLatProj)
        });

        locationMarker.setStyle(markerStyle)
        this.geolocatedFeature = this.markerSource.addFeature(locationMarker);
        return locationMarker;
    }

    public removeMarker = (feature: Feature) => {
        if (typeof feature !== 'undefined') {
            this.markerSource.removeFeature(feature);
        }

    }
    private getGeolocation = () => {
        this.removeMarker(this.geolocatedFeature);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.map.getView().setCenter(fromLonLat([position.coords.longitude, position.coords.latitude]))
                this.dispatchEvent(new CustomEvent("BROWSER_GEOLOCATED", {
                    "bubbles": true,
                    "cancelable": false,
                    "detail": {msg: position.coords}
                }));

                this.geolocatedFeature = this.addMarker(position.coords.longitude, position.coords.latitude, '#ff0000');
            });
        } else {
            this.map.getView().setCenter(fromLonLat([174.763336, -40.848461]))
        }

    }


    public findLocation = () => {

        if (document.getElementById('locations')) {
            document.getElementById('locations').remove();
        }

        const searchExp = (<HTMLInputElement>document.getElementById('nwLocationField')).value;

        const lonLat = this.lonlatHelper.getLonLat(searchExp);
        if (lonLat !== null) {
            this.map.getView().setCenter(fromLonLat([lonLat.lon, lonLat.lat]));
            this.dispatchEvent(new CustomEvent("MAP_CENTERED_ON_LONLAT", {
                "bubbles": true,
                "cancelable": false,
                "detail": {lonLat: lonLat}
            }));
            this.geolocatedFeature = this.addMarker(lonLat.lon, lonLat.lat, '#00ff00');
        } else {
            const locations = this.nominatim.getLonLatByAddress(searchExp).subscribe((lonLats: LonLat[]) => {
                const locationListRoot = document.createElement('ul');
                locationListRoot.setAttribute('id', 'locations')
                lonLats.forEach((lonLat) => {

                    const locationListElement = document.createElement('li');
                    locationListElement.innerHTML = lonLat.displayName;
                    locationListElement.addEventListener('click', () => {
                        this.map.getView().setCenter(fromLonLat([lonLat.lon, lonLat.lat]));
                        this.map.getView().setZoom(11);
                        locationListRoot.remove();

                        this.dispatchEvent(new CustomEvent("MAP_CENTERED_ON_ADDRESS", {
                            "bubbles": true,
                            "cancelable": false,
                            "detail": {lonLat: lonLat}
                        }));
                        this.removeMarker(this.geolocatedFeature);
                        this.geolocatedFeature = this.addMarker(lonLat.lon, lonLat.lat, '#00ff00');
                    })

                    locationListRoot.appendChild(locationListElement);
                })

                document.getElementById('niwaLocationPicker').appendChild(locationListRoot);

                locations.unsubscribe();
            })
        }

    }


    public addEventListener = function (type, callback) {
        if (!(type in this.listeners)) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(callback);
    };

    public removeEventListener = function (type, callback) {
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
    }

    public dispatchEvent = function (event) {
        if (!(event.type in this.listeners)) {
            return true;
        }
        const stack = this.listeners[event.type].slice();

        for (var i = 0, l = stack.length; i < l; i++) {
            stack[i].call(this, event);
        }
        return !event.defaultPrevented;
    };
}
