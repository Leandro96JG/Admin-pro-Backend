const {response} = require('express');
const jwt = require('jsonwebtoken');


const validarJwt = (req, res = response, next)=>{

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            ok:false,
            msg:'Sin token de autorización'
        });
    }

    try{

        const {uid}= jwt.verify(token,process.env.JWT_SECRET);
        //Como es un middlew podemos establer info en la req, que es info que recibe el controlador
        req.uid = uid;
        next();
    }catch(err){
        return res.status(401).json({
            ok:false,
            msg:'Token no valido'
        });  
    }
    

}

module.exports = {
    validarJwt
}