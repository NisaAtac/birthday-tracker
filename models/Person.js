// mongoose model
const mongoose = require('mongoose');
// create a Schema
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    birthday: {
        type: Date, //change this to type of date
        min: new Date('1910-01-01'),
        max: Date.now(),
        required: true
    }
});

module.exports = mongoose.model("Person", personSchema); // to create model for the Schema
// Now `require('Person.js')` will return a mongoose Model,
// without needing to do require('Person.js').Person
