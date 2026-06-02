WealthWise — Personal Finance Management System

A full-stack web application for tracking expenses, managing budgets, and receiving smart financial alerts. Built with NestJS, Next.js, PostgreSQL, and Tailwind CSS.

Table of Contents

Overview
Features
Tech Stack
Project Structure
Getting Started
Environment Variables
API Endpoints
Database Schema
Screenshots
Author


📖 Overview
WealthWise is a secure, role-based personal finance management system. It allows users to track daily expenses, set category-based budgets, and receive automatic email alerts when spending limits are exceeded. The system features two roles — a regular user who manages their own finances, and an admin (Financial Advisor) who manages global categories and oversees platform-wide data.
This project was built as a Midterm Project for the course Advanced Programming in Web Technology (Spring 2025–2026) at American International University-Bangladesh (AIUB).

✨ Features
👤 User Features

✅ Secure registration and login with JWT authentication
✅ Track and categorize daily expenses
✅ Create personal expense categories (visible only to the user)
✅ Set spending budgets per category
✅ Update budget limits anytime
✅ Delete own expenses
✅ View financial summary with category-wise breakdown
✅ Budget status tracking (within limit / exceeded)
✅ Interactive dashboard with bar charts
✅ Automatic budget alert email when spending exceeds limit
✅ Welcome email on registration

👑 Admin Features

✅ Create and manage global categories (visible to all users)
✅ View all registered users on the platform
✅ View all expenses submitted by every user
✅ View platform-wide financial reports
✅ Delete user accounts
✅ Admin dashboard with spending distribution charts

🔐 Security

✅ Passwords hashed with bcryptjs (10 salt rounds)
✅ JWT tokens with 7-day expiry
✅ Role-based access control (RBAC) with custom guards and decorators
✅ Admin accounts created via database only (not via API)
✅ Input validation on all endpoints using class-validator DTOs
✅ CORS configured for frontend-backend communication


🛠️ Tech Stack
Backend
TechnologyVersionPurposeNestJSLatestBackend frameworkTypeScriptLatestType safetyPostgreSQLLatestRelational databaseTypeORMLatestObject Relational MapperPassport.jsLatestAuthentication middlewareJWTLatestToken-based authenticationbcryptjsLatestPassword hashingNodemailerLatestEmail notificationsclass-validatorLatestRequest validation
Frontend
TechnologyVersionPurposeNext.js16.xReact frameworkJavaScriptES6+Programming languageTailwind CSSLatestUtility-first stylingAxiosLatestHTTP clientRechartsLatestData visualizationReact Hot ToastLatestNotificationsLucide ReactLatestIcons

📁 Project Structure
Wealthwise_ADV_WEB_PROJECT/
│
├── wealthwise-api/                 # NestJS Backend
│   ├── src/
│   │   ├── auth/                   # Authentication module
│   │   │   ├── dto/
│   │   │   │   ├── register.dto.ts
│   │   │   │   └── login.dto.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   └── roles.decorator.ts
│   │   ├── users/                  # Users module
│   │   │   ├── user.entity.ts
│   │   │   └── users.module.ts
│   │   ├── categories/             # Categories module
│   │   │   ├── dto/
│   │   │   │   └── create-category.dto.ts
│   │   │   ├── category.entity.ts
│   │   │   ├── categories.controller.ts
│   │   │   ├── categories.service.ts
│   │   │   └── categories.module.ts
│   │   ├── expenses/               # Expenses module
│   │   │   ├── dto/
│   │   │   │   └── create-expense.dto.ts
│   │   │   ├── expense.entity.ts
│   │   │   ├── expenses.controller.ts
│   │   │   ├── expenses.service.ts
│   │   │   └── expenses.module.ts
│   │   ├── budgets/                # Budgets module
│   │   │   ├── dto/
│   │   │   │   ├── create-budget.dto.ts
│   │   │   │   └── update-budget.dto.ts
│   │   │   ├── budget.entity.ts
│   │   │   ├── budgets.controller.ts
│   │   │   ├── budgets.service.ts
│   │   │   └── budgets.module.ts
│   │   ├── reports/                # Reports module
│   │   │   ├── reports.controller.ts
│   │   │   ├── reports.service.ts
│   │   │   └── reports.module.ts
│   │   ├── admin/                  # Admin module
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.service.ts
│   │   │   └── admin.module.ts
│   │   ├── mailer/                 # Email module
│   │   │   ├── mailer.service.ts
│   │   │   └── mailer.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env
│   └── package.json
│
└── wealthwise-frontend/            # Next.js Frontend
    ├── src/
    │   ├── app/
    │   │   ├── page.js             # Landing page
    │   │   ├── layout.js           # Root layout
    │   │   ├── globals.css
    │   │   ├── login/
    │   │   │   └── page.js
    │   │   ├── register/
    │   │   │   └── page.js
    │   │   ├── forgot-password/
    │   │   │   └── page.js
    │   │   ├── dashboard/
    │   │   │   └── page.js
    │   │   ├── expenses/
    │   │   │   └── page.js
    │   │   ├── budgets/
    │   │   │   └── page.js
    │   │   ├── categories/
    │   │   │   └── page.js
    │   │   └── admin/
    │   │       ├── dashboard/
    │   │       ├── users/
    │   │       ├── categories/
    │   │       └── expenses/
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Navbar.js
    │   │   │   └── AdminNavbar.js
    │   │   └── ui/
    │   │       ├── Modal.js
    │   │       ├── StatCard.js
    │   │       ├── LoadingSpinner.js
    │   │       └── EmptyState.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── hooks/
    │   │   └── useAuth.js
    │   └── lib/
    │       ├── axios.js
    │       └── api.js
    └── package.json

🚀 Getting Started
Prerequisites
Make sure you have these installed:

Node.js v18 or higher
npm v9 or higher
PostgreSQL v14 or higher
Git


1. Clone the Repository
bashgit clone https://github.com/yourusername/Wealthwise_ADV_WEB_PROJECT.git
cd Wealthwise_ADV_WEB_PROJECT

2. Setup the Backend
bashcd wealthwise-api
npm install
Create a .env file in the wealthwise-api root:
envDB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD="yourpassword"
DB_NAME=wealthwise

JWT_SECRET=your_super_secret_jwt_key

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_password
MAIL_FROM=your_email@gmail.com
Create the PostgreSQL database:
sqlCREATE DATABASE wealthwise;
Start the backend:
bashnpm run start:dev
Backend runs on http://localhost:3000

3. Setup the Frontend
bashcd ../wealthwise-frontend
npm install
npm run dev
Frontend runs on http://localhost:3001

4. Create Admin Account
Register a user normally, then update their role in the database:
sqlUPDATE users SET role = 'admin' WHERE email = 'admin@youremail.com';
Or using psql:
bashpsql -U postgres -d wealthwise -c "UPDATE users SET role = 'admin' WHERE email = 'admin@youremail.com';"

🔑 Environment Variables
VariableDescriptionExampleDB_HOSTPostgreSQL hostlocalhostDB_PORTPostgreSQL port5432DB_USERNAMEPostgreSQL usernamepostgresDB_PASSWORDPostgreSQL password"yourpassword"DB_NAMEDatabase namewealthwiseJWT_SECRETSecret key for JWT signingsuper_secret_keyMAIL_HOSTSMTP hostsmtp.gmail.comMAIL_PORTSMTP port587MAIL_USERGmail addressyou@gmail.comMAIL_PASSGmail app passwordxxxx xxxx xxxx xxxxMAIL_FROMSender emailyou@gmail.com

Note: For Gmail, generate an App Password at myaccount.google.com/apppasswords. Enable 2-Step Verification first.


📡 API Endpoints
Authentication
MethodEndpointDescriptionAuthPOST/auth/registerRegister new user❌POST/auth/loginLogin and get JWT token❌GET/auth/meGet current user info✅
Categories
MethodEndpointDescriptionAuthRolePOST/categories/globalCreate global category✅AdminPOST/categories/personalCreate personal category✅UserGET/categoriesGet all accessible categories✅Any
Expenses
MethodEndpointDescriptionAuthRolePOST/expensesAdd new expense✅UserGET/expenses/myGet my expenses + total✅UserDELETE/expenses/:idDelete own expense✅User
Budgets
MethodEndpointDescriptionAuthRolePOST/budgetsCreate budget for category✅UserGET/budgetsGet my budgets✅UserPATCH/budgets/:idUpdate budget limit✅User
Reports
MethodEndpointDescriptionAuthRoleGET/reports/summaryFinancial summary with breakdown✅User
Admin
MethodEndpointDescriptionAuthRoleGET/admin/usersGet all users✅AdminGET/admin/expensesGet all expenses✅AdminGET/admin/reportsPlatform-wide reports✅AdminDELETE/admin/users/:idDelete a user✅Admin

Token format: Send token directly in the Authorization header without the Bearer prefix.
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...


🗄️ Database Schema
┌─────────────────────────────────────────────────────────────┐
│                        USERS                                │
│  id | name | email | password | role | createdAt            │
└─────────────────────┬───────────────────────────────────────┘
                      │
          ┌───────────┼───────────┐
          │           │           │
          ▼           ▼           ▼
┌─────────────┐ ┌──────────┐ ┌──────────────┐
│  CATEGORIES │ │ EXPENSES │ │   BUDGETS    │
│  id         │ │ id       │ │ id           │
│  name       │ │ amount   │ │ limitAmount  │
│  isPersonal │ │ desc     │ │ user (FK)    │
│  createdBy  │ │ user(FK) │ │ category(FK) │
│  createdAt  │ │ cat(FK)  │ │ createdAt    │
└─────────────┘ │ createdAt│ │ updatedAt    │
                └──────────┘ └──────────────┘

Relationships:
- One User    → Many Expenses
- One User    → Many Budgets
- One Admin   → Many Global Categories
- One Category → Many Expenses
- One Category → Many Budgets

📱 Pages
PageRouteAccessLanding/PublicLogin/loginPublicRegister/registerPublicForgot Password/forgot-passwordPublicUser Dashboard/dashboardUserExpenses/expensesUserBudgets/budgetsUserCategories/categoriesUserAdmin Dashboard/admin/dashboardAdminAdmin Users/admin/usersAdminAdmin Categories/admin/categoriesAdminAdmin Expenses/admin/expensesAdmin

📧 Email Notifications
The system sends two types of emails:
EventRecipientDescriptionRegistrationRegistered userWelcome email with account confirmationBudget exceededExpense creatorAlert with limit, total spent, and excess amount

🔄 How Authentication Works
1. User sends POST /auth/login with email + password
2. Backend verifies credentials and generates JWT token
3. Token returned to frontend and stored in localStorage
4. Axios request interceptor attaches token to every request header
5. JwtStrategy validates token on every protected route
6. RolesGuard checks user role for admin-only routes
7. On 401 response, Axios interceptor clears storage and redirects to login

👨‍💻 Author
Kayjer Islam

ID: 22-49005-3
Section: A
Course: Advanced Programming in Web Technology
Institution: American International University-Bangladesh (AIUB)
Semester: Spring 2025-2026
Course Instructor: Md. Khairul Alam Mazumder


📄 License
This project was built for academic purpose at AIUB.
