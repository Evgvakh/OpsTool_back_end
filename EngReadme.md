# Table of Contents

1. [**General Description**](#1-general-description)
   1.1 [Introduction](#introduction)  
   1.2 [Supported Methods and Protocols](#supported-methods-and-protocols)  
   1.3 [Data Transfer Format](#data-transfer-format)  
   1.4 [Tools Used](#tools-used)  

2. [**Authorization and Authentication**](#authorization-and-authentication)  
   2.1 [Usage Examples](#usage-examples)  
   2.2 [Authorization Middleware](#authorization-middleware)  

3. [**Endpoints (URLs)**](#3-endpoints-urls)  
   3.1 [Calls (Ship Arrival Dates and Description)](#calls-ship-arrival-dates-and-description)  
       3.1.1 [Routes](#routes)  
       3.1.2 [Validation](#validation)  
       3.1.3 [Middleware](#middleware)  
       3.1.4 [Database Models](#database-models)  
       3.1.5 [Security](#security)  
   3.2 [Guides (Bookings)](#guides-preliminary-booking-table)  
       3.2.1 [Routes](#routes-1)  
       3.2.2 [Validation](#validation-1)  
       3.2.3 [Middleware](#middleware-1)  
       3.2.4 [Database Models](#database-models-1)  
       3.2.5 [Security](#security-1)  
   3.3 [Users](#users)  
       3.3.1 [Routes](#routes-2)  
       3.3.2 [Validation](#validation-2)  
       3.3.3 [Middleware](#middleware-2)  
       3.3.4 [Database Models](#database-models-2)  
       3.3.5 [Security](#security-2)  
   3.4 [Miscellaneous](#miscellaneous)  
       3.4.1 [Ports](#routes-3)  
       3.4.2 [Companies](#routes-3)  
       3.4.3 [Ships](#routes-3)  
       3.4.4 [Languages](#routes-3)  
       3.4.5 [Guide Residencies](#routes-3)  
       3.4.6 [User Roles](#routes-3)  

4. [**Request and Response Examples**](#4-request-and-response-examples)  
   4.1 [Resetting User Password](#post-userreset_password)  
   4.2 [Fetching Call List](#get-callsget)  
   4.3 [Updating Guide Worked Hours](#post-guideaddworkedhours)  

# OpsTool App

## 1. General Description

### Introduction:

This application is a back-end REST API designed to automate the onshore operations of the SHOREX department for a company organizing excursions for cruise liners. The final version will include functions for preliminary bookings and notifications for guides, transport companies, and service providers (museums, wine tastings, restaurants, etc.). An admin panel will also be created to manage all data types.

_At the current stage (09.01.2025), the implemented features include guide bookings and a basic interface for managing auxiliary elements, including the admin panel._

### Supported Methods and Protocols:

#### HTTP/HTTPS
The application supports standard HTTP methods: GET, POST, PUT, PATCH, DELETE.

### Data Transfer Format:

All data is transferred in JSON format.

### Tools Used:

#### Programming Language:
The application is written in JavaScript (Node.js with the Express framework). Migration to TypeScript is planned.
#### Database:
MongoDB is used for data storage.

## Authorization and Authentication

Token-based authentication.

Authorization uses JSON Web Token (JWT) implemented via the jsonwebtoken module.

### Usage Examples:

The **verifyToken** function checks user authorization when accessing a new route.
```javascript
const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization
        if (!token) {
            res.status(401).json({ isAuthOK: false })
        }
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN_KEY)
        const user = await User.findById(req.body.userID)
        if (decodedToken.id == user._id && decodedToken.role === user.role) {
            res.json({ isAuthOK: true, userRole: user.role, assignedCalls: user.callsPermissons })
        } else {
            res.json({ isAuthOK: false })
        }
    } catch (err) {
        console.log(err)
        res.json({ isAuthOK: false })
    }
}
```

The **checkIfAdmin** function is used as middleware to verify if a user has admin rights.

```javascript
export const checkIfAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization
        if (!token) {
            throw new Error('You have no right for this operation')
        }

        const checkToken = jwt.verify(token, process.env.SECRET_TOKEN_KEY)

        const user = await User.findById(checkToken.id)
        if (user.role === 'ADMIN') {
            next()
        } else {
            throw new Error('You have no right for this operation')
        }
    } catch (err) {
        console.log(err)
        next(err)
    }
}
```
JWT is also used to generate a password reset link sent to the user's email.

## 3. Endpoints (URLs)

### Calls (Ship Arrival Dates and Description)

The API supports managing calls (Calls), including creating, editing, retrieving information, and verifying access rights.

#### Routes

1. GET /calls/get

- **Description**: Retrieve all calls with details.
- **Method**: GET
- **Request**: No parameters.
- **Response**:
    - **Type**: JSON
    - **Format**:
      ```json
      [
        {
          "_id": "<call identifier>",
          "date": "<date>",
          "type": "<type>",
          "port": "<port name>",
          "company": "<company name>",
          "ship": "<ship name>",
          "arrival": "<arrival time>",
          "departure": "<departure time>",
          "portCode": "<port code>",
          "assignedUsers": [<list of assigned users>]
        }
      ]
      ```

2. POST /call/add

- **Description**: Add a new call (available to administrators only).
- **Method**: POST
- **Middlewares**:
  - **checkIfAdmin**: Verifies if the user is an administrator.
  - **celebrate**: Validates data using `callValidationSchema`.
- **Request Body**:
  ```json
  {
    "date": "<date>",
    "type": "<type>",
    "port": "<port name>",
    "company": "<company name>",
    "ship": "<ship name>",
    "arrival": "<arrival time>",
    "departure": "<departure time>"
  }
  ```
- **Response**:
    - **Type**: JSON
    - **Format**:
      ```json
      {
        "_id": "<call identifier>",
        "date": "<date>",
        "type": "<type>",
        "port": "<port name>",
        "company": "<company name>",
        "ship": "<ship name>",
        "arrival": "<arrival time>",
        "departure": "<departure time>"
      }
      ```

3. PATCH /call/edit_one_field/:field

- **Description**: Edit a specific field of a call.
- **Method**: PATCH
- **Path Parameters**:
  - `field`: The name of the field to be edited (e.g., `type`, `port`).
- **Request Body**:
  ```json
  {
    "callId": "<call identifier>",
    "value": "<new field value>"
  }
  ```
- **Validation**: Based on `editCallSchemaBody`.
- **Response**:
    - **Type**: JSON
    - **Format**:
      ```json
      {
        "matchedCount": <number of matched documents>,
        "modifiedCount": <number of modified documents>
      }
      ```

#### Validation

##### Validation Schemas

- **Call Validation Schema (`callValidationSchema`)**:
  - **Fields**:
    - `date` (string, required): Call date.
    - `type` (string, one of `SHX` or `TRN`, required): Call type.
    - `port` (string, required): Port name.
    - `company` (string, required): Company name.
    - `ship` (string, required): Ship name.
    - `arrival` (string, required): Arrival time (format HH:mm).
    - `departure` (string, required): Departure time (format HH:mm).

- **Edit Call Schema (`editCallSchemaBody`)**:
  - **Fields**:
    - `callId` (string, 24 characters, required): Call identifier.
    - `value` (string, required unless the field is `ship`): New value for the specified field.

#### Middleware

- **checkIfAdmin**
  - **Description**: Verifies if the user is an administrator.
  - **Check**:
    - Analyzes the authorization token.
    - Confirms the user's role.

- **verifyToken**
  - **Description**: Verifies the user's token authenticity.
  - **Check**:
    - Decodes the JWT.
    - Compares the user's ID and role.
  - **Responses**:
    - ```json
      { "isAuthOK": true, "userRole": "...", "assignedCalls": [...] }
      ``` for successful verification.
    - ```json
      { "isAuthOK": false }
      ``` for errors.

#### Database Models

- **Call Model**:
  - **Fields**:
    - `date`: Call date (string).
    - `type`: Call type (`SHX` or `TRN`).
    - `port`: Port name (string).
    - `company`: Company name (string).
    - `ship`: Ship name (string).
    - `arrival`: Arrival time (string, format HH:mm).
    - `departure`: Departure time (string, format HH:mm).

#### Relationships:
- MongoDB aggregations are used to fetch related data (e.g., ports and users).

#### Security

- **Authentication**: User token validation via `verifyToken`.
- **Authorization**: Admin rights verification via `checkIfAdmin`.
- **Validation**: All input data is checked using Joi schemas in `celebrate`.

<br>

### Guides (Guide Preliminary Booking Table)

The API supports managing guides (Guides), including creating, editing, retrieving information, booking, and managing working hours.

#### Routes

1. GET /guides/get

- **Description**: Retrieve all guides.
- **Method**: GET
- **Request**: No parameters.
- **Response**:
    - **Type**: JSON
    - **Format**: 
```json
[
  {
    "_id": "<identifier>",
    "firstName": "<first name>",
    "lastName": "<last name>",
    "residence": "<residence>",
    "phone": "<phone>",
    "email": "<email>",
    "languages": ["<language>", ...],
    "bookings": [
      {
        "callId": "<call identifier>",
        "callDate": "<call date>"
      }
    ],
    "workedHours": [
      {
        "callId": "<call identifier>",
        "hours": "<number of hours>"
      }
    ]
  }
]
```

2. GET /guide/get/:id

- **Description**: Retrieve information about a specific guide by ID.
- **Method**: GET
- **Path Parameters**:
    - `id`: Guide identifier.
- **Response**:
    - **Type**: JSON
    - **Format**:
```json
{
  "_id": "<identifier>",
  "firstName": "<first name>",
  "lastName": "<last name>",
  "residence": "<residence>",
  "phone": "<phone>",
  "email": "<email>",
  "languages": ["<language>", ...],
  "bookings": [...],
  "workedHours": [...]
}
```

3. POST /guide/add

- **Description**: Add a new guide (available to administrators only).
- **Method**: POST
- **Middlewares**:
    - **checkIfAdmin**: Verifies if the user is an administrator.
    - **celebrate**: Validates data using `guideValidationSchema`.
- **Request Body**:
```json
{
  "firstName": "<first name>",
  "lastName": "<last name>",
  "residence": "<residence>",
  "phone": "<phone>",
  "email": "<email>",
  "languages": ["<language>", ...]
}
```
- **Response**:
    - **Type**: JSON
    - **Format**:
```json
{
  "_id": "<identifier>",
  "firstName": "<first name>",
  "lastName": "<last name>",
  "residence": "<residence>",
  "phone": "<phone>",
  "email": "<email>",
  "languages": ["<language>", ...]
}
```

4. POST /guide/add/booking

- **Description**: Add a booking for a guide.
- **Method**: POST
- **Middlewares**:
    - **celebrate**: Validates data using `addBookingSchema`.
- **Request Body**:
```json
{
  "callID": "<call identifier>",
  "id": "<guide identifier>",
  "callDate": "<call date>"
}
```
- **Response**:
    - **Type**: JSON
    - **Format**:
```json
{
  "matchedCount": <number of matches>,
  "modifiedCount": <number of modifications>
}
```

4. POST /guide/add/workedhours

- **Description**: Add the number of worked hours for a guide.
- **Method**: POST
- **Middlewares**:
    - **celebrate**: Validates data using `addWorkedHoursSchema`.
- **Request Body**:
```json
{
  "callID": "<call identifier>",
  "id": "<guide identifier>",
  "hours": "<number of hours>"
}
```
- **Response**:
    - **Type**: JSON
    - **Format**:
```json
{
  "matchedCount": <number of matches>,
  "modifiedCount": <number of modifications>
}
```

#### Validation

##### Validation Schemas:

- **Guide Validation Schema (`guideValidationSchema`)**:
  - **Fields**:
    - `firstName` (string, required): Guide's first name.
    - `lastName` (string, required): Guide's last name.
    - `residence` (string, required): Guide's residence.
    - `phone` (string, required): Phone number.
    - `email` (string, email, required): Email address.
    - `languages` (array of strings, optional): Languages.

- **Booking Schema (`addBookingSchema`)**:
  - **Fields**:
    - `callID` (string, 24 characters, required): Call identifier.
    - `id` (string, 24 characters, required): Guide identifier.
    - `callDate` (string, required): Call date.

- **Worked Hours Schema (`addWorkedHoursSchema`)**:
  - **Fields**:
    - `callID` (string, 24 characters, required): Call identifier.
    - `id` (string, 24 characters, required): Guide identifier.
    - `hours` (string, one of HD, 2HD, FD, N/A, required): Type of worked hours.

#### Middleware

- **checkIfAdmin**
  - **Description**: Verifies if the user is an administrator.
  - **Check**: Analyzes the authorization token and confirms the user's role.

- **verifyToken**
  - **Description**: Verifies the user's token authenticity.
  - **Check**: Decodes JWT and compares the user's ID and role.

#### Database Models

**Guide Model:**

- **Fields**:
  - `firstName`: Guide's first name (string, required).
  - `lastName`: Guide's last name (string, required).
  - `residence`: Residence (string, required).
  - `phone`: Phone (string, optional).
  - `email`: Email (string, optional).
  - `languages`: Array of languages (string, default empty array).
  - `bookings`: Array of bookings:
    - `callId`: Call identifier.
    - `callDate`: Call date.
  - `workedHours`: Array of worked hours:
    - `callId`: Call identifier.
    - `hours`: Type of worked hours.

#### Security

- **Authentication**: User token validation via `verifyToken`.
- **Authorization**: Admin rights verification via `checkIfAdmin`.
- **Validation**: All input data is checked using Joi schemas in `celebrate`. 

### Users (Users)

The API supports managing users (Users), including creating, editing, logging in, resetting passwords, and assigning calls.

#### Routes

1. GET /users/get

- **Description**: Retrieve all users.
- **Method**: GET
- **Request**: No parameters.
- **Response**:
    - **Type**: JSON
    - **Format**:
```json
[
  {
    "_id": "<identifier>",
    "firstName": "<first name>",
    "lastName": "<last name>",
    "email": "<email>",
    "role": "<role>",
    "station": "<station>",
    "callsPermissons": [
      { "callID": "<call identifier>" }
    ]
  }
]
```

2. POST /user/login

- **Description**: User login.
- **Method**: POST
- **Middlewares**:
    - **celebrate**: Validates data using `userLoginSchema`.
- **Request Body**:
```json
{
  "email": "<email>",
  "password": "<password>"
}
```
- **Response**:
    - **Type**: JSON
    - **Format**:
```json
{
  "userData": {
    "id": "<identifier>",
    "role": "<role>",
    "user": "<name>",
    "access": ["<access rights>"]
  },
  "token": "<token>"
}
```

4. POST /user/add

- **Description**: Add a new user (available to administrators only).
- **Method**: POST
- **Middlewares**:
    - **checkIfAdmin**: Verifies if the user is an administrator.
    - **celebrate**: Validates data using `userValidationSchema`.
- **Request Body**:
```json
{
  "firstName": "<first name>",
  "lastName": "<last name>",
  "email": "<email>",
  "password": "<password>",
  "role": "<role>",
  "station": "<station>"
}
```
- **Response**:
    - **Type**: JSON
    - **Format**:
```json
{
  "_id": "<identifier>",
  "firstName": "<first name>",
  "lastName": "<last name>",
  "email": "<email>",
  "role": "<role>",
  "station": "<station>"
}
```

5. POST /users/send_reset_password_link

- **Description**: Send a reset password link.
- **Method**: POST
- **Request Body**:
```json
{
  "email": "<email>",
  "url": "<reset password URL>"
}
```
- **Response**:
    - **Type**: JSON
    - **Format**:
```json
{
  "message": "Reset link sent successfully."
}
```

6. POST /user/reset_password

- **Description**: Reset a user's password.
- **Method**: POST
- **Request Body**:
```json
{
  "token": "<token>",
  "password": "<new password>"
}
```
- **Response**:
    - **Type**: JSON
    - **Format**:
```json
{
  "message": "Password reset successfully."
}
```

7. PATCH /user/assign_call

- **Description**: Assign a call to a user to allow them to work with a specific call (adding guides, transport, etc.).
- **Method**: PATCH
- **Middlewares**:
    - **celebrate**: Validates data using `assignCallSchema`.
- **Request Body**:
```json
{
  "callId": "<call identifier>",
  "userId": "<user identifier>"
}
```
- **Response**:
    - **Type**: JSON
    - **Format**:
```json
{
  "matchedCount": <number of matches>,
  "modifiedCount": <number of modifications>
}
```

#### Validation

##### Validation Schemas

- **User Validation Schema (`userValidationSchema`)**:
  - **Fields**:
    - `firstName` (string, required): User's first name.
    - `lastName` (string, required): User's last name.
    - `email` (string, email, required): Email address.
    - `password` (string, required): Password.
    - `role` (string, required): User's role.
    - `station` (string, required): User's station.

- **Login Schema (`userLoginSchema`)**:
  - **Fields**:
    - `email` (string, email, required): Email address.
    - `password` (string, required): Password.

- **Assign Call Schema (`assignCallSchema`)**:
  - **Fields**:
    - `callId` (string, 24 characters, required): Call identifier.
    - `userId` (string, 24 characters, required): User identifier.

#### Middleware

- **checkIfAdmin**
  - **Description**: Verifies if the user is an administrator.
  - **Check**: Analyzes the authorization token and confirms the user's role.

- **verifyToken**
  - **Description**: Verifies the user's token authenticity.
  - **Check**: Decodes JWT and compares the user's ID and role.

#### Database Models

**User Model:**

- **Fields**:
  - `station`: Station (string, optional).
  - `firstName`: User's first name (string, required).
  - `lastName`: User's last name (string, required).
  - `email`: Email address (string, required).
  - `password`: Password (string, required).
  - `role`: User's role (string, required).
  - `callsPermissons`: List of calls assigned to the user:
    - `callID`: Call identifier.

#### Security

- **Authentication**: User token validation via `verifyToken`.
- **Authorization**: Admin rights verification via `checkIfAdmin`.
- **Validation**: All input data is checked using Joi schemas in `celebrate`. 

<br>

### Misc

The API supports managing various entities, including ports, companies, ships, languages, guide residences, and user roles.

#### Routes

1. **GET /ports/get**

   - **Description**: Retrieve a list of all ports.
   - **Method**: GET
   - **Request**:
     No parameters.
   - **Response**:

     **Type**: JSON

     **Format**:
     ```json
     [
       {
         "_id": "<identifier>",
         "name": "<port name>",
         "code": "<port code>"
       }
     ]
     ```

2. **POST /port/add**

   - **Description**: Add a new port (accessible only to administrators).
   - **Method**: POST
   - **Middlewares**:
     - `checkIfAdmin`: Verifies if the user is an administrator.
   - **Request Body**:
     ```json
     {
       "name": "<port name>",
       "code": "<port code>"
     }
     ```
   - **Response**:

     **Type**: JSON

     **Format**:
     ```json
     {
       "_id": "<identifier>",
       "name": "<port name>",
       "code": "<port code>"
     }
     ```

3. **GET /companies/get**

   - **Description**: Retrieve a list of all companies.
   - **Method**: GET
   - **Request**:
     No parameters.
   - **Response**:

     **Type**: JSON

     **Format**:
     ```json
     [
       {
         "_id": "<identifier>",
         "name": "<company name>"
       }
     ]
     ```

4. **POST /company/add**

   - **Description**: Add a new company (accessible only to administrators).
   - **Method**: POST
   - **Middlewares**:
     - `checkIfAdmin`: Verifies if the user is an administrator.
   - **Request Body**:
     ```json
     {
       "name": "<company name>"
     }
     ```
   - **Response**:

     **Type**: JSON

     **Format**:
     ```json
     {
       "_id": "<identifier>",
       "name": "<company name>"
     }
     ```

5. **GET /ships/get**

   - **Description**: Retrieve a list of all ships.
   - **Method**: GET
   - **Request**:
     No parameters.
   - **Response**:

     **Type**: JSON

     **Format**:
     ```json
     [
       {
         "_id": "<identifier>",
         "name": "<ship name>",
         "company": "<company name>",
         "code": "<ship code>"
       }
     ]
     ```

6. **POST /ship/add**

   - **Description**: Add a new ship (accessible only to administrators).
   - **Method**: POST
   - **Middlewares**:
     - `checkIfAdmin`: Verifies if the user is an administrator.
   - **Request Body**:
     ```json
     {
       "name": "<ship name>",
       "company": "<company name>",
       "code": "<ship code>"
     }
     ```
   - **Response**:

     **Type**: JSON

     **Format**:
     ```json
     {
       "_id": "<identifier>",
       "name": "<ship name>",
       "company": "<company name>",
       "code": "<ship code>"
     }
     ```

7. **GET /languages/get**

   - **Description**: Retrieve a list of all languages.
   - **Method**: GET
   - **Request**:
     No parameters.
   - **Response**:

     **Type**: JSON

     **Format**:
     ```json
     [
       {
         "_id": "<identifier>",
         "name": "<language name>"
       }
     ]
     ```

8. **POST /language/add**

   - **Description**: Add a new language (accessible only to administrators).
   - **Method**: POST
   - **Middlewares**:
     - `checkIfAdmin`: Verifies if the user is an administrator.
   - **Request Body**:
     ```json
     {
       "name": "<language name>"
     }
     ```
   - **Response**:

     **Type**: JSON

     **Format**:
     ```json
     {
       "_id": "<identifier>",
       "name": "<language name>"
     }
     ```

9. **GET /residences/get**

   - **Description**: Retrieve a list of all guide residences.
   - **Method**: GET
   - **Request**:
     No parameters.
   - **Response**:

     **Type**: JSON

     **Format**:
     ```json
     [
       {
         "_id": "<identifier>",
         "residenceTown": "<residence name>"
       }
     ]
     ```

10. **POST /residence/add**

    - **Description**: Add a new residence (accessible only to administrators).
    - **Method**: POST
    - **Middlewares**:
      - `checkIfAdmin`: Verifies if the user is an administrator.
    - **Request Body**:
      ```json
      {
        "name": "<residence name>"
      }
      ```
    - **Response**:

      **Type**: JSON

      **Format**:
      ```json
      {
        "_id": "<identifier>",
        "residenceTown": "<residence name>"
      }
      ```

11. **GET /roles/get**

    - **Description**: Retrieve a list of all roles.
    - **Method**: GET
    - **Request**:
      No parameters.
    - **Response**:

      **Type**: JSON

      **Format**:
      ```json
      [
        {
          "_id": "<identifier>",
          "name": "<role name>"
        }
      ]
      
#### Database Models

- **Port Model**:

  **Fields**:

  - `name`: Port name (string, required).
  - `code`: Port code (string, required, unique, max 3 characters).

<br>

- **Company Model**:

  **Fields**:

  - `name`: Company name (string, required).

<br>

- **Ship Model**:

  **Fields**:

  - `name`: Ship name (string, required).
  - `company`: Company name (string, required).
  - `code`: Ship code (string, required, unique, max 3 characters).

<br>

- **Language Model**:

  **Fields**:

  - `name`: Language name (string, required, exactly 3 characters).

<br>

- **GuidesResidence Model**:

  **Fields**:

  - `residenceTown`: Residence name (string, required).

<br>

- **Role Model**:

  **Fields**:

  - `name`: Role name (string, required).

<br>

#### Security

- **Authentication**: User token verification via `verifyToken`.
- **Authorization**: Admin rights verification via `checkIfAdmin`.
- **Validation**: All input data is validated through `celebrate`.

<br>

## 4. Request and Response Examples

### POST /user/reset_password

**Description**: Resets a user password.

**Request Example**:
```json
POST /user/reset_password
Content-Type: application/json
```
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNjE2MjM5MDIyfQ.s5c5M8_FoNz6Mv5XshQZ_gfn59RrnFNLtVXHfJhySYQ",
  "password": "new_secure_password123"
}
```

**Response Example**:

**Success**:
```json
201 Created
```
```json
{
  "message": "Password updated successfully",
  "_id": "64ac2fd83c2e1a11a4c6b9ed",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "role": "USER"
}
```

**Error**:
```json
400 Bad Request
```
```json
{
  "message": "Invalid token or user not found"
}
```

### GET /calls/get

**Description**: Retrieves a list of all calls with details.

**Request Example**:
```http
GET /calls/get
```

**Response Example**:

**Success**:
```json
200 OK
```
```json
[
  {
    "_id": "64ac2fd83c2e1a11a4c6b9ed",
    "date": "2025-01-10",
    "type": "SHX",
    "port": "Port of Miami",
    "company": "Maersk",
    "ship": "Evergreen",
    "arrival": "08:00",
    "departure": "18:00",
    "portCode": "MIA",
    "assignedUsers": [
      { "_id": "64ac3fd73a6d1b23b3e4b8df" },
      { "_id": "64ac4fd94c8f2c45a5e7b9cd" }
    ]
  }
]
```

**Error**:
```json
400 Bad Request
```
```json
{
  "errorMessage": "Database connection error"
}
```

### POST /guide/add/workedhours

**Description**: Adds or updates the worked hours of a guide.

**Request Example**:
```json
POST /guide/add/workedhours
Content-Type: application/json
```
```json
{
  "id": "64ac2fd83c2e1a11a4c6b9ed",
  "callID": "64ac4fd94c8f2c45a5e7b9cd",
  "hours": "4HD"
}
```

**Response Example**:

**Success**:
```json
201 Created
```
```json
{
  "matchedCount": 1,
  "modifiedCount": 1
}
```

**If record exists and updated**:
```json
201 Created
```
```json
{
  "_id": "64ac2fd83c2e1a11a4c6b9ed",
  "workedHours": [
    { "callId": "64ac4fd94c8f2c45a5e7b9cd", "hours": "4HD" }
  ]
}
```

**Error**:
```json
400 Bad Request
```
```json
{
  "errorMessage": "Guide not found"
}
