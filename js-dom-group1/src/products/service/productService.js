import axios, { create } from "axios";

import {getAccessToken} from "../../shared/utils/tokenStorage"
const apiUrl="https://wo365ovs53.execute-api.ap-southeast-1.amazonaws.com/products";
export const productsService={
    //get all
    async  getAllProducts(){
        try{
            const res=await axios.get(apiUrl,{
                headers:{
                    Authorization:`Bearer ${getAccessToken()}`,
                    Accept:"application/json"
                }
            })
            console.log("get data products completely")
        
            return res.data??[];
            

        }
        catch(error){
            console.log("lỗi bên product ",error)
        }
    },
    // get product by edit
    async getProductById(id){
        try{
            const res= await axios.get(`${apiUrl}/${id}`,{
                headers:{
                    Authorization:`Bearer ${getAccessToken()}`,
                    Accept:"application/json"
                }
            })
            console.log("get product by id completely")
            return res.data??[];
        }
        catch(error){
            console.log("can't get product by id ", error);
        }
    
    },
    //delete
    async deleteProduct(id){
        try{
            const res =await axios.delete(`${apiUrl}/${id}`,{
                headers:{
                    Authorization:`Bearer ${getAccessToken()}`
                }
            })
            console.log("Delete successfully");
            return res.data;
        }
        catch(error){
            
            console.log("lỗi khi xóa sản phẩm",id,"mã lỗi",error)
            throw error;
        }
    },
    // put
    async putProduct(id,product){
        try{
            const res=await axios.put(`${apiUrl}/${id}`,product,{
                headers:{
                    Authorization:`Bearer ${getAccessToken()}`,
                    Accept:"application/json"
                }
            })
            console.log("update successfully");
            return res.data;
        }
        catch(error){
            alert("Có lỗi khi update");
            console.log(error)
            throw error;
        }
    },
    //post
    async createProduct(product){
        try{
            const res=await axios.post(`${apiUrl}`,product,{
                headers:{
                    Authorization:`Bearer ${getAccessToken()}`,
                    Accept:"application/json"
                }
            })
            console.log("create successfully");
            return res.data;
        }
        catch(error){
            alert("có lỗi khi thêm");
            console.log(error);
            throw error;
        }
    }

}