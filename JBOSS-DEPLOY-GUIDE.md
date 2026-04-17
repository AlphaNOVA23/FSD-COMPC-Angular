# JBoss Deployment Finalization (WAR Conversion)

The conversion of your backend into a **WAR (Web Application Resource)** is now complete. The project is specifically configured to output a file named **`ems.war`**, which will be hosted at the `/ems` context path on your JBoss server.

## ✅ Changes Completed

### 1. Backend Packaging Configuration
- **[pom.xml](file:///d:/Code/FSD/BACKEND/Employee_Management/pom.xml)**:
    - Set `<packaging>war</packaging>`.
    - Added `<finalName>ems</finalName>` to the build configuration.
    - Marked `spring-boot-starter-tomcat` as `<scope>provided</scope>` so it doesn't conflict with JBoss's own server.

### 2. Application Initializer
- **[ServletInitializer.java](file:///d:/Code/FSD/BACKEND/Employee_Management/src/main/java/com/FSD/ServletInitializer.java)**:
    - Created this new class in the `com.FSD` package.
    - This allows JBoss to bootstrap the Spring Boot environment when the WAR is deployed.

---

## 🚀 How to Deploy to JBoss

1.  **Build the Project**: Navigate into your project folder and run the build:
    ```bash
    cd Employee_Management
    mvn clean package -DskipTests
    ```
2.  **Locate the File**: Go to the `target/` folder inside the `Employee_Management` directory. You should see a file named **`ems.war`**.
3.  **Deploy**: 
    - Copy `ems.war`.
    - Paste it into your JBoss/WildFly installation directory at: `standalone/deployments/`.
4.  **Access**: Your API will now be available at `http://localhost:8080/ems/api`.

---

## 🅰️ How to Connect Angular to JBoss

If you want your **Angular Frontend** to talk to the JBoss version of the backend, you need to update your **[proxy.conf.json](file:///d:/Code/FSD/FRONTEND/Angular_Applications/UserProject/proxy.conf.json)**.

### Option A: JBoss Mode (Deploying)
Update the `pathRewrite` so it points to the `/ems` path:
```json
{
  "/apix": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true,
    "pathRewrite": {
      "^/apix": "/ems/api"
    }
  }
}
```

### Option B: Local Mode (Standard Development)
Keep it as it is now (which you can still use!):
```json
"pathRewrite": {
  "^/apix": "/api"
}
```

> [!TIP]
> You can still run your project locally by running the `EmployeeManagementApplication.java` file or using `mvn spring-boot:run` as you always have. The WAR changes only affect the final "package" for your professor.
