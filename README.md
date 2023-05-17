Ecommerce GitHub Repository

This repository contains the source code for an Ecommerce project built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It provides a platform for creating an online store with features such as product listing, shopping cart, order management, user authentication, and more.
Getting Started

To use this repository, follow the steps below:
Prerequisites

Before getting started, make sure you have the following software installed on your machine:

    Node.js: Download and Install Node.js
    MongoDB: Download and Install MongoDB

Installation

    Clone the repository to your local machine:

    bash

git clone https://github.com/your-username/ecommerce.git

Change to the project directory:

bash

cd ecommerce

Install the dependencies:

bash

npm install

Create a .env file in the root directory of the project and replace the placeholder values with your own configuration:

plaintext

PORT=3001
DB_URI="mongodb+srv://<your-username>:<your-password>@cluster0.4igmnr2.mongodb.net/<your-database>?retryWrites=true&w=majority"
SECRET_KEY="<your-secret-key>"
SMTP_SERVICE=gmail
SMTP_MAIL=<your-email>
SMTP_PASSWORD=<your-email-password>
SMTP_PORT=465
SMTP_HOST=smtp.google.com
JWT_EXPIRE=3600
COOKIE_EXPIRE=3600
STRIPE_API_KEY=<your-stripe-api-key>
STRIPE_SECRET_KEY=<your-stripe-secret-key>
CLOUDINARY_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
FRONT_END_URL="http://localhost:5173"

Note: Replace the values in angle brackets (< >) with your own information. Also, make sure to configure your MongoDB Atlas cluster and obtain the correct connection string.

Start the development server:

bash

    npm run dev

    This will start both the client and server applications concurrently.

    Access the application in your browser:

    Open your web browser and navigate to http://localhost:5173 (or the value specified in FRONT_END_URL).

Usage

Once the application is running, you can use the following URLs to access different sections of the Ecommerce project:

    Home: /
    Login: /login
    Signup: /signup
    Products: /products
    Product Details: /viewProduct/:id
    Cart: /cart
    Checkout: /shipping
    Order Confirmation: /order/confirm
    Profile: /profile
    Orders: /orders

Feel free to explore the application and test its various features.
