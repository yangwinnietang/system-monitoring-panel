# System Monitoring Panel - Running Guide

## 📋 Table of Contents

- [Environment Requirements](#environment-requirements)
- [Installation Steps](#installation-steps)
- [Development Environment](#development-environment)
- [Production Deployment](#production-deployment)
- [Configuration](#configuration)
- [Common Issues](#common-issues)
- [Troubleshooting](#troubleshooting)

## Environment Requirements

### System Requirements

- **Operating System**: Windows 10/11, macOS, Linux
- **Memory**: At least 4GB RAM (8GB or more recommended)
- **Storage**: At least 1GB available space

### Software Requirements

- **Node.js**: >= 16.0.0
- **npm**: >= 7.0.0
- **Git**: >= 2.0.0 (for cloning the repository)

### Verify Environment

Run the following commands in your terminal to verify your environment:

```bash
# Check Node.js version
node -v

# Check npm version
npm -v

# Check Git version
git --version
```

## Installation Steps

### 1. Get the Source Code

#### Clone from GitHub (Recommended)

```bash
# Clone the project to your local machine
git clone https://github.com/yangwinnietang/system-monitoring-panel.git

# Enter the project directory
cd system-monitoring-panel
```

#### Download ZIP File

1. Visit the project page: https://github.com/yangwinnietang/system-monitoring-panel
2. Click the "Code" button
3. Select "Download ZIP"
4. Extract the downloaded file
5. Enter the extracted directory

### 2. Install Dependencies

```bash
# Install project dependencies
npm install
```

The installation process may take a few minutes, depending on your network speed.

### 3. Verify Installation

```bash
# Check if project dependencies are installed correctly
npm list --depth=0
```

## Development Environment

### Start Development Server

```bash
# Start development server
npm run dev
```

By default, the development server will run at the following addresses:
- **Local address**: http://localhost:5173/
- **Network address**: http://[your-local-IP]:5173/

### Access the Application

1. Open your browser
2. Visit http://localhost:5173/
3. You should see the main interface of the system monitoring panel

### Development Server Options

#### Custom Port

If the default port 5173 is occupied, you can change the port in the following ways:

**Method 1: Command Line Arguments**

```bash
# Start with custom port
npm run dev -- --port 3000
```

**Method 2: Environment Variables**

```bash
# Windows (PowerShell)
$env:PORT = 3000
npm run dev

# Windows (CMD)
set PORT=3000
npm run dev

# Linux/macOS
PORT=3000 npm run dev
```

#### Enable HTTPS

```bash
# Enable HTTPS
npm run dev -- --https
```

### Development Tools

#### Code Linting

```bash
# Run ESLint to check code quality
npm run lint
```

#### Auto-fix Code Issues

```bash
# Auto-fix fixable code issues
npm run lint -- --fix
```

### Development Mode Features

- **Hot Module Replacement (HMR)**: Automatically refresh the page after code changes
- **Source Maps**: Debug TypeScript source code directly in the browser
- **Error Overlay**: Display compilation errors in the browser

## Production Deployment

### Build Production Version

```bash
# Build production version
npm run build
```

After building, all production files will be located in the `dist` directory.

### Preview Production Version

```bash
# Preview production version
npm run preview
```

By default, the preview server will run at http://localhost:4173/.

### Deployment Options

#### 1. Static Server Deployment

**Using Node.js serve package**

```bash
# Install serve globally
npm install -g serve

# Start static server
serve -s dist -l 3000
```

**Using Nginx**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static resource caching
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 2. Containerized Deployment

**Create Dockerfile**

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build and Run Docker Container**

```bash
# Build Docker image
docker build -t system-monitoring-panel .

# Run Docker container
docker run -d -p 8080:80 --name monitoring-panel system-monitoring-panel
```

#### 3. Cloud Service Deployment

**Vercel Deployment**

1. Log in to Vercel (https://vercel.com)
2. Click "New Project"
3. Import GitHub repository
4. Select system-monitoring-panel project
5. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click "Deploy"

**Netlify Deployment**

1. Log in to Netlify (https://netlify.com)
2. Click "New site from Git"
3. Connect GitHub repository
4. Select system-monitoring-panel project
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click "Deploy site"

## Configuration

### Environment Variables

Create a `.env` file in the project root directory:

```env
# App configuration
VITE_APP_TITLE=System Monitoring Panel
VITE_APP_VERSION=1.0.0

# API configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Feature toggles
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_NOTIFICATIONS=true
```

### Custom Configuration

#### Change Port

Edit `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Custom port
    host: true,  // Allow network access
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

#### Proxy Configuration

Edit `vite.config.ts` to add proxy:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

## Common Issues

### Q: Permission errors during dependency installation

**A**: Try the following solutions:

```bash
# Clear npm cache
npm cache clean --force

# Use --no-bin-links flag
npm install --no-bin-links

# Or use yarn
npm install -g yarn
yarn install
```

### Q: Development server fails to start, port is occupied

**A**: Find the process occupying the port and terminate it:

```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5173
kill -9 <PID>
```

### Q: Build fails with type errors

**A**: Try the following solutions:

```bash
# Clear build cache
rm -rf dist
rm -rf node_modules/.vite

# Reinstall dependencies
npm install

# Rebuild
npm run build
```

### Q: Charts not displaying in production

**A**: Check the following points:

1. Ensure all static assets are correctly deployed
2. Check browser console for error messages
3. Ensure server is correctly configured with MIME types
4. Check if CSP (Content Security Policy) is enabled and correctly configured

### Q: 404 on route refresh in production

**A**: This is a common issue with SPA applications, configure server rewrite rules:

**Nginx configuration**:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**Apache configuration**:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Troubleshooting

### Log Analysis

#### Development Environment Logs

Development server logs are displayed directly in the terminal, including:

- Compilation errors and warnings
- Hot module replacement status
- Server startup information

#### Production Environment Logs

Production environment log analysis:

```bash
# View server access logs
tail -f /var/log/nginx/access.log

# View server error logs
tail -f /var/log/nginx/error.log
```

### Browser Developer Tools

Use browser developer tools (F12) for debugging:

1. **Console tab**: View JavaScript errors and logs
2. **Network tab**: Check network requests and responses
3. **Elements tab**: Check DOM structure and styles
4. **Application tab**: View local storage and cache

### Performance Optimization

#### Build Optimization

```bash
# Analyze bundle size
npm install -g vite-bundle-analyzer
npm run build -- --mode analyze
```

#### Production Environment Optimization

1. Enable Gzip compression
2. Configure appropriate caching strategies
3. Use CDN to distribute static assets
4. Optimize images and font files

### Contact Support

If you encounter issues that cannot be resolved, please get support through the following channels:

- **GitHub Issues**: https://github.com/yangwinnietang/system-monitoring-panel/issues
- **Email**: 1930863755@qq.com

---

*Last updated: 2025-09-20*