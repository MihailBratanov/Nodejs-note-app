const express = require('express');
const router = express.Router();
const userService = require('./user.service');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);

//all the following routes require jwt bearer token authentication:
router.get('/current', getCurrent);
router.get('/:userId', getById);
router.get('/activeNotes/:userId', getAllActiveNotes);
router.get('/archivedNotes/:userId', getAllArchivedNotes);

router.put('/:userId', update);
router.put('/addNewNote/:userId', addNewNote);
router.put('/deleteNote/:userId/:noteId', deleteNote);
router.put('/updateNote/:userId/:noteId', updateNote);
router.put('/archiveNote/:userId/:noteId', archiveNote);
router.put('/unarchiveNote/:userId/:noteId', unarchiveNote);

router.delete('/:userId', _delete);


module.exports = router;

/**
 * Authenticates a user 
 */
function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}
/**
 * Registers a new user
 */
function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

/**
 * Gets current user 
 */
function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}
/**
 * Gets user by Id
 */
function getById(req, res, next) {
    userService.getById(req.params.userId)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}
/**
 * Updates user
 */
function update(req, res, next) {
    userService.update(req.params.userId, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

/**
 * Deletes user from db
 */
function _delete(req, res, next) {
    userService.delete(req.params.userId)
        .then(() => res.json({}))
        .catch(err => next(err));
}
/**
 * Adds new note
 */
function addNewNote(req, res, next){
    userService.addNewNote(req.params.userId, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
    
}
/**
 * Deletes note 
 */
function deleteNote(req, res, next){
    userService.deleteNote(req.params.userId, req.params.noteId)
        .then(()=>res.json({}))
        .catch(err => next(err));
}
/**
 * Updates note
 */
function updateNote(req, res, next){
    userService.updateNote(req.params.userId, req.params.noteId, req.body)
    .then(() => res.json({}))
    .catch(err => next(err));
}
/**
 * Archives note
 */
function archiveNote(req, res, next){
    userService.archiveNote(req.params.userId, req.params.noteId)
    .then(() => res.json({}))
    .catch(err => next(err));
}
/**
 * Unarchives note
 */
function unarchiveNote(req, res, next){
    userService.unarchiveNote(req.params.userId, req.params.noteId)
    .then(() => res.json({}))
    .catch(err => next(err));
}
/**
 * Gets all active notes
 */
function getAllActiveNotes(req, res, next){
    userService.getAllActiveNotes(req.params.userId)
    .then(notes => res.json(notes))
    .catch(err => next(err));
}
/**
 * Gets all archived notes
 */
function getAllArchivedNotes(req, res, next){
    userService.getAllArchivedNotes(req.params.userId)
    .then(notes => res.json(notes))
    .catch(err => next(err));
}