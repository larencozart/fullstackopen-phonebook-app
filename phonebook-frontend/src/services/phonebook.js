import axios from 'axios'

const baseUrl = "/api/phonebook"

const getContacts = () => {
  return axios.get(baseUrl);
}

const createContact = newContact => {
  return axios.post(baseUrl, newContact);
}

const deleteContact = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
} 

export default { getContacts, createContact, deleteContact}