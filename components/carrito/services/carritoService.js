import { products, cartsContainer, carts } from '../../../utils/libs/Global.js'

class Carrito {

    async postCarrito() {
        console.log(`POST CrearCarrito-- cartsRouters`)
        let newCart = {}
        const max = carts.reduce((a, b) => a.id > b.id ? a : b, { id: 0 })
        newCart.id = Number(max.id) + 1
        newCart.timestamp = Date.now()
        newCart.products = []
        carts.push(newCart)
        //Save to file
        cartsContainer.save(newCart)
        
        return { status: "OK", description: "POST CREATE CART RETURN ID", id: newCart.id }
    }

    async deleteCarrito( id ) {
        console.log(`DELETE Carrito => id: ${id} -- cartsRouters`)
        let index = carts.findIndex(cart => cart.id == Number(id))

        if (index >= 0) {
            carts.splice(index, 1)
            //Save to file
            cartsContainer.deleteById(id)
        }

        return (index >= 0 ? { status: "OK", description: `DELETE CART WITH ID: ${id}`, id: id } : { error: 'Carrito no encontrado.' })
    }

    async getCarritoProductos( id ){
        console.log(`GET Productos => id: ${id} -- cartsRouters`)
        let index = carts.findIndex(cart => cart.id == id)

        return (index >= 0 ? { status: "OK", description: `GET CART WITH ID: ${id}`, cart: carts[index] } : { error: 'Carrito no encontrado.' })
    }

    async postCarritoProducto(id_cart, id_prod) {
        console.log(`POST Carrito => id: ${id_cart} -- cartsRouters`)
        let index_cart = carts.findIndex(cart => cart.id == id_cart)
        let index_prod = products.findIndex( prod => prod.id == id_prod)
        let response = {}
    
        if ( index_cart >= 0 ) {
            if ( index_prod >= 0 ) {
                carts[index_cart].products.push(products[index_prod])
                //Save to file
                cartsContainer.updateById(id_cart, carts[index_cart])
                response = { status: "OK", description: `POST ADD ID_PROD: ${id_prod} INTO ID_CART: ${id_cart}`}
                //carts[index_cart].products.forEach(e => console.log(e) )
            } else {
                response = { error: `Producto ID:${id_prod} no encontrado.` }
            }  
        } else {
            response = { error: `Carrito ID:${id_cart} no encontrado.` }
        }
    
        return response
    }

    async deleteCarritoProducto(id_cart, id_prod) {
        console.log(`DELETE Productos IDPROD: ${id_prod}  FROM CART ID: ${id_cart} -- cartsRouters`)
        let index_cart = carts.findIndex(cart => cart.id == id_cart)
        let response = {}
        let index_prod = -1

        if ( index_cart >= 0 ) {
            index_prod = carts[index_cart].products.findIndex(prod => prod.id == id_prod)
            if (index_prod >= 0 ) {
                carts[index_cart].products.splice(index_prod, 1)
                response = { status: "OK", description: `DELETE ID_PROD: ${id_prod} FROM ID_CART: ${id_cart}`}
                //Save to file
                cartsContainer.updateById(id_cart, carts[index_cart])
                //carts[index_cart].products.forEach(e => console.log(e) )
            } else {
                response = { error: `Producto ID:${id_prod} no encontrado en el carrito ID:${id_cart} .` }
            }
        } else {
            response = { error: `Carrito ID:${id_cart} no encontrado.` }
        }
    
        return(response)
    }

}

export let carritoService = new Carrito()

