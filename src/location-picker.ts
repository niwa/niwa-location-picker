import OlMap from 'ol/Map';
import View from 'ol/View.js';
import {fromLonLat, toLonLat, transform} from 'ol/proj';
import {defaults as defaultControls, Attribution} from 'ol/control.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import {LonlatHelper} from "./lonlat-helper";

export class LocationPicker implements EventTarget {

    public map: OlMap;
    private listeners = [];
    public lonlatHelper: LonlatHelper;
    constructor(elementRef) {

        this.lonlatHelper = new LonlatHelper();
        // main container
        const rootElement = document.querySelector(elementRef);

        // container holding the map
        const mapContainer = document.createElement('div');
        mapContainer.setAttribute('id', 'niwaLocationPicker');
        const searchFieldContainer = document.createElement('div');
        const searchButton = document.createElement('button');
        searchButton.setAttribute('id','searchInput');
        searchButton.setAttribute('type','button');
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
        const searchExp = (<HTMLInputElement>document.getElementById('nwLocationField')).value;

        const lonLat = this.lonlatHelper.getLonLat(searchExp);
        console.log(lonLat);
        if (lonLat !== null) {
            this.map.getView().setCenter(fromLonLat([lonLat.lon, lonLat.lat]));
            this.dispatchEvent(new CustomEvent("MAP_CENTERED_ON_LONLAT", {
                "bubbles": true,
                "cancelable": false,
                "detail": {lonLat: lonLat}
            }));

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
