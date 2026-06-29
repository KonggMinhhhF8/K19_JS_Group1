import axios from 'axios';
import {token} from '../config/token';
import { renderSidebar } from '../utils/sidebar';
const api='https://wo365ovs53.execute-api.ap-southeast-1.amazonaws.com/orders'
// đợi xong login sẽ có token lấy từ local storage 
// const token=localStorage.getItem("accessToken");

function getHomeContentHTML() {
    return `
    <header class="flex justify-between items-center bg-white p-[15px] px-[20px] rounded-[10px] mb-[25px] shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <div class="user">
        <strong>Admin</strong> <i class="fas fa-user-circle"></i>
      </div>
    </header>

    <section class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 mb-[25px]">
      <div class="bg-white p-5 rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.02)]">
        <h3 class="text-xs text-[#7f8c8d] uppercase tracking-wider">Doanh thu</h3>
        <p id="revenue" class="text-2xl font-bold mt-[5px]">Đang tải...</p>
      </div>
      <div class="bg-white p-5 rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.02)]">
        <h3 class="text-xs text-[#7f8c8d] uppercase tracking-wider">Đơn mới</h3>
        <p id="newOrders" class="text-2xl font-bold mt-[5px]">Đang tải...</p>
      </div>
    </section>

    <section class="bg-white rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.02)] flex flex-col max-h-[400px]">
      <div class="p-5 bg-white rounded-t-[12px] border-b border-[#eee] sticky top-0 z-10">
        <h3 class="font-bold text-[#2c3e50]">Đơn hàng gần đây</h3>
      </div>
      <div class="overflow-y-auto overflow-x-auto flex-1">
        <table class="w-full border-collapse min-w-[600px]">
          <thead>
            <tr class="bg-[#f8f9fa] text-left text-[#7f8c8d] text-[0.85rem] border-b-2 border-[#eee]">
              <th class="p-[15px] sticky top-0 bg-[#f8f9fa] z-5">Mã đơn</th>
              <th class="p-[15px] sticky top-0 bg-[#f8f9fa] z-5">Khách hàng</th>
              <th class="p-[15px] sticky top-0 bg-[#f8f9fa] z-5">Trạng thái</th>
              <th class="p-[15px] sticky top-0 bg-[#f8f9fa] z-5">Tổng tiền</th>
            </tr>
          </thead>
          <tbody id="tableBody"></tbody>
        </table>
      </div>
    </section>
    `;
}
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
export function renderHomeLayout(router){
  renderSidebar("home",router);
  const mainConTainer= document.getElementById("main-content");
  if(mainContainer){
    mainConTainer.innerHTML=getHomeContentHTML();
  }
  fetchOrders();
}
