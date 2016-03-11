// mapApp.js

// set up map
var map;
var marker;
var myLat = 0, myLng = 0;

var request = new XMLHttpRequest();
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
	zoom: 13, // larger zoom number, larger zoom
	center: me,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
  		center: {lat: -34.397, lng: 150.644},
  		zoom: 13
	});
	getLocation();

}

var infowindow = new google.maps.InfoWindow();

// gets user's location
function getLocation() {
	if (navigator.geolocation) { // checks if navigator.geolocation is supported by browser
		navigator.geolocation.getCurrentPosition(function(position) {
				myLat = position.coords.latitude;
				myLng = position.coords.longitude;
				//elem = document.getElementById("info");
				//elem.innerHTML = "<h1>You are in " + myLat + ", " + myLng + "</h1>";
				renderMap();
				console.log("lat: " + myLat + " long: " + myLng);
			});
	}
	else {
		alert("Geolocation is not supported by your web browser. Sorry!");
	}
}

function renderMap() {
	me = new google.maps.LatLng(myLat, myLng);
	map.panTo(me); // Update map and go there...

	// Create a marker
	marker = new google.maps.Marker({
		position: me,
		title: "Here I Am!"
	});
	marker.setMap(map);
		
	// Open info window on click of marker
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});
}