import express from 'express'
import { carritoController }  from './controllers/carritoController.js'

export const carritoApi = (app) => {
    let router = express.Router()
    app.use('/api/carrito', router )

    router.post('/', carritoController.postCarrito)
    router.delete('/:id', carritoController.deleteCarrito)
    router.get('/:id/productos', carritoController.getCarritoProductos)
    router.post('/:id/productos', carritoController.postCarritoProducto )
    router.delete('/:id/productos/:id_prod', carritoController.deleteCarritoProducto )
}
