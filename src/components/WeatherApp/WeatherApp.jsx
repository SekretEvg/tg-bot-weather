import React, { useEffect, useState } from "react";
import "./WeatherApp.css";
import searchIcon from "../../assets/search.png";
import cloudIcon from "../../assets/cloud.png";
import humidityIcon from "../../assets/humidity.png";
import windIcon from "../../assets/wind.png";
import { config } from "../../config/config";

const WeatherApp = () => {
  const [searchCity, setSearchCity] = useState("");
  const [city, setCity] = useState("Default City");
  const [conditionText, setConditionText] = useState("");
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [windSpeed, setWindSpeed] = useState(0);
  const [weatherImage, setWeatherImage] = useState(cloudIcon);
  const [lat, setLat] = useState(52.28);
  const [lon, setLon] = useState(104.31);

  const setData = async (data) => {
    setCity(data.location.name);
    setTemperature(Math.round(data.current.temp_c));
    setWeatherImage(data.current.condition.icon);
    setHumidity(data.current.humidity);
    setWindSpeed(Math.round(data.current.wind_kph));
    setConditionText(data.current.condition.text);
  };

  useEffect(() => {
    const fetchData = async () => {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
      });
      const response = await fetch(
        `${config.BASE_URL + config.API_KEY}&q=${lat},${lon}&lang=ru`
      );
      const data = await response.json();
      setData(data);
    };
    fetchData();
  }, [lat, lon]);

  const onChangeSearch = (e) => {
    setSearchCity(e.target.value);
  };

  const getWeather = async () => {
    const response = await fetch(
      `${config.BASE_URL + config.API_KEY}&q=${searchCity}&lang=ru`
    );
    if (response.status === 200) {
      const data = await response.json();
      setData(data);
    }
  };

  const searchHandler = () => {
    getWeather();
    setSearchCity("");
  };

  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchHandler();
    }
  };

  return (
    <div className="container">
      <div className="top-bar">
        <input
          value={searchCity}
          onChange={onChangeSearch}
          type="text"
          className="cityInput"
          placeholder="Поиск..."
          onKeyDown={onSearchKeyDown}
        />
        <div onClick={searchHandler} className="search-icon">
          <img src={searchIcon} alt="Search Icon" />
        </div>
      </div>
      <div className="weather-image">
        <img src={weatherImage} alt="Weather Icon" />
      </div>

      <div className="weather-temp">{temperature} ºC</div>
      <div className="weather-condition-text">{conditionText}</div>
      <div className="weather-location">{city}</div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="Humidity Icon" className="icon" />
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Влажность</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="Wind Icon" className="icon" />
          <div className="data">
            <div className="humidity-percent">{windSpeed} км/ч</div>
            <div className="text">Скорость ветра</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
