export class LonLat {

    constructor(lon: number, lat: number, displayName?, objectClass?) {
        this.lon = lon;
        this.lat = lat;
        this.displayName = displayName;
        this.objectClass = objectClass;

    }

    public lon: number;
    public lat: number;
    public displayName: string;
    public objectClass: string;

}
