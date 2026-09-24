const productList = document.getElementById("productList");
const searchInput = document.getElementById("productSearch");
const categoryFilter = document.getElementById("categoryFilter");

// ===============================
// CART STORAGE
// ===============================

let cart = JSON.parse(localStorage.getItem("selvaCrackersCart")) || {};

function saveCart() {
    localStorage.setItem("selvaCrackersCart", JSON.stringify(cart));
}

function getQuantity(productId) {
    return cart[productId] || 0;
}


// ===============================
// CATEGORY FILTER
// ===============================

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


// ===============================
// PRODUCT DISPLAY
// ===============================

function displayProducts(productArray) {

    productList.innerHTML = "";

    productArray.forEach(product => {

        const card = document.createElement("div");
        card.className = "product-card";

        const quantity = getQuantity(product.id);

        const priceDisplay =
            product.price !== null
                ? `₹${product.price}`
                : product.priceText || "Price on request";

        const lineAmount =
            product.price !== null
                ? product.price * quantity
                : 0;

        const netRateDisplay =
            product.netRate
                ? `<span class="net-rate">NET RATE</span>`
                : "";

        let quantitySection = "";

        if (product.available && product.price !== null) {

            quantitySection = `
                <div class="quantity-row">

                    <button
                        class="qty-btn"
                        onclick="changeQuantity(${product.id}, -1)">
                        −
                    </button>

                    <span
                        class="qty-value"
                        id="qty-${product.id}">
                        ${quantity}
                    </span>

                    <button
                        class="qty-btn"
                        onclick="changeQuantity(${product.id}, 1)">
                        +
                    </button>

                </div>

                <div
                    class="product-amount"
                    id="amount-${product.id}">
                    ${quantity > 0 ? `Amount: ₹${lineAmount}` : ""}
                </div>
            `;

        } else {

            quantitySection = `
                <div class="price-confirm">
                    Please confirm price
                </div>
            `;
        }

        card.innerHTML = `

            <div class="product-top-line">

                <span class="product-number">
                    ${product.id}
                </span>

                ${netRateDisplay}

            </div>

            <h3>
                ${product.name}
            </h3>

            <div class="tamil">
                ${product.tamilName}
            </div>

            <div class="product-price-row">

                <div class="price">
                    ${priceDisplay}
                </div>

                <div class="unit">
                    / ${product.unit}
                </div>

            </div>

            ${quantitySection}
        `;

        productList.appendChild(card);
    });
}


// ===============================
// QUANTITY CHANGE
// ===============================

function changeQuantity(productId, change) {

    const product = products.find(
        product => product.id === productId
    );

    if (!product || !product.available || product.price === null) {
        return;
    }

    let currentQuantity = getQuantity(productId);

    currentQuantity += change;

    if (currentQuantity < 0) {
        currentQuantity = 0;
    }

    if (currentQuantity === 0) {
        delete cart[productId];
    } else {
        cart[productId] = currentQuantity;
    }

    saveCart();

    const qtyElement =
        document.getElementById(`qty-${productId}`);

    const amountElement =
        document.getElementById(`amount-${productId}`);

    if (qtyElement) {
        qtyElement.textContent = currentQuantity;
    }

    if (amountElement) {

        amountElement.textContent =
            currentQuantity > 0
                ? `Amount: ₹${product.price * currentQuantity}`
                : "";
    }

    updateCartBar();
}


// ===============================
// SEARCH + FILTER
// ===============================

function filterProducts() {

    const searchText =
        searchInput.value.trim().toLowerCase();

    const tamilSearch =
        searchInput.value.trim();

    const selectedCategory =
        categoryFilter.value;

    const filteredProducts =
        products.filter(product => {

            const englishName =
                product.name.toLowerCase();

            const tamilName =
                product.tamilName || "";

            const idSearch =
                product.id.toString();

            const matchesSearch =
                englishName.includes(searchText) ||
                tamilName.includes(tamilSearch) ||
                idSearch === searchText;

            const matchesCategory =
                selectedCategory === "all" ||
                product.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });

    displayProducts(filteredProducts);
}


// ===============================
// STICKY CART BAR
// ===============================

function createCartBar() {

    const cartBar = document.createElement("div");

    cartBar.id = "cartBar";
    cartBar.className = "cart-bar";

    cartBar.innerHTML = `

        <div class="cart-summary">

            <div>
                <span id="cartItemCount">0</span>
                <span class="cart-label">Items Selected</span>
            </div>

            <div
                class="cart-total"
                id="cartTotal">
                ₹0
            </div>

        </div>

        <button
            id="viewEstimateBtn"
            class="estimate-btn">
            View Estimate
        </button>
    `;

    document.body.appendChild(cartBar);

    document
        .getElementById("viewEstimateBtn")
        .addEventListener("click", function () {

            const totals = calculateCartTotals();

            if (totals.quantity === 0) {

                alert("Please select at least one product.");

                return;
            }

            alert(
                `${totals.quantity} items selected\nTotal: ₹${totals.amount}`
            );
        });
}


// ===============================
// CART TOTAL CALCULATION
// ===============================

function calculateCartTotals() {

    let totalQuantity = 0;
    let totalAmount = 0;

    Object.keys(cart).forEach(productId => {

        const quantity =
            cart[productId];

        const product =
            products.find(
                product => product.id === Number(productId)
            );

        if (
            product &&
            product.price !== null &&
            product.available
        ) {

            totalQuantity += quantity;

            totalAmount +=
                product.price * quantity;
        }
    });

    return {
        quantity: totalQuantity,
        amount: totalAmount
    };
}


// ===============================
// UPDATE CART BAR
// ===============================

function updateCartBar() {

    const totals = calculateCartTotals();

    const itemCount =
        document.getElementById("cartItemCount");

    const cartTotal =
        document.getElementById("cartTotal");

    const cartBar =
        document.getElementById("cartBar");

    if (!itemCount || !cartTotal || !cartBar) {
        return;
    }

    itemCount.textContent =
        totals.quantity;

    cartTotal.textContent =
        `₹${totals.amount.toLocaleString("en-IN")}`;

    if (totals.quantity > 0) {
        cartBar.classList.add("cart-active");
    } else {
        cartBar.classList.remove("cart-active");
    }
}


// ===============================
// EVENTS
// ===============================

searchInput.addEventListener(
    "input",
    filterProducts
);

categoryFilter.addEventListener(
    "change",
    filterProducts
);


// ===============================
// START WEBSITE
// ===============================

loadCategories();

displayProducts(products);

createCartBar();

updateCartBar();
