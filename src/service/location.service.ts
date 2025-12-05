import * as publicIp from 'public-ip';
import { IP_API } from "../config/config";
import { IpApiResponse   } from "../interface/location.interface";

export async function getCity(ip: string): Promise<IpApiResponse> {
  let city = await fetch(IP_API + ip).then(response => response.json()) as IpApiResponse
  
  if(city.status === 'fail') {
    throw new Error('No se pudo obtener la ciudad')
  } 

  return city
}


export async function getIp(): Promise<string>{
  try {
		return  await publicIp.publicIpv4()
  } catch (error) {
    throw error
  }
}