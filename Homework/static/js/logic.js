// function
function createMap(earthquakes) {

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    var baseMaps = {
        "Light Map": lightmap
    };

    var overlayMaps = {
        "Earthquakes": earthquakes
    };

    var Allmap = L.map("map", {
        center: [38.6270, -90.1994],
        zoom: 5,
        layers: [lightmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
    }).addTo(Allmap);


    let legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');
        var grades = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
      var color = ["#00ccbc","#90eb9d","#f9d057","#f29e2e","#e76818","#d7191c"];
  
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<p style="margin-left: 15px">' + '<i style="background:' + color[i] + ' "></i>' + '&nbsp;&nbsp;' + grades[i]+ '<\p>';
        }
  
        return div;
    };
    legend.addTo(Allmap);

}


function createMarkers(circles) {

    var features = circles.features;

    var markers = [];

    for (var index = 0; index < features.length; index++) {
        var feature = features[index];



        function chooseColor(feature) {
            var mag = feature.properties.mag;
            if (mag >= 6.0) {
                return "darkred";
            }
            else if (mag >= 5.0) {
                return "red";
            }
            else if (mag >= 4.0) {
                return "orange";
            }
            else if (mag >= 3.0) {
                return "yellow";
            }
            else if (mag >= 2.0) {
                return "green";
            }
            else {
                return "lightgreen";
            }
        };


        var marker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], { color: chooseColor(feature) })

            .bindPopup("<h3>Location: " + feature.properties.place + "<h3><h3>Magnitude: " + feature.properties.mag + "<h3>Felt: " +
                feature.properties.felt + "<h3>Coordinates: " + feature.geometry.coordinates[1] + ", " + feature.geometry.coordinates[0] +
                "<br><a href='" + feature.properties.url + "'>More info</a>")

            .setRadius(Math.round(feature.properties.mag) * 10)


        markers.push(marker);
    }

    createMap(L.layerGroup(markers), L.layerGroup(markers));

}

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", createMarkers);
