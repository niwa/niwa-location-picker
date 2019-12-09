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


        //expecting to populate a new LonLat Object using only numeric values
        const lonLatNum = new LonLat(175, -37);
        const translatedLonLatNum = lonloatHelper.getLonLat('-37 175');

        expect(translatedLonLatNum.lat).toEqual(lonLatNum.lat);
        expect(translatedLonLatNum.lon).toEqual(lonLatNum.lon);

        //expecting to populate a new LonLat Object using only numeric values but reversed
        const lonLatNumReversed = new LonLat(175, -37);
        const translatedLonLatNumReversed = lonloatHelper.getLonLat('175 -37');

        expect(translatedLonLatNumReversed.lat).toEqual(lonLatNumReversed.lat);
        expect(translatedLonLatNumReversed.lon).toEqual(lonLatNumReversed.lon);



        //expecting to populate undefined as wrong values
        const translatedLonLatNumReversedBad = lonloatHelper.getLonLat('175 99');

        expect(translatedLonLatNumReversedBad.lat).toEqual(undefined);
        expect(translatedLonLatNumReversedBad.lon).toEqual(undefined);


        // expecting clean run
        const lonLatInvalid = new LonLat(undefined, undefined);
        const translatedInvalid = lonloatHelper.getLonLat('182 66');

        expect(translatedInvalid.lat).toEqual(lonLatInvalid.lat);
        expect(translatedInvalid.lon).toEqual(lonLatInvalid.lon);


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


    it('should check whether the value is plausible to be a Latitude', () => {

        const lonloatHelper = new LonlatHelper();
        expect (lonloatHelper.latitudePlausible(-90)).toBeTruthy();
        expect (lonloatHelper.latitudePlausible(90)).toBeTruthy();
        expect (lonloatHelper.latitudePlausible(-90.1)).toBeFalsy();
        expect (lonloatHelper.latitudePlausible(90.1)).toBeFalsy();


    })

    it('should check whether the value is plausible to be a Longitude', () => {

        const lonloatHelper = new LonlatHelper();
        expect (lonloatHelper.longitudePlausible(-180)).toBeTruthy();
        expect (lonloatHelper.longitudePlausible(180)).toBeTruthy();
        expect (lonloatHelper.longitudePlausible(-180.1)).toBeFalsy();
        expect (lonloatHelper.longitudePlausible(180.1)).toBeFalsy();


    })
})
