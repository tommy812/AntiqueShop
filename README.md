# Pischetola Antiques

A modern web application for Pischetola Antiques showcasing their collection and allowing customers to contact them.

## Fast Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Git

### Initial Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pischetola.git
   cd pischetola
   ```

2. Install all dependencies:
   ```bash
   ./dev.sh setup
   ```
   
   Or manually:
   ```bash
   npm run install-all
   ```

### Development Workflow

We use a script `dev.sh` to streamline common development tasks:

- **Start development servers**:
  ```bash
  ./dev.sh start
  ```

- **Create a new feature branch**:
  ```bash
  ./dev.sh feature my-feature-name
  ```

- **Save changes (add & commit)**:
  ```bash
  ./dev.sh save "Your commit message"
  ```

- **Push changes to remote**:
  ```bash
  ./dev.sh push
  ```

- **Build the client app**:
  ```bash
  ./dev.sh build
  ```

- **Deploy to production**:
  ```bash
  ./dev.sh deploy
  ```

### Git Aliases

For faster Git operations, the following aliases are configured:

- `git s` - Short status
- `git cm "message"` - Commit with message
- `git aa` - Add all changes
- `git p` - Push
- `git po` - Push to origin
- `git pf` - Force push with lease
- `git co branch` - Checkout branch
- `git cb new-branch` - Create and checkout new branch
- `git up` - Fetch and rebase from origin/main
- `git save "message"` - Add all and commit

### npm Scripts

- `npm run dev` - Start both client and server
- `npm run server` - Start only the server
- `npm run client` - Start only the client
- `npm run build` - Build the client app
- `npm run seed` - Run database seeding
- `npm run test` - Run client tests
- `npm run lint` - Run linting

## Project Structure

```
pischetola/
├── .github/                # GitHub configuration
│   ├── workflows/          # GitHub Actions workflows
│   └── PULL_REQUEST_TEMPLATE/  # PR templates
├── client/                 # Frontend React application
├── server/                 # Backend Express API
├── dev.sh                  # Development helper script
├── package.json            # Root package.json
└── README.md               # This file
```

## Continuous Integration

This project uses GitHub Actions for CI/CD. On every push and pull request to the `main` branch, the workflow will:

1. Install dependencies
2. Build the client
3. Run tests

## Contributing

1. Create a feature branch from `fast-dev`
2. Make your changes
3. Create a pull request to merge into `fast-dev`
4. Once approved, your changes will be merged into `fast-dev`
5. Periodically, `fast-dev` will be merged into `main` for production 