// Your JavaScript goes here...

request = new XMLHttpRequest();

function parse() {

	request.open("GET","https://messagehub.herokuapp.com/messages.json",true);

	request.onreadystatechange = function() {

		if (request.readyState == 4 && request.status == 200) {
			data = request.responseText;
			text = JSON.parse(data);
			theElem = document.getElementById("messages");
			
			for (i = 0; i < text.length; i++) {
				theElem.innerHTML += "<p><span class='firstText'>" + 
									text[i].content +
									"</span><span class='secondText'> " + 
									text[i].username + "</p>";
			}
		}
	}

	request.send(null);

}