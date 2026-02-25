"use strict";

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


