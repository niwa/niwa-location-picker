"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lonLat_1 = require("./lonLat");
var rxjs_1 = require("rxjs");
var NominatimHelper = /** @class */ (function () {
    function NominatimHelper() {
        var _this = this;
        this.nominatimSearch = 'https://nominatim.openstreetmap.org/search';
        this.nominatimReverse = 'https://nominatim.openstreetmap.org/search';
        this.getLonLatByAddress = function (query) {
            _this.lonLats = [];
            _this.httpRequest.open('GET', _this.nominatimSearch + '/' + query + '?format=json');
            _this.httpRequest.send();
            return _this.foundLonLat.asObservable();
        };
        this.handleResponse = function () {
            _this.lonLats = [];
            if (_this.httpRequest.readyState === XMLHttpRequest.DONE) {
                if (_this.httpRequest.status === 200) {
                    var response = JSON.parse(_this.httpRequest.responseText);
                    response.forEach(function (resp) {
                        _this.lonLats.push(new lonLat_1.LonLat(parseFloat(resp['lon']), parseFloat(resp['lat']), resp.boundingbox, resp['display_name'], resp['class']));
                    });
                    _this.foundLonLat.next(_this.lonLats);
                }
                else {
                    alert('There was a problem with the request.');
                }
            }
        };
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.onreadystatechange = this.handleResponse;
        this.foundLonLat = new rxjs_1.Subject();
    }
    return NominatimHelper;
}());
exports.NominatimHelper = NominatimHelper;
//# sourceMappingURL=nominatim-helper.js.map