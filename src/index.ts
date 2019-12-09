export * from './location-picker';

import {LocationPicker} from "./location-picker";
import './style.css';

const locationPicker = new LocationPicker('body');

locationPicker.addEventListener('BROWSER_GEOLOCATED', (pos) => {

    console.log('pos', pos.detail.msg);


});
locationPicker.addEventListener('MAP_CENTERED_ON_LONLAT', (pos) => {
    console.log('Lon Lat', pos.detail)
});
locationPicker.addEventListener('MAP_CENTERED_ON_ADDRESS', (pos) => {
    console.log('Lon Lat', pos.detail)
});


const marker1 = locationPicker.addMarker(160, -37, '#ff0000');
const marker2 = locationPicker.addMarker(120, -27, '#00ff00');
const marker3 = locationPicker.addMarker(160, -27, '#0000ff');
const marker4 = locationPicker.addMarker(120, -37, '#00ffff');

setTimeout(()=> {
    locationPicker.fitFeaturesIntoView([marker1, marker2, marker3, marker4])
}, 500)


setTimeout(()=> {
    locationPicker.removeAllMarkers();
}, 7000)
