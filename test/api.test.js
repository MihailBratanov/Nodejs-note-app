const app = require("../app");
const mongoose = require("mongoose");
const supertest = require("supertest");
const User =require('../users/user.model');
const config = require('../config.json');

//clear db before each test 
beforeEach((done) => {
  mongoose.connect(config.connectionString,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done());
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done())
  });
});
/**
 * POST test for registering a new user
 */
test("POST /users/register", async () => {
    const data = { 
        firstName: "Test",
        lastName: "User",
        username: "tester",
        password: "my-super-secret-password"
    };
  
    await supertest(app).post("/users/register")
      .send(data)
      .expect(200)
  });
  test("POST /users/authenticate", async () => {
    const data = { 
        firstName: "Test",
        lastName: "User",
        username: "tester",
        password: "my-super-secret-password"
    };
  
    await supertest(app).post("/users/register")
      .send(data)
      .expect(200)

    const newdata = { 
        username: "tester",
        password: "my-super-secret-password"
    };
    
    await supertest(app).post("/users/authenticate")
      .send(newdata)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.username).toBe("tester");
        
      });


  });

  /**
   * GET test for getting current user via Bearer token
   */
  test("GET /users/current", async () => {
    const data = { 
        firstName: "Test",
        lastName: "User",
        username: "tester",
        password: "my-super-secret-password"
    };
  
    await supertest(app).post("/users/register")
      .send(data)
      .expect(200)

    const newdata = { 
        username: "tester",
        password: "my-super-secret-password"
    };
    let token;
    await supertest(app).post("/users/authenticate")
      .send(newdata)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.username).toBe("tester");
        token = response.body.token;
        

      });
      await supertest(app).get("/users/current")
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.username).toBe("tester");
        

      });
      
  });
  
  /**
   * GET test for getting user by id
   */
  test("GET /users/:userId", async () => {
    //first add user
  const data = { 
      firstName: "Test",
      lastName: "User",
      username: "tester",
      password: "my-super-secret-password"
  };

  await supertest(app).post("/users/register")
    .send(data)
    .expect(200)

  const newdata = { 
      username: "tester",
      password: "my-super-secret-password"
  };
  //now authenticate the new user
  let token;
  let userId;
  await supertest(app).post("/users/authenticate")
    .send(newdata)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(async (response) => {
      // Check the response
      expect(response.body.username).toBe("tester");
      token = response.body.token;
      userId=response.body.id;

    });
    //now add a new note to the user
    const note={
      title: "new note",
      body: "new body"
    }
    await supertest(app).put("/users/addNewNote/" + userId)
    .send(note)
    .set('Authorization', 'Bearer ' + token)
    .expect(200)

    //get user by the userId

  
  await supertest(app).get("/users/" + userId)
  .set('Authorization', 'Bearer ' + token)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .then(async (response) => {
    // Check the response
    //console.log(response.body)
    expect(response.body.firstName).toBe(data.firstName);
    expect(response.body.lastName).toBe(data.lastName);
    expect(response.body.username).toBe(data.username);
    
  });
    
});

/**
 * PUT update test for updating a user by id 
 */
test("PUT /users/:userId", async () => {
  //first add user
const data = { 
    firstName: "Test",
    lastName: "User",
    username: "tester",
    password: "my-super-secret-password"
};

await supertest(app).post("/users/register")
  .send(data)
  .expect(200)

const newdata = { 
    username: "tester",
    password: "my-super-secret-password"
};
//now authenticate the new user
let token;
let userId;
await supertest(app).post("/users/authenticate")
  .send(newdata)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .then(async (response) => {
    // Check the response
    expect(response.body.username).toBe("tester");
    token = response.body.token;
    userId=response.body.id;

  });
  const updatedUser ={
    firstName: "Test-new",
    lastName: "User-new",
    username: "tester-new",
  }
  //update user and ensure it gets updated

  await supertest(app).put("/users/" + userId)
  .send(updatedUser)
  .set('Authorization', 'Bearer ' + token)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  
await supertest(app).get("/users/" + userId)
.set('Authorization', 'Bearer ' + token)
.set('Accept', 'application/json')
.expect('Content-Type', /json/)
.expect(200)
.then(async (response) => {
  // Check the response
  expect(response.body.firstName).toBe(updatedUser.firstName);
  expect(response.body.lastName).toBe(updatedUser.lastName);
  expect(response.body.username).toBe(updatedUser.username);
  
});
  
});
/**
 * DELETE test for deleting user via id
 */
test("DELETE /users/:userId", async () => {
  //first add user
const data = { 
    firstName: "Test",
    lastName: "User",
    username: "tester",
    password: "my-super-secret-password"
};

await supertest(app).post("/users/register")
  .send(data)
  .expect(200)

const newdata = { 
    username: "tester",
    password: "my-super-secret-password"
};
//now authenticate the new user
let token;
let userId;
await supertest(app).post("/users/authenticate")
  .send(newdata)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .then(async (response) => {
    // Check the response
    expect(response.body.username).toBe("tester");
    token = response.body.token;
    userId=response.body.id;

  });
  
  //delete user by the userId


await supertest(app).delete("/users/" + userId)
.set('Authorization', 'Bearer ' + token)
.set('Accept', 'application/json')
.expect('Content-Type', /json/)
.expect(200)

  
});

/**
 * PUT test for inserting new note
 */
  test("Put /users/addNewNote/:userId", async () => {
      //first add user
    const data = { 
        firstName: "Test",
        lastName: "User",
        username: "tester",
        password: "my-super-secret-password"
    };
  
    await supertest(app).post("/users/register")
      .send(data)
      .expect(200)

    const newdata = { 
        username: "tester",
        password: "my-super-secret-password"
    };
    //now authenticate the new user
    let token;
    let userId;
    await supertest(app).post("/users/authenticate")
      .send(newdata)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.username).toBe("tester");
        token = response.body.token;
        userId=response.body.id;

      });
      //now add a new note to the user
      const note={
        title: "new note",
        body: "new body"
      }
      await supertest(app).put("/users/addNewNote/" + userId)
      .send(note)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)

      
  });
  /**
   * PUT test for deleting note
   */
  test("Put /users/deleteNote/:userId/:noteId", async () => {
    //first add user
  const data = { 
      firstName: "Test",
      lastName: "User",
      username: "tester",
      password: "my-super-secret-password"
  };

  await supertest(app).post("/users/register")
    .send(data)
    .expect(200)

  const newdata = { 
      username: "tester",
      password: "my-super-secret-password"
  };
  //now authenticate the new user
  let token;
  let userId;
  await supertest(app).post("/users/authenticate")
    .send(newdata)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(async (response) => {
      // Check the response
      expect(response.body.username).toBe("tester");
      token = response.body.token;
      userId=response.body.id;

    });
    //now add a new note to the user
    const note={
      title: "new note",
      body: "new body"
    }
    await supertest(app).put("/users/addNewNote/" + userId)
    .send(note)
    .set('Authorization', 'Bearer ' + token)
    .expect(200)

    
    //get user to retrieve new note id
    let noteId;
    await supertest(app).get("/users/current")
    .set('Authorization', 'Bearer ' + token)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(async (response) => {
      // Check the response
      expect(response.body.username).toBe("tester");
      noteId = response.body.activeNotes[0]._id;
      
    });
    //delete note
    await supertest(app).put("/users/deleteNote/" + userId+"/"+noteId)
    .set('Authorization', 'Bearer ' + token)
    .set('Accept', 'application/json')
    .expect(200)
});
/**
 * PYT test for updating a note
 */
test("Put /users/updateNote/:userId/:noteId", async () => {
  //first add user
const data = { 
    firstName: "Test",
    lastName: "User",
    username: "tester",
    password: "my-super-secret-password"
};

await supertest(app).post("/users/register")
  .send(data)
  .expect(200)

const newdata = { 
    username: "tester",
    password: "my-super-secret-password"
};
//now authenticate the new user
let token;
let userId;
await supertest(app).post("/users/authenticate")
  .send(newdata)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .then(async (response) => {
    // Check the response
    expect(response.body.username).toBe("tester");
    token = response.body.token;
    userId=response.body.id;

  });
  //now add a new note to the user
  const note={
    title: "new note",
    body: "new body"
  }
  await supertest(app).put("/users/addNewNote/" + userId)
  .send(note)
  .set('Authorization', 'Bearer ' + token)
  .expect(200)

  
  //get user to retrieve new note id
  let noteId;
  await supertest(app).get("/users/current")
  .set('Authorization', 'Bearer ' + token)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .then(async (response) => {
    // Check the response
    expect(response.body.username).toBe("tester");
    noteId = response.body.activeNotes[0]._id;
    
  });
  //update note
  const newNoteBody={
    title: "newwest title for first note",
    body: "Now updated body of the first note"
  }
  await supertest(app).put("/users/updateNote/" + userId+"/"+noteId)
  .send(newNoteBody)
  .set('Authorization', 'Bearer ' + token)
  .expect(200)

  //retrieve note again and check if change occured
  await supertest(app).get("/users/current")
  .set('Authorization', 'Bearer ' + token)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .then(async (response) => {
    // Check the response
    expect(response.body.username).toBe("tester");
    expect(response.body.activeNotes[0].title).toBe("newwest title for first note");
    expect(response.body.activeNotes[0].body).toBe("Now updated body of the first note");
  });

});

/**
 *PUT test for archiving a note 
 */
test("Put /users/archiveNote/:userId/:noteId", async () => {
  //first add user
const data = { 
    firstName: "Test",
    lastName: "User",
    username: "tester",
    password: "my-super-secret-password"
};

await supertest(app).post("/users/register")
  .send(data)
  .expect(200)

const newdata = { 
    username: "tester",
    password: "my-super-secret-password"
};
//now authenticate the new user
let token;
let userId;
await supertest(app).post("/users/authenticate")
  .send(newdata)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .then(async (response) => {
    // Check the response
    expect(response.body.username).toBe("tester");
    token = response.body.token;
    userId=response.body.id;

  });
  //now add a new note to the user
  const note={
    title: "new note",
    body: "new body"
  }
  await supertest(app).put("/users/addNewNote/" + userId)
  .send(note)
  .set('Authorization', 'Bearer ' + token)
  .expect(200)

  
  //get user to retrieve new note id
  let noteId;
  await supertest(app).get("/users/current")
  .set('Authorization', 'Bearer ' + token)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .then(async (response) => {
    // Check the response
    expect(response.body.username).toBe("tester");
    noteId = response.body.activeNotes[0]._id;
    
  });
  //archive note

  await supertest(app).put("/users/archiveNote/" + userId+"/"+noteId)
  .set('Authorization', 'Bearer ' + token)
  .expect(200)

  //retrieve note again and check if it got archived
  await supertest(app).get("/users/current")
  .set('Authorization', 'Bearer ' + token)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .then(async (response) => {
    // Check the response
    expect(response.body.username).toBe("tester");
    expect(response.body.archivedNotes[0].title).toBe(note.title);
    expect(response.body.archivedNotes[0].body).toBe(note.body);
  });

});
/**
 * Put test for unarchiving a note
 */
test("Put /users/unarchiveNote/:userId/:noteId", async () => {
  //first add user
const data = { 
    firstName: "Test",
    lastName: "User",
    username: "tester",
    password: "my-super-secret-password"
};

await supertest(app).post("/users/register")
  .send(data)
  .expect(200)

const newdata = { 
    username: "tester",
    password: "my-super-secret-password"
};
//now authenticate the new user
let token;
let userId;
await supertest(app).post("/users/authenticate")
  .send(newdata)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .then(async (response) => {
    // Check the response
    expect(response.body.username).toBe("tester");
    token = response.body.token;
    userId=response.body.id;

  });
  //now add a new note to the user
  const note={
    title: "new note",
    body: "new body"
  }
  await supertest(app).put("/users/addNewNote/" + userId)
  .send(note)
  .set('Authorization', 'Bearer ' + token)
  .expect(200)

  
  //get user to retrieve new note id
  let noteId;
  await supertest(app).get("/users/current")
  .set('Authorization', 'Bearer ' + token)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .then(async (response) => {
    // Check the response
    expect(response.body.username).toBe("tester");
    noteId = response.body.activeNotes[0]._id;
    
  });
  //archive note

  await supertest(app).put("/users/archiveNote/" + userId+"/"+noteId)
  .set('Authorization', 'Bearer ' + token)
  .expect(200)

  //retrieve note again and check if it got archived
  await supertest(app).get("/users/current")
  .set('Authorization', 'Bearer ' + token)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .then(async (response) => {
    // Check the response
    expect(response.body.username).toBe("tester");
    expect(response.body.archivedNotes[0].title).toBe(note.title);
    expect(response.body.archivedNotes[0].body).toBe(note.body);
  });
  //unarchive note
  await supertest(app).put("/users/unarchiveNote/" + userId+"/"+noteId)
  .set('Authorization', 'Bearer ' + token)
  .expect(200)

  //retrieve note again and check if it got unarchived
  await supertest(app).get("/users/current")
  .set('Authorization', 'Bearer ' + token)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .then(async (response) => {
    // Check the response
    expect(response.body.username).toBe("tester");
    expect(response.body.activeNotes[0].title).toBe(note.title);
    expect(response.body.activeNotes[0].body).toBe(note.body);
  });
});

/**
 * GET test for getting all active notes via userId
 */
test("GET /users/activeNotes/:userId", async () => {
  //first add user
const data = { 
    firstName: "Test",
    lastName: "User",
    username: "tester",
    password: "my-super-secret-password"
};

await supertest(app).post("/users/register")
  .send(data)
  .expect(200)

const newdata = { 
    username: "tester",
    password: "my-super-secret-password"
};
//now authenticate the new user
let token;
let userId;
await supertest(app).post("/users/authenticate")
  .send(newdata)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .then(async (response) => {
    // Check the response
    expect(response.body.username).toBe("tester");
    token = response.body.token;
    userId=response.body.id;

  });
  //now add new notes to the user
  const note1={
    title: "new note",
    body: "new body"
  }
  const note2={
    title: "second note title", 
    body: "second note body"
  }
  await supertest(app).put("/users/addNewNote/" + userId)
  .send(note1)
  .set('Authorization', 'Bearer ' + token)
  .expect(200)
  await supertest(app).put("/users/addNewNote/" + userId)
  .send(note2)
  .set('Authorization', 'Bearer ' + token)
  .expect(200)
  
  //get all active notes 
  
  await supertest(app).get("/users/activeNotes/" + userId)
  .set('Authorization', 'Bearer ' + token)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .then(async (response) => {
    // Check the responsе
    expect(response.body[0].title).toBe(note1.title);
    expect(response.body[0].body).toBe(note1.body);
    expect(response.body[1].title).toBe(note2.title);
    expect(response.body[1].body).toBe(note2.body);
  });
  
});

/**
 * GET test for getting all archived notes via userId
 */
test("GET /users/archivedNotes/:userId", async () => {
  //first add user
const data = { 
    firstName: "Test",
    lastName: "User",
    username: "tester",
    password: "my-super-secret-password"
};

await supertest(app).post("/users/register")
  .send(data)
  .expect(200)

const newdata = { 
    username: "tester",
    password: "my-super-secret-password"
};
//now authenticate the new user
let token;
let userId;
await supertest(app).post("/users/authenticate")
  .send(newdata)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .then(async (response) => {
    // Check the response
    expect(response.body.username).toBe("tester");
    token = response.body.token;
    userId=response.body.id;

  });
  //now add new notes to the user
  const note1={
    title: "new note",
    body: "new body"
  }
  const note2={
    title: "second note title", 
    body: "second note body"
  }
  await supertest(app).put("/users/addNewNote/" + userId)
  .send(note1)
  .set('Authorization', 'Bearer ' + token)
  .expect(200)
  await supertest(app).put("/users/addNewNote/" + userId)
  .send(note2)
  .set('Authorization', 'Bearer ' + token)
  .expect(200)
  //archive the notes
  
  //retrieve the active notes and save their ids:
  let noteId1, noteId2;
  await supertest(app).get("/users/activeNotes/" + userId)
  .set('Authorization', 'Bearer ' + token)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .then(async (response) => {
    // Check the response
    noteId1=response.body[0]._id;
    noteId2=response.body[1]._id;
  });



  await supertest(app).put("/users/archiveNote/" + userId+"/"+noteId1)
  .set('Authorization', 'Bearer ' + token)
  .expect(200)
  await supertest(app).put("/users/archiveNote/" + userId+"/"+noteId2)
  .set('Authorization', 'Bearer ' + token)
  .expect(200)
  //get all archived notes 
  
  await supertest(app).get("/users/archivedNotes/" + userId)
  .set('Authorization', 'Bearer ' + token)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .then(async (response) => {
    // Check the response
    expect(response.body[0].title).toBe(note1.title);
    expect(response.body[0].body).toBe(note1.body);
    expect(response.body[1].title).toBe(note2.title);
    expect(response.body[1].body).toBe(note2.body);
  });
  
});