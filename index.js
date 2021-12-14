const express = require("express");
const bodyParser = require("body-parser");
const apiRouter = require("./routes/api");
const puppeteer = require("puppeteer");
require("./db");

const app = express();
//const router = require("express").Router();
const { Film, Serie, Doc, Vario } = require("./db");
//const { Serie } = require("./db");
// const { Chapter } = require("./db");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", apiRouter);

const Sequelize = require("sequelize");
const { decodeBase64 } = require("bcryptjs");
const urlPage = "https://dontorrent.art";

let scraptFilmHD = false;
let scraptNEW = false;
let scraptSeriestHD = false;
let scraptDocsHD = false;
let scraptVariosHD = false;

const totalScrapt = 30; // Number of pages to be scraped
const inicioScrapt = 20; // Number of pages to be scraped
let hrefsTotal = [];

// var results = [];
let TotalCreadas = [];

const calltoExtractSave = async (page, hrefsPage, typeM) => {
  for (let index = 0; index < hrefsPage.length; index++) {
    //--para recorrer todas las peliculas de la pagina
    await page.goto(urlPage + hrefsPage[index]);
    await page.waitForTimeout(300);

    let componentHD = [];
    if (typeM === "film") {
      componentHD = await extractedFilmHD(page);
      console.log(componentHD.title);
      createFilmHD(componentHD);
    } else if (typeM === "serie") {
      componentHD = await extractedSERIE_DOC(page);
      createSERIE(componentHD);
    } else if (typeM === "doc") {
      componentHD = await extractedSERIE_DOC(page);
      createDOC(componentHD);
    } else if (typeM === "vario") {
      componentHD = await extractedSERIE_DOC(page);
      createVARIO(componentHD);
    }
    
  } // fin for
};


if (scraptFilmHD) {
  hrefsTotal = [];
  let typeModel = "film";
  (async () => {
    for (let index = inicioScrapt; index <= totalScrapt; index++) {
      const browser = await puppeteer.launch();
      const [page] = await browser.pages();
      await page.goto(urlPage+"/peliculas/hd/page/" + index); //-- Para recrrer todas las peliculas HD

      // way 1
      const hrefsFilms = await page.evaluate(() =>
        Array.from(document.querySelectorAll(".card-body a[href]"), (a) =>
          a.getAttribute("href")
        )
      );

      hrefsTotal = hrefsTotal.concat(hrefsFilms);
      console.log(hrefsFilms);

      await calltoExtractSave(page, hrefsFilms, typeModel);
      await browser.close();
    } // fin FOR
  })();
} // fin IF scraping FilmHD


if (scraptSeriestHD) {
  hrefsTotal = [];
  let typeModel = "serie";
  (async () => {
    for (let index = inicioScrapt; index <= totalScrapt; index++) {
      const browser = await puppeteer.launch();
      const [page] = await browser.pages();
      await page.goto(urlPage+"/series/hd/page/" + index); //-- Para recrrer todas las peliculas HD

      // way 1
      const hrefsSeries = await page.evaluate(() =>
        Array.from(document.querySelectorAll(".card-body a[href]"), (a) =>
          a.getAttribute("href")
        )
      );

      hrefsTotal = hrefsTotal.concat(hrefsSeries.slice(27));
      console.log(hrefsSeries.slice(27));

      await calltoExtractSave(page, hrefsSeries.slice(27), typeModel);
      await browser.close();
    } // fin FOR
  })();
} // fin IF scraping SerieHD

if (scraptDocsHD) {
  hrefsTotal = [];
  let typeModel = "doc";
  (async () => {
    for (let index = inicioScrapt; index <= totalScrapt; index++) {
      const browser = await puppeteer.launch();
      const [page] = await browser.pages();
      await page.goto(urlPage+"/documentales/page/" + index); //-- Para recrrer todas las peliculas HD

      // way 1
      const hrefsDocs = await page.evaluate(() =>
        Array.from(document.querySelectorAll(".card-body a[href]"), (a) =>
          a.getAttribute("href")
        )
      );

      hrefsTotal = hrefsTotal.concat(hrefsDocs.slice(27, -1));
      console.log(hrefsDocs.slice(27, -1));

      await calltoExtractSave(page, hrefsDocs.slice(27, -1), typeModel);
      await browser.close();
    } // fin FOR
  })();
} // fin IF scraping DocHD


if (scraptVariosHD) {
  hrefsTotal = [];
  let typeModel = "vario";
  (async () => {
    for (let index = inicioScrapt; index <= totalScrapt; index++) {
      const browser = await puppeteer.launch();
      const [page] = await browser.pages();
      await page.goto(urlPage+"/variados/page/" + index); //-- Para recrrer todas las peliculas HD

      // way 1
      const hrefsVarios = await page.evaluate(() =>
        Array.from(document.querySelectorAll(".card-body a[href]"), (a) =>
          a.getAttribute("href")
        )
      );
      
      hrefsTotal = hrefsTotal.concat(hrefsVarios.slice(4));
      console.log(hrefsVarios.slice(4));

      await calltoExtractSave(page, hrefsVarios.slice(4), typeModel);
      await browser.close();
    } // fin FOR
  })();
} // fin IF scraping VariosHD


if (scraptNEW) {
  let hrefsNew = [];
  (async function mainNew() {
    try {
      const browserNew = await puppeteer.launch();
      const [pageNew] = await browserNew.pages();
      await pageNew.goto(urlPage+"/ultimos");

      // way 1
      hrefsNew = await pageNew.evaluate(() =>
        Array.from(document.querySelectorAll(".card-body a[href]"), (a) =>
          a.getAttribute("href")
        )
      );

      console.log(hrefsNew);

      for (let index = 0; index < hrefsNew.length; index++) {
        // -- recorro las primeras 15 peliculas novedades
        await pageNew.goto(urlPage + "/"+ hrefsNew[index]);
        await pageNew.waitForTimeout(500);

        let componentNEW = [];

        if (hrefsNew[index].includes("pelicula")) {
          componentNEW = await extractedFilmHD(pageNew);
          createFilmHD(componentNEW);
        }

        if (hrefsNew[index].includes("serie")) {
          componentNEW = await extractedSERIE_DOC(pageNew);
          createSERIE(componentNEW);
        }
        if (hrefsNew[index].includes("documental")) {
          componentNEW = await extractedSERIE_DOC(pageNew);
          createDOC(componentNEW);
        }
        if (hrefsNew[index].includes("variado")) {
          componentNEW = await extractedSERIE_DOC(pageNew);
          createVARIO(componentNEW);
        } else {
          console.log("es musica");
        }
      } // fin for

      await browserNew.close();
    } catch (err) {
      console.error(err);
    }
  })();
} // fin IF scraping NEW



async function extractedFilmHD(page) {
  // just extracted same exact logic in separate function
  // this function should use async keyword in order to work and take page as argument
  return page.evaluate(() => {
    let title =
      document.querySelector(".card-body h1")?.innerText || "No title";
    let description =
      document.querySelector(".text-justify")?.innerText || "No descrip";
    let picture = document.querySelectorAll(".card-body > img");
    let imagen = picture[0].src;
    let releaseYear =
      document.querySelector(".d-inline-block p a")?.innerText || "No year";
    let playersFilm =
      document.querySelector(".mb-0")?.innerText || "No players";
    let format =
      document.querySelector(".text-center .d-inline-block p")?.innerText ||
      "No format";
    let size =
      document.querySelector(".d-inline-block .mb-0")?.innerText || "No size";
    let torrent = Array.from(
      document.querySelectorAll(".text-center a[href]"),
      (a) => a.getAttribute("href")
    ).toString();
    let urlWeb = document.location.href;

    title = title.replace("Descargar ", "");
    title = title.replace(" por Torrent", "");
    description = description.replace("Descripción: ", "");
    size = size.replace("Tamaño: ", "");
    format = format.replace("Formato: ", "");
    playersFilm = playersFilm.replace("Actores:", "");

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

async function extractedSERIE_DOC(page) {
  // just extracted same exact logic in separate function
  // this function should use async keyword in order to work and take page as argument
  return page.evaluate(() => {
    let title =
      document.querySelector(".card-body h2")?.innerText || "No title";
    let description =
      document.querySelector(".text-justify")?.innerText || "No descri";
    let picture = document.querySelectorAll(".card-body > img");
    let imagen = picture[0]?.src || "No image";
    let format =
      document.querySelectorAll(".d-inline-block p")[0]?.innerText ||
      "No format";
    let numchapters_temp =
      document.querySelectorAll(".d-inline-block p")[1]?.innerText ||
      "No format";
    let torrent = Array.from(
      document.querySelectorAll(".text-center a[href]"),
      (a) => a.getAttribute("href")
    ).toString();

    let size =
      document.querySelector(".d-inline-block .mb-0")?.innerText || "No size";

    const tbody = document.querySelector("tbody");
    // let fecha = Array.from(tbody.querySelectorAll("td")).innerText;// tbody.querySelectorAll("td")[0].innerText;
    //let nameEpisode = tbody.querySelectorAll("td")[2].innerText;

    let mitemp = [];
    var tds = document.querySelectorAll("tbody td"),
      i;
    for (i = 0; i < tds.length; ++i) {
      mitemp = mitemp.concat(tds[i].innerText);
      // do something here
    }
    let episodios = mitemp.toString();
    let urlWeb = document.location.href;

    let numchapters_temp2 = numchapters_temp.replace("Episodios: ", "");
    let numchapters = parseInt(numchapters_temp2);
    description = description.replace("Descripción: ", "");
    size = size.replace("Tamaño: ", "");
    format = format.replace("Formato: ", ""); 

    return {
      title,
      description,
      imagen,
      numchapters,
      format,
      torrent,
      episodios,
      urlWeb,
      size,
    };
  });
}

function createFilmHD(tabla) {
  Film.findOrCreate({
    where: {
      title: tabla.title,
      format: tabla.format,
    },
    defaults: {
      // set the default properties if it doesn't exist
      title: tabla.title,
      type: "pelicula",
      description: tabla.description,
      imagen: tabla.imagen,
      releaseYear: tabla.releaseYear,
      playersFilm: tabla.playersFilm,
      format: tabla.format,
      size: tabla.size,
      torrent: tabla.torrent,
      urlWeb: tabla.urlWeb,
    },
  }).then(function (result) {
    var film = result[0], // the instance of the author
    created = result[1]; // boolean stating if it was created or not

    if (!created) {
      // false if film already exists and was not created.
      console.log("Film already exists..."+ film.title);
    } else {
      console.log("Film created..."+ film.title);
    }
  });
}

function createSERIE(tabla) {
  Serie.findOrCreate({
    where: {
      title: tabla.title,
      format: tabla.format, //|| tabla.format,
    },
    defaults: {
      // set the default properties if it doesn't exist
      title: tabla.title,
      type: "serie",
      description: tabla.description,
      imagen: tabla.imagen,
      numchapters: tabla.numchapters,
      format: tabla.format,
      torrent: tabla.torrent,
      episodios: tabla.episodios,
      urlWeb: tabla.urlWeb,
    },
  }).then(function (result) {
    var serie = result[0], // the instance of the author
      created = result[1]; // boolean stating if it was created or not

    if (!created) {
      // false if serie already exists and was not created.
      console.log("Serie already exists..."+serie.title);
    } else {
      console.log("Serie created..." + serie.title);
    }
  });
}

function createDOC(tabla) {
  Doc.findOrCreate({
    where: {
      title: tabla.title,
      format: tabla.format, // || tabla.format,
    },
    defaults: {
      // set the default properties if it doesn't exist
      title: tabla.title,
      type: "documental",
      description:
        tabla.description,
      imagen: tabla.imagen,
      numchapters: tabla.numchapters,
      format: tabla.format,
      torrent: tabla.torrent,
      episodios: tabla.episodios,
      urlWeb: tabla.urlWeb,
    },
  }).then(function (result) {
    var doc = result[0], // the instance of the author
      created = result[1]; // boolean stating if it was created or not

    if (!created) {
      // false if author already exists and was not created.
      console.log("Doc already exists..."+ doc.title);
    } else {
      console.log("Doc created..." + doc.title);
      //TotalCreadas = TotalCreadas.concat(tabla);
    }
  });
}

function createVARIO(tabla) {
  Vario.findOrCreate({
    where: {
      title: tabla.title,
    },
    defaults: {
      // set the default properties if it doesn't exist
      title: tabla.title,
      type: "vario",
      description: tabla.description,
      imagen: tabla.imagen,
      size: tabla.size,
      fecha: tabla.format.replace("Año: ", ""),
      torrent: tabla.torrent,
      urlWeb: tabla.urlWeb,
    },
  }).then(function (result) {
    var vario = result[0], // the instance of the vario
    created = result[1]; // boolean stating if it was created or not

    if (!created) {
      // false if author already exists and was not created.
      console.log("Vario already exist..." + vario.title);
    } else {
      console.log("Vario created..." + vario.title);
    }
  });
}

// Making Express listen on port 7000
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
