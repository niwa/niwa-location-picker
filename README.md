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
#### BROWSER_GEOLOCATED
This event is being triggered when the Browser API (HTML5) was used to find the location of the user. 
This can happen at the beginning when the page loads or the clicks on the geolocate button.

 




### Project setup
The project was set up with help of these guidelines 
https://webpack.js.org/guides/typescript/

