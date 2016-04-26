// script.js
// Comp 20 - Lab 7
// Zach Zager

$(document).ready(function(){

	// prints the old contents of localStorage
	for (i = 0; i < localStorage.length; i++) {
		$("div#log").prepend("<p>"+localStorage[i]+"</p>");
	}

	$("#msg").on("keydown",function(key){ // key is pressed in the textbox
		
    	if (key.keyCode == 13) { // Enter (keycode:13) is pressed
    		entry = new Date()+" - "+this.value;
    		localStorage.setItem(localStorage.length,entry); // sets item in localStorage
    		this.value = ""; // clears input text box

    		// add most recent post to top of HTML section
    		$("div#log").prepend("<p>"+localStorage[localStorage.length-1]+"</p>");
    	}
	});

});






