import bodyParser from 'body-parser';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import weatherRoutes from './routes/weather.routes';
import locationRoutes from './routes/location.routes';

const port: number = parseInt(process.env.PORT || '3000', 10);
const app: Express = express();

app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '5mb' }));

app.use((_req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header("Access-Control-Allow-Methods", 'GET, POST, PUT, DELETE, PATCH');
    res.header("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


weatherRoutes(app);
locationRoutes(app);

app.listen(port, () => {
    console.log('Server Running on port: ', port);
});

export default app;