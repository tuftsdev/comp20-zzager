// mapApp.js

// set up map
var map;
var marker;
myLat = 0, myLong = 0;
var infowindow;
closestLandmark = {};
closestLandmark.name = "";
closestLandmark.distance = 1;
closestLandmark.lat = 0;
closestLandmark.lng = 0;

function initMap() {

	getLocation();

	var myOptions = {
		center: {lat: -34.397, lng: 150.644},
		zoom: 13, // larger zoom number, larger zoom
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	
	map = new google.maps.Map(document.getElementById('map'), myOptions);

	// gets user's location
	function getLocation() {
		if (navigator.geolocation) { // checks if navigator.geolocation is supported by browser
			navigator.geolocation.getCurrentPosition(function(position) {
					myLat = position.coords.latitude;
					myLong = position.coords.longitude;
					getData(myLat,myLong);
				});
		} else {
			alert("Geolocation is not supported by your web browser. Sorry!");
		}
	}
}

function getData(latitude,longitude) {
	// send login, latitude, and longitude
	username = "MARI_YOUNG";
	var parameters = "login="+username+"&lat="+myLat+"&lng="+myLong;
	var theData;

	var request = new XMLHttpRequest();
	request.open("POST","https://defense-in-derpth.herokuapp.com/sendLocation",true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send(parameters);

	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			raw = request.responseText;
			theData = JSON.parse(raw);
			loadElements(theData);
		}
	};
}

//puts everything on the map
function loadElements(data) {
	showPeople(data.people); // people
	showLandmarks(data.landmarks); // landmarks
	renderMe(); // me (user)
}

// puts me on the map with a marker
function renderMe() {
	me = new google.maps.LatLng(myLat, myLong);
	map.panTo(me); // Update map and go there...

	// Create a marker
	marker = new google.maps.Marker({
		position: me,
		title: "<div id='infowindow'>"+closestLandmark.name+"<br /> is " 
				+closestLandmark.distance.toFixed(2)+" miles away </div>"
	});
	marker.setMap(map);
	infowindow = new google.maps.InfoWindow();
		
	// Open info window on click of marker
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});

	makePolyline(); // draws line to nearest landmark
}

// draws a line between me (the user) and the nearest landmark
function makePolyline() {

	var pathCoords = [
    	{lat: myLat, lng: myLong},
    	{lat: closestLandmark.lat, lng: closestLandmark.lng}
  	];

  	var path = new google.maps.Polyline({
    	path: pathCoords,
    	geodesic: true,
    	strokeColor: '#FF0000',
    	strokeOpacity: 1.0,
    	strokeWeight: 2
  	});

  	path.setMap(map);
}

// shout out to Wouter Florijn for the help on Stack Overflow
// (http://stackoverflow.com/questions/29765720/google-maps-marker-loop-in-javascript)
function showPeople(people) {

	peopleImage = { // people marker icon
		url: 'http://icons.iconarchive.com/icons/umut-pulat/tulliana-2/128/laptop-icon.png',
		scaledSize: new google.maps.Size(50, 50)
	};

	for (i in people) {
		if (people[i].login !== username) {
			person = new google.maps.LatLng(people[i].lat,people[i].lng);
			markers = new google.maps.Marker({
				position: person,
				title: people[i].login,
				icon: peopleImage
			});
			markers.setMap(map);

			// Open info window on click of marker
			google.maps.event.addListener(markers, 'click', function() {
				infowindow.setContent(this.title);
				infowindow.open(map,this);
			})
		}
	}
}

// places landmarks on the map
// NOTE: lm_coor[1]: is latitude, lm_coor[0] is longitude
function showLandmarks(landmarks) {

	landmarkImage = { // landmark marker icon
		url: 'https://d30y9cdsu7xlg0.cloudfront.net/png/174628-200.png',
		scaledSize: new google.maps.Size(40, 40)
	};

	for (i in landmarks) {
		lm = landmarks[i].properties.Location_Name;
		lm_coor = landmarks[i].geometry.coordinates;	
		landmark = new google.maps.LatLng(lm_coor[1],lm_coor[0]);
		markers = new google.maps.Marker({
			position: landmark,
			title: lm,
			icon: landmarkImage
		});
		markers.setMap(map);
		distanceHandling();

		// Open info window on click of marker
		google.maps.event.addListener(markers, 'click', function() {
			infowindow.setContent(this.title);
			infowindow.open(map,this);
		});
	}
}

// deals with everything distance related
function distanceHandling(){

	calcDistance(lm_coor[1],lm_coor[0]);

	// find closest distance/landmark
	if (mileDistance < closestLandmark.distance) {
		closestLandmark.distance = mileDistance;
		closestLandmark.name = lm;
		closestLandmark.lat = lm_coor[1];
		closestLandmark.lng = lm_coor[0];
	}
	console.log("closestLandmark: "+closestLandmark.name+" dist: "
				+closestLandmark.distance+" lat: "+
				closestLandmark.lat+" long: "+closestLandmark.lng);
}

// finds distance between an inputted landmark and me.
// both are objects with "lat" and "lng" keys.
// shout out to talkol on Stack Overflow for the guidance.
// (http://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript)
function calcDistance(landmarkLat,landmarkLng) {

	var R = 6371; // km 
	
	// latitude difference
	var x1 = landmarkLat-myLat;
	var dLat = x1.toRad();

	// longitude difference
	var x2 = landmarkLng-myLong;
	var dLon = x2.toRad();

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
			Math.cos(myLat.toRad()) * Math.cos(landmarkLat.toRad()) * 
			Math.sin(dLon/2) * Math.sin(dLon/2);  
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var kmDistance = R * c;

	// convert from KM to miles
	mileDistance = kmDistance * 0.621371;

	//console.log("distance: "+mileDistance);

}

Number.prototype.toRad = function() {
	return this * Math.PI / 180;
}



