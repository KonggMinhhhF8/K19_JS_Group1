import axios from 'axios';
import {token} from './config/token';
const api='https://wo365ovs53.execute-api.ap-southeast-1.amazonaws.com/orders'
// đợi xong login sẽ có token lấy từ local storage 
// const token=localStorage.getItem("accessToken");
// const accessToken="eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJrMTgtc3RvcmUiLCJzdWIiOiIxIiwiZXhwIjoxNzgyMTk2MDQwLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzgyMTk1NDQwLCJlbWFpbCI6ImJhbmd0eEB0ZXN0LmNvbSJ9.WqmOPVkN6zkceGNwUX8zdVPM4RZNgxlRhfI509U0qX8"
async function fetchOrders() {
    try{
        const res=await axios.get(api,{
            headers:{
                Authorization:`Bearer ${token}`,
                Accept: 'application/json'
            }
        });
        const orders=res.data;
        console.log("get dữ liệu thành công trang home");
        render(orders);
    }
    catch(error){
        console.log("Lỗi  ",error)
    }
}
function render(orders){
    // check order is empty
    if(!orders||orders.length===0){
        document.getElementById("newOrders").innerText="0";
        document.getElementById("revenue").innerText="0Đ";
        return;
    }
    document.getElementById("newOrders").innerText=orders.length;
    // check status to get revenue
    const totalRevenue=orders.reduce((sum,order)=>{
        const status =order.status?order.status.toLowerCase():"";
        if(status=== "done"){
            const price =order?.product?.price||0;
            const amount=order?.amount||0;
            return sum+(price*amount);
        }
        return sum;
    },0);
    document.getElementById("revenue").innerText=totalRevenue.toLocaleString('vi-VN')+"Đ";
    // fill to table 
    const tableBody=document.getElementById("tableBody");
    if(tableBody){
        tableBody.innerHTML="";
    }
    orders.forEach((order)=>{
        const tr=document.createElement("tr");
        // id column
        const tId=document.createElement("td");
        tId.innerText=order?.id||"N/A";
        tr.appendChild(tId);
        // name client column
        const tdName=document.createElement("td");
        tdName.innerText=order?.customer?.name||"NO Name";
        tr.appendChild(tdName);
        //status column 
        const tdStatus=document.createElement("td");
        const spanStatus=document.createElement("span");
        spanStatus.innerText=order["status"];
        spanStatus.classList.add("status");
        if(order.status.toLowerCase()==="done"){
            spanStatus.style.background = "#e8f5e9";
            spanStatus.style.color = "#2e7d32";
        }
        else{
            spanStatus.style.background = "#fff3e0";
            spanStatus.style.color = "#e67e22";
        }
        tdStatus.appendChild(spanStatus);
        tr.appendChild(tdStatus);
        // totalMoney
        const tdTotal=document.createElement("td");
        const price =order?.product?.price||0;
        const amount=order?.amount||0;
        const totalMoney=price*amount;
        tdTotal.innerText=totalMoney.toLocaleString("vi-VN")+"Đ";
        tr.appendChild(tdTotal);
        // add tr to tbody
        tableBody.appendChild(tr);

    })
}
fetchOrders();