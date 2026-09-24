const productList = document.getElementById("productList");
const searchInput = document.getElementById("productSearch");
const categoryFilter = document.getElementById("categoryFilter");

function loadCategories() {
    const categories = [...new Set(products.map(product => product.category))];

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function displayProducts(productArray) {

    productList.innerHTML = "";

    productArray.forEach(product => {

        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <h3>${product.name}</h3>
            <div class="tamil">${product.tamilName}</div>
            <div class="price">₹${product.price}</div>
            <div>${product.unit}</div>
        `;

        productList.appendChild(card);
    });
}

function filterProducts() {

    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filteredProducts = products.filter(product => {

        const matchesSearch =
            product.name.toLowerCase().includes(searchText) ||
            product.tamilName.includes(searchInput.value);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    displayProducts(filteredProducts);
}

searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);

loadCategories();
displayProducts(products);
