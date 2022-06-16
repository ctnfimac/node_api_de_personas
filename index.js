import './api/usuario';

const { Pool, Client } = require("pg");

const credentials = {
    user: "postgres",
    host: "localhost",
    database: "curso_node",
    password: "",
    port: 5432,
};

async function clientDemo() {
    const client = new Client(credentials);
    await client.connect();
    const now = await client.query("SELECT * from usuario");
    await client.end();

    return now;
}

(async () => {
    const clientResult = await clientDemo();
    clientResult.rows.map( item => {console.log(item.nombre,'|', item.id)})
    // console.log(clientResult.rows)
})();