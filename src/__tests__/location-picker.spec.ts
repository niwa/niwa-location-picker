import {LonlatHelper} from "../lonlat-helper";
import {LonLat} from "../lonLat";

describe('location picker', () => {


    it ('should get the right lat/lon', () => {
        const lonloatHelper = new LonlatHelper();

        // expecting clean run
        const lonLat = new LonLat(175, -47);
        const translated = lonloatHelper.getLonLat('175w 47s');

        expect(translated.lat).toEqual(lonLat.lat);
        expect(translated.lon).toEqual(lonLat.lon);


        //expecting clean run, same lonlat as above
        const lonLatReversed = new LonLat(175, -47);
        const translatedReversed = lonloatHelper.getLonLat('47s 175w');

        expect(translatedReversed.lat).toEqual(lonLatReversed.lat);
        expect(translatedReversed.lon).toEqual(lonLatReversed.lon);

        // expecting to end in undefined lonlat as out of bounnds
        const lonLatInvalidBounds = new LonLat(undefined, undefined);
        const translatedInvalidBounds = lonloatHelper.getLonLat('91s 181w');

        expect(translatedInvalidBounds.lat).toEqual(lonLatInvalidBounds.lat);
        expect(translatedInvalidBounds.lon).toEqual(lonLatInvalidBounds.lon);

        //expecting to fail as mix format
        const lonLatInvalidFormat = new LonLat(undefined, undefined);
        const translatedInvalidFormat = lonloatHelper.getLonLat('-37s 173');

        expect(translatedInvalidFormat.lat).toEqual(lonLatInvalidFormat.lat);
        expect(translatedInvalidFormat.lon).toEqual(lonLatInvalidFormat.lon);

    })



    it ('should fix the openlayers issue where the map is wrapped infiently from right to left', () => {
        const lonloatHelper = new LonlatHelper();

        expect(lonloatHelper.adjustLongitude(-174)).toBe(-174);
        expect(lonloatHelper.adjustLongitude(-14)).toBe(-14);
        expect(lonloatHelper.adjustLongitude(172)).toBe(172);
        expect(lonloatHelper.adjustLongitude(-364)).toBe(-4);
        expect(lonloatHelper.adjustLongitude(-271)).toBe(89);
        expect(lonloatHelper.adjustLongitude(-180)).toBe(-180);
        expect(lonloatHelper.adjustLongitude(-181)).toBe(179);
        expect(lonloatHelper.adjustLongitude(-179)).toBe(-179);
        expect(lonloatHelper.adjustLongitude(179)).toBe(179);
        expect(lonloatHelper.adjustLongitude(139)).toBe(139);
        expect(lonloatHelper.adjustLongitude(180)).toBe(180);
        expect(lonloatHelper.adjustLongitude(181)).toBe(-179);
        expect(lonloatHelper.adjustLongitude(360)).toBe(0);
    })


    it('should test to see if a value and direction is plausible' ,() => {
        const lonloatHelper = new LonlatHelper();
        expect (lonloatHelper.directionValuePlausible(180,'e')).toBeTruthy();
        expect (lonloatHelper.directionValuePlausible(180.1224,'e')).toBeFalsy();
        expect (lonloatHelper.directionValuePlausible(0,'e')).toBeTruthy();
        expect (lonloatHelper.directionValuePlausible(-1,'e')).toBeFalsy();

        expect (lonloatHelper.directionValuePlausible(37,'s')).toBeTruthy();
        expect (lonloatHelper.directionValuePlausible(90,'s')).toBeTruthy();
        expect (lonloatHelper.directionValuePlausible(90,'n')).toBeTruthy();
        expect (lonloatHelper.directionValuePlausible(90.1234,'n')).toBeFalsy();
        expect (lonloatHelper.directionValuePlausible(0,'n')).toBeTruthy();
        expect (lonloatHelper.directionValuePlausible(-0.1,'n')).toBeTruthy();
        expect (lonloatHelper.directionValuePlausible(-90,'n')).toBeTruthy();
        expect (lonloatHelper.directionValuePlausible(-90.1,'n')).toBeFalsy();



    })

    it ('should return the numeric value of lon / lat with directions', () => {
        const lonloatHelper = new LonlatHelper();

        expect (lonloatHelper.directionToNumeric(54, 'e')).toBe(-54);
        expect (lonloatHelper.directionToNumeric(54, 'w')).toBe(54);
        expect (lonloatHelper.directionToNumeric(54, 'n')).toBe(54);
        expect (lonloatHelper.directionToNumeric(54, 's')).toBe(-54);


    })
})
