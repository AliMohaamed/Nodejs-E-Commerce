# E-Commerce API Platform

A comprehensive Node.js-based e-commerce backend API with full-featured shopping functionality, user management, and payment processing.

## Description

This is a robust e-commerce backend API built with Node.js and Express.js. It provides a complete solution for online retail operations including user authentication, product management, shopping cart functionality, order processing, payment integration with Stripe, and comprehensive admin features.

## Key Features

- **User Authentication & Authorization**

  - User registration and login with JWT tokens
  - Email verification for account activation
  - Password reset functionality with OTP verification
  - Role-based access control (Admin, User)
  - Refresh token mechanism for secure sessions

- **Product Management**

  - Complete CRUD operations for products
  - Product categorization with categories and subcategories
  - Brand management
  - Image upload and management with Cloudinary
  - Product search and filtering capabilities

- **Shopping Cart System**

  - Add/remove products from cart
  - Update product quantities
  - Clear cart functionality
  - Persistent cart storage

- **Order Management**

  - Create and manage orders
  - Order cancellation functionality
  - Payment processing with Stripe integration
  - Webhook handling for payment confirmations
  - Invoice generation with PDF

- **Coupon System**

  - Create and manage discount coupons
  - Coupon validation and application
  - Admin-only coupon management

- **Review System**

  - Product reviews and ratings
  - User-generated content management

- **File Management**

  - Image upload with Multer
  - Cloud storage integration with Cloudinary
  - File validation and processing

- **Email Services**

  - Account activation emails
  - Password reset emails
  - Order confirmation emails
  - Custom email templates

- **Security Features**
  - Input validation with Joi
  - CORS protection
  - Error logging and monitoring
  - Secure file uploads

## Tech Stack & Tools

### Backend Technologies

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling tool

### Authentication & Security

- **JWT (JSON Web Tokens)** - Token-based authentication
- **bcryptjs** - Password hashing
- **cookie-parser** - Cookie parsing middleware

### File Handling & Storage

- **Multer** - File upload middleware
- **Cloudinary** - Cloud image storage and management
- **PDFKit** - PDF generation for invoices

### Payment Processing

- **Stripe** - Payment gateway integration

### Email Services

- **Nodemailer** - Email sending functionality

### Validation & Utilities

- **Joi** - Data validation library
- **date-fns** - Date utility library
- **slugify** - URL-friendly string generation
- **nanoid** - Unique ID generation
- **randomstring** - Random string generation
- **voucher-code-generator** - Coupon code generation

### Development Tools

- **Nodemon** - Development server with auto-restart
- **Morgan** - HTTP request logger
- **dotenv** - Environment variable management

## Prerequisites

Before setting up this project, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** (for cloning the repository)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ecommerce
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
CONNECTIONURL=mongodb://localhost:27017/ecommerce
# or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/ecommerce

# JWT Configuration
ACCESS_TOKEN=your_access_token_secret
REFRESH_TOKEN=your_refresh_token_secret
BEARERKEY=Bearer

# Email Configuration
EMAIL=your_email@gmail.com
EMAILPASS=your_email_app_password

# Cloudinary Configuration
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Application URLs
BACKEND_URL=http://localhost:3000
DOMAIN_URL=https://nodejs-e-commerce-u1hz.onrender.com
```

### 4. Database Setup

Ensure MongoDB is running locally or update the `CONNECTIONURL` to point to your MongoDB Atlas cluster.

### 5. Seed Initial Data

The application automatically seeds initial roles on startup.

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### Authentication (`/auth`)

- `POST /auth/register` - User registration
- `GET /auth/confirmEmail/:activationCode` - Email confirmation
- `POST /auth/login` - User login
- `POST /auth/refresh-token` - Refresh access token
- `POST /auth/forgotPassword` - Request password reset
- `POST /auth/verifyOtp` - Verify OTP for password reset
- `POST /auth/resetPassword` - Reset password

### Users (`/user`)

- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile
- `DELETE /user/profile` - Delete user account

### Categories (`/category`)

- `POST /category` - Create category (Admin only)
- `GET /category` - Get all categories
- `PUT /category/:id` - Update category (Admin only)
- `DELETE /category/:id` - Delete category (Admin only)

### Subcategories (`/subcategory`)

- `POST /subcategory` - Create subcategory (Admin only)
- `GET /subcategory` - Get all subcategories
- `PUT /subcategory/:id` - Update subcategory (Admin only)
- `DELETE /subcategory/:id` - Delete subcategory (Admin only)

### Brands (`/brand`)

- `POST /brand` - Create brand (Admin only)
- `GET /brand` - Get all brands
- `PUT /brand/:id` - Update brand (Admin only)
- `DELETE /brand/:id` - Delete brand (Admin only)

### Products (`/product`)

- `POST /product` - Create product (Admin only)
- `GET /product` - Get all products
- `GET /product/:productId` - Get single product
- `PUT /product/:productId` - Update product (Admin only)
- `DELETE /product/:productId` - Delete product (Admin only)

### Cart (`/cart`)

- `POST /cart` - Add product to cart
- `GET /cart` - Get user cart
- `PATCH /cart` - Update cart
- `PATCH /cart/clear` - Clear cart
- `PATCH /cart/:productId` - Remove product from cart

### Orders (`/order`)

- `POST /order` - Create order
- `PATCH /order/:orderId` - Cancel order
- `POST /order/webhook` - Stripe webhook handler

### Coupons (`/coupon`)

- `POST /coupon` - Create coupon (Admin only)
- `GET /coupon` - Get all coupons
- `PATCH /coupon/:code` - Update coupon (Admin only)
- `DELETE /coupon/:code` - Delete coupon (Admin only)

### Reviews (`/review`)

- `POST /review` - Add product review

### Roles (`/role`)

- `POST /role` - Create role (Admin only)
- `GET /role` - Get all roles
- `PUT /role/:id` - Update role (Admin only)
- `DELETE /role/:id` - Delete role (Admin only)

## Folder Structure

```
ecommerce/
├── DB/                          # Database configuration and models
│   ├── connection.js            # MongoDB connection setup
│   └── models/                  # Mongoose data models
│       ├── brand.model.js       # Brand schema
│       ├── cart.model.js        # Cart schema
│       ├── category.model.js    # Category schema
│       ├── coupon.model.js      # Coupon schema
│       ├── log.model.js         # Error logging schema
│       ├── order.model.js       # Order schema
│       ├── product.model.js     # Product schema
│       ├── role.models.js       # Role schema
│       ├── subcategory.model.js # Subcategory schema
│       ├── token.model.js       # Token schema
│       └── user.model.js        # User schema
├── src/
│   ├── app.router.js            # Main application router
│   ├── middleware/              # Express middleware
│   │   ├── authentication.middleware.js  # JWT authentication
│   │   ├── authorization.middleware.js   # Role-based authorization
│   │   └── validation.middleware.js      # Input validation
│   ├── modules/                 # Feature modules
│   │   ├── auth/                # Authentication module
│   │   ├── brand/               # Brand management
│   │   ├── cart/                # Shopping cart
│   │   ├── category/            # Category management
│   │   ├── coupon/              # Coupon system
│   │   ├── order/               # Order management
│   │   ├── product/             # Product management
│   │   ├── review/              # Review system
│   │   ├── role/                # Role management
│   │   ├── subcategory/         # Subcategory management
│   │   └── user/                # User management
│   ├── seeding/                 # Database seeding
│   │   └── seedRole.js          # Initial role seeding
│   └── utils/                   # Utility functions
│       ├── asyncHandler.js      # Async error handling
│       ├── cloud.js             # Cloudinary configuration
│       ├── error/               # Error handling utilities
│       ├── helper/              # Helper functions
│       ├── invoice.js           # PDF invoice generation
│       ├── multer.js            # File upload configuration
│       ├── response.js          # Response formatting
│       └── sendMail.js          # Email service
├── index.js                     # Application entry point
├── package.json                 # Project dependencies and scripts
└── README.md                    # Project documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For support and questions, please open an issue in the repository or contact the development team.

## Contact

- **Email**: alimohamed11907@gmail.com
- **LinkedIn**: [\[LinkedIn Profile\]](https://www.linkedin.com/in/ali-mohamed-68a0a3239/)
- **GitHub**: [\[GitHub Profile\]](https://github.com/AliMohaamed)

---

**Note**: Please replace the placeholder contact information above with your actual email and social media links.
