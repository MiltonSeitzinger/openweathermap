/**
 * Respuesta exitosa de la API de OpenWeatherMap para tiempo actual (/weather)
 */
export interface WeatherResponse {
	coord: {
		lon: number;
		lat: number;
	};
	weather: Array<{
		id: number;
		main: string;
		description: string;
		icon: string;
	}>;
	base: string;
	main: {
		temp: number;
		feels_like: number;
		temp_min: number;
		temp_max: number;
		pressure: number;
		humidity: number;
	};
	visibility: number;
	wind: {
		speed: number;
		deg: number;
		gust?: number;
	};
	clouds: {
		all: number;
	};
	dt: number;
	sys: {
		type?: number;
		id?: number;
		country: string;
		sunrise: number;
		sunset: number;
	};
	timezone: number;
	id: number;
	name: string;
	cod: number;
}


export interface WeatherErrorResponse {
	cod: number | string;
	message: string;
}

export interface ForecastList {
	dt: number;
	main: {
		temp: number;
		feels_like: number;
		temp_min: number;
		temp_max: number;
		pressure: number;
		sea_level: number;
		grnd_level: number;
		humidity: number;
		temp_kf: number;
	};
	weather: Array<{
		id: number;
		main: string;
		description: string;
		icon: string;
	}>;
	clouds: {
		all: number;
	};
	wind: {
		speed: number;
		deg: number;
		gust?: number;
	};
	visibility: number;
	pop: number;
	rain?: {
		'3h': number;
	};
	snow?: {
		'3h': number;
	};
	sys: {
		pod: string;
	};
	dt_txt: string;
}

export interface ForecastResponse {
	cod: string;
	message: number;
	cnt: number;
	list: ForecastList[];
	city: {
		id: number;
		name: string;
		coord: {
			lat: number;
			lon: number;
		};
		country: string;
		population: number;
		timezone: number;
		sunrise: number;
		sunset: number;
	};
}


export type WeatherApiResponse = WeatherResponse | WeatherErrorResponse;
export type ForecastApiResponse = ForecastResponse | WeatherErrorResponse;


