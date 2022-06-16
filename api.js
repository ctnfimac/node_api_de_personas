const express = require('express');
const bodyParser = require('body-parser');
const db = require('./api/usuario');

const app = express()
const port = 3001

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/usuarios', (request, response) => {
    db.obtenerUsuarios(request,response)
})

app.get('/usuario/:id', (request, response) => {
    db.obtenerUsuario(request,response)
})

app.post('/usuario', (request, response) => {
    db.crearUsuario(request, response)
})

app.delete('/usuario/:id', (request, response) => {
    db.eliminarUsuario(request, response)
})

app.put('/usuario/:id', (request, response) => {
    db.actualizarUsuario(request, response)
})

app.listen(port, () => {
    console.log(`Corriendo en http://localhost:${port}`)
})