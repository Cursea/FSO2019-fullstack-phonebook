const express = require('express')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')

const Person = require('./models/person')

app.use(bodyParser.json())
const cors = require('cors')

app.use(cors())
const morgan = require('morgan')

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :postData'
  )
)

app.use(express.static('build'))

morgan.token('postData', function(req) {
  return JSON.stringify(req.body)
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON())
      } else {
        res.status(204).end()
      }
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
  Person.countDocuments({}, function(err, c) {
    res.send(`
      <p><a href="api/persons">Phonebook</a> has info for ${c} people</p>
      <p>${new Date()}</p>
      `)
  })
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({
      error: 'person name or number is missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    date: new Date()
  })

  person
    .save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
      res.send(savedAndFormattedPerson)
    })
    .catch(error => next(error))

  console.log(person)
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
