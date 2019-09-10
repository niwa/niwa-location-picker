import {LocationPicker} from "./location-picker";
import './style.css';
export * from './location-picker';


const locationPicker = new LocationPicker('body');

locationPicker.addEventListener('BROWSER_GEOLOCATED',(pos)=> {
    console.log('pos', pos.detail.msg)
});
