Here is the assessment document cleanly structured into clear, readable Markdown format. This structure is optimized for AI context injection, keeping all rules, fields, and requirements distinct.

---

Smart Project & Task Collaboration System — Assessment Requirements

## Project Overview

Build a full-stack web application that helps teams manage projects, tasks, team members, and work progress with proper validation and workflow handling. Candidates are free to use any frontend, backend, database, or deployment technologies, provided the architecture features clean code structures and proper data validation.

---

1. Authentication & Role-Based Access Control (RBAC)

User Authentication

- **Signup & Login:** Email and password authentication.

- **Session Management:** Secure session/token handling.

- **Redirects:** Redirect users directly to the Dashboard after a successful login.

- **UX/Testing Access:** Include a **Demo Login** button with pre-filled credentials for quick testing.

Role-Based Access Control (RBAC)

The system must support at least three tiers of system users with varying granular access levels:

- **Admin:** Full system access.

- **Project Manager:** Create/manage projects and assign tasks.

- **Team Member:** Update assigned tasks only.

---

2. Project Management

Users with proper clearance must be able to create, view, update, and delete projects seamlessly.

Project Fields

Each project data entry includes:

- **Project Name**

- **Description**

- **Deadline**

- **Project Status** (Must toggle between: `Active`, `Completed`, or `On Hold`)

---

3. Task Management

Tasks live nested under specific projects. Users can create, edit, delete, alter statuses, and filter tasks by project or status.

Task Fields

Each task entity includes:

- **Task Title**

- **Description**

- **Assigned Member**

- **Due Date**

- **Priority:** `High`, `Medium`, or `Low`

- **Task Status:** `Todo`, `In Progress`, or `Completed`

---

4. Task Validation & Conflict Handling

The system must evaluate and enforce strict business logic at the data tier during task insertion or updates:

| Guardrail Rule | Exact Failure UI Message Requirements |
| -------------- | ------------------------------------- |

| Prevent duplicate task titles inside the same project

| <br>`"This task already exists in the project."`

|
| Prevent reassigning/modifying tasks if they are already completed

| <br>`"Completed tasks cannot be reassigned."`

|
| Prevent setting past dates as deadlines

| <br>`"Please select a valid deadline."`

|

---

5. Team Collaboration & Workload Summary

Team Features

- Add specific team members onto projects.

- Assign granular tasks directly to team members.

- View member-wise dedicated task lists.

Workload Summary Widget

The platform must calculate and display a high-level productivity overview per worker:

- Total tasks per member

- Completed tasks count

- Pending tasks count

---

6. Progress Tracking & Dashboard Analytics

KPI Cards

The management landing interface must compile real-time analytical tallies for:

- **Total Projects**

- **Total Tasks**

- **Completed Tasks**

- **Pending Tasks**

- **Overdue Tasks**

Charts & Data Visualization

Render interactive data components to break down system workflows:

- Tasks by Priority

- Project Progress Trend lines

- Team Productivity Overview

- Task Status Distribution

Additional Widgets

- Upcoming Deadlines tracker

- High-Priority task feeds

- Dynamic progress metrics (e.g., _Website Redesign — 5 tasks pending_ or _Mobile App — 80% completed_).

---

7. Automated Activity Log

Track and audit recent global system events. The feed must pull the latest **5 to 10 activities** sequentially.

Log Event Formats:

- `10:00 AM` — Project "E-Commerce App" created

- `10:15 AM` — Task "Setup API" assigned to John

- `10:30 AM` — Task "Homepage Design" marked as Completed

- `11:00 AM` — Member added to "Dashboard Project"

---

8. Search, Filtering, & Productivity Features

Search Capabilities

- Search through projects using **Name** strings.

- Search through tasks using **Title** or **Description** text queries.

- Search team members cleanly by **Name**.

Filtering Schemes

Filter datasets interactively by:

- Project Status / Task Status

- Task Priority Level

- Assigned Member ID

- Deadline Status (`Upcoming` or `Overdue`)

Sorting Configurations

Sort columns dynamically across:

- Latest Created

- Nearest Deadline

- Highest Priority

- Recently Updated

UX & Core Productivity Enhancements

- **Pagination:** Implement explicit Pagination or Infinite Scroll handles for large tables.

- **Layouts:** Completely responsive table or card layouts across mobile and desktop viewpoints.

- Quick inline task status updates, visual progress indicators, and recent activity shortcuts.

---

9. Bonus / Secondary System Additions

- System-wide Dark/Light UI theme toggle.

- File attachment handling on tasks.

- Interactive commenting threads inside tasks.

- Event notification system.

---

10. Submission & Deployment Requirements

The application must be completely built, deployed, and publicly queryable on the live web.

Submission Checklist:

1.  **Live Application URL** (Accessible link)

2.  **GitHub Repository Link** (Public code access)

3.  **Comprehensive README Documentation**

The `README.md` must clearly document:

- Step-by-step local project setup instructions.

- Complete product features overview.

- Required environment variables mapping (`.env.example`).

- Working Demo Account Login Credentials for evaluations.

- Production deployment walkthroughs.
