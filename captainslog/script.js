// script.js

// All displayed messages must be preceded with a human readable timestamp 
// (e.g., "Sat Jul 23 02:16:57 2005", Sun Mar 22 2015 16:05:32 GMT-0400 (EDT)")
// A space followed by a hyphen followed by a space must follow the timestamp. 
// Example: Sat Jul 23 02:16:57 2005 - Hello all!

$(document).ready(function(){
    $("#log").html("hi there");
});

var today = new Date();

today += " - Hello all!"

console.log(today);