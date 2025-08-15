# ECOMMERCE-PROJECT

## Project Description

ECOMMERCE-PROJECT is an open-source e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). It includes a React-based user-facing site, a REST API backend using Express/Node, and a React admin dashboard. The project is written in TypeScript and uses Redux for predictable state management. Node.js serves as the server runtime, and Express provides the web framework for the API.

For authentication and payments, the app integrates Firebase Authentication (Google OAuth) and Stripe for secure payment processing. It uses Redis as an in-memory cache and session store for fast data access. Media and product images are stored on AWS (e.g. Amazon S3) for scalability and durability. The entire application is containerized with Docker for consistent development and production environments.

## Features

* **User Authentication:** Google OAuth sign-in via Firebase Auth for secure user login.
* **Product Listing & Search:** Browse and search products by categories or keywords in real time.
* **Discounts & Coupons:** Support for discount codes and promotions at checkout.
* **Payments:** Secure payment processing with Stripe integration (PCI-compliant).
* **Admin Dashboard:** Charts and statistics showing orders, products, and categories over the last 6 months.
* **Environment Config:** Separate configuration files using Vite (frontend) and Node (backend) setups.
* **Caching & Sessions:** Redis is used to cache frequent queries and manage sessions for performance.
* **Containerization:** Docker support for easy local setup and deployment.
* **File Storage:** AWS (e.g. S3) is used for storing images and media files.

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
* **AWS (S3)** – Cloud object storage service for media files.
* **Docker** – Container platform to run the app consistently across environments.

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/ECOMMERCE-PROJECT.git
   cd ECOMMERCE-PROJECT
   ```
2. **Setup Backend:**

   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. **Setup Frontend:**

   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
4. **(Optional) Admin Dashboard:**

   ```bash
   cd ../admin
   npm install
   npm run dev
   ```

This will start the backend server (usually on port 5000) and the frontend apps (Vite dev server, e.g. port 3000).

## Environment Variables

**Frontend (.env):**

* `VITE_API_URL` – URL of the backend API (e.g., `http://localhost:5000/api`)
* `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, etc. – Firebase configuration for Google OAuth.
* `VITE_STRIPE_PUBLIC_KEY` – Your Stripe publishable key for payments.

**Backend (.env):**

* `NODE_ENV` – Environment (e.g., `development` or `production`)
* `PORT` – Port on which the backend server runs (e.g., `5000`)
* `MONGO_URI` – MongoDB connection string.
* `REDIS_URL` – Redis connection URL (e.g., `redis://localhost:6379`).
* `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` – Firebase service account credentials for verifying tokens.
* `STRIPE_SECRET_KEY` – Your Stripe secret key.
* `AWS_S3_BUCKET_NAME`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` – AWS S3 credentials and bucket name.

## Docker Usage

If using Docker, ensure Docker is installed. A `docker-compose.yml` is provided for convenience. From the project root, you can run:

```bash
docker-compose up --build
```

This command builds the Docker images and starts all services (frontend, backend, Redis, etc.) in containers. Use `docker-compose down` to stop and remove the containers.

## Folder Structure

```
ECOMMERCE-PROJECT/
├── backend/        # Node/Express API server (TypeScript)
│   ├── src/        #  API routes, controllers, models, etc.
│   ├── package.json
│   └── tsconfig.json
├── frontend/       # React user-facing site (TypeScript, Vite)
│   ├── src/        #  Components, pages, redux store, etc.
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── admin/          # React admin dashboard (TypeScript, Vite)
│   ├── src/        #  Components, pages, redux store, etc.
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml
└── README.md
```

<!-- Add screenshots of the user frontend and admin dashboard here -->  

## Contributing

Contributions are welcome! If you’d like to contribute, please fork the repository, create a new branch for your feature or bug fix, and submit a pull request. You can also open issues for suggestions or bug reports. Please follow any existing code style and include tests or documentation for new features.

## License

This project is open source, and you are free to use it under the terms of the MIT license.
