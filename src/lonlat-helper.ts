import {LonLat} from "./lonLat";
import * as proj from 'ol/proj.js';
import {boundingExtent} from 'ol/extent';

export class LonlatHelper {

    private lonlatregex = '';

    public isLonLat = (exp): boolean => {
        let validLonlat: boolean;
        // checking whether we have a valid lonlat e.g 192.45 -36
        const regexres = exp.match(/(\-*1*[0-9]*\.*[0-9]*[WEwe]*)[\s,](\s*\-*[0-9]*\.*[0-9]*[NSns]*)/)
        if (regexres !== null && regexres[1] !== '' && regexres[2] !== '') {
            // an invalid option has been detected as the user entered a negative lon but also used 'E' or 'W'
            if (regexres[1].indexOf('-') !== -1 && regexres[1].indexOf('W') !== -1 || (regexres[1].indexOf('E') !== -1)) {

                validLonlat = false;
            } else {
                validLonlat = true;
            }

            // an invalid option has been detected as the user entered a negative lon but also used 'E' or 'W'
            if (regexres[2].indexOf('-') !== -1 && (regexres[2].indexOf('S') !== -1 || regexres[2].indexOf('N') !== -1)) {
                validLonlat = false;
            } else {
                validLonlat = true;
            }

        } else {
            validLonlat = false;
        }
        return validLonlat;
    }

    public adjustLongitude = (longitude: number): number => {
        while (longitude < -180) {
            longitude = longitude + 360;
        }
        return longitude;
    }

    public getLonLat = (exp): LonLat => {

        let lon: number;
        let lat: number;

        if (this.isLonLat(exp)) {

            const regexres = exp.match(/(\-*1*[0-9]*\.*[0-9]*[WEwe]*)[\s,](\s*\-*[0-9]*\.*[0-9]*[NSns]*)/);
            const tempLon = regexres[1].toLowerCase();
            const tempLat = regexres[2].toLowerCase();

            if (tempLon.indexOf('e') !== -1) {
                lon = parseFloat(tempLon.substr(0, tempLon.indexOf('e')));
            } else if (tempLon.indexOf('w') !== -1) {
                lon = 0 - parseFloat(tempLon.substr(0, tempLon.indexOf('w')));
            } else {
                lon = parseFloat(tempLon);
            }


            if (tempLat.indexOf('n') !== -1) {
                lat = parseFloat(tempLat.substr(0, tempLat.indexOf('n')));
            } else if (tempLat.indexOf('s') !== -1) {
                lat = 0 - parseFloat(tempLat.substr(0, tempLat.indexOf('s')));
            } else {
                lat = parseFloat(tempLat);
            }
            if (lon > 180 || lon < -180 || lat > 90 || lat < -90) {
                return null;
            }
            return new LonLat(lon, lat)
        } else {
            return null;
        }
    }

    public boundingBoxtoExtent = (boundingBox) => {
        return [parseFloat(boundingBox[2]), parseFloat(boundingBox[0]), parseFloat(boundingBox[3]), parseFloat(boundingBox[1])];
    }
}
