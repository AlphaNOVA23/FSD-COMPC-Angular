# Employee Management System (EMS) - Angular Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.20.

## 🔗 Architecture & Backend Connection (Proxy Setup)

This Angular application is designed to pair seamlessly with a **Java Spring Boot** backend. To prevent CORS security issues and cleanly route API traffic, this project utilizes an Angular Development Proxy.

- **Frontend Port:** `localhost:4200`
- **Backend Port:** `localhost:8080` (Spring Boot)

### How the Proxy Works
There is a strictly configured `proxy.conf.json` file sitting at the root of this project. It actively listens for any outgoing Angular HTTP requests that start with `/apix`. 

When it catches one, it performs a dynamic **Path Rewrite**. It strips out `/apix`, cleanly replaces it with `/api`, and forwards the request over the fence to the Spring Boot server.

**Example Request Flow:**
1. Angular Service -> `http.post('/apix/users', data)`
2. Proxy Intercepts -> Rewrites to `/api/users`
3. Proxy Forwards -> `http://localhost:8080/api/users`

*Note: This configuration is formally loaded during server startup via `angular.json` (`architect.serve.options.proxyConfig`).*

---

## 🧪 Implementation & Testing Guide

To verify that the frontend and backend are successfully communicating, both environments must be active simultaneously.

### 1. Booting the Servers
**Backend (Spring Boot):**
1. Open the Spring Boot backend project (`EmployeeManagementApplication.java`).
2. Run the application. Ensure the console prints `Tomcat started on port 8080`.
*(Note: If you are doing a pure mock-test without a live PostgreSQL database, ensure `DataSourceAutoConfiguration` is excluded in your main class to prevent connection-refused crashes).*

**Frontend (Angular):**
1. Open this Angular project directory in your terminal.
2. Run the development server by typing `npm start` (or `ng serve`).
3. **CRITICAL:** If you modify `proxy.conf.json` at any point, you MUST completely kill (`Ctrl+C`) and restart `ng serve` for the proxy rules to be loaded into memory.

### 2. Performing the Browser Test
1. Open your browser and navigate to `http://localhost:4200/auth/register`.
2. Open your Browser DevTools (`F12`) and view the **Console** tab.
3. Fill out the form with valid dummy data and click Submit.
4. If the backend connection bridges successfully, the Proxy will hit the Spring Boot mock controller and you will see the following object physically returned and logged in your console:
   `Spring Boot Response: { token: "dummy-jwt-token-from-spring" }`

### 3. Performing the Postman Test (Direct API Test)
To verify the REST architecture independently using the exact payload formats expected by the Angular frontend:
1. Open Postman.
2. Click **Import** and select the `postman.json` file located in the root of this Angular repository.
3. A collection named **EMS API** will appear locally. 
4. The URLs in this collection are pre-configured to strictly hit `localhost:8080`.
5. Open the **User Registration** or **User Login** request and hit **Send**.
6. The Spring Boot web-server will return the mock `token` JSON response.

---

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
