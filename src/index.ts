import {LocationPicker} from "./location-picker";
import './style.css';
export * from './location-picker';


const locationPicker = new LocationPicker('body');

locationPicker.addEventListener('BROWSER_GEOLOCATED',(pos)=> {

    console.log('pos', pos.detail.msg);


});
locationPicker.addEventListener('MAP_CENTERED_ON_LONLAT',(pos)=> {
    console.log('Lon Lat', pos.detail)
});
locationPicker.addEventListener('MAP_CENTERED_ON_ADDRESS',(pos)=> {
    console.log('Lon Lat', pos.detail)
});


locationPicker.addMarker(160,-37,'#123456');
