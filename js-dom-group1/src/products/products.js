import { productsService } from "./service/productService";
import { categoryService } from "./service/categoryService";
import { renderSidebar } from "../shared/utils/sidebar";

let products = [];
let categories = [];
// render html
function getProductsListHTML() {
  return `
    <header>
      <div class="search-bar">
        <input type="text" id="searchInput" placeholder="Tìm tên sản phẩm, mã SKU...">
      </div>
      <div class="user-actions">
        <button id="btnAdd" class="btn-add">
          <i class="fas fa-plus"></i> Thêm sản phẩm
        </button>
      </div>
    </header>

    <section class="stats">
      <div class="card">
        <h3>Tổng sản phẩm</h3>
        <p id="totalProduct">0</p>
      </div>
      <div class="card">
        <h3>Sắp hết hàng</h3>
        <p id="lowStock" style="color: #e74c3c;">0</p>
      </div>
      <div class="card">
        <h3>Danh mục</h3>
        <p id="totalCate">0</p>
      </div>
    </section>

    <section class="table-container">
      <div class="table-header">
        <h3>Danh mục sản phẩm</h3>
        <div class="filters">
          <select id="cateFiltered"></select>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Hình</th>
            <th>Thông tin sản phẩm</th>
            <th>Danh mục</th>
            <th>Giá bán</th>
            <th>Tồn kho</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody id="productTableBody"></tbody>
      </table>
    </section>
    `;
}
// init function
async function initProductPage(router) {
  try {
    products = await productsService.getAllProducts();
    categories = await categoryService.getAllCategory();
    renderStatistics(products, categories);
    renderProductTable(products, router);
    filteredCate(categories, router);
    searchBar(products, router);
    document.getElementById("btnAdd").onclick = () => {
      localStorage.removeItem("editingProduct");
      router.navigate("/products/create");
    };

    console.log("init thành cống");
  } catch (error) {
    console.log("Không thể init ", error);
  }
}
//render static
function renderStatistics(products, categories) {
  const totalProductEl = document.getElementById("totalProduct");
  const lowStockEl = document.getElementById("lowStock");
  const totalCateEl = document.getElementById("totalCate");

  if (totalProductEl) totalProductEl.innerText = products.length;
  if (lowStockEl) {
    const lowStock = products.filter((p) => p.remaining < 10).length;
    lowStockEl.innerText = lowStock;
  }
  if (totalCateEl) totalCateEl.innerText = categories.length;
}
// render product table
function renderProductTable(products, router) {
  const tableBody = document.getElementById("productTableBody");
  // reset once reload page
  if (!tableBody) return;
  tableBody.innerText = "";
  products.forEach((product) => {
    const tr = document.createElement("tr");
    // image col
    const tdImg = document.createElement("td");
    const imgTag = document.createElement("img");
    imgTag.src =
      product?.imageUrl || "https://picsum.photos/seed/picsum/200/300";
    imgTag.alt = "img Product";
    imgTag.classList.add("img-thumb");
    tdImg.appendChild(imgTag);
    tr.appendChild(tdImg);
    // product info col
    const tdInfo = document.createElement("td");
    const strongTag = document.createElement("strong");
    const br = document.createElement("br");
    const small = document.createElement("small");
    strongTag.innerText = product?.name || "N/A";
    small.innerText = product?.sku || "N/A";
    tdInfo.appendChild(strongTag);
    tdInfo.appendChild(br);
    tdInfo.appendChild(small);
    tr.appendChild(tdInfo);
    // category col
    const tdCate = document.createElement("td");
    tdCate.innerText = product?.category?.name || "N/A";
    tr.appendChild(tdCate);
    // price col
    const tdPrice = document.createElement("td");
    tdPrice.innerText = product?.price || "N/A";
    tr.appendChild(tdPrice);
    // stock quanitity
    const tdStockQua = document.createElement("td");
    if (product.remaining >= 10) {
      tdStockQua.innerText = product?.remaining || "N/A";
    } else {
      tdStockQua.classList.add("stock-low");
      tdStockQua.innerText = product?.remaining + " (Cảnh Báo)" || "N/A";
    }
    tr.appendChild(tdStockQua);
    // button
    const tdActions = document.createElement("td");

    const btnEdit = document.createElement("button");
    btnEdit.className = "btn-icon edit";
    btnEdit.innerHTML = '<i class="fas fa-edit"></i>';
    btnEdit.onclick = () => {
      localStorage.setItem("editingProduct", JSON.stringify(product.id));
      router.navigate("/products/create");
    };
    // btn delete
    const btnDelete = document.createElement("button");
    btnDelete.className = "btn-icon delete";
    btnDelete.innerHTML = '<i class="fas fa-trash"></i>';
    btnDelete.onclick = async () => {
      if (confirm("Có chắc xóa không?")) {
        try {
          await productsService.deleteProduct(product.id);
          const updateProduct = await productsService.getAllProducts();
          renderProductTable(updateProduct, router);
          renderStatistics(updateProduct, categories);
          alert("xóa thành công");
        } catch (error) {
          if (error.response && error.response.status === 400) {
            alert("Sản phẩm này hiện có trogn đơn hàng của khách");
          } else {
            alert("vui lòng thử lại sau !!");
          }
        }
      }
    };

    tdActions.appendChild(btnEdit);
    tdActions.appendChild(btnDelete);

    tr.appendChild(tdActions);
    tableBody.appendChild(tr);
  });
}
// function category filtered
function filteredCate(categories, router) {
  const cateFiltered = document.getElementById("cateFiltered"); // này là thẻ select này
  if (!cateFiltered) {
    console.error("Element cateFiltered không tìm thấy");
    return;
  }
  cateFiltered.innerHTML = "";
  const defOption = document.createElement("option");
  defOption.value = "all";
  defOption.innerText = "Tất cả các loại";
  cateFiltered.appendChild(defOption);
  categories.forEach((cate) => {
    const option = document.createElement("option");
    option.value = cate?.id || 11;
    option.innerText = cate.name;
    cateFiltered.appendChild(option);
    // ko đc đặt onchange trong này bởi vì đây là thẻ option ấy
  });
  // dùng onchange cho ms cái dropdown và chỉ có select ms gán onchange đc nhé
  cateFiltered.onchange = (e) => {
    const selectedVal = e.target.value;
    if (selectedVal == "all") {
      renderProductTable(products, router);
    } else {
      let filteredProduct = products.filter((product) => {
        return product?.category?.id == selectedVal;
      });
      renderProductTable(filteredProduct, router);
    }
  };
}
function searchBar(products, router) {
  const searchBar = document.getElementById("searchInput");
  if (!searchBar) {
    console.error("Element searchInput không tìm thấy");
    return;
  }

  searchBar.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const filteredProduct = products.filter((p) => {
      return p.name.toLowerCase().includes(query);
    });
    renderProductTable(filteredProduct, router);
  });
}

export function renderProductPage(router) {
  renderSidebar("products", router);
  const mainContainer = document.getElementById("main-content");
  if (mainContainer) {
    mainContainer.className = "flex-1 p-6 w-full min-h-screen bg-[#f4f7f6]";
    mainContainer.innerHTML = getProductsListHTML();
  }
  initProductPage(router);
  
}
