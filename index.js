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

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then(person => {
    res.json(person.toJSON())
  })
})

app.get("/info", (req, res) => {
  res.send(`
    <p><a href="api/persons">Phonebook</a> has info for ${
      Person.length
    } people</p>
    <p>${new Date()}</p>
    `)
})

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then(res => {
      res.status(204).end()
    })
    .catch(error => console.log(error))
})

//const generateId = () => Math.floor(Math.random() * 100) + 1;

app.post("/api/persons", (req, res) => {
  const body = req.body

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({
      error: "person name or number is missing"
    })
  }

  /*
  if (Person.some(e => e.name.toLowerCase() === body.name.toLowerCase())) {
    return res.status(400).json({
      error: "name must be unique"
    });
  }
  */

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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
