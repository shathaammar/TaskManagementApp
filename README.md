# Task Management App

## Project Description

This project is a simple Task Management Application built using **Angular 18**.
It allows users to manage their tasks by adding, editing, deleting, viewing, searching, and filtering tasks.
All task data is stored locally in the browser using **LocalStorage**, so no backend is required.

The application is built using a clean and scalable structure with Angular components, services, routing, and reactive forms.

---

## Features

* Display a list of tasks
* Add a new task
* Edit an existing task
* Delete a task
* View task details
* Search tasks by title
* Filter tasks by status and priority
* Store tasks using LocalStorage
* Support for **Arabic and English language toggle**

---

## Technologies Used

* Angular 18
* TypeScript
* Angular Routing
* Reactive Forms
* LocalStorage
* HTML & CSS

---

## Project Structure

The project follows a simple component-based structure:

* **Components**

  * Tasks List
  * Task Form (used for Add and Edit)
  * Task Details
* **Service**

  * Task Service for managing task data
* **Model**

  * Task interface

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/shathaammar/TaskManagementApp.git
```

### 2. Navigate to the project folder

```bash
cd TaskManagementApp
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run the application

```bash
ng serve
```

### 5. Open the application

Open your browser and go to:

```
http://localhost:4200
```

---

## How It Works

Tasks are stored in the browser using **LocalStorage**.
The application uses an Angular service to handle all CRUD operations (Create, Read, Update, Delete).

---

## Expected Routes

* `/tasks` → Display all tasks
* `/tasks/new` → Add new task
* `/tasks/edit/:id` → Edit task
* `/tasks/:id` → View task details

---

## Notes

This project was built as part of a technical task to demonstrate Angular fundamentals such as routing, services, reactive forms, and component-based architecture.

