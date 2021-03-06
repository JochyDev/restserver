const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/confing');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            usuarios:   '/api/usuarios',
            productos:  '/api/productos'
        }

        
        // Conectar a bases de datos
        this.conectarDb();

        // Middlewares 
        this.middlewares();

        // Rutas de mi aplicacion 
        this.routes();
    }

    async conectarDb(){
        await dbConnection()
    }

    middlewares(){
        // Cors
        this.app.use( cors() );

        // Lectura y parseo
        this.app.use( express.json() );

        // directorio publico
        this.app.use( express.static('public'))

    }

    routes(){

        this.app.use( this.paths.auth,       require('../routes/auth') )
        this.app.use(this.paths.buscar,      require('../routes/buscar'))
        this.app.use( this.paths.categorias, require('../routes/categorias'))
        this.app.use(this.paths.productos,   require('../routes/productos'))
        this.app.use( this.paths.usuarios,   require('../routes/usuarios') )
    }

    listen(){
        this.app.listen(process.env.PORT, () => {
            console.log("App is listening port", process.env.PORT)
        });
    }
}

module.exports = Server;