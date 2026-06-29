import { productsService } from "./productService";
import { categoryService } from "./categoryService";


const form = document.getElementById("productForm");
const nameInput = document.getElementById("nameProduct");
const priceInput = document.getElementById("sellingPrice");
const costPriceInput = document.getElementById("costPrice");
const skuInput = document.getElementById("sku");
const remainingInput = document.getElementById("remaining");
const cateSelect = document.getElementById("filteredCate");


const savedData = localStorage.getItem("editingProduct");
let product ;
const isEdit = savedData ? true : false;


async function initEditPage() {
    try {
        
        await loadCategories();
        if(isEdit){
            await getProductById();
        }

      
        fillProductData();

       
        setupFormSubmit();

        console.log("Khởi tạo trang cấu hình sản phẩm thành công");
    } catch (error) {
        console.log("Lỗi khi khởi tạo trang edit ", error);
    }
}

async function getProductById(){
    try{
        const idProduct=savedData ? JSON.parse(savedData) : null;
        product=await productsService.getProductById(idProduct);
        console.log("edit received data")

    }
    catch(error){
        console.log("Edit was not received data ",error)
    }
}
async function loadCategories() {
    if (!cateSelect) return;
    
    const categories = await categoryService.getAllCategory();
    cateSelect.innerHTML = ""; 

    
    categories.forEach(cate => {
        const option = document.createElement("option");
        option.value = cate.id;
        option.innerText = cate.name;
        // auto fill  nếu là edit
        if (isEdit && product?.category?.id === cate.id) {
            option.selected = true;
        }
        cateSelect.appendChild(option);
    });
}

function fillProductData() {
  // với mới thẻ form điền bằng value nhé ko phải innerhtml đâu
    if (isEdit) {
        if (nameInput) nameInput.value = product?.name || "";
        if (priceInput) priceInput.value = product?.price || 0;
        if (costPriceInput) costPriceInput.value = 0; 
        if (skuInput) skuInput.value = product?.sku || "";
        if (remainingInput) remainingInput.value = product?.remaining || 0;
        console.log("SỬA");
    } else {
        if (nameInput) nameInput.value = "";
        if (priceInput) priceInput.value = "";
        if (costPriceInput) costPriceInput.value = 0;
        if (skuInput) skuInput.value = "SKU-" + Math.floor(Math.random() * 10000);
        if (remainingInput) remainingInput.value = "";
        console.log(" THÊM MỚI ");
    }
}


function setupFormSubmit() {
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const updatedData = {
            categoryId: cateSelect ? Number(cateSelect.value) :11,
            imageId: product?.imageUrl || "",
            name: nameInput.value,
            sku: skuInput.value,
            price: Number(priceInput.value),
            remaining: Number(remainingInput.value),
        };
        
        try {
            if (isEdit) {
                await productsService.putProduct(product.id, updatedData);
                alert("Cập nhật sản phẩm thành công!");
                localStorage.removeItem("editingProduct");
            } else {
                await productsService.createProduct(updatedData);
                alert("Thêm mới sản phẩm thành công!");
            }
            window.location.href = "./index.html";
        } catch (error) {
            console.log("Lỗi không lưu được dữ liệu: ", error);
        }
    });
}
const back=document.querySelector(".btn-back");
back.addEventListener("click",e=>{
  window.location.href="./index.html";
})
const cancel=document.querySelector(".btn-cancel");
cancel.addEventListener("click",e=>{
  window.location.href="./index.html";
})

initEditPage();