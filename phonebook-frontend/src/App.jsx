import { useEffect, useState } from 'react'
import phonebookService from './services/phonebook'

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
        console.log(response);
        setContacts(response.data);
      })
  }, [])

  const handleNewName = (e) => {
    setNewName(e.target.value)
  }

  const handleNewNum = (e) => {
    setNewNum(e.target.value)
  }

  const addContact = (e) => {
    e.preventDefault()

    const allNames = contacts.map(contact => contact.name)
    if (allNames.includes(newName)) {
      alert(`${newName} is already added to the phonebook`)
      return
    }

    const newContact = { name: newName, number: newNum}
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

  console.log("contacts: ", contacts)
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