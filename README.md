1. Project Overview & Features
Start with a high-level summary. What does this app actually do?

Role-Based Access Control (RBAC): Admin, Analyst, and Viewer permissions.

Financial Tracking: CRUD operations for income and expenses.

Dashboard Analytics: Aggregated summaries using MongoDB pipelines.

Security: JWT-based authentication with HTTP-only cookies and bcrypt hashing.

2. Technical Stack
List your tools clearly. This helps other developers understand the environment.

Runtime: Node.js

Framework: Express.js

Database: MongoDB (via Mongoose)

Validation: Zod

Auth: JSON Web Tokens (JWT) & Bcrypt

3. Setup & Installation
Prerequisites
Node.js (v18+)

MongoDB Atlas account or local MongoDB instance

Installation Steps
1-Clone the repo: git clone <your-repo-link>

2-Install dependencies: npm install

3-Environment Variables: Create a .env file in the root directory:

PORT=5000
MONGO_URI=mongodb://localhost:27017/finance_db
JWT_SECRET=your_super_secret_key

4-Run the server: npm start

4. API Documentation
This is the most important part for someone testing your code. Use a table format for clarity.

Method,               Endpoint,             Access,                Description
POST   ,           /auth/register    ,   Public    ,            Register a new user (Analyst role starts as 'inactive')
POST,              /auth/login,         Public,                Login and receive a JWT cookie

Records Management

Method,              Endpoint,              Access,                      Description
POST,             /records/create,         Admin,                       Create a new financial entry
GET,               /records,                ALL                    View all records (supports type/category filters)
GETID,            /records/:id              ALL                  Get aggregated dashboard data
PUT,             /records/:id,             Admin,                   Update an existing record
DELETE,          /records/:id,             Admin,                       Remove a record

Summary of Record
Method,             Endpoint,                Access,                         Description
GET,              /dashboard/summary,         Admin/Analyst                  View Summary

5. Assumptions & Tradeoffs
This section shows seniority. It proves you thought about the architecture.

Assumptions Made
Analyst Approval: I assumed that Analysts shouldn't have immediate access. They require an Admin to toggle their status to active via the /approve endpoint before they can log in.

Currency: All amounts are stored as Numbers. I assumed the frontend handles currency formatting (e.g., adding "$").

Tradeoffs Considered
Live Aggregation vs. Stored Balance: I chose to calculate the netBalance using MongoDB's $group and $subtract during the API call.

Tradeoff: This is slightly more CPU-intensive for the database than reading a static balance field from the User model, but it guarantees data integrity because the balance can never get "out of sync" with the actual records.

Zod for Validation: I used Zod instead of manual if/else checks.

Tradeoff: It adds a dependency, but it provides much cleaner error messages and better developer experience.

6. How to Test
Explain how to verify the roles.

Admin Test: Register an Admin. Create a record. (Should succeed).

Analyst Test: Register an Analyst. Try to login (Should fail with "Pending Approval"). Approve the Analyst using the Admin account, then login (Should succeed).

Permission Test: Try to delete a record using a Viewer token (Should return 403 Forbidden).