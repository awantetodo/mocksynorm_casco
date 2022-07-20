const express = require("express")
const { Router } = express
const router = Router()
const { generarProducto } = require("../utils/generadorDeProductos")

router.get('/', async (req, res) => {
    let productosLista = []
    for (let index = 0; index < 5; index++) {
        productosLista.push(generarProducto())
    }
    res.status(200).json(productosLista)
}
)

module.exports = router;