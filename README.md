# notes-app with user authenitcation

NodeJS + MongoDB API app for multi-user environment to store and manage notes. 
The application implements the following REST API endpoints:

## API's
When required the request body format is specified. All the API calls return the appropriate status codes. 


### POST

#### Register a new user

http://localhost:4000/users/register

```properties
req.body:
{
    "firstName": "",
    "lastName": "",
    "username": "",
    "password": ""
}
```
#### Authenticate a new user

http://localhost:4000/users/authenticate

```properties
req.body:
{
  "username": "",
  "password": ""
}
res.body:
{
  "firstName": "",
  "lastName": "",
  "username": "",
  "createdDate": "",
  "activeNotes": [],
  "archivedNotes": [],
  "id": "",
  "token": ""
}
```

### GET 
#### Get currently logged in user (requires JWT BEARER TOKEN from authentication)
http://localhost:4000/users/current

```properties
res.body:
{
  "firstName": "",
  "lastName": "",
  "username": "",
  "createdDate": "",
  "activeNotes": [],
  "archivedNotes": [],
  "id": ""
}
```

#### Get user by id (requires JWT BEARER TOKEN from authentication)
http://localhost:4000/users/:userId

```properties
res.body:
{
  "firstName": "",
  "lastName": "",
  "username": "",
  "createdDate": "",
  "activeNotes": [],
  "archivedNotes": [],
  "id": ""
}
```
#### Get all active notes by userId (requires JWT BEARER TOKEN from authentication)
http://localhost:4000/users/activeNotes/:userId
```properties
res.body:
[
  {
    "_id": "",
    "title": "",
    "body": ""
  }
  ...
]
```

#### Get all archived notes by userId (requires JWT BEARER TOKEN from authentication)
http://localhost:4000/users/archivedNotes/:userId

```properties
res.body:
[
  {
    "_id": "",
    "title": "",
    "body": ""
  }
  ...
]
```

### PUT
#### Update current user via userId (requires JWT BEARER TOKEN from authentication)
http://localhost:4000/users/:userId

```properties
req.body
{
    "firstName": "",
    "lastName": "",
    "username": "",
    "password": ""
}

```

#### Add new note to current user via userId (requires JWT BEARER TOKEN from authentication)
http://localhost:4000/users/addNewNote/:userId

```properties
req.body
{
	"title": "",
	"body": ""
}
```

#### Delete note from current user via userId and noteId(requires JWT BEARER TOKEN from authentication)
http://localhost:4000/users/deleteNote/:userId/:noteId

#### Update note for current user via userId and noteId (requires JWT BEARER TOKEN from authentication)
http://localhost:4000/users/updateNote/:userId/:noteId

```properties
req.body
{
	"title": "",
	"body": ""
}
```
#### Archive note for current user via userId and noteId (requires JWT BEARER TOKEN from authentication)
http://localhost:4000/users/archiveNote/:userId/:noteId

#### Unarchive not for current user via userId and noteId (requires JWT BEARER TOKEN from authentication)
http://localhost:4000/users/unarchiveNote/:userId/:noteId

### DELETE
#### Delete user via userId (requires JWT BEARER TOKEN from authentication)
http://localhost:4000/users/:userId

## Requirements and how to run the application 
### Requirements: 
 
* [Express](http://expressjs.com/) For RESTful API
* [MongoDD](https://www.mongodb.com/) For database.
* [Node.js](https://nodejs.org/en/) 6+
### To run the application and test with Postman or Insomnia: 
Install dependencies:
```properties
npm install
```
Ensure mongodb database called "notes-app" is created locally. 

Run the application:
```properties
npm start
```
Run tests:
```properties
npm run test
```



