import { productsService } from "./productService";
import { categoryService } from "./categoryService";
import { renderSidebar } from "../../utils/sidebar";

const form = document.getElementById("productForm");
const nameInput = document.getElementById("nameProduct");
const priceInput = document.getElementById("sellingPrice");
const costPriceInput = document.getElementById("costPrice");
const skuInput = document.getElementById("sku");
const remainingInput = document.getElementById("remaining");
const cateSelect = document.getElementById("filteredCate");


const savedData = localStorage.getItem("editingProduct");
let currentProduct ;
const isEdit = savedData ? true : false;

// render html 
function getEditFormHTML(isEdit) {
    return `
    <div class="flex justify-between items-center mb-[30px]">
      <button id="btnBack" class="text-gray-500 font-medium hover:text-dark"><i class="fas fa-arrow-left"></i> Quay lại danh sách</button>
      <h2 class="text-xl font-bold">${isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
    </div>

    <form id="productForm">
      <div class="grid grid-cols-[2fr_1fr] gap-[30px]">
        <div class="space-y-5">
          <div class="bg-white p-6 rounded-xl shadow-sm">
            <h3 class="font-bold border-b pb-2 mb-4">Thông tin chung</h3>
            <div class="mb-4"><label class="block font-semibold text-sm mb-2">Tên sản phẩm</label><input id="nameProduct" type="text" class="w-full p-3 border rounded-lg outline-none focus:border-primary" placeholder="Ví dụ: iPhone 15 Pro Max"/></div>
            <div><label class="block font-semibold text-sm mb-2">Mô tả sản phẩm</label><textarea id="descProduct" rows="4" class="w-full p-3 border rounded-lg outline-none" placeholder="Nhập đặc điểm nổi bật..."></textarea></div>
          </div>

          <div class="bg-white p-6 rounded-xl shadow-sm">
            <h3 class="font-bold border-b pb-2 mb-4">Giá cả & Kho hàng</h3>
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div><label class="block font-semibold text-sm mb-2">Giá bán (VNĐ)</label><input id="sellingPrice" type="number" class="w-full p-3 border rounded-lg"/></div>
              <div><label class="block font-semibold text-sm mb-2">Giá vốn (VNĐ)</label><input id="costPrice" type="number" class="w-full p-3 border rounded-lg"/></div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div><label class="block font-semibold text-sm mb-2">Mã SKU</label><input id="sku" type="text" class="w-full p-3 border rounded-lg"/></div>
              <div><label class="block font-semibold text-sm mb-2">Số lượng tồn kho</label><input id="remaining" type="number" class="w-full p-3 border rounded-lg"/></div>
            </div>
          </div>
        </div>

        <div class="space-y-5">
          <div class="bg-white p-6 rounded-xl shadow-sm">
            <h3 class="font-bold border-b pb-2 mb-4">Hình ảnh sản phẩm</h3>
            <div class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary hover:bg-blue-50 transition" onclick="document.getElementById('fileInput').click()">
              <i class="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
              <p class="text-sm text-gray-500">Nhấp để tải ảnh lên</p>
              <input type="file" id="fileInput" hidden/>
              <img id="imgPreview" class="w-full mt-4 rounded-lg hidden" src="#" alt="Preview"/>
            </div>
          </div>

          <div class="bg-white p-6 rounded-xl shadow-sm">
            <h3 class="font-bold border-b pb-2 mb-4">Phân loại</h3>
            <div class="mb-4"><label class="block font-semibold text-sm mb-2">Danh mục</label><select id="filteredCate" class="w-full p-3 border rounded-lg outline-none"></select></div>
            <div><label class="block font-semibold text-sm mb-2">Trạng thái</label><select class="w-full p-3 border rounded-lg"><option>Đang bán</option><option>Ngừng kinh doanh</option><option>Hết hàng</option></select></div>
          </div>
        </div>
      </div>

      <div class="mt-5 flex justify-end gap-4 p-5 bg-white rounded-xl shadow-sm">
        <button type="button" id="btnCancel" class="bg-gray-200 text-gray-600 p-3 px-6 rounded-lg font-semibold">Hủy bỏ</button>
        <button type="submit" class="bg-green-600 text-white p-3 px-6 rounded-lg font-semibold">Lưu thay đổi</button>
      </div>
    </form>
    `;
}
async function initEditPage(router) {
    const savedData = localStorage.getItem("editingProduct");
    const isEdit = !!savedData;

    const nameInput = document.getElementById("nameProduct");
    const priceInput = document.getElementById("sellingPrice");
    const costPriceInput = document.getElementById("costPrice");
    const skuInput = document.getElementById("sku");
    const remainingInput = document.getElementById("remaining");
    const cateSelect = document.getElementById("filteredCate");
    const form = document.getElementById("productForm");

    try {
        // Tải toàn bộ danh mục đổ vào thẻ Select trước
        const categoriesList = await categoryService.getAllCategory();
        if (cateSelect) {
            cateSelect.innerHTML = "";
            categoriesList.forEach(cate => {
                const option = document.createElement("option");
                option.value = cate.id;
                option.innerText = cate.name;
                cateSelect.appendChild(option);
            });
        }

        if (isEdit) {
            const idProduct = JSON.parse(savedData);
            currentProduct = await productsService.getProductById(idProduct);
            // lưu í thẻ form dùng value nhé đug có mà innerText hay innerHTML
            if (nameInput) nameInput.value = currentProduct?.name || "";
            if (priceInput) priceInput.value = currentProduct?.price || 0;
            if (costPriceInput) costPriceInput.value = 0;
            if (skuInput) skuInput.value = currentProduct?.sku || "";
            if (remainingInput) remainingInput.value = currentProduct?.remaining || 0;
            if (cateSelect && currentProduct?.category?.id) {
                cateSelect.value = currentProduct.category.id;
            }
        } else {
            
            if (nameInput) nameInput.value = "";
            if (priceInput) priceInput.value = "";
            if (costPriceInput) costPriceInput.value = 0;
            if (skuInput) skuInput.value = "SKU-" + Math.floor(Math.random() * 10000);
            if (remainingInput) remainingInput.value = "";
        }

        
        if (form) {
            form.onsubmit = async (e) => {
                e.preventDefault();
                const updatedData = {
                    categoryId: cateSelect ? Number(cateSelect.value) : 11,
                    imageId: currentProduct?.imageUrl || "",
                    name: nameInput.value,
                    sku: skuInput.value,
                    price: Number(priceInput.value),
                    remaining: Number(remainingInput.value),
                };

                try {
                    if (isEdit) {
                        await productsService.putProduct(currentProduct.id, updatedData);
                        alert("Cập nhật sản phẩm thành công!");
                        localStorage.removeItem("editingProduct");
                    } else {
                        await productsService.createProduct(updatedData);
                        alert("Thêm mới sản phẩm thành công");
                    }
                    router.navigate("/products");
                } catch (err) {
                    console.log("Lỗi không lưu được dữ liệu ", err);
                }
            };
        }

        
        document.getElementById("btnBack").onclick = () => router.navigate("/products");
        document.getElementById("btnCancel").onclick = () => router.navigate("/products");

    } catch (error) {
        console.log("Lỗi tải trang cấu hình biểu mẫu ", error);
    }
}


export function renderEditProductPage(router) {
    renderSidebar('products', router);
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
        mainContent.className = "flex-1 p-6 w-full min-h-screen bg-[#f4f7f6]";
        const isEdit = !!localStorage.getItem("editingProduct");
        mainContent.innerHTML = getEditFormHTML(isEdit);
        initEditPage(router);
    }
}