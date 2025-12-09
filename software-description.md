# **Car Dealership Management System — Project Description**

A simple, fast, and user-friendly **in-house management software** built with **Next.js Full-Stack, ShadCN UI, Prisma, PostgreSQL (Neon)**, and hosted on **Vercel**.
The system allows the business owner and staff to efficiently manage cars, employees, expenses, and business performance analytics.
There is **no public signup** — only the admin can create accounts.

---

# **1. User Roles**

### **Admin**

* Full access to all modules
* Can create and manage staff accounts
* Can manage cars, employees, expenses
* Can view analytics dashboard

### **Staff**

* Can manage cars
* Can manage expenses
* Cannot view or edit employees
* Cannot create users
* Can access to analytics

---

# **2. Core Modules**

## **A. Car Management** *(Accessible by both Admin & Staff)*

### **Car Data Includes**

* Car ID
* Name/Model
* Price
* Added Date
* Sold Date
* Status — **Available** or **Sold**
* Buyer
* Seller
* Optional fields (color, mileage, notes, etc.)

### **Features**

* **List All Cars**

  * Sorting by price, name, add date, sold date
  * Filtering by status (Available / Sold)
* **Add Car**
* **Update Car**

  * Price
  * Status (mark as sold, update sold date)
  * General details
* **Delete Car**

---

## **B. Employee Management** *(Admin Only)*

### **Employee Data Includes**

* Employee ID
* Full Name
* Salary
* Start Working Date
* Optional details (phone, address, role, notes)

### **Features**

* List all employees
* Add new employee
* Update employee information
* Delete employee

---

## **C. Expense Management** *(Accessible by both Admin & Staff)*

Used for tracking daily spending such as repairs, utilities, office items, and car-related costs.

### **Expense Data Includes**

* Expense ID
* Price/Amount
* Reason / Description
* Date
* Employee (optional)
* Category (optional)

### **Features**

* Add expense record
* Update expense
* Delete expense
* View all expenses (with date and category filters)

---

## **D. Analytics Dashboard** *(Admin Only — Optional for staff)*

A simple useful summary of business performance.

### **Features**

* **Select time range (Day / Month / Year)**

* **Total Revenue from Car Sales**
  * Sum of prices of sold cars

* **Total Expenses**
  * Sum of all recorded expenses

* **Profit Overview**
  * Revenue – Expenses

* **Basic charts or tables for quick understanding**

---

# **3. User Management**

### **Admin Creates Users**

* No public signup
* Admin account will be created first
* Admin can create:

  * Staff accounts
  * Additional admin accounts (optional)

User fields:

* ID
* Name
* Email / Username
* Password
* Role (Admin | Staff)

---

# **4. Technology Stack**

* **Frontend & Backend:** Next.js App Router
* **UI Framework:** ShadCN + TailwindCSS
* **Database ORM:** Prisma
* **Database:** PostgreSQL (Neon.io) – cloud hosted
* **Hosting:** Vercel (Free Plan)
* **Authentication:** Better Auth
* **Other Libraries:** Zustand, Zod, React Hook Form

---

# **5. Other Info**

* Fast performance (Next.js server actions & cached queries)
* Cloud-hosted database (Neon) ensures data safety
* Very easy for the client to use
* Good enough for **small teams**, low traffic, and internal usage
---
