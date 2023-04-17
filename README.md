# **Test task for Agile Solutions**
## **Table of contents**
---
- [Description](#Description)
- [Installation](#Installation)
- [Usage](#Usage)
- [Technologies](#Technologies)
---
## **Description**
It should be possible to perform the following operations using the app:
1.Sign in and sign up functionality to create user accounts and securely log in to users.
2.View the list of users.
3.Set user roles (operator, supervisor, administrator).
4.Edit and delete users

---
## **Installation**
1. Clone this project to your machine by using the "git clone + URL" command.
2. Move to project directory.
3. Run the folowing to install dependencies.
```javascript
npm install
``` 
4. Set up database.
5. Run the following code to start.
```javascript
npm run start
```
---
## **Usage**
When running the app, roles and permissions are created automatically by means of the seeder. User must select any role when registering. Each role has permissions.
---
## **Technologies**
- JavaScript
- TypeScript
- Node.js
- Express.js
- MongoDB
- Mongoose