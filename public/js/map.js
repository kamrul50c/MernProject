// Get your own API Key on https://myprojects.geoapify.com
var myAPIKey = mapToken;

var map = new maplibregl.Map({
    container: 'my-map',
    style: `https://maps.geoapify.com/v1/styles/klokantech-basic/style.json?apiKey=${myAPIKey}`,
    
    center: coordinates, // Set initial map center [lng, lat]
    zoom: 9 // Set initial zoom level
});

map.addControl(new maplibregl.NavigationControl());

// Create a popup
const popup = new maplibregl.Popup()
    .setHTML("<h3>Location</h3><p>Your specific location description here.</p>"); // Customize the content
// Add a marker to the map
const marker = new maplibregl.Marker({color:"red"})
    .setLngLat(coordinates) // Set marker position [lng, lat]
    .setPopup(popup) // Bind the popup to the marker
    .addTo(map);

    marker.bindPopup("location").openPopup()