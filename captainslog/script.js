// script.js

// All displayed messages must be preceded with a human readable timestamp 
// (e.g., "Sat Jul 23 02:16:57 2005", Sun Mar 22 2015 16:05:32 GMT-0400 (EDT)")
// A space followed by a hyphen followed by a space must follow the timestamp. 
// Example: Sat Jul 23 02:16:57 2005 - Hello all!

var counter = 0;

$(document).ready(function(){

	elem = $("#log");
	elem2 = $("#msg");


	$("#msg").on("keydown",function(key){
		
    	if (key.keyCode == 13) { // Enter (keycode:13) is pressed
    		today = new Date();
    		entry = today+" - "+this.value;
    		localStorage.setItem(counter,entry);
    		this.value = "";
    		$("#log").append("<p>"+localStorage[counter]+"</p>");
    		console.log(localStorage[counter]);
    		counter++;
    	}
	});

});






