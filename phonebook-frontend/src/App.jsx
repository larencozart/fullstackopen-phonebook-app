import { useEffect, useState } from 'react'
import phonebookService from './services/phonebook'
// import contact from '../../phonebook-backend/models/contact'

const DeleteButton = ({ handleDelete }) => {
  return (
    <>
      <button onClick={handleDelete}>delete</button>
    </>
  )
}

const Contact = ({ contact, handleDelete }) => {
  return (
    <>
      <p>{contact.name} {contact.number}</p>
      <DeleteButton handleDelete={handleDelete} />
    </>
  )
}

const App = () => {
  const [contacts, setContacts] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')

  useEffect(() => {
    phonebookService
      .getContacts()
      .then(response => {
        setContacts(response.data);
      })
      .catch(error => console.error(error.message))
  }, [])

  const handleNewName = (e) => {
    setNewName(e.target.value)
  }

  const handleNewNum = (e) => {
    setNewNum(e.target.value)
  }

  // ATTEMPT at at exercise 2.15
  // const updateContact = (id, newContact) => {
  //   const message = `${newContact.name} is already added to your phonebook. 
  //   Do you want to replace the old number with a new one?`;

  //   if (confirm(message)) {
  //     phonebookService
  //       .updateContact(id, newContact)
  //       .then(response => {
  //         const updatedContact = response.data;
  //         let updatedContacts = contacts.map(contact => {
  //           if (contact.id === id) return updatedContact;
  //           else return contact;
  //         })

  //         setContacts(updatedContacts)
  //         setNewName('')
  //         setNewNum('')
  //       })
  //       .catch(() => {
  //         console.error(`Contact '${contact.name}' was already removed from server`)
  //         setNotes(notes.filter(n => n.id !== id))
  //       })
  //   } else {
  //     return
  //   }
  // }

  const addContact = (e) => {
    e.preventDefault()

    const newContact = { name: newName, number: newNum}
    const allNames = contacts.map(contact => contact.name.toLowerCase())

    if (allNames.includes(newName.toLowerCase())) {
      alert(`${newName} is already added to the phonebook`)
      return

      //ATTEMPT at exercise 2.15
      // // find the id
      // const id = contacts.find(c => c.name.toLowerCase() === newName.toLowerCase()).id;
      // console.log("checking my find ID code logic in addContact function App.jsx:", id);
      // updateContact(id, newContact)
    }

    
    phonebookService
      .createContact(newContact)
      .then(response => setContacts(contacts.concat(response.data)))
    
    setContacts(contacts.concat(newContact))
    setNewName('')
    setNewNum('')
  }

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      phonebookService
      .deleteContact(id)
      .then(() => setContacts(contacts.filter(c => c.id !== id)))
      .catch(() => alert("Could not find that contact to delete"))
    } else {
      return
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addContact}>
        <div>
          name: <input onChange={handleNewName}
                       placeholder="Add a name here!"
                       value={newName}
                />
        </div>
        <div>
          number: <input onChange={handleNewNum}
                         placeholder='Add a number here!'
                         value={newNum}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {contacts.map(contact => <Contact key={contact.name} contact={contact} handleDelete={() => handleDelete(contact.id)}/>)}
    </div>
  )
}

export default App