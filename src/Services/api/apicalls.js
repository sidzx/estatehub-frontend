import { commonRequest } from "./axios";
import { base_url } from "./url";



export const addProperties = async (body) => {
    return await commonRequest('POST', base_url,body)
}

export const fetchProp=async() =>{
    return await commonRequest('GET',base_url)
}