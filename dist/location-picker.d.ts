import OlMap from 'ol/Map';
import { Vector as VectorLayer } from 'ol/layer.js';
import { LonlatHelper } from "./lonlat-helper";
import { LonLat } from "./lonLat";
import markerSource from 'ol/source/Vector.js';
import { Options } from "./options";
import { Observable } from "rxjs";
export declare class LocationPicker implements EventTarget {
    map: OlMap;
    markerLayer: VectorLayer;
    markerSource: markerSource;
    lonlatHelper: LonlatHelper;
    private view;
    private listeners;
    private nominatim;
    private geolocatedFeature;
    private countryCode;
    private defaultIcon;
    constructor(elementRef: any, options?: Options);
    getLocation: () => void;
    private createMap;
    private moveToLonLat;
    addMarker: (lon: number, lat: number, color: string, url?: string) => any;
    removeMarker: (feature: any) => void;
    /**
     * Returns the current geolacted position if available;
     */
    getGeolocation: () => Observable<LonLat>;
    findLocation: (searchExpression?: string) => void;
    addEventListener: (type: any, callback: any) => void;
    removeEventListener: (type: any, callback: any) => void;
    dispatchEvent: (event: any) => boolean;
    fitFeaturesIntoView: (features: any[]) => void;
    removeAllMarkers: () => void;
}
