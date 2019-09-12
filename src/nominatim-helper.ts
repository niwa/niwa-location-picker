import {LonLat} from "./lonLat";
import {Observable, Subject} from "rxjs";

export class NominatimHelper {

    private httpRequest: XMLHttpRequest;
    private nominatimSearch  = 'https://nominatim.openstreetmap.org/search';
    private nominatimReverse = 'https://nominatim.openstreetmap.org/search'
    private lonLats: LonLat[];
    public foundLonLat: Subject<LonLat[]>;

    constructor() {
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.onreadystatechange = this.handleResponse;
        this.foundLonLat = new Subject();
    }

    public getLonLatByAddress = (query): Observable<LonLat[]> => {
        this.lonLats = [];
        this.httpRequest.open('GET', this.nominatimSearch + '/' + query + '?format=json');
        this.httpRequest.send();

        return this.foundLonLat.asObservable();

    }

    private handleResponse = () => {
        this.lonLats = [];
        if (this.httpRequest.readyState === XMLHttpRequest.DONE) {
            if (this.httpRequest.status === 200) {
                const response = JSON.parse(this.httpRequest.responseText);
                response.forEach((resp) => {
                    this.lonLats.push(new LonLat(parseFloat(resp['lon']), parseFloat(resp['lat']), resp.boundingbox, resp['display_name'], resp['class']))
                })
                this.foundLonLat.next(this.lonLats)
            } else {
                alert('There was a problem with the request.');
            }
        }

    }
}
