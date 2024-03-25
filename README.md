## Description

This project aims to build a web application for managing items and sellers in an online marketplace.

## Features

-   **Item Management**: Allows users to create, update, delete, and view items.
-   **Seller Management**: Enables registration, login, logout, and profile management for sellers.
-   **Authentication & Authorization**: Provides user authentication using JWT tokens and role-based access control.
-   **Validation Middleware**: Validates incoming requests using express-validator middleware.
-   **Error Handling**: Implements global error handling for both synchronous and asynchronous functions.
-   **Database Integration**: Utilizes MongoDB for data storage and mongoose for object modeling.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your/repository.git
    ```

2. Install dependencies:

    ```bash
    cd project-folder
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the root directory and add the following variables:

    ```plaintext
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/database
    JWT_SECRET=your_secret_key
    ```

4. Run the application:

    ```bash
    npm start
    ```

## File Structure

```
.
├── controllers
│   ├── items.controller.js
│   └── sellers.controller.js
├── errors
│   └── custom.errors.js
├── middlewares
│   └── validation.middleware.js
├── models
│   ├── Item.Model.js
│   └── Seller.Model.js
├── routes
│   ├── items.router.js
│   └── sellers.router.js
├── utils
│   └── constants.js
├── index.js
├── package.json
└── README.md
```

## Dependencies

-   express
-   morgan
-   dotenv
-   mongoose
-   chalk
-   express-async-errors
-   http-status-codes

## Usage

### Items

-   **Create Item**: `POST /api/v1/items`
-   **Get All Items**: `GET /api/v1/items`
-   **Get Current User Items**: `GET /api/v1/items/current`
-   **Get Single Item**: `GET /api/v1/items/:id`
-   **Update Single Item**: `PUT /api/v1/items/:id`
-   **Delete Single Item**: `DELETE /api/v1/items/:id`

### Sellers

-   **Register Seller**: `POST /api/v1/sellers/register`
-   **Login Seller**: `POST /api/v1/sellers/login`
-   **Logout Seller**: `GET /api/v1/sellers/logout`
-   **Get All Sellers**: `GET /api/v1/sellers`
-   **Get Single Seller**: `GET /api/v1/sellers/:id`
-   **Get Current User**: `GET /api/v1/sellers/self/profile`
-   **Update Current User**: `PUT /api/v1/sellers/self/profile`
-   **Get Application Stats**: `GET /api/v1/sellers/admin/stats`

## Constants

-   **ITEM_FIELDS**: Fields to return for each item.
-   **USER_FIELDS**: Fields to return for each seller.
-   **ITEM_CONDITION**: Enum representing item conditions.
-   **PAYMENT_OPTIONS**: Enum representing payment options.
-   **LISTING_DAYS**: Enum representing listing durations.
-   **ACCOUNT_ROLES**: Enum representing account roles.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

This README provides an overview of the project, including its description, features, installation instructions, file structure, dependencies, usage instructions, constants, and license information.

# index.js

This file serves as the entry point for the application, configuring the server, middleware, routes, and error handling.

## Dependencies:

-   **express**: Web application framework for Node.js.
-   **morgan**: HTTP request logger middleware for Node.js.
-   **dotenv**: Loads environment variables from a `.env` file.
-   **mongoose**: MongoDB object modeling tool designed to work in an asynchronous environment.
-   **chalk**: Library for styling terminal strings.
-   **express-async-errors**: Simplifies error handling for asynchronous functions.
-   **http-status-codes**: Library providing HTTP status code constants.

## Initialization:

1. **Load Environment Variables**: Loads environment variables from the `.env` file using `dotenv.config()`.

2. **Initialize Express App**: Creates an instance of the Express application.

## Middleware Setup:

-   **express.json()**: Middleware to parse incoming JSON requests.
-   **morgan('dev')**: Middleware to log HTTP requests to the console in the 'dev' format.
-   **cookieParser()**: Middleware to parse cookies attached to the request headers.

## Routes Setup:

-   **Items Router**: Mounts the `itemsRouter` at the `/api/v1/items` endpoint.
-   **Sellers Router**: Mounts the `sellerRouter` at the `/api/v1/sellers` endpoint.

## Error Handling:

-   **Unknown Routes**: Middleware to handle unknown routes, responding with a 404 Not Found status.
-   **Global Error Handler**: Middleware to handle errors globally, logging the error and sending an appropriate error response.

## Server Startup:

1. **Connect to MongoDB Database**: Attempts to connect to the MongoDB database using the provided `MONGO_URI` environment variable.

2. **Start Listening on Port**: Starts the Express server listening on the specified port (`PORT` environment variable or default to `5000`).

## Error Handling on Server Startup:

-   If an error occurs during database connection, it is logged, and the process exits with a non-zero status code.

## Logging:

-   Server startup information, including the server URL, is logged to the console using `chalk.blue()` for styling.

# constants.js

This file defines various constants used throughout the application.

## Constants:

### `ITEM_FIELDS`

-   **Description:** Fields to return for each item.
-   **Value:** `'title description price quantity condition'`.

### `USER_FIELDS`

-   **Description:** Fields to return for each seller.
-   **Value:** `'username sellerRating email firstName lastName accountRole'`.

### `ITEM_CONDITION`

-   **Description:** Enum representing item conditions.
-   **Values:**
    -   `USED`: 'used'
    -   `NEW`: 'new'
    -   `REFURB`: 'refurbrished'

### `PAYMENT_OPTIONS`

-   **Description:** Enum representing payment options.
-   **Values:**
    -   `CREDIT_CARD`: 'credit_card'
    -   `PAYPAL`: 'paypal'
    -   `EASYPAISA`: 'easypaisa'
    -   `JAZZCASH`: 'jazzcash'
    -   `BANK`: 'bank'

### `LISTING_DAYS`

-   **Description:** Enum representing listing durations.
-   **Values:**
    -   `THREE`: 'three'
    -   `WEEK`: 'week'
    -   `MONTH`: 'month'

### `ACCOUNT_ROLES`

-   **Description:** Enum representing account roles.
-   **Values:**
    -   `ADMIN`: 'admin'
    -   `USER`: 'user'

## Usage:

-   These constants are used throughout the application to maintain consistency and avoid hardcoding values.
-   They are particularly useful for specifying field selections, enum values, and role definitions.

## Export:

-   **Each constant** is exported individually for use in other parts of the application.

# sellers.router.js

This file defines the Express router for handling seller-related routes in the application.

## Dependencies:

-   **express**: Web framework for Node.js.

## Routes:

### `router.post('/register')`

-   **Description:** Route for registering a new seller.
-   **Method:**
    -   `POST`: Registers a new seller after validating input.
-   **Middleware:**
    -   `validateNewUserInputs`: Validates the input data before registering the seller.

### `router.post('/login')`

-   **Description:** Route for logging in a seller.
-   **Method:**
    -   `POST`: Logs in a seller after validating login credentials.
-   **Middleware:**
    -   `validateUserLogin`: Validates the login credentials before logging in the seller.

### `router.get('/logout')`

-   **Description:** Route for logging out a seller.
-   **Method:**
    -   `GET`: Logs out the currently authenticated seller.

### `router.get('/')`

-   **Description:** Route for getting all sellers.
-   **Method:**
    -   `GET`: Retrieves all sellers.
-   **Middleware:**
    -   `authenticateUser`: Authenticates the user before retrieving all sellers.

### `router.route('/:id')`

-   **Description:** Route for getting a single seller by ID.
-   **Method:**
    -   `GET`: Retrieves a single seller by ID.
-   **Middleware:**
    -   `validateObjectId`: Validates the object ID parameter.

### `router.route('/self/profile')`

-   **Description:** Route for getting the profile of the currently authenticated seller and updating it.
-   **Methods:**
    -   `GET`: Retrieves the profile of the currently authenticated seller.
    -   `PUT`: Updates the profile of the currently authenticated seller.
-   **Middleware:**
    -   `authenticateUser`: Authenticates the user before accessing their profile.
    -   `updateCurrentUser`: Validates and updates the profile of the currently authenticated seller.

### `router.get('/admin/stats')`

-   **Description:** Route for getting application statistics.
-   **Method:**
    -   `GET`: Retrieves application statistics.
-   **Middleware:**
    -   `authenticateUser`: Authenticates the user before retrieving application statistics.
    -   `authorizePermissions('admin')`: Authorizes access for admin users only.

## Usage:

-   The routes defined in this file handle seller-related operations such as registration, login, logout, profile management, and statistics retrieval.
-   Middleware functions ensure authentication, input validation, object ID validation, and authorization for secure and reliable operations.

## Export:

-   **`router`**: The Express router configured with seller-related routes.
-   **Usage:** Exported to be mounted in the main application file for routing seller requests.

# items.router.js

This file defines the Express router for handling item-related routes in the application.

## Dependencies:

-   **express**: Web framework for Node.js.

## Routes:

### `router.route('/')`

-   **Description:** Route for creating a new item and getting all items.
-   **Methods:**
    -   `POST`: Creates a new item after authenticating the user and validating input.
    -   `GET`: Retrieves all items.
-   **Middleware:**
    -   `authenticateUser`: Authenticates the user before creating a new item.
    -   `validateItemInputs`: Validates the input data before creating a new item.

### `router.get('/current')`

-   **Description:** Route for getting items created by the current user.
-   **Method:**
    -   `GET`: Retrieves items created by the current authenticated user.
-   **Middleware:**
    -   `authenticateUser`: Authenticates the user before retrieving their items.

### `router.route('/:id')`

-   **Description:** Route for getting, updating, and deleting a single item by ID.
-   **Methods:**
    -   `PUT`: Updates a single item by ID after validating input.
    -   `GET`: Retrieves a single item by ID.
    -   `DELETE`: Deletes a single item by ID.
-   **Middleware:**
    -   `validateObjectId`: Validates the object ID parameter.
    -   `authenticateUser`: Authenticates the user before accessing item-related routes.
    -   `validateItemInputs` (for `PUT`): Validates the input data before updating the item.

## Usage:

-   The routes defined in this file handle item-related operations such as creation, retrieval, update, and deletion.
-   Middleware functions ensure authentication, input validation, and object ID validation for secure and reliable operations.

## Export:

-   **`router`**: The Express router configured with item-related routes.
-   **Usage:** Exported to be mounted in the main application file for routing item requests.

# Seller.Model.js

This file defines the Mongoose model schema for sellers in the application.

## Dependencies:

-   **mongoose**: Used for MongoDB object modeling and schema creation.
-   **bcryptjs**: Used for hashing passwords.

## Schema:

### `sellerSchema`

-   **Description:** Schema for seller details.
-   **Fields:**
    -   `username`: Username of the seller, must be unique.
    -   `sellerRating`: Seller rating, ranging from 0 to 5.
    -   `email`: Email address of the seller, must be unique.
    -   `password`: Password of the seller's account.
    -   `firstName`: First name of the seller.
    -   `lastName`: Last name of the seller.
    -   `phoneNumber`: Phone number of the seller, must be unique.
    -   `profilePicture`: URL to the seller's profile picture.
    -   `lastLoginDate`: Date of the seller's last login.
    -   `accountRole`: Account role with predefined values (default: USER).
-   **Options:**
    -   `timestamps`: Enable timestamps to track creation and update.
    -   `versionKey`: Disable version key.
-   **Pre-Save Hook:** Hashes the password before saving the seller.
-   **Usage:** Represents the schema for sellers in the application.

## Exported Model:

-   **`Seller`**: Model for the `sellerSchema`.
-   **Usage:** Exported to be used in other parts of the application for CRUD operations on sellers.

---

This documentation provides an overview of the schema defined in the `Seller.Model.js` file, including its fields, usage, and the exported model for interacting with the MongoDB database.

Sure! Below is the README.md documentation for the provided `Item.Model.js` file:

---

# Item.Model.js

This file defines the Mongoose model schema for products/items in the application.

## Dependencies:

-   **mongoose**: Used for MongoDB object modeling and schema creation.

## Schemas:

### 1. `shippingOptionSchema`

-   **Description:** Schema for shipping options with method and cost.
-   **Fields:**
    -   `method`: Shipping method with a maximum length of 50 characters.
    -   `cost`: Shipping cost, must be non-negative.
-   **Usage:** Used as a subdocument within the main product schema.

### 2. `productSchema`

-   **Description:** Main schema for product/item details.
-   **Fields:**
    -   `title`: Title of the product, required.
    -   `description`: Description of the product, required.
    -   `price`: Price of the product, must be non-negative.
    -   `category`: Category of the product, required.
    -   `condition`: Condition of the product with predefined options (default: USED).
    -   `seller`: Reference to the seller of the product.
    -   `location`: Location of the product, required.
    -   `shippingOptions`: Array of shipping options using the `shippingOptionSchema`.
    -   `images`: Array of image URLs, default empty array.
    -   `quantity`: Quantity available, must be non-negative.
    -   `availability`: Availability status of the product, defaults to true.
    -   `attributes`: Attributes for the product (brand and color).
    -   `listingDuration`: Duration of the product listing with predefined options (default: WEEK).
    -   `sku`: Stock Keeping Unit identifier, required.
    -   `endDate`: End date of the product listing, required.
    -   `paymentOptions`: Payment options with predefined values, required.
    -   `returnPolicy`: Return policy of the product, required with default value.
    -   `sellerNotes`: Additional notes from the seller, optional.
-   **Options:**
    -   `timestamps`: Enable timestamps to track creation and update.
    -   `versionKey`: Disable version key.
-   **Usage:** Represents the schema for products/items in the application.

## Exported Model:

-   **`Product`**: Model for the `Product` schema.
-   **Usage:** Exported to be used in other parts of the application for CRUD operations on products/items.

# validation.middleware.js

This file contains middleware functions for request validation using the Express-validator library.

## Middleware Functions:

### 1. `validateObjectId`

-   **Description:** Middleware to validate if the provided parameter ID is a valid MongoDB ObjectId format.
-   **Parameters:**
    -   `req`: The Express request object.
    -   `res`: The Express response object.
    -   `next`: The Express next function to proceed to the next middleware.
-   **Usage:** Used to validate request parameters containing MongoDB ObjectId.

### 2. `withValidationErrors`

-   **Description:** Higher-order middleware function that wraps around validation rules to handle validation errors.
-   **Parameters:**
    -   `rules`: An array of validation rules defined using Express-validator.
-   **Usage:** Wraps around validation rules to handle validation errors and pass them to the error handling middleware.

### 3. `validateItemInputs`

-   **Description:** Middleware to validate item inputs based on specified validation rules.
-   **Parameters:**
    -   `req`: The Express request object.
    -   `res`: The Express response object.
    -   `next`: The Express next function to proceed to the next middleware.
-   **Usage:** Used to validate item inputs before creating or updating items.

### 4. `validateNewUserInputs`

-   **Description:** Middleware to validate new user inputs based on specified validation rules.
-   **Parameters:**
    -   `req`: The Express request object.
    -   `res`: The Express response object.
    -   `next`: The Express next function to proceed to the next middleware.
-   **Usage:** Used to validate inputs when creating a new user account.

### 5. `validateUserLogin`

-   **Description:** Middleware to validate user login inputs based on specified validation rules.
-   **Parameters:**
    -   `req`: The Express request object.
    -   `res`: The Express response object.
    -   `next`: The Express next function to proceed to the next middleware.
-   **Usage:** Used to validate inputs during user login.

### 6. `authenticateUser`

-   **Description:** Middleware to authenticate user requests using JWT tokens.
-   **Parameters:**
    -   `req`: The Express request object.
    -   `res`: The Express response object.
    -   `next`: The Express next function to proceed to the next middleware.
-   **Usage:** Used to verify JWT tokens and authenticate user requests.

### 7. `authorizePermissions`

-   **Description:** Middleware to authorize user permissions based on specified roles.
-   **Parameters:**
    -   `roles`: An array of roles authorized to access the route.
-   **Usage:** Used to ensure that only users with specific roles are authorized to access certain routes.

# custom.errors.js

This file contains custom error classes used for handling various HTTP error responses in the application.

## Classes:

### 1. `CustomError`

-   **Description:** Base custom error class from which other specific error classes extend.
-   **Constructor:**
    -   Parameters:
        -   `message`: The error message.
        -   `statusCode`: The HTTP status code (default: 500 Internal Server Error).

### 2. `NotFoundError`

-   **Description:** Error class for "Not Found" errors (404).
-   **Extends:** `CustomError`
-   **Constructor:**
    -   Parameters:
        -   `message`: The error message (default: "Not found").

### 3. `UnauthorizedError`

-   **Description:** Error class for "Unauthorized" errors (401).
-   **Extends:** `CustomError`
-   **Constructor:**
    -   Parameters:
        -   `message`: The error message (default: "Unauthorized").

### 4. `BadRequestError`

-   **Description:** Error class for "Bad Request" errors (400).
-   **Extends:** `CustomError`
-   **Constructor:**
    -   Parameters:
        -   `message`: The error message (default: "Bad request").

**Note:** Other specific error classes can be added similarly by extending the `CustomError` class and specifying the appropriate status code and error message in the constructor.

---

This documentation provides an overview of each custom error class along with its description, inheritance (if applicable), constructor parameters, and default error messages and status codes.

Sure, here's the README.md documentation for the `seller.controller.js` file:

---

# seller.controller.js

This file contains controller functions for handling CRUD operations related to sellers in the application.

## Functions:

### 1. `createSeller`

-   **Description:** Creates a new seller account.
-   **HTTP Method:** POST
-   **Endpoint:** `/api/sellers/register`
-   **Request Body:** Seller account details
-   **Response:**
    -   Status: 201 Created
    -   Body: An object containing the created seller details.
-   **Functionality:**
    -   Determines the account role based on whether it's the first account or not.
    -   Creates the seller account in the database.
    -   Returns success response with selected seller details.

### 2. `loginSeller`

-   **Description:** Logs in a seller.
-   **HTTP Method:** POST
-   **Endpoint:** `/api/sellers/login`
-   **Request Body:** Seller login credentials
-   **Response:**
    -   Status: 200 OK
    -   Body: An object containing the seller details and a JWT token.
-   **Functionality:**
    -   Finds the seller by email.
    -   Compares passwords.
    -   Generates a JWT token with seller ID and account role.
    -   Sets cookie with the JWT token.

### 3. `logoutSeller`

-   **Description:** Logs out a seller.
-   **HTTP Method:** POST
-   **Endpoint:** `/api/sellers/logout`
-   **Response:**
    -   Status: 200 OK
    -   Body: A success message indicating that the user has been logged out.

### 4. `getAllSellers`

-   **Description:** Retrieves all sellers from the database.
-   **HTTP Method:** GET
-   **Endpoint:** `/api/sellers`
-   **Response:**
    -   Status: 200 OK
    -   Body: An object containing the total number of sellers and an array of sellers.

### 5. `getSingleSeller`

-   **Description:** Retrieves a single seller by ID.
-   **HTTP Method:** GET
-   **Endpoint:** `/api/sellers/:id`
-   **Response:**
    -   Status: 200 OK
    -   Body: An object containing the seller details.
-   **Error Handling:**
    -   Throws a NotFoundError if the seller with the specified ID is not found.

### 6. `getCurrentUser`

-   **Description:** Retrieves details of the current logged-in seller.
-   **HTTP Method:** GET
-   **Endpoint:** `/api/sellers/current`
-   **Response:**
    -   Status: 200 OK
    -   Body: An object containing the current seller's details.
-   **Error Handling:**
    -   Throws a NotFoundError if the current seller is not found.

### 7. `updateCurrentUser`

-   **Description:** Updates details of the current logged-in seller.
-   **HTTP Method:** PUT
-   **Endpoint:** `/api/sellers/current`
-   **Request Body:** Updated seller details
-   **Response:**
    -   Status: 200 OK
    -   Body: An object containing the updated seller details.
-   **Functionality:**
    -   Finds the seller by ID.
    -   Updates the seller with the provided and changed fields.
    -   Returns success response with the updated seller details.
-   **Error Handling:**
    -   Throws a NotFoundError if the current seller is not found.

### 8. `getApplicationStats`

-   **Description:** Retrieves application statistics (for admin).
-   **HTTP Method:** GET
-   **Endpoint:** `/api/sellers/stats`
-   **Response:**
    -   Status: 200 OK
    -   Body: An object containing the total number of sellers and products.
-   **Functionality:**
    -   Counts the total number of sellers and products in the database.

---

This documentation provides an overview of each controller function along with its description, HTTP method, endpoint, request body (if applicable), response details, functionality, and error handling.

Sure, below is the README.md documentation for the `items.controller.js` file:

---

# items.controller.js

This file contains controller functions for handling CRUD operations related to items in the application.

## Functions:

### 1. `getAllItems`

-   **Description:** Retrieves all items from the database.
-   **HTTP Method:** GET
-   **Endpoint:** `/api/items`
-   **Response:**
    -   Status: 200 OK
    -   Body: An object containing the total number of items and an array of items.

### 2. `getSingleItem`

-   **Description:** Retrieves a single item by its ID.
-   **HTTP Method:** GET
-   **Endpoint:** `/api/items/:id`
-   **Response:**
    -   Status: 200 OK
    -   Body: An object containing the item details.
-   **Error Handling:**
    -   Throws a NotFoundError if the item with the specified ID is not found.

### 3. `updateSingleItem`

-   **Description:** Updates a single item by its ID.
-   **HTTP Method:** PUT
-   **Endpoint:** `/api/items/:id`
-   **Request Body:** Updated item data
-   **Response:**
    -   Status: 200 OK
    -   Body: An object containing the updated item details.
-   **Error Handling:**
    -   Throws a NotFoundError if the item with the specified ID is not found.

### 4. `deleteSingleItem`

-   **Description:** Deletes a single item by its ID.
-   **HTTP Method:** DELETE
-   **Endpoint:** `/api/items/:id`
-   **Response:**
    -   Status: 200 OK
    -   Body: An object confirming the deletion of the item.
-   **Error Handling:**
    -   Throws a NotFoundError if the item with the specified ID is not found.
    -   Throws an UnauthorizedError if the user is not authorized to delete the item.

### 5. `createItem`

-   **Description:** Creates a new item.
-   **HTTP Method:** POST
-   **Endpoint:** `/api/items`
-   **Request Body:** Item data
-   **Response:**
    -   Status: 201 Created
    -   Body: An object containing the created item details.

### 6. `getCurrentUserItems`

-   **Description:** Retrieves items owned by the current user.
-   **HTTP Method:** GET
-   **Endpoint:** `/api/items/user`
-   **Response:**
    -   Status: 200 OK
    -   Body: An object containing the total number of items and an array of items owned by the current user.

---

This documentation provides an overview of each controller function along with its description, HTTP method, endpoint, request body (if applicable), response details, and error handling.
