

# API Documentation

## Overview
This document provides guidelines for frontend developers to interact with the API, detailing authentication, endpoint usage, request/response formats, and best practices.

## Authentication
All API endpoints require authentication. The authentication process uses JWT (JSON Web Tokens).

### How to Authenticate
1. **Obtain a Token:**
   - Send a POST request to the `/auth/login` endpoint with valid user credentials.
   - Example request:
     ```json
     POST /auth/login
     {
       "email": "user@example.com",
       "password": "password123"
     }
     ```
   - Example response:
     ```json
     {
       "token": "your-jwt-token"
     }
     ```

2. **Use the Token:**
   - Include the token in the `Authorization` header of your requests.
   - Example:
     ```
     Authorization: Bearer your-jwt-token
     ```

## Endpoint Usage

### Base URL
All endpoints are relative to the base URL:
```
https://api.example.com/v1
```

### Endpoints

1. **Get User Information**
   - **Endpoint:** `/users/me`
   - **Method:** GET
   - **Description:** Retrieves information about the authenticated user.
   - **Request Example:**
     ```
     GET /users/me
     Authorization: Bearer your-jwt-token
     ```
   - **Response Example:**
     ```json
     {
       "id": "12345",
       "name": "John Doe",
       "email": "john.doe@example.com"
     }
     ```

2. **Update User Profile**
   - **Endpoint:** `/users/me`
   - **Method:** PUT
   - **Description:** Updates the authenticated user's profile.
   - **Request Example:**
     ```json
     PUT /users/me
     Authorization: Bearer your-jwt-token
     {
       "name": "Jane Doe",
       "email": "jane.doe@example.com"
     }
     ```
   - **Response Example:**
     ```json
     {
       "id": "12345",
       "name": "Jane Doe",
       "email": "jane.doe@example.com"
     }
     ```

3. **Get List of Items**
   - **Endpoint:** `/items`
   - **Method:** GET
   - **Description:** Retrieves a list of items.
   - **Request Example:**
     ```
     GET /items
     Authorization: Bearer your-jwt-token
     ```
   - **Response Example:**
     ```json
     [
       {
         "id": "1",
         "name": "Item 1",
         "description": "Description for Item 1"
       },
       {
         "id": "2",
         "name": "Item 2",
         "description": "Description for Item 2"
       }
     ]
     ```

4. **Create a New Item**
   - **Endpoint:** `/items`
   - **Method:** POST
   - **Description:** Creates a new item.
   - **Request Example:**
     ```json
     POST /items
     Authorization: Bearer your-jwt-token
     {
       "name": "New Item",
       "description": "Description for the new item"
     }
     ```
   - **Response Example:**
     ```json
     {
       "id": "3",
       "name": "New Item",
       "description": "Description for the new item"
     }
     ```

## Request/Response Formats
- All requests should be in JSON format.
- Ensure to set the `Content-Type` header to `application/json` for POST and PUT requests.
- Responses will be in JSON format.

### Common Response Codes
- `200 OK`: The request was successful.
- `201 Created`: The resource was successfully created.
- `400 Bad Request`: The request was invalid or cannot be otherwise served.
- `401 Unauthorized`: Authentication failed or user does not have permissions for the desired action.
- `404 Not Found`: The requested resource could not be found.
- `500 Internal Server Error`: An error occurred on the server.

## Best Practices
1. **Error Handling:**
   - Always check for and handle error responses appropriately in your application.

2. **Secure Storage:**
   - Store JWT tokens securely, e.g., in HttpOnly cookies or secure storage mechanisms.

3. **Limit Data Exposure:**
   - Only request the data you need and ensure sensitive information is handled properly.

4. **Rate Limiting:**
   - Be mindful of rate limits to avoid throttling.

5. **Consistent Naming:**
   - Follow consistent naming conventions for your request payloads and parameters.

