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


        let lon: number;
        let lat: number;


        let dir1: string;
        let validLonlat: boolean;
        // checking whether we have a valid lonlat e.g 192.45 -36
        const regexres = exp.match(/(\-*1*[0-9]*\.*[0-9]*[NSnsWEwe]*)[\s,](\s*\-*[0-9]*\.*[0-9]*[NSnsWEwe]*)/)
        if (regexres !== null && regexres[1] !== '' && regexres[2] !== '') {


            if (this.directionAndNumericPresent(regexres[1]) || this.directionAndNumericPresent(regexres[2])) {
                // and invalid expression like -174e or -37n was detected
                lon = undefined;
                lat= undefined;
            } else {
                // the actual format is correct - now we need to see whether n,s,e,w is present ...
                const values = [regexres[1], regexres[2]];

                values.forEach((value) => {
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

                    }

                })
                // an invalid option has been detected as the user entered a negative lon but also used 'E' or 'W'


            }
            return new LonLat(lon, lat);
        }
    }


    public directionToNumeric (value, direction) {
        if (direction === 'w' || direction === 'n') {
            return value * 1;
        }
        if (direction === 'e' || direction === 's') {
            return value * -1;
        }
    }

    public directionValuePlausible (value, direction) {
        console.log(value, direction);
        if (direction === 'w' || direction === 'e') {
            if (value>= 0 && value <=180) {
                return true
            } else {
                return false;
            }
        } else if (direction === 'n' || direction === 's') {
            if (value >=  -90 && value <= 90) {
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
        if (exp.toLowerCase().indexOf('w') !== -1 || (exp.toLowerCase().indexOf('e') !== -1) || exp.toLowerCase().indexOf('n')||exp.toLowerCase().indexOf('s')) {
            return true
        } else {
            return false;
        }
    }


    private directionAndNumericPresent(exp) {
        if (exp.toLowerCase().indexOf('-') !== -1 && (exp.toLowerCase().indexOf('w') !== -1 || (exp.toLowerCase().indexOf('e') !== -1) || exp.toLowerCase().indexOf('n')||exp.toLowerCase().indexOf('s'))) {
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
