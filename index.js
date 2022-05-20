// file system module in js
const fs = require("fs");
// http module in js
const http = require("http");
// url moule in js
const url = require("url");
// slugify module from npm
const slugify = require("slugify");
// replaceTemplate module
const replaceTemplate = require(".\\modules\\replaceTemplate");

const tempOverview = fs.readFileSync(
  `${__dirname}\\templates\\template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}\\templates\\template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}\\templates\\template-card.html`,
  "utf-8"
);

// read json file in sync manner as it done once and at global level
const data = fs.readFileSync(`${__dirname}\\dev-data\\data.json`, "UTF-8");
const dataObj = JSON.parse(data);

// slugify the product names from each product object
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html"
    });
    const cardHTML = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const tempHTML = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardHTML);
    res.end(tempHTML);

    // Product page
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html"
    });
    const product = dataObj[query.id];
    const productHTML = replaceTemplate(tempProduct, product);
    res.end(productHTML);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json"
    });
    res.end(data);

    // NOT FOUND
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-custom-header": "my world.!"
    });
    res.end("<h1>page not found.!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("server is listening on 8000");
});
