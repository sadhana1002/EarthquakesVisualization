// Store our API endpoint inside queryUrl
// Create our map, giving it the streetmap and earthquakes layers to display on load


var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function onEachFeature(feature, layer) {
    layer.bindPopup("<h4>" + feature.properties.title   +
      "</h4><hr><p>Status : " + feature.properties.status+ "</p>");
}

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
// Once we get a response, send the data.features object to the createFeatures function
createFeatures(data.features);
});

function createFeatures(earthquakeData) {

// Define a function we want to run once for each feature in the features array
// Give each feature a popup describing the place and time of the earthquake


var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

// Create a GeoJSON layer containing the features array on the earthquakeData object
// Run the onEachFeature function once for each piece of data in the array
var earthquakes = L.geoJSON(earthquakeData, {
  onEachFeature: onEachFeature,
  pointToLayer: function (feature, latlng) {
   // console.log(`Mag - ${ feature["properties"]["mag"]} `);
    return L.circleMarker(latlng, {
        radius: feature["properties"]["mag"]*2,
        fillColor: getColor(feature["properties"]["mag"]),
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    });
}
  
});

// Sending our earthquakes layer to the createMap function
createMap(earthquakes);
}

function getColor(mag){
   
    if(mag<1){
        return "limegreen";
    }else if(mag<2.5){
        return "green";
    }else if(mag<4.5){
        return "yellow";
    }else if(mag<8){
        return "orange";
    }else{
        return "red";
    }

    return "red";
}

function createMap(earthquakes) {








console.log(tectonics)
// Define streetmap and darkmap layers
var darkmap = L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=${mapbox_key}`);

var outdoors = L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=${mapbox_key}`);

var satellite = L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=${mapbox_key}`);

// Define a baseMaps object to hold our base layers
var baseMaps = {
  "Dark Map": darkmap,
  "Outdoor Map": outdoors,
  "Satellite":satellite
};
var tectonics = new L.LayerGroup();
// Create overlay object to hold our overlay layer
var overlayMaps = {
  "Earthquakes": earthquakes,
  "Techtonics": tectonics
};

var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers:[outdoors,earthquakes,tectonics]
  });

  var tectonics_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

  d3.json(tectonics_url,function(data){
      L.geoJSON(data,{
          color:"red",
          weight:2
      }).addTo(tectonics);
  });

// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: true
}).addTo(myMap);
}
