# Pischetola Antiques

A full-stack web application for an antiques business, featuring a catalogue of antique items, category management, and administrative tools.

##Licensed

## Features

- Responsive design optimized for all devices
- Product catalogue with filtering by category and period
- Featured products and categories on the homepage
- Detailed product pages with images and specifications
- Admin dashboard for managing products, categories, and periods
- Site-wide settings management
- Contact form and estimate request functionality
- Cross-browser compatible styling
- Authentication system with admin privileges

## Tech Stack

- **Frontend**:
  - React 
  - TypeScript
  - Material UI
  - React Router
  - Context API for state management

- **Backend**:
  - Node.js
  - Express
  - MongoDB with Mongoose
  - JWT Authentication
  - RESTful API

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- MongoDB (local or Atlas)
- Git

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/tommy812/AntiqueShop.git
   cd AntiqueShop
   ```

2. Install server dependencies:
   ```
   cd server
   npm install
   ```

3. Install client dependencies:
   ```
   cd ../client
   npm install
   ```

4. Create environment variables:
   
   Create a `.env` file in the server directory:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5001
   ```

### Running the Application

1. Start the server:
   ```
   cd server
   npm start
   ```

2. In a separate terminal, start the client:
   ```
   cd client
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
/
├── client/                  # React frontend
│   ├── public/              # Static files
│   └── src/                 # Source files
│       ├── components/      # Reusable components
│       ├── contexts/        # React contexts
│       ├── pages/           # Page components
│       ├── services/        # API services
│       └── App.tsx          # Main App component
│
├── server/                  # Node.js backend
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Express middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── uploads/             # Uploaded files
│   └── server.js            # Server entry point
│
└── README.md                # Project documentation
```

## License

MIT 
