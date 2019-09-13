import { LonLat } from "./lonLat";
import { Observable, Subject } from "rxjs";
export declare class NominatimHelper {
    private httpRequest;
    private nominatimSearch;
    private nominatimReverse;
    private lonLats;
    foundLonLat: Subject<LonLat[]>;
    constructor();
    getLonLatByAddress: (query: any) => Observable<LonLat[]>;
    private handleResponse;
}
