# Open Weather Map
Open Weather Map muestra el estado del tiempo  

## Comenzando 🚀

_Primero se debe obtener la Api Key de https://home.openweathermap.org/api_keys_ 
_Una vez que tenemos la key la agregamos en el archivo de configuracion config.js._

```
exports.KEYWEATHERMAP = 'apikey'
```

### Instalación 🔧

_Crear la imagen de docker con_

```
docker build -t openweathermap . 
```

_Una vez generado el contenedor, ejecutarlo_

```
docker run -p 3000:3000 openweathermap
```

_Test_

```
npm test
```
