import {LonLat} from "./lonLat";
import * as proj from 'ol/proj.js';
import {boundingExtent} from 'ol/extent';

export class LonlatHelper {

    private lonlatregex = '';

    public getLonLat = (exp): LonLat => {


        let lon: number = undefined;
        let lat: number = undefined;


        let dir1: string;
        let validLonlat: boolean;
        // checking whether we have a valid lonlat e.g 192.45 -36
        const regexres = exp.match(/(\-*1*[0-9]*\.*[0-9]*[NSnsWEwe]*)[\s,](\s*\-*[0-9]*\.*[0-9]*[NSnsWEwe]*)/)
        if (regexres !== null && regexres[1] !== '' && regexres[2] !== '') {


            if (this.directionAndNumericPresent(regexres[1]) || this.directionAndNumericPresent(regexres[2])) {
                // and invalid expression like -174e or -37n was detected
                lon = undefined;
                lat = undefined;
            } else {
                // the actual format is correct - now we need to see whether n,s,e,w is present ...
                const values = [regexres[1], regexres[2]];
                values.forEach((value, index) => {
                    if (this.directionPresent(value)) {

                        let valueAndDirection = value.match(/(\-*1*[0-9]*\.*[0-9]*)([NSnsWEwe]*)/);
                        if (this.directionValuePlausible(valueAndDirection[1], valueAndDirection[2])) {

                            if (dir1 !== undefined && dir1 === valueAndDirection[2]) {
                                lon = undefined;
                                lat = undefined;

                            } else {
                                dir1 = valueAndDirection[2].toLowerCase();
                                if (dir1 === 'e' || dir1 === 'w') {

                                    lon = this.directionToNumeric(valueAndDirection[1], valueAndDirection[2]);
                                } else {
                                    lat = this.directionToNumeric(valueAndDirection[1], valueAndDirection[2]);
                                }
                            }

                        } else {
                            lon = undefined;
                            lat = undefined;
                        }

                    } else {
                        // we assume the first value to be Latitude
                        if (index === 0) {
                            //checking whether the value could fit the bill
                            if (this.latitudePlausible(value)) {
                                // if so we take it for being Latitude
                                lat = parseFloat(value);
                            } else {
                                // if the value does not fit the bill we check whether it could
                                // be the longiude indeed.
                                if (value > 90 || value < -90) {
                                    // if so we make it the longitude
                                    lon = parseFloat(value);
                                }
                            }
                        }

                        if (index === 1) {
                            // we assume the second value to be the longitude
                            if (this.longitudePlausible(value) && lon === undefined) {
                                // if it fits the bill we take for being the longitude - BUT only if longitude is
                                // not already populated!
                                lon = parseFloat(value);
                            } else {
                                // if longitude was already poupulated we check whether the second value could be
                                // the missing latitude
                                if (this.latitudePlausible(value)) {
                                    // if so we make it the latitude
                                    lat = parseFloat(value);
                                } else {
                                    // if not - GAME OVER
                                    lat = undefined;
                                    lon = undefined;
                                }
                            }
                        }
                    }

                })
            }
            return new LonLat(lon, lat);
        }
    }


    public directionToNumeric(value, direction) {
        if (direction === 'w' || direction === 'n') {
            return value * 1;
        }
        if (direction === 'e' || direction === 's') {
            return value * -1;
        }
    }

    public latitudePlausible = (lat) => {
        if (lat >= -90 && lat <= 90) {
            return true;
        } else {
            return false;
        }
    }

    public longitudePlausible = (lon) => {
        if (lon >= -180 && lon <= 180) {
            return true;
        } else {
            return false;
        }
    }


    public directionValuePlausible(value, direction) {
        if (direction === 'w' || direction === 'e') {
            if (value >= 0 && value <= 180) {
                return true
            } else {
                return false;
            }
        } else if (direction === 'n' || direction === 's') {
            if (value >= -90 && value <= 90) {
                console.log('!!!');
                return true
            } else {
                return false;
            }
        }
        return false;
    }


    private directionPresent(exp) {
        if (exp.toLowerCase().indexOf('w') !== -1 || (exp.toLowerCase().indexOf('e') !== -1) || exp.toLowerCase().indexOf('n') !== -1 || exp.toLowerCase().indexOf('s') !== -1) {
            return true
        } else {
            return false;
        }
    }


    private directionAndNumericPresent(exp) {
        if (exp.toLowerCase().indexOf('-') !== -1 && (exp.toLowerCase().indexOf('w') !== -1 || (exp.toLowerCase().indexOf('e') !== -1) || exp.toLowerCase().indexOf('n')!== -1 || exp.toLowerCase().indexOf('s')!== -1)) {
            return true
        } else {
            return false;
        }
    }


    public adjustLongitude = (longitude: number): number => {
        if (longitude < -180) {
            while (longitude < -180) {
                longitude = longitude + 360;
            }
        } else if (longitude > 180) {
            while (longitude > 180) {
                longitude = longitude - 360;
            }
        }
        return longitude;
    }



    public boundingBoxtoExtent = (boundingBox) => {
        return [parseFloat(boundingBox[2]), parseFloat(boundingBox[0]), parseFloat(boundingBox[3]), parseFloat(boundingBox[1])];
    }
}
