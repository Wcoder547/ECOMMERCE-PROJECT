# Ecommerce Web Application

> Full-stack MERN e-commerce platform with Stripe payments, Google OAuth, Redis caching, and an admin analytics dashboard — fully containerized with Docker.

![TypeScript](https://img.shields.io/badge/TypeScript-82%25-blue) ![Docker](https://img.shields.io/badge/Docker-ready-blue) ![Stripe](https://img.shields.io/badge/Stripe-integrated-purple) ![License](https://img.shields.io/badge/license-MIT-green)

---

## What is this?

A production-ready e-commerce platform built with the MERN stack and TypeScript. It ships three independent apps from a single repository:

- **Customer storefront** — browse products, apply coupons, checkout with Stripe
- **REST API** — Express/Node backend with Redis caching and MongoDB persistence
- **Admin dashboard** — order stats, product management, and category charts for the last 6 months

Authentication is handled by Firebase (Google OAuth), media by Cloudinary, and the entire stack runs behind an Nginx reverse proxy inside Docker containers.

---

## Features

- **Google OAuth** — sign in with Firebase Authentication, no passwords to manage
- **Product search & filtering** — browse by category or keyword in real time
- **Discount & coupon codes** — apply promotions at checkout
- **Stripe payments** — PCI-compliant card processing
- **Admin analytics** — 6-month charts for orders, revenue, products, and categories
- **Redis caching** — frequent queries cached for fast response times
- **Cloudinary media** — scalable image storage for product photos
- **Dockerized** — `docker compose up` runs the full stack instantly
- **AWS-deployable** — production compose file and Nginx config included

---

## Tech Stack

| Layer          | Technology                                      |
|----------------|-------------------------------------------------|
| Frontend       | React 18, TypeScript, Redux, Vite, SCSS         |
| Backend        | Node.js, Express, TypeScript                    |
| Database       | MongoDB, Mongoose                               |
| Cache/Sessions | Redis                                           |
| Auth           | Firebase Authentication (Google OAuth)          |
| Payments       | Stripe                                          |
| Media          | Cloudinary                                      |
| Proxy          | Nginx                                           |
| DevOps         | Docker, Docker Compose, AWS                     |

---

## Getting Started

### Option 1 — Docker (recommended)

Requires: Docker + Docker Compose

```bash
git clone https://github.com/Wcoder547/ECOMMERCE-PROJECT.git
cd ECOMMERCE-PROJECT
```

Copy the environment variables (see [Environment Variables](#environment-variables) below), then:

```bash
docker compose up --build
```

| Service    | URL                      |
|------------|--------------------------|
| Frontend   | http://localhost:5173    |
| Backend    | http://localhost:4000    |
| Via Nginx  | http://localhost:80      |

Stop everything:

```bash
docker compose down
```

---

### Option 2 — Manual

**Backend**

```bash
cd Ecommerce-Backend
npm install
npm run dev
# Runs on http://localhost:4000
```

**Frontend** (separate terminal)

```bash
cd ecommerce-frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

Redis must be running locally or accessible via `REDIS_URL` in your `.env`.

---

## Environment Variables

### Frontend — `ecommerce-frontend/.env`

```env
VITE_APIKEY=your_firebase_api_key
VITE_AUTHDOMAIN=your_project.firebaseapp.com
VITE_PROJECTID=your_project_id
VITE_STORAGEBUCKET=your_project.appspot.com
VITE_MESSAGINGSENDERID=your_sender_id
VITE_APPID=your_app_id
VITE_SERVER=http://localhost:4000
```

Get Firebase values from your [Firebase Console](https://console.firebase.google.com/) → Project Settings → Your Apps.

### Backend — `Ecommerce-Backend/.env`

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce
PORT=4000
STRIPE_KEY=sk_test_your_stripe_secret_key
PRODUCT_PER_PAGE=8
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
REDIS_URL=redis://localhost:6379
```

---

## Project Structure

```
ECOMMERCE-PROJECT/
├── Ecommerce-Backend/
│   ├── src/
│   │   ├── controllers/       # Route handlers (products, orders, users)
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # Express route definitions
│   │   ├── middlewares/       # Auth guard, error handler
│   │   └── utils/             # Redis cache helpers, Cloudinary config
│   └── Dockerfile
├── ecommerce-frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Storefront & admin pages
│   │   ├── redux/             # Store, slices, RTK Query
│   │   └── assets/
│   └── Dockerfile
├── redis/                     # Redis Docker config
├── nginx.conf                 # Reverse proxy config
├── compose.yaml               # Development compose
├── production-compose.yaml    # AWS production compose
└── Ecommerce-2025.postman_collection.json
```

---

## API Reference

A full Postman collection (`Ecommerce-2025.postman_collection.json`) is included in the root of the repository. Import it into [Postman](https://www.postman.com/) to explore and test every endpoint.

### Auth

| Method | Route               | Description              |
|--------|---------------------|--------------------------|
| POST   | `/api/v1/user/new`  | Register a new user      |
| GET    | `/api/v1/user/:id`  | Get user profile         |

### Products

| Method | Route                          | Description                     |
|--------|--------------------------------|---------------------------------|
| GET    | `/api/v1/product/all`          | List all products (paginated)   |
| GET    | `/api/v1/product/search`       | Search with filters & categories|
| GET    | `/api/v1/product/:id`          | Get single product              |
| POST   | `/api/v1/product/new`          | Create product (admin)          |
| PUT    | `/api/v1/product/:id`          | Update product (admin)          |
| DELETE | `/api/v1/product/:id`          | Delete product (admin)          |

### Orders

| Method | Route                          | Description                     |
|--------|--------------------------------|---------------------------------|
| POST   | `/api/v1/order/new`            | Place a new order               |
| GET    | `/api/v1/order/my`             | Get current user's orders       |
| GET    | `/api/v1/order/all`            | All orders (admin)              |
| PUT    | `/api/v1/order/:id`            | Update order status (admin)     |

### Payments

| Method | Route                          | Description                     |
|--------|--------------------------------|---------------------------------|
| POST   | `/api/v1/payment/create`       | Create Stripe payment intent    |
| POST   | `/api/v1/payment/coupon/new`   | Create a discount coupon        |
| GET    | `/api/v1/payment/coupon/all`   | List all coupons (admin)        |
| GET    | `/api/v1/payment/discount`     | Validate and apply a coupon     |

### Admin Stats

| Method | Route                          | Description                          |
|--------|--------------------------------|--------------------------------------|
| GET    | `/api/v1/dashboard/stats`      | Dashboard stats (orders, revenue)    |
| GET    | `/api/v1/dashboard/pie`        | Category & order status breakdown    |
| GET    | `/api/v1/dashboard/bar`        | 6-month bar chart data               |
| GET    | `/api/v1/dashboard/line`       | 6-month line chart data              |

All protected routes require `id` as a query param matching the authenticated Firebase UID.

---

## Redis Caching

Redis caches responses for expensive queries — product lists, admin stats, and search results. Cache is invalidated automatically on create/update/delete operations.

To inspect the cache during development:

```bash
docker exec -it redis redis-cli
KEYS *
GET <key>
```

---

## Production Deployment (AWS)

A dedicated `production-compose.yaml` and `nginx.conf` are provided for AWS deployment.

```bash
# On your EC2 instance
git clone https://github.com/Wcoder547/ECOMMERCE-PROJECT.git
cd ECOMMERCE-PROJECT
# Add your .env files
docker compose -f production-compose.yaml up -d
```

Nginx handles routing between the frontend and backend on port 80, with no CORS issues in production.

---

## Caveats & Limitations

- Firebase Auth only supports Google OAuth — email/password login not implemented
- No webhook handler for Stripe (failed payment recovery not handled)
- Admin role is currently controlled by a hardcoded Firebase UID — no role management UI
- Redis data is not persisted across container restarts by default

---

## Roadmap

- [ ] Email/password auth alongside Google OAuth
- [ ] Stripe webhooks for payment failure handling
- [ ] Role-based admin management UI
- [ ] Order email notifications
- [ ] Product reviews & ratings

---

## Author

**Waseem Akram** — [@Wcoder547](https://github.com/Wcoder547)

Full-stack developer · MERN · Next.js · TypeScript

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://www.linkedin.com/in/wasim-akram-dev/)

---

## License

[MIT](LICENSE)
