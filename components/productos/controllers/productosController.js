import { productosService } from '../services/productosService.js'

class Productos {
    

    async getProductos(req, res, next) {
        let response = await productosService.getProductos(req.params.id)
        res.json(response)
    }

    async postProductos(req, res, next) {
        let response = await productosService.postProductos(req.body)
        res.json(response)
    }

    async putProductos(req, res, next) {
        let response = await productosService.putProductos(req.params.id, req.body)
        res.json(response)
    }

    async deleteProductos(req, res, next) {
        let response = await productosService.deleteProductos(req.params.id)
        res.json(response)
    }
}

export let productosController = new Productos()