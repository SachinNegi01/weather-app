import React, { useState } from "react";
import WeatherBackground from "./component/weatherbackground";

const API_KEY = 'e3e93e55b4ed8b263679631e9c602657';

const App = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [suggestion, setSuggestion] = useState([]);

  // Fetch weather by city name
  const fetchWeatherData = async (url, cityLabel) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.cod && data.cod !== 200) {
        alert(data.message || "City not found.");
        setWeather(null);
        return;
      }
      setWeather(data);
      setCity(cityLabel || data.name);
      setSuggestion([]);
    } catch (err) {
      alert("Failed to fetch weather data.");
      setWeather(null);
    }
  };

  // Handle form submit
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city) return;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    fetchWeatherData(url, city);
  };

  // this func checks weather exists or not and returns an object
  const getWeatherCondition = () =>
    weather && weather.weather && weather.sys && ({
      main: weather.weather[0].main,
      isDay:
        Date.now() / 1000 > weather.sys.sunrise &&
        Date.now() / 1000 < weather.sys.sunset,
    });

  return (
    <div className="min-h-screen">
      <WeatherBackground condition={getWeatherCondition()} />

      <div className="flex items-center justify-center p-6 min-h-screen">
        <div className="bg-transparent backdrop-filter backdrop-blur-md rounded-xl shadow-2xl p-8 max-w-md text-white w-full border-white/30 relative z-10">
          <h1 className="text-4xl font-extrabold text-center mb-6">
            Weather App
          </h1>

          {!weather ? (
            <form onSubmit={handleSearch} className='flex flex-col relative'>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder='Enter City'
                className='mb-4 p-3 rounded border border-white bg-transparent text-white placeholder-white focus:outline-none focus:border-blue-300 transition duration-300'
              />
              {suggestion.length > 0 && (
                <div className='absolute top-12 right-0 bg-transparent shadow-md rounded z-10'>
                  {suggestion.map((s) => (
                    <button type="button" key={`${s.lat}-${s.lon}`} onClick={() => fetchWeatherData(`https://api.openweathermap.org/data/2.5/weather?lat=${s.lat}&lon=&{s.lon}&appid={API key}&units=metric`, `${s.name}, ${s.country}${s.state ? `, ${s.state}` : ''}`

                    )} className =' block hover:bg-blue-700 bg-transparent px-4 py-2 text-sm text-left w-full transition-colors'>
                      {s.name}, {s.country}{s.state && `, ${s.state}`}
                    </button>
                  ))}
                </div>
              )}
              <button
                type='submit'
                className='bg-purple-700 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors'
              >
                Get Weather
              </button>
            </form>
          ) : (
            <div className='mt-6 text-center transition-opacity duration-500'>
              <div className="mb-4">
                <h2 className="text-2xl font-bold">{city}</h2>
                <p className="text-lg">{weather.weather[0].description}</p>
                <p className="text-3xl">{Math.round(weather.main.temp)}°C</p>
              </div>
              <button
                onClick={() => { setWeather(null); setCity(''); }}
                className='mb-4 bg-purple-900 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded transition-colors'>
                New Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;