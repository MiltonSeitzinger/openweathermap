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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const controllers = __importStar(require("../controller/controller"));
function default_1(app) {
    app.get('/v1/location', async (_req, res) => {
        controllers.getLocation()
            .then((locations) => {
            return res.status(200).send({ locations: locations });
        })
            .catch((err) => {
            return res.status(404).send({ error: err });
        });
    });
    /**
     * Endpoint -> /current/:city
     * @params -> city, el cual es opcional.
     * Si city viene incluido como parametro lo utiliza al momento de llamar a currentLocation().
     * Si city no viene incluido llama a getLocation(), para obtener el nombre de la ciudad actual a traves de la IP.
     * @return -> Los datos de la ciudad y del tiempo actual.
     */
    app.get('/v1/current/:city?', async (req, res, _next) => {
        let ciudad;
        if (req.params.city) {
            ciudad = req.params.city;
        }
        else {
            ciudad = await controllers.getLocation()
                .then((locations) => {
                return locations.city || '';
            })
                .catch((err) => {
                return err;
            });
        }
        controllers.currentLocation(ciudad)
            .then((locations) => {
            return res.status(200).send({ locations: locations });
        })
            .catch((err) => {
            if (err == '404') {
                return res.status(404).send({ error: "No se pudo encontrar la ciudad" });
            }
            else {
                return res.status(500).send({ error: err });
            }
        });
    });
    /**
     * Endpoint -> /forecast/:city
     * @params -> city, el cual es opcional.
     * Si city viene incluido como parametro lo utiliza al momento de llamar a forecastLocation().
     * Si city no viene incluido llama a getLocation(), para obtener el nombre de la ciudad actual a traves de la IP.
     * @return -> Los datos de la ciudad y del tiempo extendido a 5 dias.
     */
    app.get('/v1/forecast/:city?', async (req, res, _next) => {
        let ciudad;
        if (req.params.city) {
            ciudad = req.params.city;
        }
        else {
            ciudad = await controllers.getLocation()
                .then((locations) => {
                return locations.city || '';
            })
                .catch((err) => {
                return err;
            });
        }
        controllers.forecastLocation(ciudad)
            .then((locations) => {
            return res.status(200).send({ locations: locations });
        })
            .catch((err) => {
            if (err == '404') {
                return res.status(404).send({ error: "No se pudo encontrar la ciudad" });
            }
            else {
                return res.status(500).send({ error: err });
            }
        });
    });
}
//# sourceMappingURL=routes.js.map