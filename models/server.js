const express = require('express');
const cors = require('cors');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosRouterPath = '/api/usuarios'

        // Middlewares 
        this.middlewares();


        // Rutas de mi aplicacion 
        this.routes();
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

        this.app.use(this.usuariosRouterPath, require('../routes/usuarios'))
    }

    listen(){
        this.app.listen(process.env.PORT, () => {
            console.log("App is listening port", process.env.PORT)
        });
    }
}

module.exports = Server;