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
			
			for (i = 0; i < text.length; i++) {
				theElem.innerHTML += "<p>" + text[i].content + " " + text[i].username + "</p>";
			}
		}
	}

	request.send(null);

}