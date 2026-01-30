import React, { useEffect, useState } from 'react';

interface HourlyData {
  time: string;
  temp: number;
  code: number;
  pop: number;
}

interface WeatherData {
  temperature: number;
  weatherCode: number;
  minTemp: number;
  maxTemp: number;
  rainProb: number;
  hourly: HourlyData[];
}

interface WeatherCardProps {
  lat: number;
  lng: number;
  locationName: string;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ lat, lng, locationName }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&hourly=temperature_2m,weather_code,precipitation_probability&timezone=auto`
        );
        const data = await response.json();
        
        if (data.current && data.daily && data.hourly) {
          const now = new Date();
          
          // Map and filter hourly data for the next 24 hours
          const hourly: HourlyData[] = data.hourly.time
            .map((time: string, index: number) => ({
              time,
              temp: data.hourly.temperature_2m[index],
              code: data.hourly.weather_code[index],
              pop: data.hourly.precipitation_probability[index]
            }))
            .filter((item: HourlyData) => new Date(item.time) >= now)
            .slice(0, 24);

          setWeather({
            temperature: data.current.temperature_2m,
            weatherCode: data.current.weather_code,
            minTemp: data.daily.temperature_2m_min[0],
            maxTemp: data.daily.temperature_2m_max[0],
            rainProb: data.daily.precipitation_probability_max[0],
            hourly
          });
        }
      } catch (error) {
        console.error("Failed to fetch weather", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lng]);

  const getWeatherIcon = (code: number) => {
    if (code === 0) return 'sunny';
    if (code <= 3) return 'partly_cloudy_day';
    if (code <= 48) return 'foggy';
    if (code <= 67) return 'rainy';
    if (code <= 77) return 'weather_snowy';
    if (code <= 82) return 'rainy';
    if (code <= 99) return 'thunderstorm';
    return 'question_mark';
  };

  const getWeatherText = (code: number) => {
      if (code === 0) return '晴朗';
      if (code <= 3) return '多雲';
      if (code <= 48) return '起霧';
      if (code <= 67) return '下雨';
      if (code <= 82) return '陣雨';
      if (code <= 99) return '雷雨';
      return '未知';
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.getHours().toString().padStart(2, '0') + ':00';
  };

  if (loading) return (
    <div className="w-full h-48 rounded-2xl bg-white/40 animate-pulse border border-white/50 shadow-sm"></div>
  );
  
  if (!weather) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/90 to-sky-400/90 text-white shadow-lg backdrop-blur-md transition-transform hover:scale-[1.01]">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20 blur-2xl"></div>
      
      {/* Current Weather Section */}
      <div className="relative z-10 flex items-center justify-between p-5 pb-2">
        <div className="flex items-center gap-4">
          <span className="material-symbols-rounded text-5xl drop-shadow-md">
            {getWeatherIcon(weather.weatherCode)}
          </span>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="material-symbols-rounded text-sm">location_on</span>
               <h3 className="font-bold text-lg leading-none">{locationName}</h3>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-4xl font-bold tracking-tight">{Math.round(weather.temperature)}°</span>
                <span className="text-sm font-medium bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {getWeatherText(weather.weatherCode)}
                </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm font-medium opacity-90 flex flex-col gap-1">
            <div className="flex items-center justify-end gap-1">
                <span className="material-symbols-rounded text-sm">thermometer_arrow_up</span>
                <span>{Math.round(weather.maxTemp)}°</span>
            </div>
            <div className="flex items-center justify-end gap-1">
                <span className="material-symbols-rounded text-sm">thermometer_arrow_down</span>
                <span>{Math.round(weather.minTemp)}°</span>
            </div>
            <div className="flex items-center justify-end gap-1 mt-1 text-blue-100 font-bold">
                <span className="material-symbols-rounded text-sm">umbrella</span>
                <span>{weather.rainProb}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="my-2 mx-5 border-t border-white/20"></div>

      {/* Hourly Forecast Carousel */}
      <div className="scrollbar-hide relative z-10 flex overflow-x-auto px-5 pb-5 pt-2">
        <div className="flex gap-4">
          {weather.hourly.map((hour, idx) => (
            <div key={idx} className="flex min-w-[3.5rem] flex-col items-center justify-between gap-2 rounded-xl bg-white/10 p-2 backdrop-blur-sm">
              <span className="text-xs font-medium opacity-80">{formatTime(hour.time)}</span>
              <span className="material-symbols-rounded text-2xl drop-shadow-sm">
                {getWeatherIcon(hour.code)}
              </span>
              <div className="flex flex-col items-center">
                 <span className="text-lg font-bold leading-none">{Math.round(hour.temp)}°</span>
                 {hour.pop > 20 && (
                    <span className="text-[10px] text-blue-200 font-medium mt-1">{hour.pop}%</span>
                 )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};