import { KEYWEATHERMAP } from "../config/config"
import { WeatherResponse } from "../interface/weather.interface"

function getOpenWeatherUrl(city: string, type: 'current' | 'forecast'): string {
  switch(type) {
    case 'current':
      return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEYWEATHERMAP}&units=metric&lang=es`
    case 'forecast':
      return `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${KEYWEATHERMAP}&units=metric&lang=es`
    default:
      throw new Error('Invalid type')
  }
}

export async function fetchWeather(city: string, type: 'current' | 'forecast'): Promise<WeatherResponse> {
  try {
  const url = getOpenWeatherUrl(city, type)
    return await fetch(url).then(res => res.json()).then(data => data as WeatherResponse)
  } catch (error) {
    throw error
  }
}

