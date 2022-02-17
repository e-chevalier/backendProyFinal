import express from 'express'
import { productosController }  from './controllers/productosController.js'

export const productosApi = (app) => {
    let router = express.Router()
    app.use('/api/productos', router )

    router.get('/:id?', productosController.getProductos)
    router.post('/', productosController.postProductos)
    router.put('/:id', productosController.putProductos)
    router.delete('/:id', productosController.deleteProductos)
}
