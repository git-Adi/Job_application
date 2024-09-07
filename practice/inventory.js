class Product {
    constructor(productId, name, description, price, quantity) {
        this.productId = productId;
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
    }

    toString() {
        return `Product(id=${this.productId}, name=${this.name}, quantity=${this.quantity})`;
    }
}

class InventoryService {
    constructor() {
        this.products = new Map();
    }

    addProduct(product) {
        this.products.set(product.productId, product);
    }

    updateProduct(productId, updates) {
        if (this.products.has(productId)) {
            const product = this.products.get(productId);
            this.products.set(productId, { ...this.products.get(productId), ...updates });
        }
    }

    deleteProduct(productId) {
        this.products.delete(productId);
    }

    viewProduct(productId) {
        return this.products.get(productId) || null;
    }

    listProducts() {
        return Array.from(this.products.values());
    }

    updateStock(productId, quantity) {
        if (this.products.has(productId)) {
            const product = this.products.get(productId);
            product.quantity = quantity; // Corrected typo here
            this.products.set(productId, product);
        }
    }
}


class Order {
    constructor(orderId, products) {
        this.orderId = orderId;
        this.products = products;
        this.totalAmount = products.reduce((total, product) => total + product.price * product.quantity, 0);
    }
}

class OrderService {
    constructor(inventoryService) {
        this.orders = new Map();
        this.inventoryService = inventoryService;
    }

    createOrder(orderId, productOrders) {
        const products = [];
        for (const [productId, quantity] of Object.entries(productOrders)) {
            const product = this.inventoryService.viewProduct(productId);
            console.log(`Checking stock for product ${productId}: ${product.quantity} available, ${quantity} requested`);
            if (product && product.quantity >= quantity) {
                product.quantity -= quantity;
                products.push(new Product(productId, product.name, product.description, product.price, quantity));
                this.inventoryService.updateStock(productId, product.quantity);
            } else {
                throw new Error(`Insufficient stock for product ${productId}`);
            }
        }

        const order = new Order(orderId, products);
        this.orders.set(orderId, order);
        return order;
    }

    viewOrder(orderId) {
        return this.orders.get(orderId) || null;
    }
}

// Test the implementation
const inventoryService = new InventoryService();
const orderService = new OrderService(inventoryService);

inventoryService.addProduct(new Product(1, "Laptop", "A powerful laptop", 1000, 10));
inventoryService.addProduct(new Product(2, "Mouse", "A wireless mouse", 50, 100));

// Update product
inventoryService.updateProduct(1, { name: "Gaming Laptop", price: 1500 });

// Create an order
try {
    const order = orderService.createOrder(1, {1: 2, 2: 5});
    console.log(`Order created: ${JSON.stringify(order)}`);
} catch (error) {
    console.error(error.message);
}

// View reports
console.log("Inventory Report:", inventoryService.listProducts());
console.log("Order Report:", Array.from(orderService.orders.values()));
