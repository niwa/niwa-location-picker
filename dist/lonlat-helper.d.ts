import { LonLat } from "./lonLat";
export declare class LonlatHelper {
    private lonlatregex;
    getLonLat: (exp: any) => LonLat;
    directionToNumeric(value: any, direction: any): number;
    latitudePlausible: (lat: any) => boolean;
    longitudePlausible: (lon: any) => boolean;
    directionValuePlausible(value: any, direction: any): boolean;
    private directionPresent;
    private directionAndNumericPresent;
    adjustLongitude: (longitude: number) => number;
    boundingBoxtoExtent: (boundingBox: any) => [number, number, number, number];
}
