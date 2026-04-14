# 🅰️ Angular Frontend Study Guide

This guide provides a deep-dive into the architectural logic of the Enterprise Employee Management System from the Angular perspective.

---

## 🚀 1. Dynamic Rendering Engine (Admin Dashboard)
The core of the administrator experience is the `AdminDashboardComponent`. Instead of hardcoding specialized pages for every database entity (Employees, Salaries, Projects), we created a **Universal Data Generator**.

### How it Works:
1. **`activeSection` Switching**: When a sidebar item is clicked, the `activeSection` variable changes.
2. **Generic Fetching**: The `loadSection()` method uses this key to fetch data from a standardized endpoint (e.g., `/apix/employees`).
3. **Template Discovery**: In the HTML, we use `*ngFor="let row of data"` and `*ngFor="let key of getKeys(row)"`. This allows Angular to build the table columns dynamically based on the JSON keys returned by the Java backend.

---

## 🛠️ 2. Data Transformation (Proxy Fields)
The Java backend expects relationships as **nested objects** (e.g., `department: { departmentId: 1 }`). However, capturing this in a simple UI form is difficult. We solved this using **Proxy Mapping**.

### The Flow:
- **UI Interaction**: In the Edit Modal, we present a flat field like `departmentId` to the user via a dropdown.
- **Proxy Injection**: When opening a modal, we "inject" these flat ID properties into the `modalEntity`.
- **Relational Mapping (`saveRecord`)**: Right before the `POST` or `PATCH` request is sent, the code intercepts the payload and transforms the flat IDs back into nested objects:
  ```typescript
  if (payload.departmentId) {
      payload.department = { departmentId: payload.departmentId }; // Transform ID to Object
      delete payload.departmentId; // Clean up the flat field
  }
  ```
This makes the frontend compatible with the backend’s strict JPA/Hibernate requirements.

---

## 🔒 3. Security & Authentication
Authentication is handled centrally through **JWT (JSON Web Tokens)**.

### A. AuthInterceptor
Located in `core/interceptors`, this interceptor monitors **every** HTTP request. It checks `localStorage` for a `token`. If found, it clones the request and adds the `Authorization: Bearer <token>` header. This means individual components never have to worry about authentication headers.

### B. AuthGuard
Protects routes like `/admin` and `/my-profile`. If a user attempts to access these without a valid token in storage, they are automatically rerouted to `/auth/login`.

---

## 🎨 4. Layout & Interaction Logic

### A. Custom Datalist Dropdowns
To provide flexibility, we replaced standard `<select>` boxes with a hybrid `<input list="...">`.
- **The Benefit**: Admins can either select from a predefined list (e.g., "Manager", "CTO") OR type in a completely custom role manually.
- **The Logic**: Predefined lists are loaded into the `dropdownOptions` object during `ngOnInit` for every major section.

### B. Dynamic Header Formatting
Since database keys like `employeeName` or `jobLevel` are camelCased, we implemented a custom `formatHeader(key)` function. It uses Regex to insert spaces and capitalize words, turning `jobLevel` into `Job Level` for a professional UI look.

### C. Native Date Pickers
By checking if a key name contains "Date", "DOB", or "Term", the dashboard modal automatically switches the input type to `date`, enabling the browser's native calendar widget for a better user experience.

---

## 📈 5. Integration Challenges Resolved
One of the biggest challenges was the transition from **Standalone** components to **Module-based** architecture. The project uses a hybrid approach:
- **CoreModule**: For global components like the Header and Footer.
- **Feature Modules**: Groups related logic (like Admin or Profile) to keep the initial load time small.
- **Shared Context**: Using `EmployeeService` as a singleton to share profile data across components.
