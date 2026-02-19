import { commonRequest } from "./axios";
import { base_url, user_url,estateHub_url} from "./url";



export const addProperties = async (body) => {
    const url=`${estateHub_url}/save-property`
    return await commonRequest('POST',url,body)
}

export const fetchProp=async() =>{
    return await commonRequest('GET',base_url)
}

export const fetchPropDetails=async(id) =>{
    const url = `${base_url}?id=${id}`;
    console.log(url)
    return await commonRequest('GET',url)
}

export const addUser= async(body)=>{
    return await commonRequest('POST',user_url,body)
}

export const generateUploadUrl=async(body)=>{
    const url = `${estateHub_url}/get-upload-urls`
    return await commonRequest('POST',url,body)
}