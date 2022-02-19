import { contenedor, products } from '../../../utils/libs/Global.js'

class Productos {

    async getProductos(id) {
        console.log(`GET ${id? "WITH ID => id: " + id : "ALL => "} -- productsRouters`)
        let filteredArray = id ? products.filter(prod => prod.id == id) : products

        return({status: "OK", products: filteredArray, isEmpty: filteredArray.length ?  false : true })
    }

    async postProductos(prod) {
        console.log(`POST -- productsRouters`)
        let response = {}

        if (Object.keys(prod).length !== 0 && !Object.values(prod).includes('')) {
            const max = products.reduce((a, b) => Number(a.id) > Number(b.id) ? a : b, { id: 0 })
            prod.id = Number(max.id) + 1
            prod.timestamp = Date.now()
            products.push(prod)
            //Save to file
            contenedor.save(prod)
            response = { status: "ok", id: prod.id}
        } else {
            response = { error: 'Algunos campos del producto no fueron completados.' }
        }

        return (response)
    }

    async putProductos(id, prod) {
        console.log(`PUT => id: ${id} -- productsRouters`)
        let index = products.findIndex(prod => prod.id == id)
    
        if (index >= 0) {
            prod.id = id
            products[index] = prod
            //Save to file
            contenedor.updateById(id, prod)
        }
        return (index >= 0 ? { id: id } : { error: 'Producto no encontrado.' })
    }

    async deleteProductos(id) {
        console.log(`DELETE => id: ${id} -- productsRouters`)
        let index = products.findIndex(prod => prod.id == id)
    
        if (index >= 0) {
            products.splice(index, 1)
            //Save to file
            contenedor.deleteById(id)
        }
        return(index >= 0 ? { id: id } : { error: 'Producto no encontrado.' })
    }
}

export let productosService = new Productos()