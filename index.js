const express = require('express')
const app = express()
const morgan = require('morgan')
const generateId = () => {
  const newId = Math.floor(Math.random()*50)
  return String(newId)
}

const cors = require('cors')

app.use(cors())

app.use(express.static('dist'))

app.use(express.json())
//app.use(morgan('tiny'))

let persons = [

  {
    id:'1',
    name:'Arto Hellas',
    number:'050-123456'
  },
  {
    id:'2',
    name:'Mike Tyson',
    number:'050-654321'
  },
  {
    id:'3',
    name:'Carl Hamilton',
    number:'050-7707770'
  }
]

morgan.token('body', (request) => { // oma mod-token
  return JSON.stringify(request.body)
})

// 'tiny' mallinnus
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (request, response) => {
  let date = new Date()  
  response.send(`
    <p>Phonebook has info for ${persons.length} persons</ p>
    <p>${date}</ p>
  `)
  //console.log(date)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  //console.log(persons)
  response.status(204).end()
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  const bookNames = [];
  
  persons.forEach(person => bookNames.push(person.name))
  //console.log(bookNames)

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Name and number are required'
    })
  }

  if (bookNames.includes(body.name)) {
    return response.status(400).json({  // olisiko status 409 parempi?
      error: 'Name must be unique' 
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number    
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})