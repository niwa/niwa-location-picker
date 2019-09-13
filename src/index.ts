export * from './location-picker';
import {LocationPicker} from "./location-picker";
import './style.css';

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

locationPicker.addEventListener('CLICKED_ON_LONLAT',(pos)=> {
    console.log('Lon Lat', pos.detail)
});
locationPicker.findLocation('Berlin');

