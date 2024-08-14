// Biến global
let currentPage = 1;
const itemsPerPage = 10;
let products = [];

// Hàm khởi tạo
document.addEventListener('DOMContentLoaded', function() {
    fetchProducts();
    setupEventListeners();
});

// Thiết lập các event listener
function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('minPrice').addEventListener('input', handlePriceFilter);
    document.getElementById('maxPrice').addEventListener('input', handlePriceFilter);
    document.getElementById('saveProduct').addEventListener('click', handleSaveProduct);
}

// Fetch sản phẩm từ API
async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        products = await response.json();
        renderProducts();
        renderPagination();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Render sản phẩm
function renderProducts() {
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = '';

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProducts = products.slice(start, end);

    paginatedProducts.forEach(product => {
        const row = `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.discountPrice || '-'}</td>
                <td>${product.category}</td>
                <td>${product.status ? 'Kích hoạt' : 'Không kích hoạt'}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="viewProduct(${product.id})">Xem</button>
                    <button class="btn btn-sm btn-warning" onclick="editProduct(${product.id})">Sửa</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">Xóa</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Render phân trang
function renderPagination() {
    const pagination = document.getElementById('pagination');
    const pageCount = Math.ceil(products.length / itemsPerPage);

    let paginationHTML = '';
    for (let i = 1; i <= pageCount; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `;
    }

    pagination.innerHTML = paginationHTML;
}

// Thay đổi trang
function changePage(page) {
    currentPage = page;
    renderProducts();
    renderPagination();
}

// Xử lý tìm kiếm
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
    );
    renderFilteredProducts(filteredProducts);
}

// Xử lý lọc theo giá
function handlePriceFilter() {
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;

    const filteredProducts = products.filter(product => 
        product.price >= minPrice && product.price <= maxPrice
    );
    renderFilteredProducts(filteredProducts);
}

// Render sản phẩm đã lọc
function renderFilteredProducts(filteredProducts) {
    products = filteredProducts;
    currentPage = 1;
    renderProducts();
    renderPagination();
}

// Xử lý lưu sản phẩm (thêm mới hoặc cập nhật)
async function handleSaveProduct() {
    const productData = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        discountPrice: parseFloat(document.getElementById('productDiscountPrice').value) || null,
        category: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value,
        status: document.getElementById('productStatus').checked
    };

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });

        if (response.ok) {
            fetchProducts();
            $('#addProductModal').modal('hide');
        } else {
            console.error('Error saving product');
        }
    } catch (error) {
        console.error('Error saving product:', error);
    }
}

// Xem chi tiết sản phẩm
function viewProduct(id) {
    // Implement view product logic
    console.log('Viewing product', id);
}

// Sửa sản phẩm
function editProduct(id) {
    // Implement edit product logic
    console.log('Editing product', id);
}

// Xóa sản phẩm
async function deleteProduct(id) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchProducts();
            } else {
                console.error('Error deleting product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }
}