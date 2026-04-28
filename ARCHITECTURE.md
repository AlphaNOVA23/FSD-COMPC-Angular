# 🧠 System Architecture

The Enterprise Employee Management System applies a strict separation of concerns, heavily prioritizing strong entity relationships.

## 💾 The Backend: Spring Boot & Hibernate

The Java backend does not merely serve JSON; it actively enforces data integrity using **Hibernate ORM** (Object-Relational Mapping). 

### The Cascade Hierarchy
When an Employee is saved or deleted, the system uses `@OneToOne` and `@OneToMany` Java annotations alongside `CascadeType.ALL` to handle associated data natively.
For example, an Employee entity contains nested objects:
- `PositionDetails`
- `Salary`
- `Responsibilities`
- `PerformanceReviews` (with a self-referencing link to chain previous reviews)

If you attempt to assign an Employee to a Project via a `Responsibility` bridge, Spring Boot receives the nested JSON payload (`{ "employee": {"employeeId": 1}, "project": {"projectId": 2} }`), resolves the actual entities in memory, locks the database context, and fires off the relational mapping sequentially.

### Controller Routing
Standard endpoints are strictly localized:
- `/api/auth/register` and `/login` pass through a JWT token generation scheme.
- `/api/employees`, `/api/departments`, etc., map generic CRUD tasks to the raw database representations via standardized JPARepositories.

---

## 💻 The Frontend: Angular & TypeScript

The Angular frontend acts as an aggressive "Proxy Layer".

### JWT Interceptors
When you log in, Angular stores a JSON Web Token in your browser's persistent `localStorage`. An overarching `AuthInterceptor` attaches `Authorization: Bearer <token>` to the HTTP headers of *every* outgoing request, guaranteeing secure transmission.

### Dynamic Modal Binding
Instead of writing 15 separate HTML forms to edit Employees, Departments, Projects, etc., the dashboard uses an advanced **Dynamic Modal Configuration**. 
- `admin-dashboard.component.ts` reads the keys of the JSON object it needs to edit.
- It determines if a key requires an ID dropdown (e.g., `departmentId`).
- It iterates through `<input>` types seamlessly, automatically rendering native `<select>` dropdowns for specific keys, `<input type="date">` calendars for temporal keys, and generic string inputs for names.
