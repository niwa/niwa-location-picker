import OlMap from 'ol/Map';
import View from 'ol/View.js';
import { fromLonLat, toLonLat, transform } from 'ol/proj';
import {defaults as defaultControls, Attribution} from 'ol/control.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';

export class LocationPicker {

    public map: OlMap;

    constructor(elementRef) {

        const rootElement = document.querySelector(elementRef);

        const mapContainer = document.createElement('div');


        mapContainer.setAttribute('id', 'niwaLocationPicker');

        rootElement.appendChild(mapContainer);
        this.createMap('niwaLocationPicker')
    }


    private createMap = (elementRef: string) => {

        const mapContainer = document.querySelector('#' + elementRef);
        const geoLocateButton = document.createElement('span');
        geoLocateButton.addEventListener('click', () => {
            this.getGeolocation();

        })
        geoLocateButton.setAttribute('id','findMe');
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
                   console.log('position!');
                this.map.getView().setCenter(fromLonLat([position.coords.longitude, position.coords.latitude]))
            });
        } else {
            this.map.getView().setCenter(fromLonLat([174.763336, -40.848461]))
        }

    }
}
