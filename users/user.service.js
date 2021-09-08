const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db/index.js');
const User = db.User;

module.exports = {
    authenticate,
    getById,
    create,
    update,
    delete: _delete,
    addNewNote, 
    deleteNote,
    updateNote, 
    archiveNote, 
    unarchiveNote, 
    getAllActiveNotes,
    getAllArchivedNotes
};

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
        return {
            ...user.toJSON(),
            token
        };
    }
}

async function getById(id) {
    return await User.findById(id);
}

async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}

async function addNewNote(userId,noteBody){
    
    const user=await User.findById(userId);
        // validate
        if (!user) {
            throw 'User does not exist with user id "' + userId;
        }
        else{
            user.activeNotes.push(noteBody);
        }
    
        // save user
        await user.save();
}
async function deleteNote(userId,noteId){
    const user=await User.findById(userId);
    // validate
    if (!user) {
        throw 'User does not exist with user id "' + userId;
    }
    else{
        user.activeNotes.id(noteId).remove();
    }

    // save user
    await user.save();
}
async function updateNote(userId, noteId, noteBody){
    const user =await User.findById(userId);
    //validate
    if(!user ){
        throw 'User does not exist with user id "' + userId;
    }
    else{
        const note= await user.activeNotes.id(noteId);
        if(!note){
            throw 'Note does not exist with note id "' + noteId;
        }
        Object.assign(note, noteBody);
    }
    //save user
    await user.save();
}
async function archiveNote(userId, noteId){
    const user =await User.findById(userId);
    //validate
    if(!user ){
        throw 'User does not exist with user id "' + userId;
    }
    else{
        const note= await user.activeNotes.id(noteId);
        if(!note){
            throw 'Note does not exist with note id "' + noteId;
        }
        user.archivedNotes.push(note);
        user.activeNotes.id(noteId).remove();
    }
    //save user
    await user.save();
}
async function unarchiveNote(userId, noteId){
    const user =await User.findById(userId);
    //validate
    if(!user ){
        throw 'User does not exist with user id "' + userId;
    }
    else{
        const note= await user.archivedNotes.id(noteId);
        if(!note){
            throw 'Note does not exist with note id "' + noteId;
        }
        user.activeNotes.push(note);
        user.archivedNotes.id(noteId).remove();
    }
    //save user
    await user.save();
}
async function getAllActiveNotes(userId){
    const user =await User.findById(userId);
    if(!user ){
        throw 'User does not exist with user id "' + userId;
    }
    else{
        return user.activeNotes;
    }
    
}
async function getAllArchivedNotes(userId){
    const user =await User.findById(userId);
    //validate
    if(!user ){
        throw 'User does not exist with user id "' + userId;
    }
    else{
        return user.archivedNotes;
    }
    
}