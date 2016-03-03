// Your JavaScript goes here...

request = new XMLHttpRequest();

function parse() {

	request.open("GET","data.json",true);

	request.onreadystatechange = function() {
		console.log("Running");

		if (request.readyState == 4 && request.status == 200) {
			console.log("MING!");

			data = request.responseText;
			text = JSON.parse(data);
			theElem = document.getElementById("messages");
			theElem.innerHTML = "<h4>DATA: </h4>" + request.response;
		}
	}

	

	//theElem.innerHTML = JSON.parse(request.responseText);

	request.send(null);

}