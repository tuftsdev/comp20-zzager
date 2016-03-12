// mapApp.js

// set up map
var map;
var marker;
var myLat = 0, myLong = 0;
var infowindow;
var people_infowindow;
var landmark_infowindow;
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

	// people
	showPeople(data.people);

	// landmarks
	showLandmarks(data.landmarks);
}

function showPeople(people) {

	peopleImage = { // people marker icon
		url: 'http://icons.iconarchive.com/icons/umut-pulat/tulliana-2/128/laptop-icon.png',
		scaledSize: new google.maps.Size(50, 50)
	};

	for (i in people) {
		console.log(people[i].login+" lat: "+people[i].lat+" long:"+people[i].lng);

		if (people[i].login !== username) {
			person = new google.maps.LatLng(people[i].lat,people[i].lng);
			people_marker = new google.maps.Marker({
				position: person,
				title: people[i].login,
				icon: peopleImage
			});
			people_marker.setMap(map);
/*
			// Open info window on click of marker
			google.maps.event.addListener(people_marker, 'click', function() {
				people_infowindow.setContent(people_marker.title);
				people_infowindow.open(map,people_marker);
			});*/
		}
	}
}

function showLandmarks(landmarks) {

	landmarkImage = { // landmark marker icon
		url: 'https://d30y9cdsu7xlg0.cloudfront.net/png/174628-200.png',
		scaledSize: new google.maps.Size(40, 40)
	};

	var landmarker_list;

	for (i in landmarks) {
		lm = landmarks[i].properties.Location_Name;
		lm_coor = landmarks[i].geometry.coordinates;
		console.log(lm+" lat: "+lm_coor[1]+" long:"+lm_coor[0]);
	
		landmark = new google.maps.LatLng(lm_coor[1],lm_coor[0]);
		landmarker = new google.maps.Marker({
			position: landmark,
			title: lm,
			icon: landmarkImage
		});
		landmarker.setMap(map);
/*
		// Open info window on click of marker
		google.maps.event.addListener(landmarker[i], 'click', function() {
			landmark_infowindow[i].setContent(landmarker.title);
			landmark_infowindow[i].open(map,landmarker);
		});*/
	}

}





