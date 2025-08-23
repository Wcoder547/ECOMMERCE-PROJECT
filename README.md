# ECOMMERCE-WEB-APPLICATION

## Project Description

ECOMMERCE-WEB-APPLICATION is an open-source e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). It includes a React-based user-facing site, a REST API backend using Express/Node, and a React admin dashboard. The project is written in TypeScript and uses Redux for predictable state management. Node.js serves as the server runtime, and Express provides the web framework for the API.

For authentication and payments, the app integrates Firebase Authentication (Google OAuth) and Stripe for secure payment processing. It uses Redis as an in-memory cache and session store for fast data access. Media and product images are stored on Cloudinary for scalability and durability. The entire application is containerized with Docker for consistent development and production environments.

## Features

* **User Authentication:** Google OAuth sign-in via Firebase Auth for secure user login.
* **Product Listing & Search:** Browse and search products by categories or keywords in real time.
* **Discounts & Coupons:** Support for discount codes and promotions at checkout.
* **Payments:** Secure payment processing with Stripe integration (PCI-compliant).
* **Admin Dashboard:** Charts and statistics showing orders, products, and categories over the last 6 months.
* **Environment Config:** Separate configuration files using Vite (frontend) and Node (backend) setups.
* **Caching & Sessions:** Redis is used to cache frequent queries and manage sessions for performance.
* **Containerization:** Docker support for easy local setup and deployment.
* **File Storage:** Cloudinary is used for storing images and media files.

## Tech Stack

* **React** – A JavaScript library for building user interfaces.
* **Redux** – A JS library for predictable global state management.
* **Vite** – Modern build tool and dev server for frontend apps.
* **TypeScript** – Superset of JavaScript with static typing for better maintainability.
* **Node.js** – Server-side JavaScript runtime environment.
* **Express** – Web framework for Node.js to create the REST API.
* **MongoDB** – NoSQL document database for storing products, users, and orders.
* **Firebase** – Backend platform (Authentication) used for Google sign-in.
* **Stripe** – Payment API for securely processing credit card transactions.
* **Redis** – In-memory data store used for caching and session storage.
* **Cloudinary** – Cloudinary service for media files.
* **Docker** – Container platform to run the app consistently across environments.

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Wcoder547/ECOMMERCE-PROJECT.git
   ```
2. **Setup Backend:**

   ```bash
   cd Ecommerce-Backend
   npm install
   npm run dev
   ```
3. **Setup Frontend:**

   ```bash
   cd ecommerce-frontend
   npm install
   npm run dev
   ```

This will start the backend server (usually on port 4000) and the frontend apps (Vite dev server, e.g. port 5173).

## Environment Variables

**Frontend (.env):**

   ```bash
VITE_APIKEY=your_firebase_api_key  
VITE_AUTHDOMAIN=your_project.firebaseapp.com  
VITE_PROJECTID=your_project_id  
VITE_STORAGEBUCKET=your_project.appspot.com  
VITE_MESSAGINGSENDERID=your_sender_id  
VITE_APPID=your_app_id  
VITE_SERVER=your-server  
   ```


**Backend (.env):**
   ```bash
MONGODB_URI=your-mongodb
PORT=4000  
STRIPE_KEY=your_stripe_key  
PRODUCT_PER_PAGE=8  
CLOUDINARY_CLOUD_NAME=your_cloud_name  
CLOUDINARY_API_KEY=your_api_key  
CLOUDINARY_API_SECRET=your_api_secret  
REDIS_URL=your_redis_url  
   ```

## Docker Usage

If using Docker, ensure Docker is installed. A `docker-compose.yml` is provided for convenience. From the project root, you can run:

```bash
docker-compose up --build
```

This command builds the Docker images and starts all services (frontend, backend, Redis, etc.) in containers. Use `docker-compose down` to stop and remove the containers.

 ---

### 🔗 Connect with me  

[![LinkedIn](https://img.shields.io/badge/LinkedIn-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/wasim-akram-dev/)  
[![GitHub](https://img.shields.io/badge/GitHub-black?style=for-the-badge&logo=github)](https://github.com/wcoder547) 