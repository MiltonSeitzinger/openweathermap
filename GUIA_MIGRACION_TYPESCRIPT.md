# Guía de Migración a TypeScript - Paso a Paso

## 📋 Resumen del Proyecto Actual
Tu proyecto es una API REST con Express.js que consume la API de OpenWeatherMap. Tiene la siguiente estructura:
- `index.js` - Punto de entrada de la aplicación
- `routes/routes.js` - Definición de rutas
- `controller/controller.js` - Lógica de negocio
- `config.js` - Configuración
- `tests/api.test.js` - Tests

---

## 🚀 PASO 1: Instalar Dependencias de TypeScript

Ejecuta los siguientes comandos en tu terminal:

```bash
# Instalar TypeScript y tipos necesarios
npm install --save-dev typescript @types/node @types/express @types/cors @types/body-parser @types/mocha @types/supertest @types/should

# Instalar ts-node para ejecutar TypeScript directamente
npm install --save-dev ts-node

# Instalar ts-node-dev para desarrollo con hot-reload (opcional pero recomendado)
npm install --save-dev ts-node-dev
```

**Explicación:**
- `typescript`: El compilador de TypeScript
- `@types/*`: Definiciones de tipos para las librerías que usas
- `ts-node`: Permite ejecutar archivos `.ts` directamente sin compilar
- `ts-node-dev`: Similar a nodemon pero para TypeScript

---

## 🔧 PASO 2: Crear archivo de configuración de TypeScript

Crea un archivo llamado `tsconfig.json` en la raíz del proyecto con el siguiente contenido:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

**Explicación de opciones importantes:**
- `outDir`: Donde se compilarán los archivos JavaScript
- `rootDir`: Donde estarán tus archivos TypeScript fuente
- `strict`: Habilita todas las verificaciones estrictas de tipos
- `sourceMap`: Genera mapas de fuente para debugging

---

## 📁 PASO 3: Reestructurar el proyecto

Crea la siguiente estructura de carpetas:

```bash
# Crear carpeta src para código TypeScript
mkdir src
mkdir src/routes
mkdir src/controller
mkdir src/config

# Crear carpeta dist para código compilado (se creará automáticamente, pero puedes crearla)
mkdir dist
```

**Estructura final esperada:**
```
openweathermap/
├── src/
│   ├── config/
│   │   └── config.ts
│   ├── controller/
│   │   └── controller.ts
│   ├── routes/
│   │   └── routes.ts
│   └── index.ts
├── tests/
│   └── api.test.js (o api.test.ts si también migras los tests)
├── dist/ (generado automáticamente)
├── tsconfig.json
└── package.json
```

---

## 📝 PASO 4: Migrar archivo por archivo

### 4.1 Migrar `config.js` → `src/config/config.ts`

1. **Crea el archivo** `src/config/config.ts`
2. **Copia el contenido** de `config.js` y conviértelo así:

```typescript
export const KEYWEATHERMAP: string = ''; // apiKey de Open Weather Map
export const IP_API: string = "http://ip-api.com/json/";
```

**Cambios realizados:**
- `exports.KEYWEATHERMAP` → `export const KEYWEATHERMAP: string`
- `exports.IP_API` → `export const IP_API: string`
- Agregar tipos explícitos `: string`

---

### 4.2 Migrar `controller/controller.js` → `src/controller/controller.ts`

1. **Crea el archivo** `src/controller/controller.ts`
2. **Convierte el código** así:

```typescript
import publicIp from 'public-ip';
import fetch from 'node-fetch';
import { KEYWEATHERMAP, IP_API } from '../config/config';

// Definir interfaces para los tipos de datos
interface CityData {
    status?: string;
    city?: string;
    [key: string]: any; // Para otras propiedades que puedan venir
}

interface WeatherResponse {
    cod: number | string;
    message?: string;
    [key: string]: any; // Para otras propiedades del clima
}

/**
 * Function -> /getLocation
 * @returns Promise con los datos de la ciudad de acuerdo a la IP
 */
async function getLocation(): Promise<CityData> {
    return new Promise(async (resolve, reject) => {
        try {
            const ip: string = await publicIp.v4();
            const cities: CityData | false = await fetch(IP_API + ip)
                .then(response => response.json())
                .then((city: CityData) => {
                    if (city.status == 'fail') {
                        return false;
                    } else {
                        return city;
                    }
                });
            
            if (!cities) {
                reject('No se pudo obtener la ciudad');
            } else {
                resolve(cities);
            }
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Function -> /currentLocation
 * @param city - Nombre de la ciudad
 * @returns Promise con los datos del tiempo actual
 */
async function currentLocation(city: string): Promise<WeatherResponse> {
    const url: string = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEYWEATHERMAP}&units=metric&lang=es`;
    
    return new Promise(async (resolve, reject) => {
        try {
            const currentWeather: WeatherResponse = await fetch(url)
                .then(openWeather => openWeather.json())
                .then((weather: WeatherResponse) => {
                    return weather;
                });
            
            if (currentWeather.cod == 404) {
                reject('404');
            } else if (currentWeather.cod == 200) {
                resolve(currentWeather);
            } else {
                reject(currentWeather.message || 'Error desconocido');
            }
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Function -> /forecastLocation
 * @param city - Nombre de la ciudad
 * @returns Promise con los datos del pronóstico extendido
 */
async function forecastLocation(city: string): Promise<WeatherResponse> {
    const url: string = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${KEYWEATHERMAP}&units=metric&lang=es`;
    
    return new Promise(async (resolve, reject) => {
        try {
            const currentWeather: WeatherResponse = await fetch(url)
                .then(openWeather => openWeather.json())
                .then((weather: WeatherResponse) => {
                    return weather;
                });
            
            if (currentWeather.cod == 404) {
                reject('404');
            } else if (currentWeather.cod == 200) {
                resolve(currentWeather);
            } else {
                reject(currentWeather.message || 'Error desconocido');
            }
        } catch (error) {
            reject(error);
        }
    });
}

export {
    getLocation,
    currentLocation,
    forecastLocation
};
```

**Cambios realizados:**
- `require()` → `import`
- `module.exports` → `export`
- Agregar tipos a parámetros: `city: string`
- Agregar tipos de retorno: `Promise<CityData>`, `Promise<WeatherResponse>`
- Definir interfaces para estructuras de datos
- Agregar manejo de errores con try-catch

---

### 4.3 Migrar `routes/routes.js` → `src/routes/routes.ts`

1. **Crea el archivo** `src/routes/routes.ts`
2. **Convierte el código** así:

```typescript
import { Express, Request, Response, NextFunction } from 'express';
import * as controllers from '../controller/controller';

export default function(app: Express): void {
    /** 
     * Endpoint -> /location
     * Llama al controlador getLocation -> La cual obtiene los datos de la ciudad de acuerdo a la IP.
     */
    app.get('/v1/location', (req: Request, res: Response) => {
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
    app.get('/v1/current/:city?', async (req: Request, res: Response, next: NextFunction) => {
        let ciudad: string;
        
        if (req.params.city) {
            ciudad = req.params.city;
        } else {
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
                } else {
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
    app.get('/v1/forecast/:city?', async (req: Request, res: Response, next: NextFunction) => {
        let ciudad: string;
        
        if (req.params.city) {
            ciudad = req.params.city;
        } else {
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
                } else {
                    return res.status(500).send({ error: err });
                }
            });
    });
}
```

**Cambios realizados:**
- `require()` → `import`
- `module.exports` → `export default`
- Agregar tipos a parámetros: `app: Express`, `req: Request`, `res: Response`, `next: NextFunction`
- Agregar tipo de retorno: `void` para la función
- Tipar variables: `ciudad: string`
- Manejar posibles valores undefined con `|| ''`

---

### 4.4 Migrar `index.js` → `src/index.ts`

1. **Crea el archivo** `src/index.ts`
2. **Convierte el código** así:

```typescript
import bodyParser from 'body-parser';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes/routes';

const port: number = parseInt(process.env.PORT || '3000', 10);
const app: Express = express();

app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '5mb' }));

app.use(function(req: Request, res: Response, next: NextFunction) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header("Access-Control-Allow-Methods", 'GET, POST, PUT, DELETE, PATCH');
    res.header("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

routes(app);

app.get('*', (req: Request, res: Response) => {
    res.status(404).send({ mensaje: 'No existe la ruta' });
});

app.listen(port, () => {
    console.log('Server Running on port: ', port);
});

export default app;
```

**Cambios realizados:**
- `require()` → `import`
- `module.exports` → `export default`
- Tipar `port: number` con conversión explícita
- Tipar `app: Express`
- Agregar tipos a callbacks: `req: Request`, `res: Response`, `next: NextFunction`
- Cambiar `true` a `'true'` en header (aunque esto puede ser un error, normalmente es boolean)

---

## 🔄 PASO 5: Actualizar package.json

Modifica tu `package.json` para agregar los scripts de TypeScript:

```json
{
  "name": "openweather",
  "version": "1.0.0",
  "description": "",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "test": "mocha tests/api.test.js --timeout 3000 --exit"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "body-parser": "^1.19.0",
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "geoip-lite": "^1.4.2",
    "mocha": "^8.2.1",
    "node-fetch": "^2.6.1",
    "public-ip": "^4.0.3",
    "should": "^13.2.3",
    "supertest": "^6.1.1"
  },
  "devDependencies": {
    "@types/body-parser": "^1.19.2",
    "@types/cors": "^2.8.13",
    "@types/express": "^4.17.17",
    "@types/mocha": "^10.0.1",
    "@types/node": "^20.5.0",
    "@types/should": "^13.0.0",
    "@types/supertest": "^2.0.12",
    "ts-node": "^10.9.1",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.1.6"
  }
}
```

**Cambios:**
- `main`: Cambiar de `index.js` a `dist/index.js`
- `build`: Script para compilar TypeScript
- `start`: Ejecutar el código compilado
- `dev`: Ejecutar en modo desarrollo con hot-reload

---

## 🧪 PASO 6: Actualizar tests (Opcional pero recomendado)

Si quieres migrar también los tests a TypeScript:

1. **Instala dependencias adicionales:**
```bash
npm install --save-dev @types/node-fetch
```

2. **Crea** `tests/api.test.ts` (similar estructura pero con tipos)

3. **Actualiza el script de test en package.json:**
```json
"test": "mocha -r ts-node/register tests/api.test.ts --timeout 3000 --exit"
```

---

## 🏃 PASO 7: Compilar y ejecutar

1. **Compilar el proyecto:**
```bash
npm run build
```

2. **Ejecutar en producción:**
```bash
npm start
```

3. **Ejecutar en desarrollo (con hot-reload):**
```bash
npm run dev
```

---

## 📌 PASO 8: Crear .gitignore para TypeScript

Asegúrate de que tu `.gitignore` incluya:

```
node_modules/
dist/
*.log
.env
```

---

## ⚠️ NOTAS IMPORTANTES

1. **Tipos faltantes:** Algunas librerías como `public-ip` y `node-fetch` pueden necesitar tipos adicionales. Si ves errores, puedes:
   - Crear un archivo `src/types/public-ip.d.ts` con declaraciones de tipos
   - O usar `// @ts-ignore` temporalmente (no recomendado)

2. **Variables de entorno:** Considera usar `dotenv` para manejar la API key:
   ```bash
   npm install dotenv
   npm install --save-dev @types/dotenv
   ```

3. **Errores comunes:**
   - Si `public-ip` da error, puede que necesites usar `import * as publicIp from 'public-ip'`
   - Si `node-fetch` da error en TypeScript, puede que necesites usar la versión 2.x o crear tipos personalizados

4. **Validación:** Después de migrar, ejecuta `npm run build` para verificar que no hay errores de compilación.

---

## 📝 PASO 9: Definir Interfaces y Tipos (CRÍTICO)

**Problema actual:** Durante la migración inicial, todo el código usa `any`, lo cual elimina los beneficios principales de TypeScript.

### Qué hacer:

1. **Crear carpeta de tipos:**
   - Crear `src/types/` para organizar todas las definiciones de tipos

2. **Definir interfaces para APIs externas:**
   - Crear `src/types/weather.types.ts` para las respuestas de OpenWeatherMap API
   - Crear `src/types/location.types.ts` para las respuestas de IP-API
   - Crear `src/types/errors.types.ts` para errores personalizados

3. **Reemplazar todos los `any`:**
   - Tipar parámetros de funciones
   - Tipar valores de retorno
   - Tipar variables y constantes
   - Tipar respuestas de APIs

4. **Beneficios:**
   - Autocompletado en el IDE
   - Detección de errores en tiempo de compilación
   - Mejor documentación del código
   - Refactorización más segura

---

## 🏗️ PASO 10: Separar Responsabilidades - Arquitectura Correcta

**Problema actual:** El código mezcla responsabilidades. El controller está haciendo lógica de negocio y llamadas a APIs directamente.

### Estructura recomendada:

```
src/
├── config/          → Configuración y variables de entorno
├── types/           → Interfaces y tipos TypeScript
├── services/        → Lógica de negocio y llamadas a APIs externas
├── controllers/     → Manejo de HTTP (Request/Response)
├── routes/          → Mapeo de URLs a Controllers
└── index.ts         → Punto de entrada
```

### Roles y Responsabilidades:

#### Routes (routes.ts)
- **Función:** Mapear URLs a Controllers
- **Responsabilidades:**
  - Definir las rutas de la API
  - Conectar cada ruta con su Controller correspondiente
  - Configurar middlewares específicos de ruta si es necesario
- **NO debe:** Contener lógica de negocio, manejar errores HTTP, llamar a servicios directamente

#### Controller (controller.ts)
- **Función:** Manejar la capa HTTP
- **Responsabilidades:**
  - Recibir Request HTTP
  - Validar datos de entrada (params, query, body)
  - Llamar a Services para obtener datos
  - Formatear Response HTTP
  - Manejar códigos de estado HTTP (200, 404, 500)
  - Manejar errores HTTP y convertirlos en respuestas apropiadas
- **NO debe:** Contener lógica de negocio compleja, hacer llamadas directas a APIs externas

#### Service (service.ts)
- **Función:** Contener la lógica de negocio
- **Responsabilidades:**
  - Ejecutar lógica de negocio
  - Hacer llamadas a APIs externas (OpenWeatherMap, IP-API)
  - Transformar y validar datos
  - Lanzar errores de negocio tipados
- **NO debe:** Manejar Request/Response HTTP, formatear respuestas HTTP

### Flujo de datos:

```
Request → Routes → Controller → Service → API Externa
                                    ↓
Response ← Controller ← Service ← Datos transformados
```

### Qué refactorizar:

1. **Mover lógica de negocio del Controller al Service:**
   - Las llamadas a APIs externas deben estar en Services
   - La transformación de datos debe estar en Services
   - El Controller solo debe llamar al Service y formatear la respuesta

2. **Simplificar Routes:**
   - Routes debe solo mapear URLs a métodos del Controller
   - Eliminar toda lógica de negocio de Routes
   - Eliminar manejo de errores de Routes

3. **Crear Services separados:**
   - `LocationService` para lógica relacionada con ubicación por IP
   - `WeatherService` para lógica relacionada con datos del clima

---

## 🔐 PASO 11: Implementar Variables de Entorno con dotenv

**Problema actual:** La API key está hardcodeada en el archivo de configuración, lo cual es inseguro.

### Qué hacer:

1. **Instalar dotenv:**
   - Instalar `dotenv` como dependencia
   - Instalar `@types/dotenv` como devDependency

2. **Crear archivo .env:**
   - Crear archivo `.env` en la raíz del proyecto
   - Agregar las variables de entorno necesarias (API keys, URLs, etc.)
   - **IMPORTANTE:** Agregar `.env` al `.gitignore`

3. **Actualizar config.ts:**
   - Cargar dotenv al inicio de la aplicación
   - Leer variables de entorno usando `process.env`
   - Proporcionar valores por defecto si es necesario

4. **Beneficios:**
   - Seguridad: No exponer credenciales en el código
   - Flexibilidad: Diferentes configuraciones para desarrollo/producción
   - Buenas prácticas: Separar configuración del código

---

## 📌 PASO 12: Actualizar .gitignore

Asegúrate de que tu `.gitignore` incluya todos los archivos que no deben versionarse:

**Archivos a agregar:**
- `dist/` - Código compilado de TypeScript
- `*.log` - Archivos de log
- `.env` - Variables de entorno (contiene credenciales)
- `.env.local` - Variables de entorno locales
- `.env.*.local` - Cualquier variante local de .env

**Razón:** Estos archivos son generados automáticamente o contienen información sensible que no debe estar en el repositorio.

---

## 🛡️ PASO 13: Mejorar Manejo de Errores

**Problema actual:** 
- Errores genéricos sin tipos
- Comparaciones con strings (`err == '404'`)
- No hay clases de error personalizadas
- Manejo de errores inconsistente

### Qué hacer:

1. **Crear clases de error personalizadas:**
   - Crear `src/types/errors.types.ts` o `src/errors/`
   - Definir clases de error específicas (ej: `CityNotFoundError`, `WeatherApiError`)
   - Extender de `Error` nativo de JavaScript

2. **Tipar errores:**
   - Usar tipos específicos en lugar de `any` o `string`
   - Crear uniones de tipos para errores esperados
   - Usar type guards para verificar tipos de error

3. **Manejo consistente:**
   - El Service debe lanzar errores tipados
   - El Controller debe capturar y convertir errores en respuestas HTTP apropiadas
   - Usar códigos de estado HTTP correctos según el tipo de error

4. **Beneficios:**
   - Código más mantenible
   - Mejor debugging
   - Respuestas HTTP más informativas
   - Type safety en el manejo de errores

---

## ⚡ PASO 14: Optimizaciones de Código

### Optimizaciones recomendadas:

1. **Eliminar Promises innecesarios:**
   - Las funciones `async` ya retornan Promises
   - No necesitas envolver código async en `new Promise()`
   - Usar directamente `async/await`

2. **Usar async/await en lugar de .then()/.catch():**
   - Código más legible y fácil de mantener
   - Mejor manejo de errores con try/catch
   - Evitar "callback hell"

3. **Eliminar código duplicado:**
   - Si tienes `controller.ts` y `service.ts` con el mismo código, eliminar uno
   - Extraer lógica común a funciones reutilizables
   - Crear helpers/utilities para código repetido

4. **Agregar validación de entrada:**
   - Validar parámetros de entrada en el Controller
   - Usar librerías como `joi` o `zod` para validación
   - Retornar errores 400 (Bad Request) para datos inválidos

5. **Mejorar tipos de retorno:**
   - Especificar tipos de retorno explícitos en todas las funciones
   - Evitar `Promise<any>`, usar tipos específicos
   - Crear tipos de retorno para respuestas HTTP

---

## 🧪 PASO 15: Migrar Tests a TypeScript (Opcional pero recomendado)

### Qué hacer:

1. **Migrar archivos de test:**
   - Renombrar `tests/api.test.js` → `tests/api.test.ts`
   - Agregar tipos a las funciones de test
   - Tipar las respuestas de las peticiones

2. **Actualizar configuración:**
   - Actualizar script de test en `package.json` para usar `ts-node/register`
   - Asegurar que los tipos de testing estén instalados

3. **Beneficios:**
   - Type safety en los tests
   - Mejor autocompletado
   - Detección de errores en tiempo de compilación

---

## 📊 PASO 16: Consideraciones para Express 5.x

**Nota importante:** Si estás usando Express 5.x, hay cambios en la sintaxis de rutas:

1. **Parámetros opcionales:**
   - Express 5.x NO soporta `:param?` (parámetro opcional con `?`)
   - Solución: Crear dos rutas separadas, una con parámetro y otra sin él

2. **Rutas catch-all:**
   - Express 5.x NO soporta `'*'` como ruta catch-all
   - Solución: Usar `'/*'` en lugar de `'*'`

3. **Verificar versión:**
   - Revisar la versión de Express en `package.json`
   - Si es 5.x, aplicar estos cambios
   - Si es 4.x, la sintaxis original funciona

---

## ✅ Checklist Final Completo

### Migración Básica:
- [X] Instaladas todas las dependencias de TypeScript
- [X] Creado `tsconfig.json` con configuración adecuada
- [X] Creada estructura de carpetas `src/`
- [X] Migrado `config.js` → `src/config/config.ts`
- [X] Migrado `controller/controller.js` → `src/controller/controller.ts`
- [X] Migrado `routes/routes.js` → `src/routes/routes.ts`
- [X] Migrado `index.js` → `src/index.ts`
- [X] Actualizado `package.json` con nuevos scripts
- [X] Compilado el proyecto (`npm run build`)
- [X] Probado que funciona (`npm start` o `npm run dev`)

### Mejoras y Optimizaciones:
- [ ] Definir interfaces y tipos (eliminar todos los `any`)
- [ ] Separar responsabilidades correctamente (Controller vs Service)
- [ ] Implementar dotenv para variables de entorno
- [ ] Actualizar `.gitignore` con archivos necesarios
- [ ] Mejorar manejo de errores con clases personalizadas
- [ ] Optimizar código (async/await, eliminar duplicación)
- [ ] Agregar validación de entrada
- [ ] Migrar tests a TypeScript (opcional)

### Arquitectura:
- [ ] Routes solo mapea URLs a Controllers (sin lógica)
- [ ] Controller solo maneja HTTP (sin lógica de negocio)
- [ ] Service contiene toda la lógica de negocio
- [ ] Tipos definidos para todas las estructuras de datos
- [ ] Errores tipados y manejados correctamente

---

## 🎯 Próximos Pasos (Orden de Prioridad)

1. ✅ Definir interfaces y tipos (eliminar `any`) 
2. ✅ Separar Controller y Service correctamente
3. 🏗️ Implementar dotenv.
4. 🏗️ Actualizar .gitignore con archivos necesarios
5. 🏗️ Mejorar manejo de errores
6. 🏗️ Optimizar código y agregar validación
7. 🏗️ Agregar validación de entrada
6. 🏗️ Migrar tests a TypeScript

---

## 📚 Recursos Adicionales

- **Documentación TypeScript:** https://www.typescriptlang.org/docs/
- **Express.js:** https://expressjs.com/
- **Arquitectura MVC:** Investigar patrones de arquitectura para APIs REST
- **Best Practices TypeScript:** Buscar guías de mejores prácticas para TypeScript en Node.js

---


