const jwt = require('jsonwebtoken')




const generarJWT = (uid) =>{

    //necesitamos devolver una promesa para que podamos usar como una funcion async
    return new Promise((resolve,reject)=>{
        //Aca podemos agregar mas datos
        const payload = {
            uid,
        }
    
        jwt.sign(payload, process.env.JWT_SECRET,{
            expiresIn:'12h'
        },(err, token)=>{
            if(err){
                console.log(err);
                reject('Error al generar token',err)
            }else{
                resolve(token);
            }
        });


    })
   
    
}

module.exports = {
    generarJWT
}