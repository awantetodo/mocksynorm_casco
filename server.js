const PORT = 8080
const express = require("express")
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const productoRouter= require("./router/productos")

const app = express()
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const {normalizarMensajes}= require("./modelos/normalizador")


const path = require("path")
app.use(express.static(path.join(__dirname, "public")))

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// parse application/json
app.use(express.json());

app.use("/api/productos-test",productoRouter)


const server = httpServer.listen(PORT, () => {
    console.log("escuchando en puerto " + server.address().port);
})

server.on("error", err => console.log(err))


const { Contenedor } = require("./contenedor")
const { options: MariaDBOptions } = require('./options/MariaDB.js')
const { options: SQLiteOptions } = require('./options/SQLite3.js')

const containerProductos = new Contenedor(MariaDBOptions, "productos")
//const containerMensajes = new Contenedor(SQLiteOptions, "mensajes")
const MensajeDaoFirestore = require("./daos/mensajesDaoFirebase")
const containerMensajes =new MensajeDaoFirestore()

let productos = []
let mensajes = []
io.on('connection', async (socket) => {

    console.log('Se conecto un cliente');
    console.log(socket.id);


    productos = await containerProductos.getAll()
    socket.emit('productos', productos);//mensaje para el cliente que inicio la conexion

    socket.on('nuevo-producto', async (d) => {
        console.log("recibo un nuevo producto");
        await containerProductos.save(d)
        productos = await containerProductos.getAll()
        io.sockets.emit('productos', productos)//mensaje para todos los clientes
    })

    mensajes = await containerMensajes.getAll()
    let mensajesNormalizado=normalizarMensajes(mensajes)  
 
   // socket.emit('messages', mensajes);//mensaje para el cliente que inicio la conexion
   socket.emit('messages', mensajesNormalizado);//mensaje para el cliente que inicio la conexion

    socket.on('new-message',async (d) => {
       
        //mensajes.push(d);
       // normalizarMensajes(d)

        let mensaje= {
            author:{
                id: d.id,              
                nombre: d.nombre,
                apellido:d.apellido,
                edad:d.edad,
                alias:d.alias,
                avatar:d.avatar,
              
            },
            mensaje:d.text,
            fecha: d.date, 
        }


        await containerMensajes.save(mensaje)
        mensajes = await containerMensajes.getAll()
        mensajesNormalizado=normalizarMensajes(mensajes)  
      
       // io.sockets.emit('messages', mensajes)//mensaje para todos los clientes
        io.sockets.emit('messages', mensajesNormalizado)//mensaje para todos los clientes
    })
})


