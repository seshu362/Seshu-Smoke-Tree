### **PROJECT**
 Create a backend where users can register and store their addresses. There must be two tables: User and Address. There will be one to many relationships between users and addresses. We would prefer if you use a relational database to store the information but MongoDB is also acceptable. Please use Node.js with JavaScript or TypeScript. Any other language will not be considered. There is no need to create an authentication system for the user (Login, JWT). One simple form submission should be enough to achieve this. On submitting the form user name and address is collected. The name is stored in the user table while the address is stored in the address table.

### 1. **Project Setup**

- Create a new project directory.
- Initialize the project using `npm init`.
- Install necessary dependencies (Express, database ORM, etc.).

### 2. **Database Setup**

- Choose a relational database MySQL.
- Design two tables: **User** (with fields like `id` and `name`) and **Address** (with fields like `id`, `userId`, and `address`).
- Establish a one-to-many relationship between the `User` and `Address` tables.

### 3. **Server Setup**

- Set up an Express.js server to handle incoming requests.
- Use body-parser to parse form submissions.

### 4. **Database Models**

- Define the **User** model with fields like `name`.
- Define the **Address** model with fields like `address` and a foreign key referencing the **User**.
- Establish relationships between the tables or collections (one-to-many).

### 5. **Create API Endpoints**

- Create a **POST** endpoint (`/register`) to collect user name and address from the form submission.
- Store the name in the **User** table and the address in the **Address** table.

