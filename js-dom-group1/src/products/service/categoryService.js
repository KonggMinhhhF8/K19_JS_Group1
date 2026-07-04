import axios from "axios";
import {getAccessToken} from "../../shared/utils/tokenStorage"
const apiUrl="https://wo365ovs53.execute-api.ap-southeast-1.amazonaws.com/categories";
export const categoryService={
    async getAllCategory(){
        try{
            const res= await axios.get(apiUrl,{
                headers:{
                    Authorization:`Bearer ${getAccessToken()}`,
                    Accept:"application/json"
                }
            })
            console.log("get data category completely")
            return res.data||[];
        }
        catch(error){
            console.log("Lỗi bên category " ,error)
        }
    }
}