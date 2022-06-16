
const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "curso_node",
    password: "",
    port: 5432,
});

const obtenerUsuarios = (request, response) => {
    pool.query('SELECT * FROM usuario ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const obtenerUsuario = (request, response) => {
    const id = parseInt(request.params.id)
    const consulta = `SELECT * FROM usuario WHERE id = ${id}`
    pool.query(consulta, (error, result) => {
        if(error){
            throw error
        }
        response.status(200).json(result.rows)
    })
}


const crearUsuario = (request, response) => {
    const { nombre } = request.body
    const consulta = `INSERT INTO usuario(nombre) VALUES('${nombre}') RETURNING *`;
    console.log(consulta)
    pool.query(consulta, (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`Usuario agregado de nombre: ${results.rows[0].nombre}`)
    })
}


const eliminarUsuario = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM usuario WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`Usuario eliminado con Id: ${id}`)
    })
}


const actualizarUsuario = (request, response) => {
    const id = parseInt(request.params.id)
    const { nombre } = request.body
    pool.query(
        'UPDATE usuario SET nombre = $1 WHERE id = $2',
        [nombre, id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`Usuario modificado con Id: ${id}`)
        }
    )
}


module.exports = {
    obtenerUsuarios,
    obtenerUsuario,
    crearUsuario,
    eliminarUsuario,
    actualizarUsuario
}