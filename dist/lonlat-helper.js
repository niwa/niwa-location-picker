"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LonlatHelper = void 0;
var lonLat_1 = require("./lonLat");
var LonlatHelper = /** @class */ (function () {
    function LonlatHelper() {
        var _this = this;
        this.lonlatregex = '';
        this.getLonLat = function (exp) {
            var lon = undefined;
            var lat = undefined;
            var LatLonError = false;
            var direction;
            var validLonlat;
            // checking whether we have a valid lonlat e.g 192.45 -36
            var regexres = exp.match(/(\-*1*[0-9]*\.*[0-9]*[NSnsWEwe]*)[\s,](\s*\-*[0-9]*\.*[0-9]*[NSnsWEwe]*)/);
            if (regexres !== null && regexres[1] !== '' && regexres[2] !== '') {
                if (_this.directionAndNumericPresent(regexres[1]) || _this.directionAndNumericPresent(regexres[2])) {
                    // and invalid expression like -174e or -37n was detected
                    LatLonError = true;
                }
                else {
                    // the actual format is correct - now we need to see whether n,s,e,w is present ...
                    var values = [regexres[1], regexres[2]];
                    values.forEach(function (value, index) {
                        if (_this.directionPresent(value)) {
                            var valueAndDirection = value.match(/(\-*1*[0-9]*\.*[0-9]*)([NSnsWEwe]*)/);
                            if (_this.directionValuePlausible(valueAndDirection[1], valueAndDirection[2])) {
                                if (direction !== undefined && direction === valueAndDirection[2]) {
                                    LatLonError = true;
                                }
                                else {
                                    direction = valueAndDirection[2].toLowerCase();
                                    if (direction === 'e' || direction === 'w') {
                                        lon = _this.directionToNumeric(valueAndDirection[1], valueAndDirection[2]);
                                    }
                                    else {
                                        lat = _this.directionToNumeric(valueAndDirection[1], valueAndDirection[2]);
                                    }
                                }
                            }
                            else {
                                LatLonError = true;
                            }
                        }
                        else {
                            // we assume the first value to be Latitude
                            if (index === 0) {
                                //checking whether the value could fit the bill
                                if (_this.latitudePlausible(value)) {
                                    // if so we take it for being Latitude
                                    lat = parseFloat(value);
                                }
                                else {
                                    // if the value does not fit the bill we check whether it could
                                    // be the longiude indeed.
                                    if (value > 90 || value < -90) {
                                        // if so we make it the longitude
                                        if (_this.longitudePlausible(value)) {
                                            lon = parseFloat(value);
                                        }
                                        else {
                                            LatLonError = true;
                                        }
                                    }
                                }
                            }
                            if (index === 1) {
                                // we assume the second value to be the longitude
                                if (_this.longitudePlausible(value) && lon === undefined) {
                                    // if it fits the bill we take for being the longitude - BUT only if longitude is
                                    // not already populated!
                                    lon = parseFloat(value);
                                }
                                else {
                                    // if longitude was already poupulated we check whether the second value could be
                                    // the missing latitude
                                    if (_this.latitudePlausible(value)) {
                                        // if so we make it the latitude
                                        lat = parseFloat(value);
                                    }
                                    else {
                                        // if not - GAME OVER
                                        LatLonError = true;
                                    }
                                }
                            }
                        }
                    });
                }
                if (LatLonError) {
                    return new lonLat_1.LonLat(undefined, undefined);
                }
                else {
                    return new lonLat_1.LonLat(lon, lat);
                }
            }
            else {
                return new lonLat_1.LonLat(undefined, undefined);
            }
        };
        this.latitudePlausible = function (lat) {
            if (lat >= -90 && lat <= 90) {
                return true;
            }
            else {
                return false;
            }
        };
        this.longitudePlausible = function (lon) {
            if (lon >= -180 && lon <= 180) {
                return true;
            }
            else {
                return false;
            }
        };
        this.adjustLongitude = function (longitude) {
            if (longitude < -180) {
                while (longitude < -180) {
                    longitude = longitude + 360;
                }
            }
            else if (longitude > 180) {
                while (longitude > 180) {
                    longitude = longitude - 360;
                }
            }
            return longitude;
        };
        this.boundingBoxtoExtent = function (boundingBox) {
            return [parseFloat(boundingBox[2]), parseFloat(boundingBox[0]), parseFloat(boundingBox[3]), parseFloat(boundingBox[1])];
        };
    }
    LonlatHelper.prototype.directionToNumeric = function (value, direction) {
        if (direction === 'w' || direction === 'n') {
            return value * 1;
        }
        if (direction === 'e' || direction === 's') {
            return value * -1;
        }
    };
    LonlatHelper.prototype.directionValuePlausible = function (value, direction) {
        if (direction === 'w' || direction === 'e') {
            if (value >= 0 && value <= 180) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (direction === 'n' || direction === 's') {
            if (value >= 0 && value <= 90) {
                return true;
            }
            else {
                return false;
            }
        }
        return false;
    };
    LonlatHelper.prototype.directionPresent = function (exp) {
        if (exp.toLowerCase().indexOf('w') !== -1 || (exp.toLowerCase().indexOf('e') !== -1) || exp.toLowerCase().indexOf('n') !== -1 || exp.toLowerCase().indexOf('s') !== -1) {
            return true;
        }
        else {
            return false;
        }
    };
    LonlatHelper.prototype.directionAndNumericPresent = function (exp) {
        if (exp.toLowerCase().indexOf('-') !== -1 && this.directionPresent(exp)) {
            return true;
        }
        else {
            return false;
        }
    };
    return LonlatHelper;
}());
exports.LonlatHelper = LonlatHelper;
//# sourceMappingURL=lonlat-helper.js.map