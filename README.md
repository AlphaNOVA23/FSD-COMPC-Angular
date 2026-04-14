<h1 align="center">Enterprise Employee Management System</h1>

<p align="center">
  <strong>A premium, full-stack enterprise resource planning (ERP) platform.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" />
  <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
</p>

---

## 📖 Overview

The **Enterprise Employee Management System (EMS)** is an end-to-end web application built to streamline HR, project assignments, and corporate structural logic. 

Designed with a stunning "vibrant dark mode" UI powered by glassmorphism, the platform dynamically maps deep relational data structures—from tracking an employee's daily timesheet and base compensation, to recursively linking department heads, managing project clearances, and monitoring continuous training enrollments.

### Key Features
* **Role-Based Workspaces**: Distinct native experiences for standard Employees (personal profiles, team analytics) vs Administrators (global data grids).
* **Cascading Entity Resolution**: Advanced hierarchical structures linking `Client` → `Project` → `Responsibility` → `Employee` flawlessly in the database layer.
* **Intelligent Dropdowns & Foreign Keys**: Cross-referencing `<datalist>` dropdowns that enforce relational database integrity while allowing custom string inputs.

---

## 🗄️ Master Database Population (CRITICAL)

Because of the platform's advanced cascading mechanisms (Foreign Keys, Triggers, and Dependencies), you **cannot** just start using the frontend on a blank database. 

You **must** seed the database so that root-level entities (like Departments and generic Roles) exist before you can assign custom Employees to them.

### Step-by-Step Population Using DBeaver / pgAdmin:
1. Connect your SQL Client (DBeaver or pgAdmin) to your target `employee_management` Postgres database.
2. Open the `db_schema.sql` file provided in the repository.
3. **Execute the SQL file entirely**. 
   > This script forcefully clears old constraints, builds the precise table definitions expected by Hibernate, and injects **Test/Dummy Data** (Departments, Default Employees, Projects).
4. Once the script says `Success`, **restart the Spring Boot Backend** so `Hibernate` syncs the cached entity context with the newly populated tables.
5. You can now log in using the mock credentials provided in the database!

---

## 📚 Repository Structure

This repository is split perfectly in half between two distinct operating boundaries:

* `/BACKEND/Employee_Management`: The Java Spring Boot 3 Engine. Responsible for JWT Authentication mapping, API routing (`/api/*`), and ORM (Hibernate) mapping against PostgreSQL.
* `/FRONTEND/Angular_Applications/UserProject`: The Angular 17+ client. Leverages generic HTTP proxies and modern CSS layout engines designed for enterprise data visualization.

---

## 🚀 Getting Started

To launch the project, please refer to the extremely detailed [✅ SETUP-GUIDE.md](./SETUP-GUIDE.md) document attached in this root folder. It will walk you through exactly what commands to run inside your terminal.

If you are a student or developer trying to understand *how* the code works, please read the [🧠 ARCHITECTURE.md](./ARCHITECTURE.md) map.
