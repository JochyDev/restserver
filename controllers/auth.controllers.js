const { response } = require("express")
const bcryptjs = require('bcryptjs')

const Usuario = require('./../models/usuario')
const { generarJWT } = require("../helpers/generar-jwt")
const { googleVerify } = require("../helpers/google-verify")



const login = async(req, res = response) => {

    const {correo, password} = req.body

    try{

        // Verificar si el email existe 
        const usuario = await Usuario.findOne({ correo });
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }
        // Verificar si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado false'
            });
        }
        //Verificar la contrasena
        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }
        // Generar el JWt
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })
    } catch(error){
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el adminitrador'
        });
    }
}

const googleSignin = async(req, res = response) => {

    const { id_token } = req.body;

    try {

        const {correo, nombre, img} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario( data ); 
            await usuario.save();

        }

        // Si el usuario en DB 
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el adinistrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error){

        res.status(400).json({
            msg: 'Token de Google no es valido'
        })
    }

}

module.exports = {
    login,
    googleSignin
}