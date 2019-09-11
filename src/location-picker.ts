import OlMap from 'ol/Map';
import View from 'ol/View.js';
import {fromLonLat, toLonLat, transform} from 'ol/proj';
import {defaults as defaultControls, Attribution} from 'ol/control.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import {LonlatHelper} from "./lonlat-helper";
import {NominatimHelper} from "./nominatim-helper";
import {LonLat} from "./lonLat";

export class LocationPicker implements EventTarget {

    public map: OlMap;
    private listeners = [];
    public lonlatHelper: LonlatHelper;
    private nominatim: NominatimHelper;

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
                })
            ],
            controls: defaultControls({attribution: false}).extend([attribution]),
            target: elementRef,
            view: new View({
                zoom: 6,
                center: fromLonLat([171.763336, -40.848461])
            })
        });
        mapContainer.appendChild(geoLocateButton);
        this.getGeolocation();

        this.map.on('click', ()=> {
            if (document.getElementById('locations')) {
                document.getElementById('locations').remove();
            }


        })
    }
    private getGeolocation = () => {

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.map.getView().setCenter(fromLonLat([position.coords.longitude, position.coords.latitude]))
                this.dispatchEvent(new CustomEvent("BROWSER_GEOLOCATED", {
                    "bubbles": true,
                    "cancelable": false,
                    "detail": {msg: position.coords}
                }));
            });
        } else {
            this.map.getView().setCenter(fromLonLat([174.763336, -40.848461]))
        }

    }


    private findLocation = () => {

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

        } else {
            const locations = this.nominatim.getLonLatByAddress(searchExp).subscribe((lonLats: LonLat[]) => {
                const locationListRoot = document.createElement('ul');
                locationListRoot.setAttribute('id', 'locations')
                lonLats.forEach((lonLat) => {

                    const locationListElement = document.createElement('li');
                    locationListElement.innerHTML = lonLat.displayName ;
                    locationListElement.addEventListener('click', () => {
                        this.map.getView().setCenter(fromLonLat([lonLat.lon, lonLat.lat]));
                        this.map.getView().setZoom(11);
                        locationListRoot.remove();

                        this.dispatchEvent(new CustomEvent("MAP_CENTERED_ON_ADDRESS", {
                            "bubbles": true,
                            "cancelable": false,
                            "detail": {lonLat: lonLat}
                        }));
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
