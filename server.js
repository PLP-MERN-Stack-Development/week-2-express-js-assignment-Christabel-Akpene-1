// server.js - Starter Express server for Week 2 assignment

// Import required modules
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const CustomError = require("./Utils/customError");
const NotFoundError= require("./Utils/notFound");
const ValidationError = require("./Utils/validateError");


// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const validApiKey = process.env.API_KEY;

// Middleware setup
app.use(bodyParser.json());

// Sample in-memory products database
let products = [
  {
    id: "1",
    name: "Laptop",
    description: "High-performance laptop with 16GB RAM",
    price: 1200,
    category: "electronics",
    inStock: true,
  },
  {
    id: "2",
    name: "Smartphone",
    description: "Latest model with 128GB storage",
    price: 800,
    category: "electronics",
    inStock: true,
  },
  {
    id: "3",
    name: "Coffee Maker",
    description: "Programmable coffee maker with timer",
    price: 50,
    category: "kitchen",
    inStock: false,
  },
];

// Task 1

// Root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});


// Task 3

// Custom logger middleware
const logger = (req, res, next) => {
  const method = req.method;
  const url = req.url;
  const timeStamp = new Date().toISOString();

  console.log(`urlMethod: ${method}, url: ${url}, timeStamp: ${timeStamp}`);

  next();
};

// To parse JSON request body
app.use(express.json());

// Authentication middleware which checks the header for an api key
const authenticate = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).send("Api key required.");
  }

  if (apiKey !== validApiKey) {
    return res.status(403).send("Invalid API key");
  }

  next();
};

// Validation MiddleWare
const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  const errors = [];

  if (typeof name !== "string" || name.trim() === "") {
    errors.push("Name must be a non-empty string.");
  }
  if (typeof description !== "string" || description.trim() === "") {
    errors.push("Description must be a non-empty string.");
  }
  if (typeof price !== "number" || price < 0) {
    errors.push("Price must be a positive number.");
  }
  if (typeof category !== "string" || category.trim() === "") {
    errors.push("Category must be a non-empty string.");
  }
  if (typeof inStock !== "boolean") {
    errors.push("inStock must be either true / false.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors,
    });
  }
  next();
};


// Task 5

// Search by name
app.get("/api/products/search", (req, res, next) => {
  const name = req.query.name;

  try{
  if (!name){
    throw new CustomError("Name parameter is required.", 400);
  }

  const results = products.filter((item) => {
    return item.name.toLowerCase().includes(name.toLowerCase())
  })

  res.status(200).json(results);
  }

  catch (err){
    next(err)
  }
  
})

// Filtering by categories
app.get("/api/products/category", (req, res, next) => {
  const category = req.query.category;

  try {
    if (!category) {
      throw new CustomError("Category parameter is required.", 400);
    }

    const specifiedCategory = products.filter((item) => {
      return item.category === category.toLowerCase();
    });

    if (specifiedCategory.length === 0) {
      throw new CustomError(
        "Could not find products in specified category.",
        404
      );
    }

    res.status(200).json(specifiedCategory);
  } catch (err) {
    next(err);
  }
});

app.get("/api/products/statistics", (req, res, next) => {
  try{
    const statistics = {};

    products.forEach((item) => {
      const category = item.category.toLowerCase();
      statistics[category] = (statistics[category] || 0) + 1
    })

    res.status(200).json(stats)
  }
  catch (err){
    next(err)
  }
})

// Adding pagination support

app.get("/api/products", (req, res, next) => {
  const { category, page = 1, limit = 10 } = req.query;
  try {
    let result = products;
    if (category) {
      result = products.filter((item) => {
        return item.category.toLowerCase() === category.toLowerCase();
      });
    }

    const paginatedResult = result.slice((page - 1) * limit, page * limit);

    res.status(200).json(paginatedResult);
  } catch (err) {
    next(err);
  }
});

// Task 4

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("error", err);
    res.status(500).json({
      message: "Error",
    });
  }
});

app.get("/api/products/:id", (req, res, next) => {
  const id = req.params.id;

  try {
    const specificProduct = products.find((item) => {
      return item.id === id;
    });

    if (!specificProduct) {
      throw new NotFoundError("No product found with specified id");
    }
    res.json(specificProduct);
  } catch (err) {
    next(err);
  }
});


// Task 2


// Getting all products
app.get("/api/products", (req, res) => {
  res.json(products);
});


// Getting a specific product
app.get("/api/products/:id", (req, res) => {
  const id = req.params.id;
  try {
    const specificProduct = products.find((item) => {
      return item.id === id;
    });

    if (!specificProduct) {
      return res.status(404).send("No product found with specified id");
    }

    res.json(specificProduct);
  } catch (err) {
    res.send("Error: ", err.message);
  }
});

// Create a new product
app.post("/api/products", (req, res) => {
  try {
    const newProduct = { id: (products.length + 1).toString(), ...req.body };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

// Update a product
app.put("/api/products/:id", (req, res) => {
  const id = req.params.id;
  try {
    const updatedProduct = products.find((item) => {
      return item.id === id;
    });

    if (!updatedProduct) {
      return res
        .status(404)
        .send("Could not find the product with the id specified.");
    }
    Object.assign(updatedProduct, req.body);
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

// DELETE /api/products/:id - Delete a product

app.delete("/api/products/:id", (req, res) => {
  const id = req.params.id;
  try {
    const deletedProduct = products.find((item) => {
      return item.id == id;
    });

    if (!deletedProduct) {
      return res.status(404).send("Could not find item with the specified id.");
    }

    products = products.filter((item) => {
      return item.id !== id;
    });

    res.status(200).json(deletedProduct);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



// Export the app for testing purposes
module.exports = app;
