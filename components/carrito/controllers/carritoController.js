import { carritoService } from '../services/carritoService.js'

class Carrito {
    async postCarrito(req, res, next) {
        let response = await carritoService.postCarrito()
        res.json(response)
    }

    async deleteCarrito(req, res, next) {
        let response = await carritoService.deleteCarrito(req.params.id)
        res.json(response)
    }

    async getCarritoProductos(req, res, next) {
        let response = await carritoService.getCarritoProductos(req.params.id)
        res.json(response)
    }

    async postCarritoProducto(req, res, next) {
        let response = await carritoService.postCarritoProducto(req.params.id, req.body.id_prod)
        res.json(response)
    }

    async deleteCarritoProducto(req, res, next) {
        let response = await carritoService.deleteCarritoProducto(req.params.id, req.params.id_prod)
        res.json(response)
    }
    
}

export let carritoController = new Carrito()

