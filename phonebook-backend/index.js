const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
require('dotenv').config();
const Contact = require("./models/contact");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('dist'));
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

let contacts = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const findContact = (id) => contacts.find(c => c.id === id);

const nextId = () => {
  const maxId = contacts.length > 0 ? Math.max(...contacts.map(n => Number(n.id))) : 0;
  return String(maxId + 1);
}

const isUniqueName = (name) => {
  const allNames = contacts.map(c => c.name.toLowerCase());
  return !allNames.includes(name.toLowerCase());
}

app.get("/api/phonebook", (req, res) => {
  Contact.find({})
         .then(contacts => res.json(contacts));
});

app.get("/info", (req, res) => {
  const time = new Date();
  res.send(`<p>Phonebook has info for ${contacts.length} people</p>
            <p>${time.toString()}</p>`);
})

app.get("/api/phonebook/:id", (req, res) => {
  Contact.findById(req.params.id)
         .then(contact => res.json(contact))
         .catch(error => {
            alert("No contact was found to delete");
            res.status(404).end();
         });
})

app.delete("/api/phonebook/:id", (req, res) => {
  const id = req.params.id;
  const contact = findContact(id);

  if (contact) {
    contacts = contacts.filter(c => c.id !== id);
    res.status(204).end();
  } else {
    alert("No contact was found to delete");
    res.status(404).end();
  }
})

app.post("/api/phonebook", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ "error": "content missing" });
  } else if (!isUniqueName(body.name)) {
    return res.status(400).json({ error: "name must be unique" });
  }

  const newContact = Contact({
    id: nextId(),
    name: body.name,
    number: body.number
  });

  newContact.save()
            .then(savedContact => res.json(savedContact));
})


app.use((req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})