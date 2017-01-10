/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var http = require('http');
// var request = require('request');
var _ = require('underscore');
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var Message = function (username, message, lobby) {
  this.username = username;
  this.message = message;
  this.lobby = lobby;
};

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var headers = request.headers;
  var method = request.method;
  var url = request.url;
  var body = [];
  var data = '';
  headers = _.extend(headers, defaultCorsHeaders);
  headers['Content-Type'] = 'application/json';
  request.setEncoding('utf8');

  if (url === '/classes/messages') { 

    if (request.method === 'POST') {
      response.statusCode = 201;
    } else {
      response.statusCode = 200;
    }
    response.setHeader('Content-Type', 'application/json');

    request.on('error', function(err) {
      console.error(err);
    }).on('data', function(chunk) {
      var temp = JSON.parse(chunk);
      var newMsg = new Message(temp.username, temp.message);
      body.push(newMsg);
      data += chunk;

    }).on('end', function() {
      response.on('error', function(err) {
        console.error(err);
      });
    });
    var responseBody = {
      headers: headers,
      method: method,
      url: url,
      results: body
    };
    var responseBodyStr = JSON.stringify(responseBody);
    if (request.method === 'POST') {  
      console.log('POST method;');
      console.log(responseBodyStr);
      console.log(JSON.parse(responseBodyStr).results[0].username);
      console.log(typeof JSON.parse(responseBodyStr).results[0]);
    }
    response.end(responseBodyStr);
  } else {
    response.statusCode = 404;
    response.end('Status Code: 404');
  }
  // See the note below about CORS headers.
 
  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.


  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

module.exports = requestHandler;
