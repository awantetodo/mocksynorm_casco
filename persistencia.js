const { options: SQLiteOptions } = require('./options/SQLite3.js')
const { options: MariaDBOptions } = require('./options/MariaDB.js')
const knexSQLite = require('knex')(SQLiteOptions);
const knexMariaDB = require('knex')(MariaDBOptions);

(async () => {
    try {
        console.log('Elimina la tabla mensajes')
        await knexSQLite.schema.dropTableIfExists('mensajes')

        console.log('Se crea la tabla mensajes')
        await knexSQLite.schema.createTable('mensajes', table => {
            table.increments('id').primary().notNull(),
                table.string('author', 50),
                table.date('date'),
                table.string('text', 500)
        })

        const mensajes = [
            { author: 'sarasa', date: Date.now(), text: "mensaje 1" },
            { author: 'lionel.messi', date: Date.now(), text: "mensaje 2" },
        ]
        console.log('Se ingresan mensajes de prueba')
        await knexSQLite('mensajes').insert(mensajes)

        const msjs = await knexSQLite.from('mensajes').select('*');
        for (row of msjs) {
            console.log(`ID:${row.id} - Author:${row.author} - Date:${row.date} - Text:${row.text}`)
        }


        console.log('Se cierra la conexion SQLite')
        await knexSQLite.destroy();
    } catch (error) {
        console.log(error)
    }

})();



(async () => {
    try {
        console.log('Elimina la tabla productos')
        await knexMariaDB.schema.dropTableIfExists('productos')

        console.log('Se crea la tabla productos')
        await knexMariaDB.schema.createTable('productos', table => {
            table.increments('id').primary().notNull(),
                table.string('title', 25).notNull(),
                table.float('price'),
                table.string('thumbnail', 500)
        })

        const productos = [
            { title: 'producto1', price: 1291, thumbnail: "imagen1.jpg" },
            { title: 'producto2', price: 32, thumbnail: "imagen2.jpg"  },
        ]
        console.log('Se ingresan productos de prueba')
        await knexMariaDB('productos').insert(productos)

        const pdrs = await knexMariaDB.from('productos').select('*');
        for (row of pdrs) {
            console.log(`ID:${row.id} - title:${row.title} - price:${row.price} - thumbnail:${row.thumbnail}`)
        }


        console.log('Se cierra la conexion MariaDB')
        await knexMariaDB.destroy();
    } catch (error) {
        console.log(error)
    }

})();
