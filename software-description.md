# Car Dealership Management System — Software Description

A simple and efficient **in-house management system** for a small car dealership.  
The application is used by **one admin user only**, with no staff accounts or public access.

Built with **Next.js Full-Stack**, **ShadCN UI**, **Prisma**, and **PostgreSQL (Neon)**.  
Hosted on **Vercel** for easy cloud deployment and maintenance-free operation.

---

## 1. User Role

### **Admin (Single User Only)**
The system has **only one user** — the Admin.

Admin can:
- Manage all cars  
- Manage all employees  
- Manage all expenses  
- Access analytics dashboard  

There are **no staff accounts**, no roles, no invitations, no user creation.

## 2. Core Modules

## A. Car Management

### Car Data Includes:
- Car Name / Model  
- Purchase Price  
- Selling Price  
- Added Date  
- Sold Date  
- Status (Available / Sold)  
- Buyer Information  
- Optional:
  - Color  
  - Mileage  
  - Notes  
  - VIN  
  - Photos  

### Features:
- List all cars  
- Filter by status  
- Sort by price, dates, name  
- Add new car  
- Update car details  
- Mark car as sold  
- Delete car  

## B. Employee Management

Employees are **real workers of the business**, NOT system users.

### Employee Data Includes:
- Name  
- Salary  
- Start Date  
- Phone / Address (optional)  
- Notes (optional)

### Features:
- View employees  
- Add employee  
- Edit employee  
- Delete employee  

## C. Expense Management

Track all business costs.

### Expense Data Includes:
- Amount  
- Description / Notes  
- Date  
- Category (Repair, Transport, Utilities, etc.)  
- Linked car (optional)  
- Linked employee (optional)

### Features:
- View expense list  
- Add expense  
- Edit expense  
- Delete expense  
- Filter by date and category  

## D. Analytics Dashboard

Shows a simple overview of business performance.

### Includes:
- Total Revenue (Sold cars)  
- Total Expenses  
- Profit = Revenue – Expenses  
- Select: Day / Month / Year  
- Optional mini-charts for trends  
- Optional tables:
  - Monthly revenue  
  - Monthly expenses  

## 3. System Characteristics

### Authentication
- Only **one admin login**  
- No user roles  
- No staff accounts  
- No registration screen  

### Database
- PostgreSQL (Neon)  
- Prisma ORM  

### Tech Stack
| Layer | Technology |
|--------|------------|
| Frontend / Backend | Next.js App Router |
| UI | ShadCN UI + Tailwind |
| ORM | Prisma |
| DB | PostgreSQL |
| Hosting | Vercel |
| Validation | Zod |
| Forms | React Hook Form |
| State | Zustand |
| Tools | React Query |

## 4. Optional Future Features
- PDF/Excel export for Cars and Expenses  
- Profit-sharing module for business partners  
