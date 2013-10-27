// Global Variables
var directionsService = new google.maps.DirectionsService();
var mapVar;
var markerArray = [];
var sv = new google.maps.StreetViewService();
var panorama;
var bearings = [];
var geoStreet = [];
google.maps.visualRefresh=true;

// Initialize map and displays, then call calcRoute function
function initialize()
{
    directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
    var toronto = new google.maps.LatLng(43.652527, -79.381961);
    var mapOptions=
        {
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          center: toronto
        }

    mapVar = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    panorama = new google.maps.StreetViewPanorama(document.getElementById("pano"));
    directionsDisplay.setMap(mapVar);
    directionsDisplay.setPanel(document.getElementById('directions_box'));

    calcRoute();
}

// calcRoute makes request for directions, then displays directions in direction div and calls showMarkers function to add markers
function calcRoute()
{

    var request =
      {
        origin: route_start,
        destination: route_end,
        travelMode: google.maps.DirectionsTravelMode.WALKING
      };

    directionsService.route
      (
          request, function(response, status)
          {
            if (status == google.maps.DirectionsStatus.OK)
              {
                directionsDisplay.setDirections(response);
                showMarkers(response);
              }
          }
      );
};

// showMarkers renders polyline along route path, adds marker at 200m intervals along polyline, and includes two event listeners for markers:  mouseover to view streetview, and click to view comments on selected street
function showMarkers (directionResult)
{
    var path = directionResult.routes[0].overview_path;
    polyline = new google.maps.Polyline
      ({
         path: path,
         strokeColor: "#FF0000",
         strokeOpacity: 0.8,
         strokeWeight: 2
       });

    var polyPoints = polyline.GetPointsAtDistance(200);
    var numPoints = 0;
    markerArray = [];
    var route = directionResult.routes[0];
    markerArray[numPoints] = route.legs[0].start_location;
    numPoints++;

    for (var i = 0; i < polyPoints.length; i++)
    {
      markerArray[numPoints] = polyPoints[i];
      numPoints++;
    }

    var numLegs = route.legs.length;
    var numSteps = route.legs[numLegs-1].steps.length;
    markerArray[numPoints] = route.legs[numLegs-1].end_location;
    numPoints++;

    for (var i = 0; i < markerArray.length; i++)
          {
                  var marker = new google.maps.Marker
                  ({
                    position: markerArray[i],
                    map: mapVar
                  });

            marker.myIndex = i;

            if (i < markerArray.length-1)
            {
              bearings[i] = getBearing(markerArray[i]['lb'], markerArray[i]['mb'], markerArray[i+1]['lb'], markerArray[i+1]['mb']);
            }
            else
            {
              if (i > 0)
              {
                bearings[i] = bearings[i-1];
              }
              else
              {
                bearings[i] = 0;
              }
            }
            google.maps.event.addListener(marker, 'mouseover', function(event)
                  {
                      sv.getPanoramaByLocation(event.latLng, 50, processSVData);
                      panorama.setPov
                      ({
                        heading: bearings[this.myIndex],
                        pitch: 0
                      });
                      panorama.setVisible(true);
                  });

            google.maps.event.addListener(marker, 'click', function(event)

                  {
                    getPointData(event.latLng);
                  });
          };
};

// getPointData sends request and handles response from Google for reverse geocoding (co-ordinates to street address) of marker co-ordinates, in order to identify street name.
function getPointData(point)
{
      var geoUrl = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + point.lat() +"," + point.lng()+ "&sensor=false";

      $.ajax
          ({
            url: geoUrl,
            cache: false
          })

      .done(function( json )
          {
              geoStreet = json.results[0].address_components[1].long_name;
              var request = $.ajax
                    ({
                        url: "/walks/search",
                        type: "GET",
                        data: { street_name : geoStreet },
                    });
              request.done(function( msg )
                    {
                      $( "#comment_box" ).html( msg );
                    });
          });
}

// processSVData renders streetview in "pano" div
function processSVData(data, status)
{
    if (status == google.maps.StreetViewStatus.OK)

      {
          var markerPanoID = data.location.pano;
          panorama.setPano(markerPanoID);

      }

    else
      {
          alert('Sorry, no views are currently available for this location.');
      }
};

// getBearing calculates direction to next marker, in order to orient streetview point-of-view in direction of the walk
function getBearing(lt1, ln1, lt2, ln2)
{
  var lat1 = toRad(lt1);
  var lon1 = toRad(ln1);
  var lat2 = toRad(lt2);
  var lon2 = toRad(ln2);
  var angle = - Math.atan2( Math.sin( lon1 - lon2 ) * Math.cos( lat2 ), Math.cos( lat1 ) * Math.sin( lat2 ) - Math.sin( lat1 ) * Math.cos( lat2 ) * Math.cos( lon1 - lon2 ) );
  if ( angle < 0.0 ) angle  += Math.PI * 2.0;
  angle = angle * 180.0 / Math.PI;
  return parseFloat(angle.toFixed(1));
}

// toRad converts degrees to radians, used for bearing calculation
function toRad(Value)
{
  return Value * Math.PI/180;
}

google.maps.event.addDomListener(window, 'load', initialize);
