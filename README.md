# NIWA Location Picker


This project is under development. Soon it will be a universal location picker following this
story on tracking https://tracking.niwa.co.nz/browse/TIDE-144.


To work on it, simply clone it and run 

````angular2
npm install
````

To start the development server:

```angular2
npm start
```


To run a build 
```angular2
npm run build
```

## Events

To subscribe to an event triggered by the location picker follow this general idea and replace the event iwth the one that you are interested in.

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


## Adding / removing markers

### addMarker

To add a marker to the map execute the addMarker method. The method returns an object of class 'Feature' (Openlayers). 
If you want to delete this marker later on you will need to keep track of it (e.g. sticking it into an array)

````angular2
const locationPicker = new LocationPicker('body');
const marker = locationPicker.addMarker(174.763336, -40.848461, '#ff0000');
````


### removeMarker

To remove a marker from the map hand in the marker to the removeMarker method. The marker needs to be an Openlayers Feature object.
(See 'addMarker' above).
 

````angular2

locationPicker.removeMarker(Marker)

````

#### Project setup

The project was set up with help of these guidelines 
https://webpack.js.org/guides/typescript/

The geolacting functionality is provided by Nominatim 
https://wiki.openstreetmap.org/wiki/Nominatim
