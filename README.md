# Authentication and Authorization Service
This project implements an authentication and authorization service using Node.js, Express.js, MongoDB, and JSON Web Tokens (JWT). The service provides secure user authentication and authorization functionalities.

# Features
- ** User Registration **: Allows users to sign up and create an account.
- ** User Login **: Provides a secure login system using JWT for authentication.
- ** Token-Based Authentication **: Generates JWT upon successful login, which is used to authenticate subsequent API requests.
- **Password Hashing **: Implements password hashing using bcrypt to securely store user passwords.
- **Token Authorization **: Restricts access to certain routes or functionalities based on user roles using JWT.
- **Middleware for Authentication **: Includes middleware to verify JWT and authenticate users for protected routes.
- ** MongoDB Integration **: Utilizes MongoDB as the database to store user credentials.

