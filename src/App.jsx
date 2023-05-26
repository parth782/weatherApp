import { useState } from "react";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./api";
import Today from "./components/Today";
import Forecast from "./components/Forecast";
import "./App.css";
import Searchbar from "./components/Searchbar";
import { useEffect } from "react";
import axios from "axios";

// DECLARING STATE VARIABLES FOR CURRENT WEATHER AND FORECAST
function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");
    console.log(WEATHER_API_URL);

    // FETCHING CURRENT LOCATION WEATHER
    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    // FETCHING WEATHER FOR NEXT 7 DAYS
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    // HANDLING PROMISES THROUGH ASYNC FUNCTION
    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forcastResponse = await response[1].json();
        console.log("wcdekjvbk", weatherResponse);
        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forcastResponse });
      })
      .catch(console.log);
  };

  // USE EFFECT HOOK FOR RENDERING CURRENT LOCATION WEATHER AND FORECAST INFO
  useEffect(() => {

    // FETCHING CURRENT LOCATION LATITUDE AND LONGITUDE
    navigator.geolocation.getCurrentPosition((position) => {
      setLat(position.coords.latitude);
      setLon(position.coords.longitude);
    });

    // FETCHING CURRENT LOCATION WEATHER THROUGH AXIOS
    console.log(WEATHER_API_URL);
    axios
      .get(
        `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      )
      .then((response) => setCurrentWeather(response.data))
      .catch(console.log);

      // FETCHING WEATHER FOR NEXT 7 DAYS THROUGH AXIOS
    axios
      .get(
        `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      )
      .then((response) => setForecast(response.data))
      .catch(console.log);
  }, [lat, lon]);
  console.log(lat, lon);
  return (
    <div>
      {/* RENDERING SEARCH BAR COMPONENT */}
      <Searchbar onSearchChange={handleOnSearchChange} />

      <div className="w-full h-screen md:flex items-center justify-between md:gap-4">

        {/* RENDERING TODAY COMPONENT */}
        {currentWeather && <Today data={currentWeather} />}

        {/* RENDERING FORECAST INFORMATION */}
        {forecast && <Forecast data={forecast} />}
      </div>
    </div>
  );
}

export default App;
