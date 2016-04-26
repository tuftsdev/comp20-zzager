// mapApp.js

// Assignment 2 for Tufts Comp 20

// Script to load the web program that displys a user, other users,
// and nearby historical landmarks.

// by Zach Zager

Number.prototype.toRad = function() {
	return this * Math.PI / 180;
}

var map;
var marker;
username = "Zach";
myLat = 0, myLong = 0;
var infowindow;
closestLandmark = {};
closestLandmark.name = "";
closestLandmark.distance = 1;
closestLandmark.lat = 0;
closestLandmark.lng = 0;

function initMap() {
	getLocation(); // gets location of user
	var myOptions = {
		center: {lat: -34.397, lng: 150.644},
		zoom: 13, // larger zoom number, larger zoom
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	// initializes the map
	map = new google.maps.Map(document.getElementById('map'), myOptions);

	function getLocation() { // gets user's location
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

// send login, latitude, and longitude
function getData(latitude,longitude) {
	var parameters = "login="+username+"&lat="+myLat+"&lng="+myLong;
	var request = new XMLHttpRequest();
	request.open("POST","https://desolate-cove-62070.herokuapp.com/sendLocation",true);
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
	marker = new google.maps.Marker({ // Create a marker for me
		position: me,
		title: "<div id='infowindow'><h2>"+username+"</h2><h3>Current Location</h3>"+
				"The nearest historical landmark \""
				+closestLandmark.name+"\"<br /> is " 
				+closestLandmark.distance.toFixed(2)+" miles away</div>"
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
    	strokeWeight: 5
  	});
  	path.setMap(map);
}

// displays other users on the map
// shout out to Wouter Florijn for the help on Stack Overflow
// (http://stackoverflow.com/questions/29765720/google-maps-marker-loop-in-javascript)
function showPeople(people) {
	peopleImage = { // people marker icon
		url: 'http://icons.iconarchive.com/icons/umut-pulat/tulliana-2/128/laptop-icon.png',
		scaledSize: new google.maps.Size(50, 50)
	};

	for (i in people) { // loops through all elements of people
		if (people[i].login !== username) { // skips user
			console.log(people[i]);
			person = new google.maps.LatLng(people[i].lat,people[i].lng);
			calcDistance(people[i].lat,people[i].lng,"person");
			
			markers = new google.maps.Marker({ // defines marker, sets details
				position: person,
				title: "<div id='infowindow'>"+people[i].login+
						"<br />Distance from me: "+personMileDistance.toFixed(2)+" miles</div>",
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
		lm_name = landmarks[i].properties.Location_Name;
		lm = landmarks[i].properties.Details;
		lm_coor = landmarks[i].geometry.coordinates;	
		landmark = new google.maps.LatLng(lm_coor[1],lm_coor[0]);
		markers = new google.maps.Marker({
			position: landmark,
			title: lm,
			icon: landmarkImage
		});
		markers.setMap(map);
		landmarkDistanceHandling();

		// Open info window on click of marker
		google.maps.event.addListener(markers, 'click', function() {
			infowindow.setContent(this.title);
			infowindow.open(map,this);
		});
	}
}

// deals with everything distance related
function landmarkDistanceHandling(){
	calcDistance(lm_coor[1],lm_coor[0],"landmark");
	// find closest distance/landmark
	if (landmarkMileDistance < closestLandmark.distance) {
		closestLandmark.distance = landmarkMileDistance;
		closestLandmark.name = lm_name;
		closestLandmark.lat = lm_coor[1];
		closestLandmark.lng = lm_coor[0];
	}
}

// finds distance between an inputted landmark and me.
// both are objects with "lat" and "lng" keys.
// shout out to talkol on Stack Overflow for the guidance.
// (http://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript)
function calcDistance(lat,lng,obj) {
	var R = 6371; // km 

	lat = Number(lat);
	lng = Number(lng);
	
	// latitude difference
	var x1 = lat-myLat;
	var dLat = x1.toRad();

	// longitude difference
	var x2 = lng-myLong;
	var dLon = x2.toRad();

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
			Math.cos(myLat.toRad()) * Math.cos(lat.toRad()) 
			* Math.sin(dLon/2) * Math.sin(dLon/2);  
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var kmDistance = R * c;

	// convert from KM to miles
	// separates landmark and person distances
	if (obj === "landmark") {
		landmarkMileDistance = kmDistance * 0.621371;
	} else if (obj === "person") {
		personMileDistance = kmDistance * 0.621371;
	}
}
