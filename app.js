$.getJSON('./node_modules/datamaps/src/js/data/world.json', function(countries) {

var map = new Datamap({
  element: document.getElementById("container"),
  fills: {
      'selected': 'white',
      'default': 'rgba(0,0,0,0.7)',
      defaultFill: 'transparent'
  },
  scope: 'world',
  setProjection: function(element) {
    
    var projection = d3.geo.equirectangular()
      .center([0, 0])
      .rotate([0, 0])
      .scale(170);

    var path = d3.geo.path()
      .projection(projection);
    return {path: path, projection: projection}
  },
  geographyConfig: {
    popupOnHover: false,
    highlightOnHover: false,
    borderColor: 'none',
  },
  bubblesConfig: {
        fillKey: 'black',
        borderWidth: 0,
        popupOnHover: true,
        popupTemplate: function(geography, data) {
          return '<div class="hoverinfo">' + data.name + '</div>';
        },
        fillOpacity: 1,
        animate: true,
        highlightOnHover: false,
        exitDelay: 0,
        key: JSON.stringify
    }
  });


  var points = [];

  for (lat = -54; lat < 85; lat += 3) { 

    for (lon = -159; lon < 181; lon += 3) { 

      if (data = getPointData(lat, lon, countries)) {

        points.push({
            radius: 4,
            latitude: lat,
            longitude: lon,
            name: data,
            fillKey: 'default'

        });

      }

    }

  }

 var from = {
    radius: 4,
    latitude: 57,
    longitude: 24,
    fillKey: 'selected',
    name: 'Estonia'
  }

 var to = {
    radius: 4,
    latitude: 15,
    longitude: 102,
    fillKey: 'selected',
    name: 'Thailand'
  }

  points.push(from);
  points.push(to);
  
  map.bubbles(points);

  var arcs = [];

  arcs.push({
    origin: from,
    destination: to,
  });

  map.arc(arcs, {
    strokeWidth: 2,
    strokeColor: 'white',
    arcSharpness: 1.2,
    greatArc: false
  });


});



function getPointData(lat, lon, countries) {

    var data = false;

    countries.features.forEach(function (country) {
  
      if (country.geometry.type == 'Polygon' && turf.inside(
        turf.point([lon,lat]), turf.polygon(
          country.geometry.coordinates
      ))) { 

        data = country.properties.name;  

      };

      if (country.geometry.type == 'MultiPolygon') {

        country.geometry.coordinates.forEach(function (polygon) {

          if(turf.inside(turf.point([lon,lat]), turf.polygon(polygon))) { 

            data = country.properties.name; 

          };

        });

      };

    });

    return data;

}



