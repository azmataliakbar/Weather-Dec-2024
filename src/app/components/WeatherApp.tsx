import React, { useState } from 'react';
import axios from 'axios';

// Define the types for the weather and forecast data
interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  unit: string;
}

interface ForecastData {
  dateTime: string;
  temperature: number;
  description: string;
}

interface ForecastAPIItem {
  dt_txt: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
  }[];
}

const WeatherApp: React.FC = () => {
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [error, setError] = useState<string>('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!city) {
      setError('Please enter a city.');
      return;
    }

    const apiKey = 'e808063f278324a4a2d132b912ccb6c8'; // Replace with your OpenWeatherMap API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const [weatherResponse, forecastResponse] = await Promise.all([
        axios.get(weatherUrl),
        axios.get(forecastUrl),
      ]);

      // Set weather data
      const weatherData = weatherResponse.data;
      setWeather({
        location: weatherData.name,
        temperature: weatherData.main.temp,
        description: weatherData.weather[0].description,
        unit: 'C',
      });

      // Set forecast data
      const forecastData = forecastResponse.data.list.slice(0, 5).map((item: ForecastAPIItem) => ({
        dateTime: item.dt_txt,
        temperature: item.main.temp,
        description: item.weather[0].description,
      }));
      setForecast(forecastData);

      setError('');
    } catch (error) {
      console.error(error);
      setError('Failed to fetch weather data.');
      setWeather(null);
      setForecast([]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 via-pink-200 to-purple-300 px-2 py-4">
      <div className="bg-white bg-image shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h1 className="heading-1 text-2xl  lg:text-4xl text-red-500 font-bold text-center mb-6">Weather App</h1>
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Find your city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 font-bold text-center text-lg lg:text-2xl button-1"
          />
          <div className=' flex justify-center items-center '>
          <button
            type="submit"
            className="text-xl px-8 bg-gradient-to-r from-blue-400 to-purple-400 text-white py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all font-bold button-1"
          >
            Search
          </button>
          </div>
        </form>

        {error && <div className="text-red-500 text-center mt-4">{error}</div>}

        {weather && (
          <div className="button-1 bg-gray-50 p-4 rounded-lg shadow-md mt-6 text-center ">
            <h2 className="text-3xl font-bold text-green-500 mb-4">{weather.location}</h2>
            <p className="text-xl font-bold text-red-500">Temperature {weather.temperature}°{weather.unit}</p>
            <p className="text-lg font-bold text-blue-500">{weather.description}</p>
          </div>
        )}

        {forecast.length > 0 && (
          <div className="button-1 bg-gray-50  text-black px-4 py-6 rounded-lg shadow-md mt-6 flex flex-col justify-center items-center">
            <div className=''>
            <h3 className=" button-1 text-lg font-bold text-center mb-4 rounded-lg px-16 py-4 lg:px-20">Five Forecasts</h3>
            </div>
            <ul className="space-y-4">
              {forecast.map((day, index) => (
                <li
                  key={index}
                  className="button-1 border rounded-lg shadow-sm bg-white flex justify-between items-center px-3 py-2"
                >
                  <div className='justify-center items-center flex flex-col '>
                  <div className=' text-[20px] lg:text-xl text-green-500 font-bold  truncate overflow-hidden whitespace-nowrap '>
                  <span>{new Date(day.dateTime).toLocaleString()}</span>
                  </div>
                  <div className=' text-[25px]  lg:text-2xl  text-red-500 font-bold '>
                  <span className=''>{day.temperature}°C</span>
                  </div>
                  <div className=' text-[20px]  lg:text-2xl  text-blue-500 font-bold'>
                  <span className=''>{day.description}</span>
                  </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className='author'>
        <h4 className=' text-center text-sm font-bold text-white mt-4'>Author: Azmat Ali</h4>
        </div>
      </div>
      
    </div>
  );
};

export default WeatherApp;
