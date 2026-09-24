// ========== MODEL ==========
const model = {
    allProducts: [],
    // Hent produkter fra API'et
    async fetchProducts() {
        const res = await fetch('https://dummyjson.com/products');
        if (!res.ok) throw new Error('Kunne ikke hente produkter');
        const data = await res.json();
        this.allProducts = data.products;
        return this.allProducts;
    },
    // Hent unikke kategorier fra produkterne
    getCategories() {
        return [...new Set(this.allProducts.map(p => p.category))].sort();
    },
    // Filtrer produkter efter kategori
    filterByCategory(category) {
        if (!category) return this.allProducts;
        return this.allProducts.filter(p => p.category === category);
    }
};

// ========== VIEW ==========
// Render produkter og kategorier
const view = {
    renderProducts(products) {
        const productList = document.getElementById("product-list");
        const status = document.getElementById("products-status");
        productList.innerHTML = "";
        status.textContent = `${products.length} produkter fundet`;
        
        products.forEach(product => {
            const card = document.createElement("article");
            const name = document.createElement("h2");
            const price = document.createElement("p");
            const category = document.createElement("p");
            const img = document.createElement("img");
            const addButton = document.createElement("button");
            
            name.textContent = product.title;
            price.textContent = `${product.price.toFixed(2)} $`;
            category.textContent = product.category;
            category.className = "category";
            img.src = product.thumbnail;
            img.alt = product.title;
            img.loading = "lazy";
            addButton.textContent = "Tilføj til liste";
            addButton.type = "button";
            addButton.addEventListener("click", () => {
                const savedItems = JSON.parse(localStorage.getItem("wishlistItems") || "[]");
                if (!savedItems.includes(product.title)) savedItems.push(product.title);
                localStorage.setItem("wishlistItems", JSON.stringify(savedItems));
                addButton.textContent = "Tilføjet";
                addButton.disabled = true;
            });
            
            card.append(img, category, name, price, addButton);
            productList.append(card);
        });
    },
    populateCategories(categories) {
        const select = document.getElementById("category-filter");
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            select.append(option);
        });
    }
};

// ========== CONTROLLER ==========
const controller = {
    // Hent produkter og render dem
    async init() {
        try {
            await model.fetchProducts();
            view.populateCategories(model.getCategories());
            view.renderProducts(model.allProducts);
            this.setupFilterListener();
        } catch (error) {
            // Vis en fejlmeddelelse, hvis produkterne ikke kan hentes
            document.getElementById("products-status").textContent = "Produkterne kunne ikke hentes lige nu.";
            console.error(error);
        }
    },
    // Opsæt event listener for filter dropdown
    setupFilterListener() {
        const select = document.getElementById("category-filter");
        select.addEventListener("change", (e) => {
            const filtered = model.filterByCategory(e.target.value);
            view.renderProducts(filtered);
        });
    }
};

// Start appen
controller.init();

