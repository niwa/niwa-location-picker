"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LonLat = void 0;
var LonLat = /** @class */ (function () {
    function LonLat(lon, lat, boundingBox, displayName, objectClass) {
        this.lon = lon > 180 ? lon - 360 : lon;
        this.lat = lat;
        this.boundingBox = boundingBox;
        this.displayName = displayName;
        this.objectClass = objectClass;
    }
    return LonLat;
}());
exports.LonLat = LonLat;
//# sourceMappingURL=lonLat.js.map