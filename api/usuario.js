
const Pool = require("pg").Pool;
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

const obtenerBarrioYComuna = async (x,y) => {
    try{
        const url = `https://ws.usig.buenosaires.gob.ar/datos_utiles/?x=${x}&y=${y}`
        let resultado = await fetch(url);
        let json = await resultado.json();
        return json
    }catch(error){
        console.log(error)
    }
}

const crearUsuario = async (request, response) => {
    const { nombre, direccion } = request.body

    try {
        const { direccionesNormalizadas } = await obtenerCoordenadas(direccion)

        let longitud = parseFloat(direccionesNormalizadas[0].coordenadas.x)
        let latitud = parseFloat(direccionesNormalizadas[0].coordenadas.y)

        let {comuna, barrio} = await obtenerBarrioYComuna(longitud,latitud)

        const consulta = `INSERT INTO usuario(nombre,direccion,latitud,longitud,barrio,comuna) VALUES('${nombre}','${direccion}',${latitud},${longitud},'${barrio}','${comuna}') RETURNING *`;
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

        let { comuna, barrio } = await obtenerBarrioYComuna(longitud, latitud)

        pool.query(
            'UPDATE usuario SET nombre = $1, direccion = $2, latitud = $3, longitud = $4, comuna = $5, barrio = $6 WHERE id = $7',
            [nombre, direccion, latitud, longitud, comuna, barrio, id],
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


const loginDeUsuario = async (request, response) => {
    const { nombre, password } = request.body;
    try {
        pool.query('SELECT nombre FROM administrador WHERE nombre = $1 and contraseña = $2 LIMIT 1',[nombre,password],
        (error, results)=>{
            if(error){
                throw error
            }
            response.status(200).json(results.rows)
        })
    }catch(error){
        console.log(error)
    }
}


module.exports = {
    obtenerUsuarios,
    obtenerUsuario,
    crearUsuario,
    eliminarUsuario,
    actualizarUsuario,
    loginDeUsuario
}