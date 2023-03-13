# Clinic-Management-System
Clinic Management System - RESTful API to manage multiple clinics, incl. authentication, authorization, patients, doctors, employees, medicines, clinics, appointments, prescriptions, invoices, &amp; payments. Manage all clinic data with ease.


## Introduction
This is a REST API that implements a medical clinic management system. It provides endpoints for different entities in the system (patients, doctors, employees, etc.), each with its own CRUD operations. it also offers different roles and authorization levels for different users. The API uses MongoDB for persistence and is built using Node.js and the Express framework.


## Technologies
The following technologies were used to develop the platform:

- Node.js
- Express
- MongoDB
- Mongoose
- Morgan
- bcrypt
- easyinvoice
- express-validator
- fs
- jsonwebtoken
- mongoose-sequence
- mongoose-validator
- multer
- nodemailer
- stripe
- validatorjs


## Resources

- https://expressjs.com/
- https://www.mongodb.com/

## Requirements

* Node.js
* npm
* MongoDB

## Tools

- https://code.visualstudio.com/
- https://www.mongodb.com/products/compass
- https://robomongo.org/
- https://www.postman.com/

## Configuration

The API uses the following environment variables:

* `PORT` - the port on which the API will listen for incoming requests.
* `MONGODB_URI` - the URL of the MongoDB database to connect to.
* `MONGODB_LOCAL` - the URL of the local MongoDB database to connect to.
* `SECRET_KEY` - a string used for bcrypt to secure the application and encrypt user passwords.
* `SECRET_KEY_STRIPE` - a string used to authenticate with the Stripe payment processing API and securely handle transactions.

## Installation
To install the platform and its dependencies, follow these steps:
1. Clone the repository.
$ git clone https://github.com/hassan9810/Clinic-Management-System

2. Install the dependencies.
```bash
$ npm install
```

3. Create a .env file in the project directory and set the following environment variables:
- PORT=<PORT NUMBER>
- MONGODB_URI=<MONGODB URI>
- MONGODB_LOCAL=<LOCAL MONGODB URI>
- SECRET_KEY = <SECRET KEY FOR BCRYPT ENCRPTION>
- SECRET_KEY_STRIPE = <FOR STRIPT>

5. Start the database server:
```bash
$ mongod
```
4. Start the application.
```bash
$ npm start
```

## Functionalities
The project has several functionalities, including:

- Registering patients: Allows patients to register to the medical center.
- Authenticating users: Allows users to authenticate to the medical center.
- Managing appointments: Allows users to manage appointments, including adding appointments, getting all appointments, and more.
- Managing prescriptions: Allows users to manage prescriptions, including adding prescriptions and getting all prescriptions.
- Managing invoices: Allows users to manage invoices, including adding invoices and getting all invoices.
- Managing payments: Allows users to manage payments, including adding payments and getting all payments.


## Endpoints

The API implements the following endpoints:

* `/register` - POST request to register a new patient.
* `/auth` - POST request to authenticate a user.
* `/doctor` - CRUD operations on doctors.
* `/patient` - CRUD operations on patients.
* `/employee` - CRUD operations on employees.
* `/medicine` - CRUD operations on medicines.
* `/clinic` - CRUD operations on clinics.
* `/appointment` - CRUD operations on appointments.
* `/prescription` - CRUD operations on prescriptions.
* `/invoice` - CRUD operations on invoices.
* `/payment` - CRUD operations on payments.

Each endpoint supports the following methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.



## Middlewares

The API uses the following middlewares:

* `Morgan` - a logging middleware.
* `express.json` - a body parser middleware.
* `Routes` - endpoint middlewares.
* `File not found` - a middleware to handle requests to non-existing endpoints.
* `Error handling` - a middleware to handle errors in the API.

## Contributors
- [@Ahmed Hassan](https://github.com/hassan9810)
- [@Mohammed Ibrahim](https://github.com/MoIbrahim10)
- [@Amr Allam](https://github.com/amriallam)
- [@Mohammed Alaa](https://github.com/moalaacs)
- [@Hazem Magdy](https://github.com/Hazem-Magdy)

## Conclusion

This API provides a complete solution for managing a medical clinic and can be used as a starting point for further customization and expansion.
