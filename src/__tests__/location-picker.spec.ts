import {LonlatHelper} from "../lonlat-helper";
import {LonLat} from "../lonLat";

describe('location picker', () => {


    it('should check for valid lon lat values', () => {
        const lonloatHelper = new LonlatHelper();
        expect (lonloatHelper.isLonLat('192.32 -37.23')).toBeTruthy();
        expect (lonloatHelper.isLonLat('192.32W 37.23S')).toBeTruthy();
        expect (lonloatHelper.isLonLat('192.32W -37.23S')).toBeFalsy();
        expect (lonloatHelper.isLonLat('-192.32 -37.23')).toBeTruthy();
        expect (lonloatHelper.isLonLat('Address line')).toBeFalsy();

    })

    it('should get the lonLat as a typed object', () => {
        const lonloatHelper = new LonlatHelper();
        expect(lonloatHelper.getLonLat('171.23E 37.234S')).toEqual(new LonLat(171.23, -37.234));
        expect(lonloatHelper.getLonLat('172.23W 37.234N')).toEqual(new LonLat(-172.23, 37.234));
        expect(lonloatHelper.getLonLat('173.23 37.234')).toEqual(new LonLat(173.23, 37.234));
        expect(lonloatHelper.getLonLat('-174.25 -37.234')).toEqual(new LonLat(-174.25, -37.234));
        expect(lonloatHelper.getLonLat('-175.25 37.234')).toEqual(new LonLat(-175.25, 37.234));
        expect(lonloatHelper.getLonLat('176.25W 37.234')).toEqual(new LonLat(-176.25, 37.234));
        expect(lonloatHelper.getLonLat('276.25W 37.234')).toBeNull();
        expect(lonloatHelper.getLonLat('276.25W 91.234')).toBeNull();
        expect(lonloatHelper.getLonLat('76.25W 91.234')).toBeNull();
        expect(lonloatHelper.getLonLat('This is my address')).toBeNull();
    })


    it ('should turn a bounding box into an extent', () => {

        //-37.3644738 173.8963284 -35.6983921 175.9032151
        const lonloatHelper = new LonlatHelper();
        const extent = lonloatHelper.boundingBoxtoExtent([-37.3644738,-35.6983921,-173.8963284,175.9032151]);
        expect(extent[0]).toBe(175.9032151);
        expect(extent[1]).toBe(-35.6983921);
        expect(extent[2]).toBe(-173.8963284);
        expect(extent[3]).toBe(-37.3644738);

    })

    // it('should prject extent into ol', () => {
    //
    //     const lonloatHelper = new LonlatHelper();
    //
    //     expect(lonloatHelper.projectExtentToOL([175.9032151, -35.6983921, -173.8963284, 37.3644738])).toBe([1,2,3,4])
    //
    // })


})
