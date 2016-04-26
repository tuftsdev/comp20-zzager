README.md

COMP 20: Web Programming

Lab: Messages

Files:

data.json

index.html

lab.js

style.css


This web app can parse and print JSON files stored locally. It CANNOT do the same for JSON files on the web because of the same-origin policy. When it attempts to do so the Chrome Developer Tools state: "XMLHttpRequest cannot load https://messagehub.herokuapp.com/messages.json. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:8000' is therefore not allowed access." The same-origin policy dictates that files can only be loaded from the origin (i.e., the messages folder). This is why the JS code can open the data.json file.

This assignment took me approximately 3 hours to complete.


Help from:
http://jsfiddle.net/Josh_Powell/qnYYL/1/

