
const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');


const getUsuarios = async (req,res)=>{

    const usuario = await Usuario.find({},'nombre email google role');

    res.status(202).json({
        ok:true,
        usuario,
        uid: req.uid
 })
}

const crearUsuario = async (req,res) => {

    const {nombre, password, email} = req.body;
    const uid = req.params.id;

   
    try{
        const usuarioExiste = await Usuario.findOne({email:email});
         
        if( usuarioExiste ){
           return res.status(406).json({
                ok:false,
                msg:'Usuario existente'
            })
        }
        const usuario = new Usuario(req.body);

        
        // Encriptar contraseña
        
        //Genera un valor aleatorio que se agrega al bcrypt
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
        
        // Como devuelve una promesa es necesario que se realice la funcion primero para continuar
        await usuario.save(); 
        
        const token = await generarJWT(usuario.id);

    
        res.status(202).json({
            ok:true,
            usuario: usuario,
            token
     })

    }catch(err){
        console.log(err);
        res.status(500).json({
            ok:false,
            msg:'Error inesperado'
        })
    }

    
    
}


const actualizarUsuario = async (req, res) => {
    const id = req.params.id;
    //En caso de tener mas datos de los necesarios
    const {password, google, email, ...datosNuevos} = req.body;

    try{
        const existeUsuario = await Usuario.findById(id);
        
        if(!existeUsuario){
            return res.status(404).json(
                {
                    ok:false,
                    msg:'Usuario no encontrado'
                }
            );           
        }

        //TODO: Validar token y comprobar si es el usuario correcto
        // En caso de que el email sea diferente al que envia como actualizacion
        if(existeUsuario.email !== email){
            //Comprobar que el email no pertenezca a otro usuario
            const existeEmail = await Usuario.findOne({email});
            if(existeEmail){
                return res.status(406).json({
                    ok:false,
                    msg:'Email existente, use otro'
                })
            }
        }

        datosNuevos.email = email;

        // Actualizar
        const actualizarUsuario = await Usuario.findByIdAndUpdate(
            id, //condicion de busqueda
            datosNuevos, //Nuevos valores
            {new:true} // Para devolver el nuevo usuario actualizado
        );

        res.status(200).json({
            ok:true,
            msg:"Usuario actualizado",
            usuario: actualizarUsuario,
        });
        
        

    }catch(err){
        console.log(err);
        res.status(500).json({
            ok:false,
            msg:'Error al actualizar usuario'
        })
    }
}

const borrarUsuario = async(req, res) =>{
    const id = req.params.id;
    const existeUsuario = await Usuario.findById(id);

    try{
        if(!existeUsuario){
            return res.status(406).json({
                ok:false,
                msg:'Usuario no existe'
            })
        }
        
       await Usuario.deleteOne({_id:id});
        res.status(200).json({
            ok:true,
            msg:'Usuario eliminado',
            uid: id
        })
    }catch(err){
        return res.status(400).json({
            ok:false,
            msg:'Ocurrio un error al eliminar un usuario'
        })
    }
}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}