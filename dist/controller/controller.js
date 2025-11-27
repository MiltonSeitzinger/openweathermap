"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocation = getLocation;
exports.currentLocation = currentLocation;
exports.forecastLocation = forecastLocation;
const publicIp = __importStar(require("public-ip"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = require("../config/config");
async function getLocation() {
    return new Promise(async (resolve, reject) => {
        let ip = await publicIp.publicIpv4();
        let cities = await (0, node_fetch_1.default)(config_1.IP_API + ip)
            .then(response => response.json())
            .then((city) => {
            if (city.status == 'fail') {
                return false;
            }
            else {
                return city;
            }
        });
        if (!cities) {
            reject('No se pudo obtener la ciudad');
        }
        else {
            resolve(cities);
        }
    });
}
async function currentLocation(city) {
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${config_1.KEYWEATHERMAP}&units=metric&lang=es`;
    return new Promise(async (resolve, reject) => {
        let currentWeather = await (0, node_fetch_1.default)(url)
            .then(openWheater => openWheater.json())
            .then((weather) => {
            return weather;
        });
        if (currentWeather.cod == 404) {
            reject('404');
        }
        else if (currentWeather.cod == 200) {
            resolve(currentWeather);
        }
        else {
            reject(currentWeather.message);
        }
    });
}
async function forecastLocation(city) {
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${config_1.KEYWEATHERMAP}&units=metric&lang=es`;
    return new Promise(async (resolve, reject) => {
        let currentWeather = await (0, node_fetch_1.default)(url)
            .then(openWheater => openWheater.json())
            .then((weather) => {
            return weather;
        });
        if (currentWeather.cod == 404) {
            reject('404');
        }
        else if (currentWeather.cod == 200) {
            resolve(currentWeather);
        }
        else {
            reject(currentWeather.message);
        }
    });
}
//# sourceMappingURL=controller.js.map