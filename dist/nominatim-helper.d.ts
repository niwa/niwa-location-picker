import { LonLat } from "./lonLat";
import { Observable, Subject } from "rxjs";
export declare class NominatimHelper {
    private httpRequest;
    private nominatimSearch;
    private nominatimReverse;
    private lonLats;
    private countryCode;
    foundLonLat: Subject<LonLat[]>;
    constructor(countryCode?: string);
    getLonLatByAddress: (query: any) => Observable<LonLat[]>;
    private handleResponse;
}
