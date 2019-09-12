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
import { boundingExtent } from 'ol/extent';

export class LocationPicker implements EventTarget {

    public map: OlMap;
    public markerLayer: VectorLayer;
    public markerSource: markerSource;
    public lonlatHelper: LonlatHelper;

    private view: View;
    private listeners = [];
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



        const boundingBox = [-37.3644738, -35.6983921, 173.8963284, 175.9032151];

        this.markerSource = new markerSource({
            features: []
        })

        this.markerLayer = new VectorLayer({
            source: this.markerSource
        });



        this.view = new View({
            zoom: 6,
            center: fromLonLat([174.763336, -40.848461])
        })
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
            view: this.view
        });

        mapContainer.appendChild(geoLocateButton);
        // this.getGeolocation();

        this.map.on('click', (evt) => {
            if (document.getElementById('locations')) {
                document.getElementById('locations').remove();


            }

            const reprojCoorindates = proj.transform(evt.coordinate,this.map.getView().getProjection(), 'EPSG:4326');

            this.removeMarker(this.geolocatedFeature);
            const lonLat = new LonLat(reprojCoorindates[0], reprojCoorindates[1]);
            this.geolocatedFeature = this.addMarker(lonLat.lon, lonLat.lat, '#ff0000');


            this.dispatchEvent(new CustomEvent("CLICKED_ON_LONLAT", {
                "bubbles": true,
                "cancelable": false,
                "detail": {coords: lonLat}
            }));

        })

    }


    private moveToLonLat = (lonLat: LonLat) => {
        const lontLatProj = fromLonLat([lonLat.lon, lonLat.lat]);

        if (typeof lonLat.boundingBox !=='undefined') {

            const extent = this.lonlatHelper.boundingBoxtoExtent(lonLat.boundingBox);
            const proj_extent = proj.transformExtent(extent,'EPSG:4326','EPSG:3857');

            this.view.animate({
                duration: 500,
            });
            this.view.fit(proj_extent, {
                duration: 1000
            });
        } else {
            this.view.animate({
                center: lontLatProj,
                duration: 500
            });
        }
    }

    public addMarker = (lon: number, lat: number, color: string, url?:string): Feature => {
        const lontLatProj = fromLonLat([lon, lat]);

        const locationMarker = new Feature({
            type: 'locationFound',
            geometry: new Point(lontLatProj)
        });

        if (typeof url ==='undefined') {
            console.log(url);
            const markerVectorStyle = new Style({
                image: new CircleStyle({
                    fill: new Fill({
                        color: color
                    }),
                    stroke: new Stroke({color: 'black', width: 0.5}),
                    radius: 5,
                })
            });
            locationMarker.setStyle(markerVectorStyle)
        } else {
            const markerIconStyle = new Style({
                image: new Icon(({
                    src: url,
                    color: 'white',
                    scale: 0.5
                } as any))
            })
            locationMarker.setStyle(markerIconStyle)
        }



        this.geolocatedFeature = this.markerSource.addFeature(locationMarker);
        this.moveToLonLat(new LonLat(lon, lat));
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
                        this.moveToLonLat(lonLat);
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
