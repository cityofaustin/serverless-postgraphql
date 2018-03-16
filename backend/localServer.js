const http = require('http');
const parser = require('url');
const xmlHandler = require('./handlers/xmlHandler');
const graphqlHandler = require('./handlers/graphqlHandler');

const hostname = '127.0.0.1';
const port = 5000;

const server = http.createServer((req, res) => {
  const url = parser.parse(req.url, true);

  switch (url.pathname) {
    case '/xml':
      xmlHandler.handle(null, null, (error, response) => {
        res.statusCode = response.statusCode;
        res.setHeader('Content-Type', 'text/xml');
        res.end(response.body);
      });
      break;

    case '/graphql':
      switch (req.method) {
        case 'OPTIONS':
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, Accept');
          res.end();
          break;

        case 'POST':
          console.log("blarg");
          var body = '';
          req.on('data', data => {
            body += data;
          })
          req.on('end', () => {
            // debugger;
            var event = JSON.parse(body);
            event.headers = req.headers;
            graphqlHandler.handle(event, null, (error, response) => {
              res.statusCode = response.statusCode;
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(JSON.stringify({data: response.data}));
            })
          });
          break;
      }
      break;
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});