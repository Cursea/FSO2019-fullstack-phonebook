const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require('morgan');

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
];

app.use(bodyParser.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

morgan.token('postData', function(req) { return JSON.stringify(req.body)})

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.get("/info", (req, res) => {
  res.send(`
    <p><a href="api/persons">Phonebook</a> has info for ${
      persons.length
    } people</p>
    <p>${new Date()}</p>
    `);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
});

const generateId = () => Math.floor(Math.random() * 100) + 1;

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "person name or number is missing"
    });
  }

  if (persons.some(e => e.name.toLowerCase() === body.name.toLowerCase())) {
    return res.status(400).json({
      error: "name must be unique"
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    date: new Date(),
    id: generateId()
  };
  console.log(person);

  persons = persons.concat(person);

  res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
