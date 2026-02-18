# 🏠 PropertyConnect – Real Estate Management System

PropertyConnect is a microservices-based real estate management platform designed to provide secure, scalable, and efficient property listing, management, and user interaction. It enables users to browse, search, and manage properties, while providing administrators full control over property approvals, user management, and system monitoring.

## 🏗 Architecture Overview

This project follows a Microservices Architecture where each service handles a specific business responsibility and communicates through an API Gateway.

### Core Components
- API Gateway – Central entry point for all client requests
- Auth Service – Handles authentication and JWT token generation
- User Service – Manages user profiles and roles
- Property Service – Manages property listings and approvals
- React Frontend – User interface
- MySQL Database – Persistent data storage

## 🛠 Tech Stack

**Frontend:** React.js, Axios, HTML, CSS, JavaScript  
**Backend:** Spring Boot (Java Microservices), ASP.NET Core Microservices, REST APIs  
**Security:** JWT Authentication, Role-Based Access Control (RBAC), API Gateway Security  
**Database:** MySQL  
**Tools:** Git, GitHub, Postman, Maven, .NET CLI  

## 📦 Microservices Structure

| Service | Responsibility |
|----------|----------------|
| API Gateway | Routes requests to appropriate services |
| Auth Service | User login, JWT generation, authentication |
| User Service | User profile, role management |
| Property Service | Property CRUD operations |
| Frontend | User interface |

## ✨ Key Features

### User Features
- User Registration and Login
- Secure JWT Authentication
- Browse Property Listings
- View Property Details
- Add Property Enquiry

### Admin Features
- Approve / Reject Property Listings
- Manage Users
- Secure Admin Access

### System Features
- Microservices Architecture
- API Gateway Routing
- Secure Token Validation
- Scalable Service Design

## 🔐 Security Implementation

PropertyConnect uses JWT-based authentication.

Authentication Flow:
1. User logs in
2. Auth Service generates JWT token
3. Token sent to client
4. Client sends token in Authorization header
5. API Gateway validates token
6. Request forwarded to respective services
