require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('data', (request, response) => {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  response.send(`
    <h4>Phonebook has info for ${persons.length} people</h4>
    ${new Date()}
  `)
})

// get all persons
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))

  // response.json(persons)
})

// get single person by id
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))

  // const id = Number(request.params.id)
  // const person = persons.find(person => person.id === id)
  
  // if (person) {
  //   response.json(person)
  // } else {
  //   response.status(404).end()
  // }
})

// delete a person by id
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))

  // const id = Number(request.params.id)

  // persons = persons.filter(person => person.id !== id)

  // response.status(204).end()
})

// create new person
app.post('/api/persons', (request, response, next) => {
  if (!request.body.name) {
    return response.status(400).json({ error: 'name missing' })
  }

  if (!request.body.number) {
    return response.status(400).json({ error: 'number missing' })
  }

  const person = new Person({
    name: request.body.name,
    number: request.body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))

  // if (!request.body) {
  //   return response.status(400).json({ 
  //     error: 'request body missing' 
  //   })
  // } else if (!request.body.name) {
  //   return response.status(400).json({ 
  //     error: 'name missing' 
  //   })
  // } else if (!request.body.number) {
  //   return response.status(400).json({ 
  //     error: 'number missing' 
  //   })
  // }

  // const names = persons.map(person => person.name.toLowerCase())

  // if (names.includes(request.body.name.toLowerCase())) {
  //   return response.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }

  // const person = {
  //   name: request.body.name,
  //   number: request.body.number,
  //   id: createId()
  // }

  // console.log(person)

  // persons = persons.concat(person)

  // response.json(person)
})

// const createId = () => {
//   return Math.floor(Math.random() * 999999 + 1)
// }

app.put('/api/persons/:id', (request, response, next) => {
  const person = {
    name: request.body.name,
    number: request.body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})