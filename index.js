const express = require("express")
const app = express()
require("dotenv").config()
const bodyParser = require("body-parser")
const morgan = require("morgan")
const cors = require("cors")

const Person = require("./models/person")

let persons = [
  {
    name: "Arto Hellas",
    number: "040-1168101",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-561565",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-68448",
    id: 3
  }
]

app.use(bodyParser.json())
app.use(cors())
app.use(express.static("build"))
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postData"
  )
)

morgan.token("postData", function(req) {
  return JSON.stringify(req.body)
})

app.get("/api/persons", (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get("/info", (req, res) => {
  Person.countDocuments({}, function(err, c) {
    res.send(`
      <p><a href="api/persons">Phonebook</a> has info for ${c} people</p>
      <p>${new Date()}</p>
      `)
  })
})

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post("/api/persons", (req, res) => {
  const body = req.body

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({
      error: "person name or number is missing"
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    date: new Date()
  })

  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON())
  })

  console.log(person)
})

app.put("/api/persons/:id", (req, res, next) => {
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

  if (error.name === "CastError" && error.kind === "ObjectId") {
    return response.status(400).send({ error: "malformated id" })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
