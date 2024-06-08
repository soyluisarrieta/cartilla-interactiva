import express from 'express'
import bodyParser from 'body-parser'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware: Body-Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Bienvenido a la Cartilla Interactiva')
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
