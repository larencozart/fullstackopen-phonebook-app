const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

// SET UP CONNECTION
// const password = encodeURIComponent('03ErtyNlGkjAAqZn');
const password = encodeURIComponent(process.argv[2]);
const url = `mongodb+srv://larencozart:${password}@cluster0.a3rt1.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);
mongoose.connect(url);


// SET UP SCHEMA + MODEL
const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model('Contact', phonebookSchema);


// EXECUTE ADD CONTACTS OR GET ALL CONTACTS
if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const contact = new Contact({ name, number });
  contact.save()
         .then(() => {
          console.log(`added ${name} number ${number} to phonebook`);
          mongoose.connection.close();
         });
} else {
  Contact.find({}).then(result => {
    console.log("phonebook");
    result.forEach(note => {
      console.log(`${note.name} ${note.number}`);
      // phonebook:
      // Anna 040-1234556
      // Arto Vihavainen 045-1232456
      // Ada Lovelace 040-1231236
    })
    mongoose.connection.close()
  });
}