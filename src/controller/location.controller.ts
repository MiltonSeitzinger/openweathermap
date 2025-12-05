import { getCity, getIp } from "../service/location.service";
import { Request, Response } from "express";

export async function getLocation(_req: Request, res: Response) {
	try {
		const ip = await getIp();
		const city = await getCity(ip);
		return res.status(200).json(city);
	} catch (err) {
		return res.status(500).json({ error: err });
		throw err;
	}
}