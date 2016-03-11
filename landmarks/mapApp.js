// mapApp.js

// set up map
var map;
var marker;
var myLat = 0, myLong = 0;
var infowindow;
//var me = new google.maps.LatLng(myLat, myLng);

/*
var myOptions = {
	center: me,
	zoom: 13, // larger zoom number, larger zoom
	mapTypeId: google.maps.MapTypeId.ROADMAP
};
*/

function initMap() {

	getLocation();

	var myOptions = {
		center: {lat: -34.397, lng: 150.644},
		zoom: 13, // larger zoom number, larger zoom
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	
	map = new google.maps.Map(document.getElementById('map'), myOptions);
		
	infowindow = new google.maps.InfoWindow();

	// gets user's location
	function getLocation() {
		if (navigator.geolocation) { // checks if navigator.geolocation is supported by browser
			navigator.geolocation.getCurrentPosition(function(position) {
					myLat = position.coords.latitude;
					myLong = position.coords.longitude;
					renderMap();
					getData(myLat,myLong);
				});
		} else {
			alert("Geolocation is not supported by your web browser. Sorry!");
		}
	}

	function renderMap() {
		me = new google.maps.LatLng(myLat, myLong);
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
}

function getData(latitude,longitude) {
	// send login, latitude, and longitude
	var username = "MARI_YOUNG";
	var parameters = "login="+username+"&lat="+myLat+"&lng="+myLong;
	var theData;
	console.log(parameters);

	var request = new XMLHttpRequest();
	request.open("POST","https://defense-in-derpth.herokuapp.com/sendLocation",true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send(parameters);

	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			raw = request.responseText;
			theData = JSON.parse(raw);
			printStuff(theData);
		}
	};

}

function printStuff(data) {

	// people
	console.log(data.people);

	for (i in data.people) {
		console.log(data.people[i].login+" lat: "+data.people[i].lat
					+" long:"+data.people[i].lng);

		// Create new markers
		person = new google.maps.LatLng(data.people[i].lat,data.people[i].lng);
		new_marker = new google.maps.Marker({
			position: person,
			title: data.people[i].login
		});
		new_marker.setMap(map);

		var new_infowindow;

		// Open info window on click of marker
		google.maps.event.addListener(new_marker, 'click', function() {
			new_infowindow[i].setContent(new_marker.title);
			new_infowindow[i].open(map, new_marker);
		});
	}

	// landmarks
	console.log(data.landmarks);

}





