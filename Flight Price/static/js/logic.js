//runs on page load
$(document).ready(function() {
    let url = "machineLearningData (1).csv";
    makeMap(url, -1);

    //event listener on dropdown change
    $("#timeFilter, #magFilter").change(function() {
        let url = url;
        let minMag = $('#magFilter').val();
        let vizText = $("#timeFilter option:selected").text();
        $('#vizTitle').text(`Earthquakes in the ${vizText}`);
        makeMap(url, minMag);
    });
});

function makeMap(url, minMag) {
    //clear map
    $('#mapParent').empty();
    $('#mapParent').append('<div style="height:700px" id="map"></div>');

    // Adding tile layer to the map
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
    });

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "satellite-streets-v11",
        accessToken: API_KEY
    });

    d3.csv(url).then(function(data) {
        console.log(data);

        var icons = {
            ori: L.ExtraMarkers.icon({
                icon: "ion-plane",
                iconColor: "white",
                markerColor: "green",
                shape: "circle"
            }),
            des: L.ExtraMarkers.icon({
                icon: "ion-plane",
                iconColor: "white",
                markerColor: "red",
                shape: "circle"
            }),
        };

        var origin_airport = "SEA" //input
        var destination_airport = "MIA" //input

        //var inputValue = inputElement.property("value");

        var or_lat = data.filter[origin_airport === data.Origin, data.Origin_Lat];
        //var or_long = data.filter[data.Origin == origin_airport, data.Origin_Long]
        //var de_lat = -data.loc[data.Origin == destination_airport, data.Origin_Lat].values[0]
        //var de_long = data.loc[data.Origin == destination_airport, data.Origin_Long].values[0]

        //console.log(data.Origin_Lat);

        //var orig_coords = or_lat + or_long
        //var dest_coords = de_lat + de_long

        //create markers and heatmap

        var markersOrigin = L.marker([+data[0].Origin_Lat, +data[0].Origin_Long], {
            icon: icons.ori,
        }).bindPopup(`<h3>Origin</h3><hr><h5>${data[1315].Origin}</h5><br>${data[0].Origin_Airport}</h5>`);

        var markersDest = L.marker([+data[1315].Origin_Lat, +data[1315].Origin_Long], {
            icon: icons.des,
        }).bindPopup(`<h3>Destination</h3><hr><h5>${data[1315].Origin}</h5><br><h5>${data[1315].Origin_Airport}</h5>`);

        //console.log(markers)



        // Create a baseMaps object to contain the streetmap and darkmap
        var baseMaps = {
            "Street": streetmap,
            "Dark": darkmap,
            "Light": lightmap,
            "Satellite": satellitemap,
            "Outdoors": outdoors
        };

        // Create an overlayMaps object here to contain the "State Population" and "City Population" layers
        var overlayMaps = {
            "Origin": markersOrigin,
            "Destination": markersDest
        };

        // Creating map object
        var myMap = L.map("map", {
            center: [39.8283, -98.5795],
            zoom: 4,
            layers: [streetmap, markersOrigin, markersDest],
            fullscreenControl: true,
        });

        // Create a layer control, containing our baseMaps and overlayMaps, and add them to the map
        myMap.addLayer(markers);
        L.control.layers(baseMaps, overlayMaps).addTo(myMap);
    })
};