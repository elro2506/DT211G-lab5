"use strict";
import "./scss/main.scss";

import Chart from "chart.js/auto"; //Annars lästes diagrammet inte in ordentligt

//När hela HTML-dokumntet laddats så körs loadCountries
document.addEventListener("DOMContentLoaded", () => {
  loadCountries(); //Hämtar länder så jag kan skriva ut dem i puffen

});
//Här gör jag en fetch på API/kursdatan och ser till så att det returneras som javascript
async function fetchCountries() {
  const response = await fetch('https://raw.githubusercontent.com/Ginden/capitals/master/europe.json');
  if (!response.ok) { //Kollar så servern svarar ok
    throw new Error('Kan inte hämta kursdata'); //Om servern inte svarar ok så skrivs detta ut
  }
  return await response.json(); //Svaret görs om till javascript-objekt
}

//Här hämtar jag datan så att jag kan skriva ut listan sen
async function loadCountries() {
  try {
    const data = await fetchCountries(); //Hämtar länder från dokumentet
    fillList(data);  //Sparar länderna globalt
  }
  catch (error) {
    console.error("Det uppstod ett fel:", error.message);
  }
}

//Funktion för attfylla listan
function fillList(countries) {
  const puff = document.querySelector(".puff"); //punkten framför är pga att det är en klass och inte element
  if (!puff) return;
  const ul = document.createElement("ul");

  //Gör en loop för varje land och skapar en rad i listan
  countries.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.properties.country}: ${item.properties.capital}`;
    ul.appendChild(li); //Lägger till li i ul
  });


  puff.appendChild(ul);

}

/**
 * Här hämtar jag data från en extern JSON-fil för att filtrera fram de mest sökta kurserna
 * Kurserna visas i ett stapeldiagram som är byggt med hjälp av Chart.js
 * @typedef {Object} Kursstatistik
 * @property {string} type är typ av utbildning, dvs kurs eller program
 * @property {string} name är namnet på kursen eller programmet
 * @property {string} applicantsFirstHand är antal förstahandssökare
*/
getBarData();
async function getBarData() {
  let labels = [];
  let values = [];
  try {
    const response = await fetch('https://mallarmiun.github.io/Frontend-baserad-webbutveckling/Moment%205%20-%20Dynamiska%20webbplatser/statistik_sokande_ht25.json');
    if (!response.ok) {
      throw new Error(`Fel: ${response.status} ${response.statusText}`);

    }
    const data = await response.json();
    const courses = data.filter(item => item.type === "Kurs");
    courses.sort(
      (a, b) => Number(b.applicantsFirstHand) - Number(a.applicantsFirstHand));
    const top10 = courses.slice(0, 6);

    labels = top10.map((item) => item.name);
    values = top10.map((item) => Number(String(item.applicantsFirstHand).trim()));
  }
  catch (err) {
    console.error("Fel vid hämtning av diagram", err);

  }
  const ctx = document.getElementById("myChart");
  if (!ctx) return;


  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Förstahandssökare',
          backgroundColor: ["#3a90cd",
            "#48ff00",
            "#ff3c00",
            "#ff00b3",
            "#00ffff",
            "#860086",],
          data: values,
          borderWidth: 1
        },],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}


/*----Cirkeldiagram------------------------------------------------------------------------------------------------------------------------------*/

getPieData();
async function getPieData() {
  let labelspie = [];
  let valuespie = [];
  try {
    const response = await fetch('https://mallarmiun.github.io/Frontend-baserad-webbutveckling/Moment%205%20-%20Dynamiska%20webbplatser/statistik_sokande_ht25.json');
    if (!response.ok) {
      throw new Error(`Fel: ${response.status} ${response.statusText}`);

    }
    const data = await response.json();
    const courses = data.filter(item => item.type === "Program");
    courses.sort(
      (a, b) => Number(b.applicantsFirstHand) - Number(a.applicantsFirstHand));
    const top10 = courses.slice(0, 5);

    labelspie = top10.map((item) => item.name);
    valuespie = top10.map((item) => Number(String(item.applicantsFirstHand).trim()));
  }
  catch (err) {
    console.error("Fel vid hämtning av diagram", err);

  }
  const ctx = document.getElementById("myPieChart");
  if (!ctx) return;


  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labelspie,
      datasets: [
        {
          label: "Förstahandssökare",
          backgroundColor: ["#3a90cd",
            "#48ff00",
            "#ff3c00",
            "#ff00b3",
            "#00ffff",
            "#860086",],
          data: valuespie,
          borderWidth: 1
        },],
    },

  });
}

/*----Hamburgermeny------------------------------------------------------------------------------------------------------------------------------*/

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});



/*Kartan*/
var map = L.map('map').setView([55.8708, 12.83016], 13);
var marker = L.marker([55.8708, 12.83016]).addTo(map);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 20,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//Hämtar formuläret från HTML-koden där jag döpt formuläret till search
const form = document.getElementById("search");
//Hämtar textfältet där man skriver in adressen eller staden
const input = document.getElementById("search-city");

//Ltssnar efter när formuläret skickas
form.addEventListener("submit", async function (e) {
  //För att förhindra att formuläret laddas om
  e.preventDefault();

  //Här hämtar jag sökningen och tar bort eventuella mellanslag
  const query = input.value.trim();
  //Om inget skrivits i så avbryts det
  if (!query) return;

  try {
    //Skickar en fetchförfrågan till Nominatim så att jag får koordinaterna till kartan
    const response = await fetch(
      "http://nominatim.openstreetmap.org/search?format=json&limit=5&q=" +
      encodeURIComponent(query)
    );
    //Felmeddelande om något inte funkar
    if (!response.ok) {
      throw new Error("Fel vid hämtning av plats");
    }
    //Gör om från JSON till Javascript
    const data = await response.json();
//Om ingen plats hittas så visas ett felmeddelande
    if (data.length === 0) {
      alert("Ingen plats hittades.");
      return;
    }
//Hämtar latitud och longitud
    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);

    //Gör så att kartan och markörenflyttar till den nya positionen, 15 innebär zoom-graden
    map.setView([lat, lon], 15);
    marker.setLatLng([lat, lon]);

  }
  //Om det finns några fel så skrivs de ut i konsolen
  catch (error) {
    console.log(error);
  }
});
