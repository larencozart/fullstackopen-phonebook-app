const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', true);
mongoose.connect(url)
        .then(result => {
          console.log('connected to MongoDB')
        })
        .catch(error => {
          console.log('error connecting to MongoDB:', error.message)
        });


const ContactSchema = new mongoose.Schema({
  name: String,
  number: String
});

ContactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

module.exports = mongoose.model('Contact', ContactSchema);