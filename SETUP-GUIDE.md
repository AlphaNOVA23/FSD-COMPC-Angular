# ✅ Setup & Quickstart Guide

This guide covers everything required to boot the application from scratch on a new machine.

## Prerequisites
1. **Java JDK 21+** (Verify via `java -version`)
2. **Node.js 18+** (Verify via `node -v`)
3. **Angular CLI** (Install globally via `npm install -g @angular/cli`)
4. **PostgreSQL** Server running locally on port `5432`.

---

## 🏗️ 1. Database Configuration

1. Launch **pgAdmin** or **DBeaver** and connect to your local Postgres instance.
2. Create an empty database named exactly: `employee_management`.
3. Locate the `db_schema.sql` file inside the root of this project.
4. Copy the entire file content, paste it into an SQL Execution window inside DBeaver/pgAdmin, and run it against the `employee_management` database.
> This ensures all table architectures, cascading constraints, and base user data are pre-populated!

## ⚙️ 2. Booting the Backend (Java/Spring Boot)

1. Open your terminal and navigate into the backend folder:
   ```bash
   cd BACKEND/Employee_Management
   ```
2. Open `src/main/resources/application.properties` and verify your Postgres credentials:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/employee_management
   spring.datasource.username=postgres
   spring.datasource.password=ROOT  <-- CHANGE THIS TO YOUR ACTUAL POSTGRES PASSWORD
   ```
3. Clean and compile the application to ensure all dependencies are fresh:
   ```bash
   mvn clean compile
   ```
4. Run the Spring Boot Server:
   ```bash
   mvn spring-boot:run
   ```
OR SIMPLY JUST DEBUG THE EmployeeManagementApplication.java FILE, SKIPPING STEPS 3 & 4.

> Keep this terminal open! The server should confirm it started Tomcat on port `8080`.

## 🎨 3. Booting the Frontend (Angular)

1. Open a **new** terminal and navigate to the frontend workspace:
   ```bash
   cd FRONTEND/Angular_Applications/UserProject
   ```
2. Install all `node_modules` required for the application:
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   npm run start
   ```
> The dashboard will compile and automatically start intercepting traffic to `http://localhost:4200`.

## 🚀 4. Login Credentials

Navigate to `http://localhost:4200` in your web browser. Since you ran the `db_schema.sql` script, you can log in immediately using the pre-seeded administrators!

- **Email/Username**: `admin`
- **Password**: `admin123`
