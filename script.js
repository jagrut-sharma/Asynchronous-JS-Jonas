'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

// FETCH API:

// const request = fetch(`https://restcountries.com/v3.1/name/bharat`);
// console.log(request);

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
  <img class="country__img" src="${data.flags.svg}" />
  <div class="country__data">
    <h3 class="country__name">${data.name.official}</h3>
    <h4 class="country__region">${data.region}</h4>
    <p class="country__row"><span>👫</span>${(
      +data.population / 1000000
    ).toFixed(1)}</p>
    <p class="country__row"><span>🗣️</span>${
      data.languages[Object.keys(data.languages)[0]]
    }</p>
    <p class="country__row"><span>💰</span>${
      data.currencies[Object.keys(data.currencies)[0]].name
    }</p>
  </div>
</article>
  `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  // countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  // countriesContainer.style.opacity = 1;
};

const getJSON = function (url, errorMsg) {
  return fetch(url).then(res => {
    console.log(res);
    if (!res.ok) {
      throw new Error(`${errorMsg} Error: ${res.status}`);
    }
    return res.json();
  });
};

// const getCountryData = function (country) {
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then(function (res) {
//       console.log(res);
//       return res.json();
//     })
//     .then(function (data) {
//       console.log(data);
//       renderCountry(data[0]);
//     });
// };

const getCountryData = function (country) {
  getJSON(
    `https://restcountries.com/v3.1/name/${country}`,
    'Country not found.'
  )
    .then(data => {
      console.log(data[0]);
      renderCountry(data[0]);
      const neighbour = data[0].borders?.[0];
      // const neighbour = 'asasasdasdd';

      // console.log(neighbour);
      if (!neighbour) throw new Error('No neighbour found!');

      // getting data of neighbor
      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        'No neighbour found.'
      );
    })
    .then(data => renderCountry(data[0], 'neighbour'))
    .catch(err => {
      console.error(err.message);
      renderError(`Something went wrong: ${err.message}. Try Again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function () {
  getCountryData('Bharat');
});

// getCountryData('Australia');

/* 
  const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
  <img class="country__img" src="${data.flags.svg}" />
  <div class="country__data">
    <h3 class="country__name">${data.name.official}</h3>
    <h4 class="country__region">${data.region}</h4>
    <p class="country__row"><span>👫</span>${(
      +data.population / 1000000
    ).toFixed(1)}</p>
    <p class="country__row"><span>🗣️</span>${
      data.languages[Object.keys(data.languages)[0]]
    }</p>
    <p class="country__row"><span>💰</span>${
      data.currencies[Object.keys(data.currencies)[0]].name
    }</p>
  </div>
</article>
  `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const getCountryAndNeighbour = function (country) {
  const request = new XMLHttpRequest(); // creates an object of XMLHttpRequest
  // console.log(request);
  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  // Now we need to send the request as well, but can't store it in a variable as it is a async method and will fetch data in backgrpund.
  request.send(); // will run in background => therefore addEventListener is added

  request.addEventListener('load', function () {
    //   console.log(this.responseText);

    const [data] = JSON.parse(this.responseText); // used to convert string received => JSON object
    console.log(data);

    // calling the render function:
    renderCountry(data);

    // get neigbour country:
    const neighbour = data.borders?.[0];

    // checking if neighbour exists
    if (!neighbour) return;

    // AJAX call country 2
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`);
    request2.send();

    request2.addEventListener('load', function () {
      const [data] = JSON.parse(this.responseText);
      console.log(data);

      // render neighbour
      renderCountry(data, 'neighbour');
    });
  });
};

getCountryAndNeighbour('Bharat');
// getCountryAndNeighbour('Maldives'); // testing for countries with no border
// getCountryData('Israel');
// getCountryData('australia');
 */
