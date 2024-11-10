
import L from 'leaflet';
import leafletImage from 'leaflet-image';

var map = L.map('map').setView([60.1699, 24.9384], 13);  // Centering on Helsinki

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map);

// Store the click event to get coordinates
map.on('click', function(event) {
var lat = event.latlng.lat;
var lon = event.latlng.lng;
console.log("Clicked coordinates: ", lat, lon);

// Create a 64x64 pixel bounding box centered on the clicked point
var bounds = L.latLngBounds(
    L.latLng(lat - 0.0008, lon - 0.0008), // Adjust these values to get the 64x64 size you want
    L.latLng(lat + 0.0008, lon + 0.0008)
);
           
// Capture the map area within the bounds as an image using leaflet-image.js
leafletImage(map, function(err, canvas) {
if (err) {
    console.error("Error capturing the map area:", err);
    return;
}

                
var nw = map.latLngToContainerPoint(bounds.getNorthWest());
var se = map.latLngToContainerPoint(bounds.getSouthEast());

var width = se.x - nw.x;
var height = se.y - nw.y;

// Luo uusi canvas rajatulle 64x64 pikselin alueelle
var croppedCanvas = document.createElement('canvas');
croppedCanvas.width = 64;
croppedCanvas.height = 64;
var ctx = croppedCanvas.getContext('2d');

// Piirrä bounding box -alue alkuperäisestä canvasista uuteen canvas-elementtiin
ctx.drawImage(canvas, nw.x, nw.y, width, height, 0, 0, 64, 64);

// Muunna rajattu kuva base64-koodatuksi stringiksi
var imgData = croppedCanvas.toDataURL('image/png');

// Send the image data to the backend for prediction
fetch('http://localhost:5000/predict', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        image: imgData })
})
.then(response => response.json())
.then(data => {
    console.log('Predicted type:', data.prediction);
    alert('Type:\n' + data.prediction);
})
.catch(error => console.error('Error:', error));
});
});