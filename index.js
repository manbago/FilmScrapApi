const express = require("express");
const bodyParser = require("body-parser");
const apiRouter = require("./routes/api");

const puppeteer = require("puppeteer");
require("./db");

const app = express();
const router = require("express").Router();

const { Film } = require("./db");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", apiRouter);

// Launching the Puppeteer controlled headless browser and navigate to the Digimon website
const total = 1;
let hrefsTotal = [];
var results = [];

for (let index = 1; index < total; index++) {
  (async function main() {
    try {
      // const browser = await puppeteer.launch( {headless: false, ignoreHTTPSErrors: true, defaultViewport: null });
      const browser = await puppeteer.launch();

      const [page] = await browser.pages();

      await page.goto("https://todotorrents.net/peliculas/hd/page/" + index);

      // way 1
      const hrefs1 = await page.evaluate(() =>
        Array.from(document.querySelectorAll(".text-center a[href]"), (a) =>
          a.getAttribute("href")
        )
      );

      hrefsTotal = hrefsTotal.concat(hrefs1);
      console.log(hrefsTotal);

      for (let index2 = 0; index2 < hrefs1.length; index2++) {
        await page.goto("https://todotorrents.net" + hrefs1[index2]);
        await page.waitForTimeout(500);
        // call and wait extractedEvaluateCall and concatenate results every iteration.
        // Evitar añadir inserciones duplicadas en Test
        let tabla = [];
        //  tabla = await extractedEvaluateCall(page);
        //      Film.create({
        //   title:tabla.title,
        //   description: tabla.description,
        //   imagen : tabla.imagen,
        //   releaseYear: tabla.releaseYear,
        //   playersFilm: tabla.playersFilm,
        //   format: tabla.format,
        //   size: tabla.size,
        //   torrent: tabla.torrent,
        //   urlWeb: tabla.urlWeb,
        // });
      }
      console.log("RESULTADOS" + results);

      await browser.close();
    } catch (err) {
      console.error(err);
    }
  })();
} //fin for

async function extractedEvaluateCall(page) {
  // just extracted same exact logic in separate function
  // this function should use async keyword in order to work and take page as argument
  //const { Film } = require("./db");
  return page.evaluate(() => {
    let title =
      document.querySelector(".card-body h2")?.innerText || "No title";
    let description = document.querySelector(".text-justify").innerText;
    let picture = document.querySelectorAll(".card-body > img");
    let imagen = picture[0].src;
    let releaseYear = document.querySelector(".d-inline-block p a").innerText;
    let playersFilm = document.querySelector(".mb-0").innerText;
    let format = document.querySelector(
      ".text-center .d-inline-block p"
    ).innerText;
    let size = document.querySelector(".d-inline-block .mb-0").innerText;
    let torrent = Array.from(
      document.querySelectorAll(".text-center a[href]"),
      (a) => a.getAttribute("href")
    ).toString();
    let urlWeb = document.location.href;

    return {
      title,
      description,
      imagen,
      releaseYear,
      playersFilm,
      format,
      size,
      torrent,
      urlWeb,
    };
  });
}

// Making Express listen on port 7000
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
