# RESTAPI

This is a basic Express.js API for managing a list of products. It supports CRUD operations, filtering, searching and basic error handling. It also includes middleware for authentication and validation.


## Endpoints

### General Routes
- `GET /api/products` 
It returns a list of all products.

- `GET /api/products/:id` 
Returns a specific product by id.

- `POST /api/products` 
Adds a new product

- `PUT /api/products:id` 
Updates an existing product by id.

- `DELETE /api/products:id`
Deletes a product by id.

### Advanced Routes
- `GET /api/products/search?name=...`  
  Searches for products by name.

- `GET /api/products/category?category=...`  
  Filters products by category.

- `GET /api/products/statistics`  
  Returns product count per category.


## Middleware

### Authentication
There is a middleware which authenticates routes by an api key in the request header. 

### Validation
Input data is validated to prevent non-empty strings being inputed and to ensure that price is a positive number and inStock is a boolean.

## Error Handling
Custom error handling with 3 custom classes found in the `Utils` directory
- CustomError - For general api errors.
- NotFoundError - When a product is not found.
- ValidationError - When an input data is invalid


## Getting Started
1. Clone the repository

```bash
git clone https://github.com/week-2-express-js-assignment-Christabel-Akpene-1
cd week-2-express-js-assignment-Christabel-Akpene-1
```

2. Install dependencies
`npm install `

3. Create a .env file with template found in the .env.example file.

4. Start the server
`node server.js`


### Testing 
You can test the api endpoints using Postman, Insomnia, or Curl.

