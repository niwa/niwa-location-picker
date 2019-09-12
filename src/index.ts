import {LocationPicker} from "./location-picker";
import './style.css';

const locationPicker = new LocationPicker('body');

locationPicker.addEventListener('BROWSER_GEOLOCATED',(pos)=> {



});
locationPicker.addEventListener('MAP_CENTERED_ON_LONLAT',(pos)=> {
});
locationPicker.addEventListener('MAP_CENTERED_ON_ADDRESS',(pos)=> {
});

locationPicker.addEventListener('CLICKED_ON_LONLAT',(pos)=> {
});

