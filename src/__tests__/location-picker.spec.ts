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


})
