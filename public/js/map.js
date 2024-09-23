
          // Get your own API Key on https://myprojects.geoapify.com
          var myAPIKey = mapToken;
          var map = new maplibregl.Map({
              container: 'my-map',
              style: `https://maps.geoapify.com/v1/styles/klokantech-basic/style.json?apiKey=${myAPIKey}`,
              center: [0, 0], // Set initial map center [lng, lat]
              zoom: 2 // Set initial zoom level
          });
  
          map.addControl(new maplibregl.NavigationControl());
