const productList = document.getElementById("productList");
const searchInput = document.getElementById("productSearch");
const categoryFilter = document.getElementById("categoryFilter");

function loadCategories() {

    const categories = [
        ...new Set(products.map(product => product.category))
    ];

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

        const priceDisplay =
            product.price !== null
                ? `₹${product.price}`
                : product.priceText || "Price on request";

        const netRateDisplay =
            product.netRate
                ? `<div class="net-rate">NET RATE</div>`
                : "";

        const unavailableDisplay =
            !product.available
                ? `<div class="availability">Please confirm price</div>`
                : "";

        card.innerHTML = `

            ${netRateDisplay}

            <h3>
                ${product.id}. ${product.name}
            </h3>

            <div class="tamil">
                ${product.tamilName}
            </div>

            <div class="price">
                ${priceDisplay}
            </div>

            <div>
                ${product.unit}
            </div>

            ${unavailableDisplay}
        `;

        productList.appendChild(card);
    });
}


function filterProducts() {

    const searchText =
        searchInput.value.trim().toLowerCase();

    const selectedCategory =
        categoryFilter.value;

    const filteredProducts =
        products.filter(product => {

            const englishName =
                product.name.toLowerCase();

            const tamilName =
                product.tamilName || "";

            const matchesSearch =
                englishName.includes(searchText) ||
                tamilName.includes(searchInput.value.trim());

            const matchesCategory =
                selectedCategory === "all" ||
                product.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });

    displayProducts(filteredProducts);
}


searchInput.addEventListener(
    "input",
    filterProducts
);

categoryFilter.addEventListener(
    "change",
    filterProducts
);


loadCategories();
displayProducts(products);
