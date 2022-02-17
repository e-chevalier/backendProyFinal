import 'dotenv/config'
import express, { response } from 'express'
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

app.set('views', './views') // especifica el directorio de vistas
app.set('view engine', 'ejs') // registra el motor de plantillas

const server = app.listen(PORT, (err) => {
    if (err) {
        console.log("Error while starting server")
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
    console.log(`GET ${req.params.id? "WITH ID => id: " + req.params.id : "ALL => "} -- productsRouters`)
    let filteredArray = req.params.id ? products.filter(prod => prod.id == req.params.id) : products

    res.json({status: "OK", products: filteredArray, isEmpty: filteredArray.length ?  false : true })
})

/**
 *  products EndPoints - ADMIN ONLY
 */


productsRouters.post('/', (req, res) => {
    console.log(`POST -- productsRouters`)
    let prod = req.body
    let response = {}

    if (Object.keys(prod).length !== 0 && !Object.values(prod).includes('')) {
        const max = products.reduce((a, b) => a.id > b.id ? a : b, { id: 0 })
        prod.id = Number(max.id) + 1
        prod.timestamp = Date.now()
        products.push(prod)
        //Save to file
        contenedor.save(prod)
        response = { status: "ok", id: prod.id}
    } else {
        response = { error: 'Algunos campos del producto no fueron completados.' }
    }

    res.json(response)
    //res.render('page/form')
})

productsRouters.put('/:id', (req, res) => {
    console.log(`PUT => id: ${req.params.id} -- productsRouters`)
    let prod = req.body
    let id = req.params.id
    let index = products.findIndex(prod => prod.id == id)

    if (index >= 0) {
        prod.id = id
        products[index] = prod
        //Save to file
        contenedor.updateById(id, prod)
    }
    res.json(index >= 0 ? { id: id } : { error: 'Producto no encontrado.' })
})

productsRouters.delete('/:id', (req, res) => {
    console.log(`DELETE => id: ${req.params.id} -- productsRouters`)
    let id = req.params.id
    let index = products.findIndex(prod => prod.id == id)

    if (index >= 0) {
        products.splice(index, 1)
        //Save to file
        contenedor.deleteById(id)
    }
    res.json(index >= 0 ? { id: id } : { error: 'Producto no encontrado.' })
})


/**
 *  Carrito EndPoints
 */

cartsRouters.post('/', (req, res) => {
    console.log(`POST CrearCarrito-- cartsRouters`)
    let newCart = {}
    const max = carts.reduce((a, b) => a.id > b.id ? a : b, { id: 0 })
    newCart.id = Number(max.id) + 1
    newCart.timestamp = Date.now()
    newCart.products = []
    carts.push(newCart)
    //Save to file
    cartsContainer.save(newCart)
    
    res.json({ status: "OK", description: "POST CREATE CART RETURN ID", id: newCart.id })
})

cartsRouters.delete('/:id', (req, res) => {
    console.log(`DELETE Carrito => id: ${req.params.id} -- cartsRouters`)
    let id = req.params.id
    let index = carts.findIndex(cart => cart.id == id)

    if (index >= 0) {
        carts.splice(index, 1)
        //Save to file
        cartsContainer.deleteById(id)
    }
    res.json(index >= 0 ? { status: "OK", description: `DELETE CART WITH ID: ${id}`, id: id } : { error: 'Carrito no encontrado.' })
})

cartsRouters.get('/:id/productos', (req, res) => {
    console.log(`GET Productos => id: ${req.params.id} -- cartsRouters`)
    let id = req.params.id
    let index = carts.findIndex(cart => cart.id == id)

    res.json(index >= 0 ? { status: "OK", description: `GET CART WITH ID: ${id}`, cart: carts[index] } : { error: 'Carrito no encontrado.' })
})

cartsRouters.post('/:id/productos', (req, res) => {
    console.log(`POST Carrito => id: ${req.params.id} -- cartsRouters`)
    let id_prod = req.body.id_prod
    let id_cart = req.params.id
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

    res.json(response)

    
})

cartsRouters.delete('/:id/productos/:id_prod', (req, res) => {
    console.log(`DELETE Productos IDPROD: ${req.params.id_prod}  FROM CART ID: ${req.params.id} -- cartsRouters`)
    let id_cart = req.params.id
    let id_prod = req.params.id_prod
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

    res.json(response)
})


/**
 * Undefined endpoint
 */
app.all('*', (req, res) => {
    res.json({ error: -2, descripcion: `Ruta ${req.url} método ${req.method} no implementada.` })
})



