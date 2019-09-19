export class LonLat {

    constructor(lon: number, lat: number, boundingBox?, displayName?, objectClass?) {
        this.lon = lon > 180 ? lon - 360 : lon;

        this.lat = lat;
        this.boundingBox = boundingBox;
        this.displayName = displayName;
        this.objectClass = objectClass;
    }

    public lon: number;
    public lat: number;
    public displayName: string;
    public objectClass: string;
    public boundingBox: [number, number, number, number]

}
