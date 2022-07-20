const { normalize, denormalize, schema } = require("normalizr");
const util = require('util')

function print(objeto) {
    console.log(util.inspect(objeto, false, 12, true))
}

function normalizarMensajes(datos) {     
    const authorEntity = new schema.Entity('author')
    const mensajeEntity = new schema.Entity('mensaje', {
        author: authorEntity
    },)//,{idAttribute:"mensaje"}

    const mensajesEntity = new schema.Entity('mensajes', {
        mensajes: [mensajeEntity]
    })

    console.log(' ------------- OBJETO SIN NORMALIZAR --------------- ')
    const listaMensajes = JSON.parse(JSON.stringify(datos));
    print(listaMensajes)
    console.log(' ------------- OBJETO NORMALIZADO --------------- ')
    const datosNormalizados = normalize( { id: 'mensajes',  mensajes:listaMensajes},mensajesEntity)
    print(datosNormalizados)

    return datosNormalizados

}


module.exports= {normalizarMensajes}