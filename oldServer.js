const http = require("http");
const fs = require("fs");
const path = require("path");
const fsP = require("fs").promises;
const logEvents = require("./logEvents");
const eventEmitter = require("events");
class MyEmitter extends eventEmitter {}
const myEmitter = new MyEmitter();

const PORT = process.env.PORT || 3500;

myEmitter.on("logg", (msg, filename) => logEvents(msg, filename));

const serveFile = async (filePath, contentType, res) => {
  try {
    const rawData = await fsP.readFile(
      filePath,
      !contentType.includes("image") ? "utf8" : ""
    );
    const data =
      contentType === "application/json" ? JSON.parse(rawData) : rawData;
    res.writeHead(filePath.includes("404.html") ? 404 : 200, {
      "Content-Type": contentType,
    });
    res.end(contentType === "application/json" ? JSON.stringify(data) : data);
  } catch (err) {
    console.log(err);
    myEmitter.emit("logg", `${err.name} : ${err.message}`, "error.txt");

    res.statusCode = 500;
    res.end();
  }
};

const server = http.createServer((req, res) => {
  // console.log(req.url);
  // console.log(req.method);
  myEmitter.emit("logg", `${req.url}\t${req.method}`, "reqLog.txt");

  // set header content type
  const extension = path.extname(req.url);
  let contentType;

  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".jpg":
      contentType = "image/jpeg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".txt":
      contentType = "text/plain";
      break;
    default:
      contentType = "text/html";
  }

  // serve html files
  let filePath =
    contentType === "text/html" && req.url === "/"
      ? path.join(__dirname, "views", "index.html")
      : contentType === "text/html" && req.url.slice(-1) === "/"
      ? path.join(__dirname, "views", req.url, "index.html")
      : contentType === "text/html"
      ? path.join(__dirname, "views", req.url)
      : path.join(__dirname, req.url);
  // makes .html extension not required in the browser
  if (!extension && req.url.slice(-1) !== "/") filePath += ".html";

  const fileExists = fs.existsSync(filePath);

  if (fileExists) {
    serveFile(filePath, contentType, res);
  } else {
    //404 // 301 redirect
    switch (path.parse(filePath).base) {
      case "old-page.html":
        res.writeHead(301, { Location: "/new-page.html" });
        res.end();
        break;
      case "www-page.html":
        res.writeHead(301, { Location: "/" });
        res.end();
        break;
      default:
        serveFile(path.join(__dirname, "views", "404.html"), "text/html", res);

      // serve a 404
    }
  }
  //method one
  // if(req.url === '/'|| req.url =='index.html'){
  //     res.statusCode = 200;
  //     res.setHeader('Content-Type','text/html');
  //     pathfile = path.join(__dirname,'views','index.html');
  //     fs.readFile(pathfile,'utf8',(err,data)=>{
  //         if(err) throw err;
  //         res.end(data);
  //     })
  // }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// setTimeout(() => {
//     myEmitter.emit("logg", "Log event emitted!","solin");
// }, 5000);
