import { productsService } from "./service/productService";
import { categoryService } from "./service/categoryService";

let products=[];
let categories=[];
// render html 
function getProductsListHTML() {
    return `
    <header class="flex justify-between items-center mb-[30px]">
      <div class="flex-1 max-w-[400px]">
        <input type="text" id="searchInput" class="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-primary" placeholder="Tìm tên sản phẩm, mã SKU..."/>
      </div>
      <div>
        <button id="btnAdd" class="bg-primary text-white p-3 px-5 rounded-lg font-semibold hover:opacity-90 transition">
          <i class="fas fa-plus"></i> Thêm sản phẩm
        </button>
      </div>
    </header>

    <section class="grid grid-cols-3 gap-5 mb-[25px]">
      <div class="bg-white p-5 rounded-xl shadow-sm"><h3 class="text-gray-500 text-sm">Tổng sản phẩm</h3><p id="totalProduct" class="text-2xl font-bold mt-1">0</p></div>
      <div class="bg-white p-5 rounded-xl shadow-sm"><h3 class="text-gray-500 text-sm">Sắp hết hàng</h3><p id="lowStock" class="text-2xl font-bold text-red-500 mt-1">0</p></div>
      <div class="bg-white p-5 rounded-xl shadow-sm"><h3 class="text-gray-500 text-sm">Danh mục</h3><p id="totalCate" class="text-2xl font-bold mt-1">0</p></div>
    </section>

    <section class="bg-white rounded-xl shadow-sm p-5">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-dark">Danh mục sản phẩm</h3>
        <select id="cateFiltered" class="p-2 border border-gray-300 rounded-lg outline-none"></select>
      </div>
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-50 text-left text-gray-500 text-sm border-b border-gray-200">
            <th class="p-3">Hình</th><th class="p-3">Thông tin sản phẩm</th><th class="p-3">Danh mục</th><th class="p-3">Giá bán</th><th class="p-3">Tồn kho</th><th class="p-3">Thao tác</th>
          </tr>
        </thead>
        <tbody id="productTableBody"></tbody>
      </table>
    </section>
    `;
}
// init function
async function initProductPage() {
    try{
        products=await productsService.getAllProducts();
        categories=await categoryService.getAllCategory();
        renderStatistics(products,categories);
        renderProductTable(products);
        filteredCate(categories);
        searchBar(products);
        document.getElementById("btnAdd").onclick = () => {
            localStorage.removeItem("editingProduct");
            router.navigate("/products/create");
        };

        console.log("init thành cống")

    }
    catch(error){
        console.log("Không thể init " ,error);
    }

}
//render static
function renderStatistics(products,categories){
    document.getElementById("totalProduct").innerText=products.length;
    const lowStock= products.filter(p=>p.remaining<=10).length;
    document.getElementById("lowStock").innerText=lowStock;
    document.getElementById("totalCate").innerText=categories.length;
    
}
// render product table
function renderProductTable(products){
    const tableBody=document.getElementById("productTableBody");
    // reset once reload page
    tableBody.innerText="";
    products.forEach((product)=>{
        const tr=document.createElement("tr");
        // image col
        const tdImg=document.createElement("td");
        const imgTag=document.createElement("img");
        imgTag.src=product?.imageUrl||"https://picsum.photos/seed/picsum/200/300";
        imgTag.alt="img Product";
        imgTag.classList.add("img-thumb");
        tdImg.appendChild(imgTag);
        tr.appendChild(tdImg);
        // product info col
        const tdInfo=document.createElement("td");
        const strongTag=document.createElement("strong");
        const br=document.createElement("br");
        const small=document.createElement("small");
        strongTag.innerText=product?.name||"N/A";
        small.innerText=product?.sku||"N/A";
        tdInfo.appendChild(strongTag);
        tdInfo.appendChild(br);
        tdInfo.appendChild(small);
        tr.appendChild(tdInfo);
        // category col
        const tdCate=document.createElement("td");
        tdCate.innerText=product?.category?.name||"N/A"
        tr.appendChild(tdCate);
        // price col
        const tdPrice=document.createElement("td");
        tdPrice.innerText=product?.price||"N/A";
        tr.appendChild(tdPrice);
        // stock quanitity
        const tdStockQua=document.createElement("td");
        if(product.remaining>=10){
            tdStockQua.innerText=product?.remaining||"N/A";
        }
        else{
            tdStockQua.classList.add("stock-low");
            tdStockQua.innerText=product?.remaining+" (Cảnh Báo)"||"N/A";
        }
        tr.appendChild(tdStockQua);
        // button
        const tdActions = document.createElement("td");
        
        const btnEdit = document.createElement("button");
        btnEdit.className = "btn-icon edit";
        btnEdit.innerHTML = '<i class="fas fa-edit"></i>';
        btnEdit.onclick=()=>{
            localStorage.setItem("editingProduct",JSON.stringify(product.id));
            router.navigate("/products/create")

        }
        // btn delete
        const btnDelete = document.createElement("button");
        btnDelete.className = "btn-icon delete";
        btnDelete.innerHTML = '<i class="fas fa-trash"></i>';
        btnDelete.onclick= async ()=> {
            if(confirm("Có chắc xóa không?")){
                try{
                    await productsService.deleteProduct(product.id);
                    const updateProduct=await productsService.getAllProducts();
                    renderProductTable(updateProduct);
                    renderStatistics(updateProduct,categories);
                    alert("xóa thành công");
                }
                catch(error){
                    if(error.response&&error.response.status===400){
                        alert("Sản phẩm này hiện có trogn đơn hàng của khách")
                    }
                    else{
                        alert("vui lòng thử lại sau !!")
                    }
                }
            }
        }
        
        tdActions.appendChild(btnEdit);
        tdActions.appendChild(btnDelete);
       

        tr.appendChild(tdActions);
        tableBody.appendChild(tr);


    })

}
// function category filtered
function filteredCate(categories){
    const cateFiltered=document.getElementById("cateFiltered");// này là thẻ select này 
    cateFiltered.innerHTML="";
    const defOption= document.createElement("option");
    defOption.value="all";
    defOption.innerText="Tất cả các loại";
    cateFiltered.appendChild(defOption);
    categories.forEach(cate=>{
        const option=document.createElement("option");
        option.value=cate?.id||11;
        option.innerText=cate.name;
        cateFiltered.appendChild(option);
        // ko đc đặt onchange trong này bởi vì đây là thẻ option ấy 
        
    })
    // dùng onchange cho ms cái dropdown và chỉ có select ms gán onchange đc nhé 
    cateFiltered.onchange=(e)=>{
            const selectedVal=e.target.value;
            if(selectedVal=="all"){
                renderProductTable(products);
            }else{
                let filteredProduct=products.filter(product=>{
                    return product?.category?.id==selectedVal;
                })
                renderProductTable(filteredProduct);
                
            }

        }

}
function searchBar(products){
    const searchBar=document.getElementById("searchInput");
    searchBar.addEventListener("input",(e)=>{
        const query=e.target.value.toLowerCase();
        const filteredProduct=products.filter(p=>{
            return p.name.toLowerCase().includes(query);
        })
        renderProductTable(filteredProduct);
    })
}



export function renderProductPage(router){
    renderSidebar("products",router);
    const mainContainer=document.getElementById("main-content");
    if(mainContainer){
        mainContainer.innerHTML= getProductsListHTML();
    }
    initProductPage();

}