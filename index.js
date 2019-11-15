const express = require("express");
const app = express();
const bodyParser = require("body-parser");

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

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
