import { CartContainer } from './CartContainer.js'
import { Contenedor } from './Contenedor.js'

/**
 * Container instance 
 */
const contenedor = new Contenedor('productos.txt')
const products = await contenedor.getAll()
//products.length = 0

/**
 *  Carts instance
 */
const cartsContainer = new CartContainer('carritos.txt')
const carts = await cartsContainer.getAll()
console.log(carts)

export {contenedor, products, cartsContainer, carts}