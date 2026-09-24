const productList = document.getElementById("productList");
const searchInput = document.getElementById("productSearch");
const categoryFilter = document.getElementById("categoryFilter");


// ======================================================
// CART STORAGE
// ======================================================

let cart =
    JSON.parse(
        localStorage.getItem("selvaCrackersCart")
    ) || {};


function saveCart() {

    localStorage.setItem(
        "selvaCrackersCart",
        JSON.stringify(cart)
    );
}


function getQuantity(productId) {

    return cart[productId] || 0;
}


// ======================================================
// CATEGORY FILTER
// ======================================================

function loadCategories() {

    const categories = [
        ...new Set(
            products.map(
                product => product.category
            )
        )
    ];


    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value =
            category;

        option.textContent =
            category;

        categoryFilter.appendChild(
            option
        );

    });
}


// ======================================================
// DISPLAY PRODUCTS
// ======================================================

function displayProducts(productArray) {

    productList.innerHTML = "";


    productArray.forEach(product => {

        const card =
            document.createElement("div");

        card.className =
            "product-card";


        const quantity =
            getQuantity(product.id);


        const priceDisplay =

            product.price !== null

                ? `₹${product.price.toLocaleString("en-IN")}`

                : product.priceText ||
                  "Price on request";


        const lineAmount =

            product.price !== null

                ? product.price * quantity

                : 0;


        const netRateDisplay =

            product.netRate

                ? `
                    <span class="net-rate">
                        NET RATE
                    </span>
                  `

                : "";


        let quantitySection = "";


        if (
            product.available &&
            product.price !== null
        ) {

            quantitySection = `

                <div class="quantity-row">

                    <button
                        class="qty-btn"
                        type="button"
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
                        type="button"
                        onclick="changeQuantity(${product.id}, 1)">
                        +
                    </button>

                </div>


                <div
                    class="product-amount"
                    id="amount-${product.id}">

                    ${
                        quantity > 0

                            ? `Amount: ₹${lineAmount.toLocaleString("en-IN")}`

                            : ""
                    }

                </div>
            `;

        }

        else {

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
                ${product.tamilName || ""}
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


        productList.appendChild(
            card
        );

    });

}


// ======================================================
// CHANGE QUANTITY
// ======================================================

function changeQuantity(
    productId,
    change
) {

    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (
        !product ||
        !product.available ||
        product.price === null
    ) {

        return;
    }


    let quantity =
        getQuantity(productId);


    quantity += change;


    if (quantity < 0) {

        quantity = 0;
    }


    if (quantity === 0) {

        delete cart[productId];

    }

    else {

        cart[productId] =
            quantity;
    }


    saveCart();


    updateProductQuantityDisplay(
        product
    );


    updateCartBar();


    if (
        document.body.classList.contains(
            "estimate-open"
        )
    ) {

        renderEstimateItems();

    }

}


// ======================================================
// UPDATE PRODUCT CARD
// ======================================================

function updateProductQuantityDisplay(
    product
) {

    const quantity =
        getQuantity(product.id);


    const qtyElement =
        document.getElementById(
            `qty-${product.id}`
        );


    const amountElement =
        document.getElementById(
            `amount-${product.id}`
        );


    if (qtyElement) {

        qtyElement.textContent =
            quantity;
    }


    if (amountElement) {

        const amount =
            product.price * quantity;


        amountElement.textContent =

            quantity > 0

                ? `Amount: ₹${amount.toLocaleString("en-IN")}`

                : "";
    }

}


// ======================================================
// SEARCH + FILTER
// ======================================================

function filterProducts() {

    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    const tamilSearch =
        searchInput.value.trim();


    const selectedCategory =
        categoryFilter.value;


    const filtered =
        products.filter(product => {


            const englishName =
                product.name
                    .toLowerCase();


            const tamilName =
                product.tamilName || "";


            const id =
                product.id.toString();


            const matchesSearch =

                searchText === "" ||

                englishName.includes(
                    searchText
                ) ||

                tamilName.includes(
                    tamilSearch
                ) ||

                id === searchText;


            const matchesCategory =

                selectedCategory === "all" ||

                product.category ===
                    selectedCategory;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    displayProducts(
        filtered
    );

}


// ======================================================
// GET SELECTED ITEMS
// ======================================================

function getCartItems() {

    return Object.keys(cart)

        .map(productId => {

            const product =
                products.find(
                    item =>
                        item.id ===
                        Number(productId)
                );


            if (
                !product ||
                product.price === null ||
                !product.available
            ) {

                return null;
            }


            const quantity =
                cart[productId];


            return {

                ...product,

                quantity:

                    quantity,

                total:

                    product.price *
                    quantity

            };

        })

        .filter(Boolean);

}


// ======================================================
// CART TOTALS
// ======================================================

function calculateCartTotals() {

    const items =
        getCartItems();


    const totalQuantity =
        items.reduce(

            (sum, item) =>
                sum + item.quantity,

            0
        );


    const totalAmount =
        items.reduce(

            (sum, item) =>
                sum + item.total,

            0
        );


    return {

        quantity:
            totalQuantity,

        amount:
            totalAmount

    };

}


// ======================================================
// CREATE STICKY CART BAR
// ======================================================

function createCartBar() {

    const existing =
        document.getElementById(
            "cartBar"
        );


    if (existing) {

        existing.remove();
    }


    const cartBar =
        document.createElement(
            "div"
        );


    cartBar.id =
        "cartBar";


    cartBar.className =
        "cart-bar";


    cartBar.innerHTML = `

        <div class="cart-summary">

            <div>

                <span id="cartItemCount">
                    0
                </span>

                <span class="cart-label">
                    Items Selected
                </span>

            </div>


            <div
                class="cart-total"
                id="cartTotal">

                ₹0

            </div>

        </div>


        <button
            id="viewEstimateBtn"
            class="estimate-btn"
            type="button">

            View Estimate

        </button>
    `;


    document.body.appendChild(
        cartBar
    );


    document
        .getElementById(
            "viewEstimateBtn"
        )
        .addEventListener(
            "click",
            openEstimate
        );

}


// ======================================================
// UPDATE CART BAR
// ======================================================

function updateCartBar() {

    const totals =
        calculateCartTotals();


    const count =
        document.getElementById(
            "cartItemCount"
        );


    const total =
        document.getElementById(
            "cartTotal"
        );


    if (count) {

        count.textContent =
            totals.quantity;
    }


    if (total) {

        total.textContent =

            `₹${totals.amount.toLocaleString("en-IN")}`;
    }

}


// ======================================================
// CREATE ESTIMATE DRAWER
// ======================================================

function createEstimateDrawer() {

    const drawer =
        document.createElement(
            "div"
        );


    drawer.id =
        "estimateOverlay";


    drawer.className =
        "estimate-overlay";


    drawer.innerHTML = `

        <div class="estimate-panel">


            <div class="estimate-header">

                <div>

                    <span class="estimate-kicker">
                        SELVA CRACKERS
                    </span>

                    <h2>
                        Your Estimate
                    </h2>

                    <p>
                        Selected products only
                    </p>

                </div>


                <button
                    id="closeEstimateBtn"
                    class="estimate-close"
                    type="button">

                    ×

                </button>

            </div>



            <div
                id="estimateItems"
                class="estimate-items">
            </div>



            <div class="estimate-summary">


                <div>

                    <span>
                        Total Quantity
                    </span>

                    <strong
                        id="estimateQty">

                        0

                    </strong>

                </div>


                <div>

                    <span>
                        Estimate Total
                    </span>

                    <strong
                        id="estimateTotal">

                        ₹0

                    </strong>

                </div>


            </div>



            <div class="estimate-note">

                <strong>
                    Note:
                </strong>

                This is an estimate only.
                Final availability,
                payment and collection /
                delivery arrangements
                will be confirmed directly
                by Selva Crackers.

            </div>



            <div class="estimate-actions">


                <button
                    id="continueShoppingBtn"
                    class="estimate-secondary-button"
                    type="button">

                    Continue Shopping

                </button>


                <button
                    id="resetSelectionBtn"
                    class="estimate-reset-button"
                    type="button">

                    Reset Selection

                </button>


                <button
                    id="proceedEnquiryBtn"
                    class="estimate-primary-button"
                    type="button">

                    Continue Enquiry →

                </button>


            </div>


        </div>
    `;


    document.body.appendChild(
        drawer
    );


    document
        .getElementById(
            "closeEstimateBtn"
        )
        .addEventListener(
            "click",
            closeEstimate
        );


    document
        .getElementById(
            "continueShoppingBtn"
        )
        .addEventListener(
            "click",
            closeEstimate
        );


    document
        .getElementById(
            "resetSelectionBtn"
        )
        .addEventListener(
            "click",
            resetSelection
        );


    document
        .getElementById(
            "proceedEnquiryBtn"
        )
        .addEventListener(
            "click",
            function () {

                alert(
                    "Next step: Customer details and WhatsApp enquiry."
                );

            }
        );


    drawer.addEventListener(
        "click",
        function (event) {

            if (
                event.target === drawer
            ) {

                closeEstimate();

            }

        }
    );

}


// ======================================================
// OPEN ESTIMATE
// ======================================================

function openEstimate() {

    const items =
        getCartItems();


    if (
        items.length === 0
    ) {

        alert(
            "Please select at least one product."
        );

        return;
    }


    renderEstimateItems();


    document
        .getElementById(
            "estimateOverlay"
        )
        .classList.add(
            "show"
        );


    document.body.classList.add(
        "estimate-open"
    );

}


// ======================================================
// CLOSE ESTIMATE
// ======================================================

function closeEstimate() {

    document
        .getElementById(
            "estimateOverlay"
        )
        .classList.remove(
            "show"
        );


    document.body.classList.remove(
        "estimate-open"
    );

}


// ======================================================
// RENDER ESTIMATE ITEMS
// ======================================================

function renderEstimateItems() {

    const container =
        document.getElementById(
            "estimateItems"
        );


    const items =
        getCartItems();


    if (
        items.length === 0
    ) {

        container.innerHTML = `

            <div class="estimate-empty">

                No products selected.

            </div>
        `;


        document.getElementById(
            "estimateQty"
        ).textContent =
            "0";


        document.getElementById(
            "estimateTotal"
        ).textContent =
            "₹0";


        return;
    }


    container.innerHTML =
        items
        .map(item => `

            <div class="estimate-item">


                <div class="estimate-product-info">

                    <span class="estimate-product-number">

                        ${item.id}

                    </span>


                    <div>

                        <strong>

                            ${item.name}

                        </strong>


                        <small>

                            ${item.tamilName || ""}

                        </small>


                        <span>

                            ₹${item.price.toLocaleString("en-IN")}
                            / ${item.unit}

                        </span>

                    </div>

                </div>



                <div class="estimate-item-controls">


                    <div class="estimate-qty-control">


                        <button
                            type="button"
                            onclick="changeQuantity(${item.id}, -1)">

                            −

                        </button>


                        <strong>

                            ${item.quantity}

                        </strong>


                        <button
                            type="button"
                            onclick="changeQuantity(${item.id}, 1)">

                            +

                        </button>


                    </div>


                    <div class="estimate-line-total">

                        ₹${item.total.toLocaleString("en-IN")}

                    </div>


                </div>


            </div>

        `)
        .join("");


    const totals =
        calculateCartTotals();


    document.getElementById(
        "estimateQty"
    ).textContent =
        totals.quantity;


    document.getElementById(
        "estimateTotal"
    ).textContent =

        `₹${totals.amount.toLocaleString("en-IN")}`;

}


// ======================================================
// RESET CART
// ======================================================

function resetSelection() {

    const confirmed =
        confirm(
            "Remove all selected products?"
        );


    if (!confirmed) {

        return;
    }


    cart = {};


    saveCart();


    filterProducts();


    updateCartBar();


    renderEstimateItems();


    closeEstimate();

}


// ======================================================
// ESCAPE KEY
// ======================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            document.body.classList.contains(
                "estimate-open"
            )
        ) {

            closeEstimate();

        }

    }
);


// ======================================================
// EVENTS
// ======================================================

searchInput.addEventListener(
    "input",
    filterProducts
);


categoryFilter.addEventListener(
    "change",
    filterProducts
);


// ======================================================
// START
// ======================================================

loadCategories();

displayProducts(
    products
);

createCartBar();

createEstimateDrawer();

updateCartBar();
