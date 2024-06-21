// Create the tile layer that will be the background of our map
let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


let myMap = L.map("map", {
    center: [19, -99],
    zoom: 3
});

basemap.addTo(myMap);

url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Our style object
function magRadius(quake) {
    return quake * 6
};

function mapStyle(x) {
    return {
        fillcolor: chooseColor(x.geometry.coordinates[2]),
        color: chooseColor(x.geometry.coordinates[2]),
        fillOpacity: 0.5,
        radius: magRadius(x.properties.mag),
        weight: 1.5
    };
}

// The function that will determine the color of a marker based on the magnitude
function chooseColor(depth) {
    if (depth > 90) return "#FF0000";
    else if (depth > 70) return "#FF4500";
    else if (depth > 50) return "#FFA500";
    else if (depth > 30) return "#FFD700";
    else if (depth > 10) return "#FFFF00";
    else return "#00FF00"
};


let legend = L.control({
    position: "bottomright"
});
legend.onAdd = function () {

    let div = L.DomUtil.create('div', 'info legend');
    // labels = ['<strong>depth</strong>'];
    categories = [-10, 10, 30, 50, 70, 90];
    colors = ['#FF0000', '#FF4500', '#FFA500', '#FFD700', '#FFFF00', '#00FF00']


    for (var i = 0; i < categories.length; i++) {
        div.innerHTML += '<i style="background:' + colors[i] + '"></i> '
            + categories[i] + (categories[i + 1] ? '&ndash;' + categories[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(myMap);

// Getting our GeoJSON data
d3.json(url).then(function (data) {
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
        // Passing in our style object
        pointToLayer: function (x, latlng) {
            return new L.CircleMarker(latlng, {
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.place);
        },
        style: mapStyle
    }).addTo(myMap);
});

