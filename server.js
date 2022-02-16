import 'dotenv/config'
import express from 'express';
import { Contenedor } from './Contenedor.js'
import { CartContainer } from './CartContainer.js'

const app = express()
const productsRouters = express.Router()
const cartsRouters = express.Router()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'))
app.use('/api/productos', productsRouters)
app.use('/api/carrito', cartsRouters)

const PORT = process.env.PORT || process.env.PORT_DEV

app.set('views', './views'); // especifica el directorio de vistas
app.set('view engine', 'ejs'); // registra el motor de plantillas

const server = app.listen(PORT, (err) => {
    if (err) {
        console.log("Error while starting server");
    } else {
        console.log(`Servidor http escuchando en el puerto ${server.address().port}
                 Open link to http://127.0.0.1:${server.address().port}`)
    }
})

server.on("error", error => console.log(`Error en servidor ${error}`))

/**
 * Variable that determines if the user is an administrator or not. 
 */
let administrator = true

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



const fakeApi = () => products
const fakeApiOne = (id) => products.filter(prod => prod.id == id)

/**
 *  products EndPoint - Users and Admin
 */

productsRouters.get('/:id?', (req, res) => {
    if (req.params.id) {
        console.log(`GET => id: ${req.params.id} -- productsRouters`);
        res.render('page/productList', { products: fakeApiOne(req.params.id), isEmpty: fakeApiOne(req.params.id).length ? false : true })
    } else {
        console.log(`GET ALL -- productsRouters`);
        res.render('page/productList', { products: fakeApi(), isEmpty: fakeApi().length ? false : true })
    }
})

/**
 *  products EndPoints - ADMIN ONLY
 */


productsRouters.post('/', (req, res) => {
    console.log(`POST -- productsRouters`);
    let prod = req.body

    if (Object.keys(prod).length !== 0 && !Object.values(prod).includes('')) {
        const max = products.reduce((a, b) => a.id > b.id ? a : b, { id: 0 })
        prod.id = max.id + 1
        prod.timestamp = Date.now()
        products.push(prod)
        contenedor.save(prod)
    }

    //res.json(prod)
    res.render('page/form')
})

productsRouters.put('/:id', (req, res) => {
    console.log(`PUT => id: ${req.params.id} -- productsRouters`);
    let prod = req.body
    let id = req.params.id
    let index = products.findIndex(prod => prod.id == id)

    if (index >= 0) {
        prod.id = id
        products[index] = prod
        contenedor.updateById(id, prod)
    }
    res.json(index >= 0 ? { id: id } : { error: 'Producto no encontrado.' })
})

productsRouters.delete('/:id', (req, res) => {
    console.log(`DELETE => id: ${req.params.id} -- productsRouters`);
    let id = req.params.id
    let index = products.findIndex(prod => prod.id == id)

    if (index >= 0) {
        products.splice(index, 1)
        contenedor.deleteById(id)
    }
    res.json(index >= 0 ? { id: id } : { error: 'Producto no encontrado.' })
})


/**
 *  Carrito EndPoints
 */

cartsRouters.post('/', (req, res) => {
    console.log(`POST CrearCarrito-- cartsRouters`);
    let newCart = {}
    const max = carts.reduce((a, b) => a.id > b.id ? a : b, { id: 0 })
    newCart.id = max.id + 1
    newCart.timestamp = Date.now()
    newCart.products = []
    carts.push(newCart)
    cartsContainer.save(newCart)
    
    res.json({ status: "OK", description: "POST CREATE CART RETURN ID", id: newCart.id })
})

cartsRouters.delete('/:id', (req, res) => {
    console.log(`DELETE Carrito => id: ${req.params.id} -- cartsRouters`);
    let id = req.params.id
    let index = carts.findIndex(cart => cart.id == id)

    if (index >= 0) {
        carts.splice(index, 1)
        cartsContainer.deleteById(id)
    }
    res.json(index >= 0 ? { status: "OK", description: `DELETE CART WITH ID: ${id}`, id: id } : { error: 'Producto no encontrado.' })
})

cartsRouters.get('/:id/productos', (req, res) => {
    console.log(`GET Productos => id: ${req.params.id} -- cartsRouters`);
    let id = req.params.id
    let index = carts.findIndex(cart => cart.id == id)

    res.json(index >= 0 ? { status: "OK", description: `GET CART WITH ID: ${id}`, cart: carts[index] } : { error: 'Producto no encontrado.' })
})

cartsRouters.post('/:id/productos', (req, res) => {
    res.json({ status: "POST products TO CART", id: req.params.id })
})

cartsRouters.delete('/:id/productos/:id_prod', (req, res) => {
    res.json({ status: `DELETE PRODUCTO IDPROD: ${req.params.id_prod}  FROM CART ID: ${req.params.id_prod}`, id: req.params.id, id_prod: req.params.id })
})


/**
 * Undefined endpoint
 */
app.all('*', (req, res) => {
    res.json({ error: -2, descripcion: `Ruta ${req.url} método ${req.method} no implementada.` })
})



