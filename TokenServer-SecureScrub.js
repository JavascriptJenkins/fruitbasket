var Firebase = require('firebase');/* get the firebase code which allows you to access their api . */
var url = require('url');/* for parsing urls */
var querystring = require('querystring');/* for parsing querystrings */
var http = require('http'); /* for creating servers */

/* Create firebase objects to represent the JSON data structures on the firebase server. */
var rootData = new Firebase("https://SLANG4USDATA.firebaseio.com/");
var userData = new Firebase("https://SLANG4USDATA.firebaseio.com/users");

var AUTH_TOKEN ='';

/* create the firebase tokenGenerator  */
var FirebaseTokenGenerator = require("firebase-token-generator");
var tokenGenerator = new FirebaseTokenGenerator(AUTH_TOKEN);


/* This function validates tokens that are generated by the server. */
function AuthWithData(token){
	/* this sends data to firebase and checks if a given token is valid */
	rootData.authWithCustomToken(token, function(error, authData) {
	  if (error) {
	    console.log("Login Failed!", error);
	  } else {
	    console.log("Login Succeeded!", authData);
	  }
	});
}

/* Create the server and listen on the correct port. */
http.createServer(function (request, response) {

	/* Log all the parts of the request object to the console. */
	console.log('request.headers: '+request.headers);
	console.log('request.method: '+request.method);
	console.log('request.url: '+request.url);

	var paramsParsedFromRequest = querystring.parse(url.parse(request.url).query);

	/* Log the parameters that are in the request object. */
	console.log('Parameters received from request object: '+paramsParsedFromRequest);

	/* Send data to firebase server and create the token with the secret key. */
	var tokenReceivedFromFireBase = tokenGenerator.createToken({ uid: "uniqueId1", some: "arbitrary", data: paramsParsedFromRequest });

	/* The the token that was created. */
	console.log('tokenReceivedFromFireBase: '+tokenReceivedFromFireBase);

	/* Authenticate the token that was generated. */
	AuthWithData(tokenReceivedFromFireBase);

	/* Write to the response object. */
	// write the header information
	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.write('hey man heres your token: '+tokenReceivedFromFireBase);

	/* End writing to the response object. */ 
    response.end();

}).listen(8080, '172.31.63.88');

/* Log the ip that the server is listening on. */
console.log('Server running at http://172.31.63.88:8080/');

