
const Pool = require("pg").Pool;
// const req = require("request");
const fetch = require("node-fetch");


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

const obtenerCoordenadas = async (direccion) => {
    try {
        const url = `http://servicios.usig.buenosaires.gob.ar/normalizar/?direccion=${direccion},caba`
        let resultado = await fetch(url),
            json = await resultado.json();
            return json
    } catch (error) {
        console.log(error)
    }
}



const crearUsuario = async (request, response) => {
    const { nombre, direccion } = request.body

    try {
        const { direccionesNormalizadas } = await obtenerCoordenadas(direccion)

        let longitud = parseFloat(direccionesNormalizadas[0].coordenadas.x)
        let latitud = parseFloat(direccionesNormalizadas[0].coordenadas.y)

        const consulta = `INSERT INTO usuario(nombre,direccion,latitud,longitud) VALUES('${nombre}','${direccion}',${latitud},${longitud}) RETURNING *`;
        
        pool.query(consulta, (error, results) => {
            if (error) {
                throw error
            }
            response.status(201).send(`Usuario agregado de nombre: ${results.rows[0].nombre}`)
        })

    } catch (error) {
        console.log(error)
    }

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


const actualizarUsuario = async(request, response) => {
    const id = parseInt(request.params.id)
    const { nombre, direccion } = request.body
    try {
        const { direccionesNormalizadas } = await obtenerCoordenadas(direccion)

        let longitud = parseFloat(direccionesNormalizadas[0].coordenadas.x)
        let latitud = parseFloat(direccionesNormalizadas[0].coordenadas.y)

        pool.query(
            'UPDATE usuario SET nombre = $1, direccion = $2, latitud = $3, longitud = $4 WHERE id = $5',
            [nombre, direccion, latitud, longitud, id],
            (error, results) => {
                if (error) {
                    throw error
                }
                response.status(200).send(`Usuario modificado con Id: ${id}`)
            }
        )
        
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    obtenerUsuarios,
    obtenerUsuario,
    crearUsuario,
    eliminarUsuario,
    actualizarUsuario
}