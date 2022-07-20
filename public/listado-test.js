
let listaProductos=[]

fetch('/api/productos-test')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        data.forEach(element => {          
            listaProductos.push({title:element.title, price: element.price, thumbnail:element.thumbnail})
        });
        actualizarProductos(listaProductos)

    })
    .catch(err => {
        console.error(err);
       
    });


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