const { response } = require('express')
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');



const login = async (req, res = response)=>{

    const { email, password } = req.body;

    try{

        const usuarioDb = await Usuario.findOne({email});

        if(!usuarioDb){
            return res.status(404).json({
                ok:false,
                msg:'Email no valido',
            });
        }

        //Verificar contraseña
        const validPassword = bcrypt.compareSync(password,usuarioDb.password);
        if(!validPassword){
            return res.status(404).json({
                ok:false,
                msg:'Contraseña no valida'
            });
        }

        //Generar un token

        const token = await generarJWT(usuarioDb.id);

        res.status(200).json({
            ok:true,
            msg:'Todo Ok',
            token
        })
    }catch(err){
        console.log(err);
        res.status(400).json({
            ok:false,
            msg:'Ups! Algo salio mal'
        })
    }
}

module.exports = {
    login
}