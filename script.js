'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const imgContainer = document.querySelector('.images');

///////////////////////////////////////

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

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject); // resolve will pass the position automatically
  });
};

// ASYNC AND AWAIT
const whereAmI = async function () {
  try {
    // Getting co-ordinates:
    const position = await getPosition();
    const { latitude: lat, longitude: long } = position.coords;

    // Getting location:
    const res = await fetch(
      `https://geocode.xyz/${lat},${long}?geoit=json&auth=1339718243064921253x96876`
    );
    if (!res.ok) {
      throw new Error('Promlem getting location data');
    }

    const data = await res.json();
    const country = data.country;

    // Getting details of country:
    const detailsCountry = await fetch(
      `https://restcountries.com/v3.1/name/${country}`
    );

    if (!detailsCountry.ok) {
      throw new Error(`Can't find the country`);
    }
    const details = await detailsCountry.json();
    countriesContainer.style.opacity = 1;
    renderCountry(details[1]);

    return `You are in ${data.city}, ${data.country}`;
  } catch (err) {
    console.error(err);
    renderError(`Something went wrong:🎈 ${err.message}`);

    // Reject promise returned from async function
    throw err;
  }
};

(async function () {
  try {
    console.log('1. Will get location');
    // const city = whereAmI();
    // console.log(city); // consoles a pending promise => its fulfilled value becomes one reyurned by an async function. => which in this case is `You are in ${data.city}, ${data.country}`
    const city = await whereAmI();
    console.log(city);
    console.log('3. Finished getting location');
  } catch (err) {
    console.error(`Error in async function: ${err}`);
  }
})();

// Outputs:
// 1. Will get location
// 3. Finished getting location
// {name: {…}, tld: Array(1), cca2: 'IN', ccn3: '356', cca3: 'IND', …}

// .then(data => {
//   console.log(data[0]);
//   renderCountry(data[0]);
//   const neighbour = data[0].borders?.[0];
//   // const neighbour = 'asasasdasdd';

//   // console.log(neighbour);
//   if (!neighbour) throw new Error('No neighbour found!');

//   // getting data of neighbor
//   return getJSON(
//     `https://restcountries.com/v3.1/alpha/${neighbour}`,
//     'No neighbour found.'
//   );
// })
// .then(data => renderCountry(data[0], 'neighbour'))
// .catch(err => console.error(`Error observed: ${err.message}`))
// .finally(() => {
//   countriesContainer.style.opacity = 1;
// });
// };

/*
// CODING CHALLENGE - 2:
const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const imgEle = document.createElement('img');
    imgEle.src = imgPath;

    imgEle.addEventListener('load', function () {
      imgContainer.append(imgEle);
      resolve(imgEle);
    });

    imgEle.addEventListener('error', function () {
      reject(new Error('Error in loading image. Image not found'));
    });
  });
};

let currImg;

createImage(`./img/img-1.jpg`)
  .then(img => {
    currImg = img;
    console.log('Image 1 loaded and displayed');
    return wait(2);
  })
  .then(() => {
    currImg.style.display = 'none';
    return createImage('./img/img-2.jpg');
  })
  .then(img => {
    currImg = img;
    console.log('Image 2 Loaded and displayed');
    return wait(2);
  })
  .then(() => {
    currImg.style.display = 'none';
    return createImage('./img/img-3.jpg');
  })
  .then(img => {
    console.log('Image 3 Loaded and Displayed');
  })
  .catch(err => console.error(err.message));

// Creating wait function
const wait = function (timer) {
  return new Promise(function (resolve) {
    setTimeout(resolve, timer * 1000);
  });
};
/*
// Promisifying the geolocation API:

// navigator.geolocation.getCurrentPosition(
//   pos => console.log(pos), // GeolocationPosition {coords: GeolocationCoordinates, timestamp: 1679480413660}
//   err => console.error(err)
// );

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    // navigator.geolocation.getCurrentPosition(
    //   pos => resolve(pos),
    //   err => reject(err)
    // );

    // Can be written in shortcut as follows:
    navigator.geolocation.getCurrentPosition(resolve, reject); // resolve will pass the position automatically
  });
};

console.log('Getting position');

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

const whereAmI = function () {
  getPosition()
    .then(pos => {
      const { latitude: lat, longitude: long } = pos.coords;
      return fetch(
        `https://geocode.xyz/${lat},${long}?geoit=json&auth=1339718243064921253x96876`
      );
    })
    .then(response => {
      console.log(response);
      if (!response.ok) {
        throw new Error(`Problem with geocoding ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // console.log(data);
      console.log(`You are in ${data.city}, ${data.country}`);

      // getting data
      const country = data.country;
      return getJSON(
        `https://restcountries.com/v3.1/name/${country}`,
        'Country not found.'
      );
    })
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
    .catch(err => console.error(`Error observed: ${err.message}`))
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

getPosition().then(pos => console.log(pos)); // GeolocationPosition {coords: GeolocationCoordinates, timestamp: 1679480637228}

btn.addEventListener('click', whereAmI);

/*
// Building a Promise:

const lottery = new Promise(function (resolve, reject) {
  console.log('Lottery is being drawn.... 🎡');
  setTimeout(function () {
    if (Math.random() >= 0.5) {
      resolve('Congrats, you won the lottery!! ✨');
    } else {
      reject(new Error('Sorry, You lost 😥'));
    }
  }, 2000);
});

lottery.then(res => console.log(res)).catch(err => console.error(err));

// Promisifying setTimeout:
const wait = function (seconds) {
  return new Promise(function (resolve) {
    // Here we didn't use reject as parameter => setTimeout will definitely return a result and not fail.
    setTimeout(resolve, seconds * 1000); // No resolve message is passed => Not mandatory to pass a value inside resolve.
  });
};

wait(2)
  .then(() => {
    // No parameter is received it is empty () as only resolve was passed and no message/data was passed.
    console.log('Waited for 2 seconds');
    return wait(1);
  })
  .then(() => console.log('Waited for 1 second'));

// Similary for avoiding pyramid of doom:
// setTimeout(() => {
//   console.log('1 second passed');
//   setTimeout(() => {
//     console.log('2 second passed');
//     setTimeout(() => {
//       console.log('3 seconds passed');
//       setTimeout(() => console.log('4 seconds passed'), 1000);
//     }, 1000);
//   }, 1000);
// }, 1000);

// This can be promisified as follows:

wait(1)
  .then(() => {
    console.log('1 second has passed');
    return wait(1);
  })
  .then(() => {
    console.log('2 seconds has passed');
    return wait(1);
  })
  .then(() => {
    console.log('3 seconds have passed');
    return wait(1);
  })
  .then(() => console.log('4 seconds have passed'));

// Directky resolving and rejecting Promise:

Promise.resolve('ABC').then(x => console.log(x));
Promise.reject('DEF').catch(x => console.error(x));

/*
// CODING CHALLENGE - 1:

// In this challenge you will build a function 'whereAmI' which renders a country
// only based on GPS coordinates. For that, you will use a second API to geocode
// coordinates. So in this challenge, you’ll use an API on your own for the first time 😁
// Your tasks:
// PART 1
// 1. Create a function 'whereAmI' which takes as inputs a latitude value ('lat')
// and a longitude value ('lng') (these are GPS coordinates, examples are in test
// data below).
// 2. Do “reverse geocoding” of the provided coordinates. Reverse geocoding means
// to convert coordinates to a meaningful location, like a city and country name.
// Use this API to do reverse geocoding: https://geocode.xyz/api. The AJAX call
// will be done to a URL with this format:
// https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and
// promises to get the data. Do not use the 'getJSON' function we created, that
// is cheating 😉
// 3. Once you have the data, take a look at it in the console to see all the attributes
// that you received about the provided location. Then, using this data, log a
// message like this to the console: “You are in Berlin, Germany”
// 4. Chain a .catch method to the end of the promise chain and log errors to the
// console
// 5. This API allows you to make only 3 requests per second. If you reload fast, you
// will get this error with code 403. This is an error with the request. Remember,
// fetch() does not reject the promise in this case. So create an error to reject
// the promise yourself, with a meaningful error message

// ? PART 2
// 6. Now it's time to use the received data to render a country. So take the relevant
// attribute from the geocoding API result, and plug it into the countries API that
// we have been using.
// 7. Render the country and catch any errors, just like we have done in the last
// lecture (you can even copy this code, no need to type the same code)

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

const whereAmI = function (lat, long) {
  const url = `https://geocode.xyz/${lat},${long}?geoit=json&auth=1339718243064921253x96876`; // &auth=1339718243064921253x96876
  fetch(url)
    .then(response => {
      console.log(response);
      if (!response.ok) {
        throw new Error(`Problem with geocoding ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // console.log(data);
      console.log(`You are in ${data.city}, ${data.country}`);

      // getting data
      const country = data.country;
      return getJSON(
        `https://restcountries.com/v3.1/name/${country}`,
        'Country not found.'
      );
    })
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
    .catch(err => console.error(`Error observed: ${err.message}`))
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

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

// whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
whereAmI(-33.933, 18.474);

// Coordinates 1: 52.508, 13.381 (Latitude, Longitude)
// Coordinates 2: 19.037, 72.873
// Coordinates 3: -33.933, 18.474

/*
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
