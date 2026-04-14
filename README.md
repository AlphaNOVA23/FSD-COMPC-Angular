# Angular 17+ - Employee Management Frontend

This folder contains the client-side single-page application (SPA) acting as the main interface for the Enterprise ERP.

## Tech Stack
- **Angular 17+**
- **TypeScript**
- **Vanilla CSS (Glassmorphism UI)**

## Architecture Overview

This frontend utilizes an ultra-dynamic layout configuration system. Rather than hardcoding individual screens/cards for every database entity, the core `admin-dashboard` intelligently evaluates backend generic JSON keys, identifies foreign-key logic, and renders native inputs/modals accordingly.

It employs native JWT logic using HTTP Interceptors ensuring all outgoing CRUD traffic connects seamlessly to the Spring Boot REST API.

## Getting Started

1. Set up the backend Java server first (see root documentation).
2. Install dependencies locally:
```bash
npm install
```
3. Run the development server:
```bash
ng serve
# OR 
npm run start
```
4. Access the web interface at `http://localhost:4200`.

*Note: Ensure the local Java backend is running on port 8080 or the internal proxy will fail.*
