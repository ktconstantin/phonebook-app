import React, { useState, useEffect } from 'react'
import PersonList from './PersonList'
import AddPersonForm from './AddPersonForm'
import SearchFilter from './SearchFilter'
import personService from '../services/persons'
import Notification from './Notification'
import '../css/app.css'

export default function App() {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [notificationType, setNotificationType] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
        displayNotification(
          'success', 
          'successfully loaded phonebook from server', 
          initialPersons
        )
      })
      .catch(error => {
        displayNotification(
          'error',
          'unable to load phonebook from server',
          error
        )
      })
  }, [])

  const addPerson = event => {
    event.preventDefault()

    const newPerson = {
      name: newName,
      number: newNumber,
      id: createId()
    }

    const names = persons.map(person => {
      return person.name.toLowerCase()
    })

    if (names.includes(newName.toLowerCase())) {
    
      if (window.confirm(`${newName} is already in the phonebook. Do you want to update their number?`)) {
          
          const id = persons.find(person => {
            return person.name.toLowerCase() === newName.toLowerCase()
          }).id

          newPerson.id = id

          personService
            .update(id, newPerson)
            .then(updatedPerson => {
              setPersons(persons.map(person => person.id !== id ? person : updatedPerson))
              clearInputs()
              displayNotification(
                'success',
                `updated the number for ${newName}`,
                updatedPerson
              )
            })
            .catch(error => {
              displayNotification(
                'error',
                `unable to update the number for ${newName}`,
                error
              )
            })
        }
    } else {

      personService
        .create(newPerson)
        .then(createdPerson => {
          setPersons(persons.concat(createdPerson))
          clearInputs()
          displayNotification(
            'success',
            `added ${newName} to the phonebook`,
            createdPerson
          )
        })
        .catch(error => {
          displayNotification(
            'error',
            `unable to add ${newName} to the phonebook`,
            error
          )
        })
    }
  }

  const handleNameChange = event => {
    setNewName(event.target.value)
  }

  const handleNumberChange = event => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = event => {
    setSearch(event.target.value)
  }

  const createId = () => {
    const maxId = persons.length > 0 ?
      Math.max(...persons.map(person => person.id)) : 0

    return maxId + 1
  }

  const clearInputs = () => {
    setNewName('')
    setNewNumber('')
  }

  // get filtered persons
  const filteredPersons = persons.filter(person => {
    const name = person.name.toLowerCase()
    return name.includes(search.toLowerCase())
  })

  const handleDeleteClick = id => {
    const name = persons.find(person => person.id === id).name

    if (window.confirm(`Do you want to delete ${name}?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          displayNotification(
            'success',
            `${name} has been removed from the phonebook`,
            `deleted ${name}`
          )
        })
        .catch(error => {
          displayNotification(
            'error',
            `unable to remove ${name} from phonebook`,
            error
          )
        })
    }
  }

  const displayNotification = (type, message, response) => {
    console.log(response)

    if (type === 'error') {
      setNotificationType('error')
    } else {
      setNotificationType('success')
    }

    setNotificationMessage(message)

    setTimeout(() => {
      setNotificationType(null)
      setNotificationMessage(null)
    }, 3000)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        type={notificationType}
        message={notificationMessage}
      />
      <SearchFilter
        value={search}
        onChange={handleSearchChange}
      />
      <h4>Add new person: </h4>
      <AddPersonForm
        nameValue={newName}
        handleNameChange={handleNameChange}
        numberValue={newNumber}
        handleNumberChange={handleNumberChange}
        onSubmit={addPerson}
      />
      <h2>Numbers</h2>
      <PersonList 
        persons={filteredPersons} 
        handleDeleteClick={handleDeleteClick}
      />
    </div>
  )
}