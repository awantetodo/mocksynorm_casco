
const formulario = document.querySelector("#nuevoProducto")
const socket = io();

socket.on('productos', (data) => {
    console.log("recibido de socket")
    console.log(data)
    actualizarProductos(data)
})

socket.on("messages", (data) => {

    const authorEntity = new normalizr.schema.Entity('author')
    const mensajeEntity = new normalizr.schema.Entity('mensaje', {
        author: authorEntity
    })

    const mensajesEntity = new normalizr.schema.Entity('mensajes', {
        mensajes: [mensajeEntity]
    })

    const mensajeDesnormalizado = normalizr.denormalize(data.result, mensajesEntity, data.entities)
    // actualizarMensajes(data);
    actualizarMensajes(mensajeDesnormalizado);

    const longN = JSON.stringify(data).length
    console.log('Longitud objeto normalizado: ', longN)

    const longD = JSON.stringify(mensajeDesnormalizado).length
    console.log('Longitud objeto desnormalizado: ', longD)

    const porcentajeC = (longN * 100) / longD
    console.log('Porcentaje de compresión: ', porcentajeC.toFixed(2) + '%')
    document.getElementById('porcentajeReduccion').innerHTML = `${porcentajeC.toFixed(2)}% de Compresión`;
});

formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(formulario);
    const producto = {
        title: formData.get('title'),
        price: formData.get('price'),
        thumbnail: formData.get('thumbnail'),

    };
    socket.emit('nuevo-producto', producto)
    swal.fire("Enviado!", `El producto se ha agredado correctamente.`, "success");
    formulario.reset()
})


function actualizarProductos(productos) {
    fetch('/listado.hbs')
        .then(response => response.text())
        .then(data => {
            const template = Handlebars.compile(data); // compila la plantilla
            const html = template({ array: productos }); // genera el html
            document.querySelector('#listadoProductos').innerHTML = html; // inyecta el resultado en la vista

        })
        .catch(err => {
            console.error(err);
        });

}


function addMessage(e) {
    const mensaje = {
        id: document.getElementById("author").value,
        text: document.getElementById("texto").value,
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        edad: document.getElementById("edad").value,
        alias: document.getElementById("alias").value,
        avatar: document.getElementById("avatar").value,
        date: new Date().toLocaleString(),
    };
    socket.emit("new-message", mensaje);
    document.getElementById("texto").value = '';

    return false;
}

function actualizarMensajes(data) {

    const htmlMensajes = data.mensajes
        .map((elem) => {
            return `<div>
              <b style="color:blue;">${elem.author.id}</b>
              [<span style="color:brown;">${elem.fecha}</span>] :
              <i style="color:green;">${elem.mensaje}</i>
              <img style="width: 30px; border-radius: 100%" src="${elem.author.avatar == '' ? 'https://www.gravatar.com/avatar/' : elem.author.avatar  }">
          </div>`;
        })
        .join(" ");
    document.getElementById("messages").innerHTML = htmlMensajes;


}