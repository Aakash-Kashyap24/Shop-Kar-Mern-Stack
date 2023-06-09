Ecommerce GitHub Repository
# How it looks like

![Screenshot_select-area_20230602050753](https://github.com/Aakash-Kashyap24/Shop-Kar-Mern-Stack/assets/110857134/586cc8f3-ccb8-455b-8bd6-f13370e50a0b)

![Screenshot_select-area_20230602050819](https://github.com/Aakash-Kashyap24/Shop-Kar-Mern-Stack/assets/110857134/bad9bdd6-0906-44da-a076-aaa4585b53b7)
![Screenshot_select-area_20230602050839](https://github.com/Aakash-Kashyap24/Shop-Kar-Mern-Stack/assets/110857134/056ff872-c4bc-4fa0-a930-b6d2f57076f9)

![Screenshot_select-area_20230602050858](https://github.com/Aakash-Kashyap24/Shop-Kar-Mern-Stack/assets/110857134/d2fd27f6-63d7-4207-b6dd-849579034dc0)

![Screenshot_select-area_20230602050919](https://github.com/Aakash-Kashyap24/Shop-Kar-Mern-Stack/assets/110857134/bc6518c1-55d4-4c17-92b6-82b328ae514b)

![Screenshot_select-area_20230602050933](https://github.com/Aakash-Kashyap24/Shop-Kar-Mern-Stack/assets/110857134/54c7ec64-b744-45b9-a925-a4d00df53480)

![Screenshot_select-area_20230602050951](https://github.com/Aakash-Kashyap24/Shop-Kar-Mern-Stack/assets/110857134/bfb34563-3c01-4bb2-aa7e-d9f1c61f01f8)

![Screenshot_select-area_20230602051005](https://github.com/Aakash-Kashyap24/Shop-Kar-Mern-Stack/assets/110857134/c938c21d-2d92-4456-842a-6b1e3e10c42b)

![Screenshot_select-area_20230602051108](https://github.com/Aakash-Kashyap24/Shop-Kar-Mern-Stack/assets/110857134/5d84e995-d24b-4846-a8a7-80edf42837e2)

![Screenshot_select-area_20230602051306](https://github.com/Aakash-Kashyap24/Shop-Kar-Mern-Stack/assets/110857134/bf456f2d-c02d-431f-a6f5-1778cc942ce6)

![Screenshot_select-area_20230602051326](https://github.com/Aakash-Kashyap24/Shop-Kar-Mern-Stack/assets/110857134/4d9e8724-5fad-4ace-9043-beac1f0282ca)

![Screenshot_select-area_20230602051338](https://github.com/Aakash-Kashyap24/Shop-Kar-Mern-Stack/assets/110857134/16ac9d5b-4adc-48b7-abdc-635c65bd2dc4)

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

Create a .env file in the config folder of the project and replace the placeholder values with your own configuration:

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
