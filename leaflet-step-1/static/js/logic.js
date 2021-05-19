var myMap;
var tokenVar = "ADD YOUR TOKEN HERE"
var dataLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(dataLink, function (data) {

    function createCircleMarker(feature, latlng) {
        let options = {
            radius: feature.properties.mag * 5,
            fillColor: chooseColor(feature.properties.mag),
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.5
        }
        return L.circleMarker(latlng, options);
    }


    var earthQuakes = L.geoJSON(data, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Title:" + feature.properties.title + "<br> Magnitude: " + feature.properties.mag + "<br> Time: " + new Date(feature.properties.time));
        },
        pointToLayer: createCircleMarker

    });

    createMap(earthQuakes);

});

function createMap(earthQuakes) {

    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        maxZoom: 18,
        id: "mapbox/light-v10",
        accessToken: tokenVar
    });

    // tectonic plates / fault line
    var tplateLayer = new L.LayerGroup();

    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
        function (platedata) {
            L.geoJson(platedata, {
                color: "orange",
                weight: 2
            })
                .addTo(tplateLayer);
        });

    myMap = L.map("map", {
        center: [
            35.0, -95.7128906
        ],
        zoom: 5,
        layers: [satellite, tplateLayer, earthQuakes]
    });

    var info = L.control({
        position: "bottomright"
    });

    info.onAdd = function () {
        var div = L.DomUtil.create("div", "legend");
        return div;
    }

    info.addTo(myMap);

    document.querySelector(".legend").innerHTML = buildLegend();
}

function chooseColor(mag) {
    switch (true) {
        case (mag < 1):
            return "chartreuse";
        case (mag < 2):
            return "greenyellow";
        case (mag < 3):
            return "pink";
        case (mag < 4):
            return "blue";
        case (mag < 5):
            return "purple";
        default:
            return "red";
    };
}

function buildLegend() {
    var legendInfo = [{
        limit: "0-1",
        color: "chartreuse"
    }, {
        limit: "1-2",
        color: "greenyellow"
    }, {
        limit: "2-3",
        color: "pink"
    }, {
        limit: "3-4",
        color: "blue"
    }, {
        limit: "4-5",
        color: "purple"
    }, {
        limit: "5+",
        color: "red"
    }];

    var header = "<h3>Magnitude</h3><hr>";

    var strng = "";

    for (i = 0; i < legendInfo.length; i++) {
        strng += "<p style = \"background-color: " + legendInfo[i].color + "\">" + legendInfo[i].limit + "</p> ";
    }
    return header + strng;
}