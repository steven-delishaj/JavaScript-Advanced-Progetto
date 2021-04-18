import "../style/style.css";
import "./animation.js";
import Swal from "sweetalert2";

const API_KEY = process.env.API_KEY;
let air = {};
//
// geolocation
//

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(getPosition, catchError);
} else {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Geolocation is not supported in this browser.",
    footer: "The input field is empty, please write something.",
  });
}

function getPosition(position) {
  let lat = position.coords.latitude;
  let lng = position.coords.longitude;
  console.log(lat, lng);
  airQualityPollutionGeo(lat, lng);
}

function catchError(error) {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: error.message,
  });
}

const airQualityPollutionGeo = (lat, lng) => {
  let api = `https://api.waqi.info/feed/geo:${lat};${lng}/?token=${API_KEY}`;

  fetch(api)
    .then(function (response) {
      let data = response.json();
      return data;
    })
    .then(function (data) {
      console.log(data);
      air.city = data.data.city.name;
      air.index = data.data.aqi;
      air.time = data.data.time.s;
    })
    .then(function () {
      showData();
    });
};

//
// search input
//

const btn = document.getElementById("button");
btn.onclick = () => {
  let check = nameCheck();
  if (check == "ok") {
    airQualityPollutionSearch();
  }
};

document
  .getElementById("cityName")
  .addEventListener("keydown", function (enter) {
    if (enter.keyCode === 13) {
      let check = nameCheck();
      if (check == "ok") {
        airQualityPollutionSearch();
      }
    }
  });

const nameCheck = () => {
  let cityName = document.getElementById("cityName").value;
  if (cityName) {
    console.log(cityName);
    return "ok";
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
      footer: "The input field is empty, please write something.",
    });
  }
};

const airQualityPollutionSearch = () => {
  let city = document.getElementById("cityName").value;

  let api = `https://api.waqi.info/search/?token=${API_KEY}&keyword=${city}`;

  fetch(api)
    .then(function (response) {
      let data = response.json();
      return data;
    })
    .then(function (data) {
      console.log(data);
      air.city = data.data[0].station.name;
      air.index = data.data[0].aqi;
      air.time = data.data[0].time.stime;
    })
    .then(function () {
      showData();
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: "This city isn't in our database yet! : ( ",
      });
    });
};

const showData = () => {
  document.getElementById("name").innerHTML = `${air.city}`;
  document.getElementById(
    "AQPI"
  ).innerHTML = `Air Quality Pollution index: ${air.index}`;
  document.getElementById("level").innerHTML = indexLevel();
  document.getElementById(
    "time"
  ).innerHTML = `Local date and time: ${air.time}`;
};

const indexLevel = () => {
  if (air.index >= 0 && air.index < 51) {
    return "Level: Good , air quality is considered satisfactory!";
  }
  if (air.index >= 51 && air.index < 101) {
    return "Level: Moderate , air quality is acceptable.";
  }
  if (air.index >= 101 && air.index < 151) {
    return "Level: Unhealthy only for sensitive groups.";
  }
  if (air.index >= 151 && air.index < 201) {
    return "Level: Unhealthy , everyone may experience health effects.";
  }
  if (air.index >= 201) {
    return "Level: Hazarduos and very unhealthy , everyone may experience serious health effects";
  }
};
