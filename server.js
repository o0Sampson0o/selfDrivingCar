const https = require("https");
const fs = require("fs");

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
};

https.createServer(options, listener).listen(3000, () => { console.log("server started"); });

function listener(req, res) {
    switch (req.url) {
        case "/": {
            res.setHeader("content-type", "text/html");
            res.write(fs.readFileSync("./index.html"));
            res.end();
        } break;
        case "/main.js": {
            res.setHeader("content-type", "text/javascript");
            res.write(fs.readFileSync("./main.js"));
            res.end();
        } break;
        case "/style.css": {
            res.setHeader("content-type", "text/css");
            res.write(fs.readFileSync("./style.css"));
            res.end();
        } break;
        default: {
            try {
                res.setHeader("content-type", "text/javascript");
                res.write(fs.readFileSync("." + req.url + ".js"));
                res.end();
            } catch (error) {
                res.writeHead(404, "NOT FOUND");
                res.end();
            }
        }
    }
}