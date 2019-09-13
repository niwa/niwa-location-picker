import { LonLat } from "./lonLat";
export declare class LonlatHelper {
    private lonlatregex;
    isLonLat: (exp: any) => boolean;
    getLonLat: (exp: any) => LonLat;
    boundingBoxtoExtent: (boundingBox: any) => number[];
    projectExtentToOL: (extent: any) => any;
}
