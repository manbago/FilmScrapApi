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

let scraptFilmHD = false;
let scraptNEW = true;
let scraptSeriestHD = false;
let scraptDocsHD = false;

const totalScrapt = 35; // Number of pages to be scraped
const inicioScrapt = 1; // Number of pages to be scraped
let hrefsTotal = [];

// var results = [];
let TotalCreadas = [];

function sleep(miliseconds) {
  var currentTime = new Date().getTime();
  while (currentTime + miliseconds >= new Date().getTime()) {
  }
}

if (scraptFilmHD) {
  // hrefsTotal = [];
  let hrefs1 = [];
  for (let index = inicioScrapt; index <= totalScrapt; index++) {
    hrefs1 = [];
    //-- Para recorrer todas las paginas
    (async function main() {
      try {
        // const browser = await puppeteer.launch( {headless: false, ignoreHTTPSErrors: true, defaultViewport: null });
        const browser = await puppeteer.launch();
        const [page] = await browser.pages();
        await page.goto("https://todotorrents.net/peliculas/hd/page/" + index); //-- Para recrrer todas las peliculas HD

        // way 1
        hrefs1 = await page.evaluate(() =>
          Array.from(document.querySelectorAll(".card-body a[href]"), (a) =>
            a.getAttribute("href")
          )
        );

        //  hrefsTotal = hrefsTotal.concat(hrefs1);
        //  console.log(hrefsTotal);

        for (let index2 = 0; index2 < hrefs1.length; index2++) {
          //--para recorrer todas las peliculas de la pagina
          await page.goto("https://todotorrents.net/" + hrefs1[index2]);
          await page.waitForTimeout(500);

          let filmHD = [];
          filmHD = await extractedFilmHD(page);
          createFilmHD(filmHD);
        }

        await browser.close();
      } catch (err) {
        console.error(err);
      }
    })();
  } //fin for
  
} // fin IF scraping HD

if (scraptSeriestHD) {
  // hrefsTotal = [];
  let hrefsSeries = [];
  for (let index = inicioScrapt; index <= totalScrapt; index++) {
    
    hrefsSeries = [];
    //-- Para recorrer todas las paginas
    (async function mainSeries() {
      try {
        // const browser = await puppeteer.launch( {headless: false, ignoreHTTPSErrors: true, defaultViewport: null });
        const browserSeries = await puppeteer.launch();
        const [pageSeries] = await browserSeries.pages();
        await pageSeries.goto("https://dontorrent.fit/series/page/" + index); //-- Para recrrer todas las peliculas HD
        await pageSeries.waitForTimeout(500);
        // way 1
        hrefsSeries = await pageSeries.evaluate(() =>
          Array.from(document.querySelectorAll(".noticiasContent a[href]"), (a) =>
            a.getAttribute("href")
          )
        );
        

          hrefsTotal = hrefsTotal.concat(hrefsSeries.slice(0, - 5));
          console.log(hrefsTotal);
          
        for (let index2 = 0; index2 < hrefsSeries.slice(0, - 5).length; index2++) {
         
          //--para recorrer todas las peliculas de la pagina
          await pageSeries.goto("https://dontorrent.fit/" + hrefsSeries[index2]);
          await pageSeries.waitForTimeout(1000);

          let serieHD = [];
          serieHD =  await extractedSERIE_DOC(pageSeries);
          
          //console.log(serieHD);
           createSERIE(serieHD);
        }

        await browserSeries.close();
      } catch (err) {
        console.error(err);
      }
    })();
  } //fin for
  
} // fin IF scraping HD


if (scraptDocsHD) {
  // hrefsTotal = [];
  let hrefsDocs = [];
  let totalPages = []
  for (let index = inicioScrapt; index <= totalScrapt; index++) {
    
    hrefsDocs = [];

    //-- Para recorrer todas las paginas
    (async function mainSeries() {
      try {
        // const browser = await puppeteer.launch( {headless: false, ignoreHTTPSErrors: true, defaultViewport: null });
        const browserSeries = await puppeteer.launch();
        const [pageSeries] = await browserSeries.pages();
        await pageSeries.waitForTimeout(1000);
        await pageSeries.goto("https://dontorrent.fit/documentales/page/" + index); //-- Para recrrer todas las peliculas HD
        await pageSeries.waitForTimeout(1000);
        // way 1
        hrefsDocs = await pageSeries.evaluate(() =>
          Array.from(document.querySelectorAll(".noticiasContent a[href]"), (a) =>
            a.getAttribute("href")
          )
        );
        

          hrefsTotal = hrefsTotal.concat(hrefsDocs.slice(0, - 1));
          console.log(hrefsTotal);
          
        for (let index2 = 0; index2 < hrefsDocs.slice(0, - 1).length; index2++) {
         
          //--para recorrer todas las peliculas de la pagina
          await pageSeries.goto("https://dontorrent.fit/" + hrefsDocs[index2]);
          await pageSeries.waitForTimeout(1000);

          
          let docHD = [];
          docHD =  await extractedSERIE_DOC(pageSeries);
          
          //console.log(serieHD);
           createDOC(docHD);
        }

        await browserSeries.close();
      } catch (err) {
        console.error(err);
      }
    })();
  } //fin for
  
} // fin IF scraping HD

if (scraptNEW) {
  console.log("Inicializando scraptNEW...");
  let hrefs2 = [];
  (async function main2() {
    try {
      const browser2 = await puppeteer.launch();
      const [page2] = await browser2.pages();
      await page2.goto("https://dontorrent.fit/ultimos");

      // way 1
      hrefs2 = await page2.evaluate(() =>
        Array.from(document.querySelectorAll(".card-body a[href]"), (a) =>
          a.getAttribute("href")
        )
      );

      console.log(hrefs2);

      for (let index2 = 0; index2 < hrefs2.length; index2++) {
        // -- recorro las primeras 15 peliculas novedades
        await page2.goto("https://dontorrent.fit/" + hrefs2[index2]);
        await page2.waitForTimeout(500);

        let componentNEW = [];
        
        if (hrefs2[index2].includes("pelicula")) {
          componentNEW = await extractedFilmHD(page2);
          createFilmHD(componentNEW);
        } 

        if (hrefs2[index2].includes("serie")) {
          componentNEW = await extractedSERIE_DOC(page2);
          createSERIE(componentNEW);
        }
        if (hrefs2[index2].includes("documental")) {
          componentNEW = await extractedSERIE_DOC(page2);
          createDOC(componentNEW);
        }
        if (hrefs2[index2].includes("variado")) {
          componentNEW = await extractedSERIE_DOC(page2);
          createVARIO(componentNEW);
        }
        else {
          console.log("es musica");
          
        }
      } // fin for

      await browser2.close();
    } catch (err) {
      console.error(err);
    }
  })();
  console.log("scraptNEW Finalizado...");
} // fin IF scraping NEW



function createCHAPTER(tabla) {
  Chapter.findOrCreate({
    where: {
      // title: title,
       //chapter: tabla.td_chapter,
    },
    defaults: {
      // set the default properties if it doesn't exist
      chapter: tabla.title,
      //fecha: tabla.fecha,
      torrent: tabla.torrent,
    },
  }).then(function (result) {
    var author = result[0], // the instance of the author
      created = result[1]; // boolean stating if it was created or not

    if (!created) {
      // false if author already exists and was not created.
      console.log("Capitulo already exists");
    } else {
      console.log("Capitulo created..."+tabla.numchapters);
      TotalCreadas = TotalCreadas.concat(tabla);
    }
  });
  
}


async function extractedFilmHD(page) {
  // just extracted same exact logic in separate function
  // this function should use async keyword in order to work and take page as argument
  return page.evaluate(() => {
    let title =
      document.querySelector(".card-body h2")?.innerText || "No title";
    let description = document.querySelector(".text-justify")?.innerText || "No descrip";
    let picture = document.querySelectorAll(".card-body > img");
    let imagen = picture[0].src;
    let releaseYear = document.querySelector(".d-inline-block p a")?.innerText || "No year";
    let playersFilm = document.querySelector(".mb-0")?.innerText || "No players";;
    let format =
      document.querySelector(".text-center .d-inline-block p")?.innerText ||
      "No format";
    let size = document.querySelector(".d-inline-block .mb-0")?.innerText || "No size";
    let torrent = Array.from(
      document.querySelectorAll(".text-center a[href]"),
      (a) => a.getAttribute("href")
    ).toString();
    let urlWeb = document.location.href;

    // let type_temp = urlWeb.substring(
    //   urlWeb.indexOf(".net/") + 5,
    //   urlWeb.lastIndexOf("/")
    // );

    // let type = type_temp.substring(0, type_temp.lastIndexOf("/"));

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
    let description = document.querySelector(".text-justify")?.innerText || "No descri";
    let picture = document.querySelectorAll(".card-body > img");
    let imagen = picture[0]?.src || "No image";
    let format = document.querySelectorAll(".d-inline-block p")[0]?.innerText || "No format";
    format = format.replace("Formato:", "");
    let numchapters_temp = document.querySelectorAll(".d-inline-block p")[1]?.innerText || "No format";
    let torrent = Array.from(
      document.querySelectorAll(".text-center a[href]"),
      (a) => a.getAttribute("href")
    ).toString();

    let size = document.querySelector(".d-inline-block .mb-0")?.innerText || "No size";
    
    const tbody = document.querySelector('tbody');
   // let fecha = Array.from(tbody.querySelectorAll("td")).innerText;// tbody.querySelectorAll("td")[0].innerText;
    //let nameEpisode = tbody.querySelectorAll("td")[2].innerText;

      let mitemp = [];
    var tds = document.querySelectorAll('tbody td'), i;
    for(i = 0; i < tds.length; ++i) {
      mitemp = mitemp.concat(tds[i].innerText);
    // do something here
}
 let episodios = mitemp.toString();
  let urlWeb = document.location.href;
  

    // let type_temp = urlWeb.substring(
    //   urlWeb.indexOf(".fit/") + 6,
    //   urlWeb.lastIndexOf("/") - 6
    // );

    // let type = type_temp.substring(0, type_temp.lastIndexOf("/"));

    let numchapters_temp2 = numchapters_temp.replace("Episodios: ", "");
    let numchapters = parseInt(numchapters_temp2);

    // return {
    //   title
    // };
    
    return {
      title,
      description,
      imagen,
      numchapters,
      format,
      torrent,
      episodios,
      urlWeb,
      size
    };
  });
}



function createFilmHD(tabla) {
  Film.findOrCreate({
    where: {
      title: tabla.title,
      format: tabla.format.replace("Formato:", ""),
    },
    defaults: {
      // set the default properties if it doesn't exist
      title: tabla.title,
      type: "pelicula",
      description: tabla.description.replace("Descripción:", ""),
      imagen: tabla.imagen,
      releaseYear: tabla.releaseYear,
      playersFilm: tabla.playersFilm.replace("Actores:", ""),
      format: tabla.format.replace("Formato:", ""),
      size: tabla.size.replace("Tamaño:", ""),
      torrent: tabla.torrent,
      urlWeb: tabla.urlWeb,
    },
  }).then(function (result) {
    var author = result[0], // the instance of the author
      created = result[1]; // boolean stating if it was created or not

    if (!created) {
      // false if author already exists and was not created.
      console.log("Film already exists");
    } else {
      console.log("Film created...");
      TotalCreadas = TotalCreadas.concat(tabla);
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
      description: tabla.description?.replace("Descripción:", "") || tabla.description,
      imagen: tabla.imagen,
      numchapters: tabla.numchapters,
      format: tabla.format, //?.replace("Formato:", "") || tabla.format,
      torrent: tabla.torrent,
      episodios: tabla.episodios,
      urlWeb: tabla.urlWeb,
    },
  }).then(function (result) {
    var author = result[0], // the instance of the author
      created = result[1]; // boolean stating if it was created or not

    if (!created) {
      // false if author already exists and was not created.
      console.log("Serie already exists");
    } else {
      console.log("Serie created..."+tabla.fecha);
      //TotalCreadas = TotalCreadas.concat(tabla);
    }
  });
  
}


function createDOC(tabla) {
  Doc.findOrCreate({
    where: {
      title: tabla.title,
      format: tabla.format.replace("Formato:", ""), // || tabla.format,
    },
    defaults: {
      // set the default properties if it doesn't exist
      title: tabla.title,
      type: "documental",
      description: tabla.description?.replace("Descripción:", "") || tabla.description,
      imagen: tabla.imagen,
      numchapters: tabla.numchapters,
      format: tabla.format?.replace("Formato:", "") || tabla.format,
      torrent: tabla.torrent,
      episodios: tabla.episodios,
      urlWeb: tabla.urlWeb,
    },
  }).then(function (result) {
    var author = result[0], // the instance of the author
      created = result[1]; // boolean stating if it was created or not

    if (!created) {
      // false if author already exists and was not created.
      console.log("Doc already exists");
    } else {
      console.log("Doc created..."+tabla.fecha);
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
      description: tabla.description?.replace("Descripción:", "") || tabla.description,
      imagen: tabla.imagen,
      size: tabla.size.replace("Tamaño:", ""),
      fecha: tabla.format?.replace("Fecha:", "") || tabla.format,
      torrent: tabla.torrent,
      urlWeb: tabla.urlWeb,
    },
  }).then(function (result) {
    var author = result[0], // the instance of the author
      created = result[1]; // boolean stating if it was created or not

    if (!created) {
      // false if author already exists and was not created.
      console.log("Vario already exist..."+tabla.size);
    } else {
      console.log("Vario created..."+tabla.size);
      //TotalCreadas = TotalCreadas.concat(tabla);
    }
  });
  
}

// Making Express listen on port 7000
app.listen(3000, () => {
  console.log("Listening on port 3000");
});

