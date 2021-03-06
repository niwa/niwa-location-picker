# NIWA Location Picker




![Alt text](./LocationFinder2.png?raw=true "Test")

After install add the styles ````styles.css```` found in the src folder to your project.

Create a new instance of the location picker. The country code is optional.
```angular2
const picker = new LocationPicker('nz');

```
## Events

To subscribe to an event triggered by the location picker follow this general idea and replace the event with the one that you are interested in.

```angular2

const locationPicker = new LocationPicker('body');

locationPicker.addEventListener('BROWSER_GEOLOCATED',(pos)=> {
    console.log('pos', pos)
})
```
##### BROWSER_GEOLOCATED

This event is being triggered when the Browser API (HTML5) was used to find the location of the user. 
This can happen at the beginning when the page loads or the clicks on the geolocate button.

##### MAP_CENTERED_ON_LONLAT

This event is being triggered after a succesfull search for the entered Longitude / Latitude in the search field.

##### MAP_CENTERED_ON_ADDRESS

This event is being triggered after a succesfull search for the entered place / address.

##### CLICKED_ON_LONLAT
This event is being triggered after clicking on the map. It will return the lon/lat for the click event. 
## Adding / removing markers

### addMarker

To add a marker to the map execute the addMarker method. The method returns an object of class 'Feature' (Openlayers). 
If you want to delete this marker later on you will need to keep track of it (e.g. sticking it into an array)


```angular2
addMarker(lon, lat, url[optional])
```



````angular2
const locationPicker = new LocationPicker('body');
const marker = locationPicker.addMarker(174.763336, -40.848461, '#ff0000');
````

The 'addMarker' method also has a third parameter url where a url to an icon can be set. 

```angular2
const locationPicker = new LocationPicker('body');
const marker = locationPicker.addMarker(174.763336, -40.848461, '#ff0000','/assts/icon.png');
```

When an URL is provided it overrules the color parameter.
### removeMarker

To remove a marker from the map hand in the marker to the removeMarker method. The marker needs to be an Openlayers Feature object.

(See 'addMarker' above).
````angular2

locationPicker.removeMarker(Marker)

````
 
### fitFeaturesIntoView

This method expects an array of Features / Markers. It will then fit the view to show all markers  

### removeAllMarkers 

This method removes all markers on the map.
### getGeolocation
Return an Observable of type LonLat

#### Project setup

The project was set up with help of these guidelines 
https://webpack.js.org/guides/typescript/

The geolacting functionality is provided by Nominatim 
https://wiki.openstreetmap.org/wiki/Nominatim

### Gotcha's
Since the update to openlayers 6, the map container must now have a height defined to render.
This is set to 200px by default, but can be overridden by passing a numeric height value to the constructor, e.g.

```angular2
const locationPicker = new LocationPicker('body', { height: 350 });
```

### Index.ts Cheat sheet
This is for development only.

```angular2
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


```
