import { productsService } from "./service/productService";
import { categoryService } from "./service/categoryService";

let products=[];
let categories=[];
// init function
async function initProductPage() {
    try{
        products=await productsService.getAllProducts();
        categories=await categoryService.getAllCategory();
        renderStatistics(products,categories);
        renderProductTable(products);
        filteredCate(categories);
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
            localStorage.setItem("editingProduct",JSON.stringify(product));
            window.location.href="./create.html";

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

const btnAdd=document.getElementById("btnAdd");
    btnAdd.onclick=()=>{
        localStorage.removeItem("editingProduct");
        window.location.href="./create.html";
    }
initProductPage();