const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '0.0.0.0';
const port = 3000;

const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: 'UP' }));
        return;
    }
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
        if (err) {
            res.statusCode = 500;
            res.end('Error loading page');
            return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
    });
});

server.listen(port, hostname, () => {
    console.log('Server berjalan di port ' + port);
});
