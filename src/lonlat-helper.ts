import {LonLat} from "./lonLat";
import * as proj from 'ol/proj.js';
import {boundingExtent} from 'ol/extent';

export class LonlatHelper {

    private lonlatregex = '';

    // public isLonLat = (exp): boolean => {
    //     let validLonlat: boolean;
    //     // checking whether we have a valid lonlat e.g 192.45 -36
    //     const regexres = exp.match(/(\-*1*[0-9]*\.*[0-9]*[WEwe]*)[\s,](\s*\-*[0-9]*\.*[0-9]*[NSns]*)/)
    //     console.log(regexres);
    //     if (regexres !== null && regexres[1] !== '' && regexres[2] !== '') {
    //         // an invalid option has been detected as the user entered a negative lon but also used 'E' or 'W'
    //         if (regexres[1].indexOf('-') !== -1 && regexres[1].indexOf('W') !== -1 || (regexres[1].indexOf('E') !== -1)) {
    //
    //             console.log('false');
    //             validLonlat = false;
    //         } else {
    //             console.log('true');
    //             validLonlat = true;
    //         }
    //
    //         // an invalid option has been detected as the user entered a negative lon but also used 'E' or 'W'
    //         if (regexres[2].indexOf('-') !== -1 && (regexres[2].indexOf('S') !== -1 || regexres[2].indexOf('N') !== -1)) {
    //             validLonlat = false;
    //         } else {
    //             validLonlat = true;
    //         }
    //
    //     } else {
    //         validLonlat = false;
    //     }
    //     return validLonlat;
    // }


    public getLonLat = (exp): LonLat => {


        let lon: number = undefined;
        let lat: number = undefined;


        let dir1: string;
        let validLonlat: boolean;
        // checking whether we have a valid lonlat e.g 192.45 -36
        const regexres = exp.match(/(\-*1*[0-9]*\.*[0-9]*[NSnsWEwe]*)[\s,](\s*\-*[0-9]*\.*[0-9]*[NSnsWEwe]*)/)
        console.log('regexres', regexres);
        if (regexres !== null && regexres[1] !== '' && regexres[2] !== '') {


            if (this.directionAndNumericPresent(regexres[1]) || this.directionAndNumericPresent(regexres[2])) {
                // and invalid expression like -174e or -37n was detected
                lon = undefined;
                lat = undefined;
            } else {
                // the actual format is correct - now we need to see whether n,s,e,w is present ...
                const values = [regexres[1], regexres[2]];
                console.log('reg1',regexres[1]);
                console.log('reg2',regexres[2]);
                values.forEach((value, index) => {
                    if (this.directionPresent(value)) {

                        let valueAndDirection = value.match(/(\-*1*[0-9]*\.*[0-9]*)([NSnsWEwe]*)/);
                        if (this.directionValuePlausible(valueAndDirection[1], valueAndDirection[2])) {

                            if (dir1 !== undefined && dir1 === valueAndDirection[2]) {
                                console.error('invalt value: same direction error');
                                lon = undefined;
                                lat = undefined;

                            } else {
                                dir1 = valueAndDirection[2];
                                if (valueAndDirection[2] === 'e' || valueAndDirection[2] === 'w') {

                                    lon = this.directionToNumeric(valueAndDirection[1], valueAndDirection[2]);
                                } else {
                                    lat = this.directionToNumeric(valueAndDirection[1], valueAndDirection[2]);
                                }
                            }

                        } else {
                            return false;
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
        console.log('checkingLat', lat);
        if (lat >= -90 && lat <= 90) {
            return true;
        } else {
            return false;
        }
    }

    public longitudePlausible = (lon) => {
        console.log('checkingLon', lon);
        if (lon >= -180 && lon <= 180) {
            return true;
        } else {
            return false;
        }
    }


    public directionValuePlausible(value, direction) {
        console.log(value, direction);
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
        console.log('XXX');
        return false;
    }


    private directionPresent(exp) {
        if (exp.toLowerCase().indexOf('w') !== -1 || (exp.toLowerCase().indexOf('e') !== -1) || exp.toLowerCase().indexOf('n') !== -1 || exp.toLowerCase().indexOf('s') !== -1) {
            console.log('dir!');
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

    // public getLonLat = (exp): LonLat => {
    //
    //     let lon: number;
    //     let lat: number;
    //     // console.log('res', this.isLonLat(exp));
    //     if (this.isLonLat(exp)) {
    //
    //         const regexres = exp.match(/(\-*1*[0-9]*\.*[0-9]*[WEwe]*)[\s,](\s*\-*[0-9]*\.*[0-9]*[NSns]*)/);
    //         const tempLon = regexres[1].toLowerCase();
    //         const tempLat = regexres[2].toLowerCase();
    //
    //         if (tempLon.indexOf('e') !== -1) {
    //             lon = parseFloat(tempLon.substr(0, tempLon.indexOf('e')));
    //         } else if (tempLon.indexOf('w') !== -1) {
    //             lon = 0 - parseFloat(tempLon.substr(0, tempLon.indexOf('w')));
    //         } else {
    //             lon = parseFloat(tempLon);
    //         }
    //
    //
    //         if (tempLat.indexOf('n') !== -1) {
    //             lat = parseFloat(tempLat.substr(0, tempLat.indexOf('n')));
    //         } else if (tempLat.indexOf('s') !== -1) {
    //             lat = 0 - parseFloat(tempLat.substr(0, tempLat.indexOf('s')));
    //         } else {
    //             lat = parseFloat(tempLat);
    //         }
    //         if (lon > 180 || lon < -180 || lat > 90 || lat < -90) {
    //             return null;
    //         }
    //         return new LonLat(lon, lat)
    //     } else {
    //         return null;
    //     }
    // }

    public boundingBoxtoExtent = (boundingBox) => {
        return [parseFloat(boundingBox[2]), parseFloat(boundingBox[0]), parseFloat(boundingBox[3]), parseFloat(boundingBox[1])];
    }
}
