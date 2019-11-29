import { LonLat } from "./lonLat";
export declare class LonlatHelper {
    private lonlatregex;
    isLonLat: (exp: any) => boolean;
    adjustLongitude: (longitude: number) => number;
    getLonLat: (exp: any) => LonLat;
    boundingBoxtoExtent: (boundingBox: any) => number[];
}
