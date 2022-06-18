const express = require('express');
const bodyParser = require('body-parser');
const db = require('./api/usuario');
const cors = require('cors');

const app = express()
const port = 3001

const whitelist = ["http://localhost:3000"]

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
}

app.use(cors(corsOptions))



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