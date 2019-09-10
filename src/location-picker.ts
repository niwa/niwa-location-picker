import OlMap from 'ol/Map';
import View from 'ol/View.js';
import { fromLonLat, toLonLat, transform } from 'ol/proj';
import {defaults as defaultControls, Attribution} from 'ol/control.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';

export class LocationPicker {

    constructor(elementRef) {

        const rootElement = document.querySelector(elementRef);

        const mapContainer = document.createElement('div');


        mapContainer.setAttribute('id','niwaLocationPicker');

        rootElement.appendChild(mapContainer);
        this.createMap('niwaLocationPicker')
    }


    private createMap = (elementRef: string) => {

        const attribution = new Attribution({
            collapsible: false
        });
        const map = new OlMap({
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            controls: defaultControls({attribution: false}).extend([attribution]),
            target: elementRef,
            view: new View({
                center: fromLonLat([174.763336, -40.848461]),
                zoom: 6
            })
        });
    }
}
