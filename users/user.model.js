const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema= new Schema({
    title:{type: String, unique: false},
    body: {type: String, unique: false}
});

const schema = new Schema({
    username: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    activeNotes:[noteSchema], 
    archivedNotes:[noteSchema]
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('User', schema);