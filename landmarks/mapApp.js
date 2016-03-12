// mapApp.js

// set up map
var map;
var marker;
myLat = 0, myLong = 0;
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
			title: "I am here."
		});
		marker.setMap(map);

		var infowindow = new google.maps.InfoWindow();
			
		// Open info window on click of marker
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(marker.title);
			infowindow.open(map, marker);
		});
	}
}

function getData(latitude,longitude) {
	// send login, latitude, and longitude
	username = "MARI_YOUNG";
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
	showPeople(data.people); // people
	showLandmarks(data.landmarks); // landmarks
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

			var people_infowindow = new google.maps.InfoWindow();

			// Open info window on click of marker
			google.maps.event.addListener(markers, 'click', function() {
				people_infowindow.setContent(this.title);
				people_infowindow.open(map,this);
			})
		}
	}
	console.log(markers);
}

function showLandmarks(landmarks) {

	landmarkImage = { // landmark marker icon
		url: 'https://d30y9cdsu7xlg0.cloudfront.net/png/174628-200.png',
		scaledSize: new google.maps.Size(40, 40)
	};

	console.log(myLat+" "+myLong);

	landmark_infowindow = new google.maps.InfoWindow();

	for (i in landmarks) {
		lm = landmarks[i].properties.Location_Name;
		lm_coor = landmarks[i].geometry.coordinates;
		console.log(lm+" lat: "+lm_coor[1]+" long:"+lm_coor[0]);
	
		landmark = new google.maps.LatLng(lm_coor[1],lm_coor[0]);
		markers = new google.maps.Marker({
			position: landmark,
			title: lm,
			icon: landmarkImage
		});
		markers.setMap(map);

		// Open info window on click of marker
		google.maps.event.addListener(markers, 'click', function() {
			landmark_infowindow.setContent(this.title);
			landmark_infowindow.open(map,this);
		});
	}

}





