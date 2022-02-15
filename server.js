import 'dotenv/config'
import express from 'express';
import { Contenedor } from './Contenedor.js'

const app = express()
const productosRouters = express.Router()
const carritoRouters = express.Router()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('node_modules/bootstrap/dist'))
app.use('/api/productos', productosRouters)
app.use('/api/carrito', carritoRouters)

const PORT = process.env.PORT || process.env.PORT_DEV

app.set('views', './views'); // especifica el directorio de vistas
app.set('view engine', 'ejs'); // registra el motor de plantillas

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}
                 Open link to http://127.0.0.1:${server.address().port}`)
})

server.on("error", error => console.log(`Error en servidor ${error}`))


const contenedor = new Contenedor('productos.txt')
const productos = await contenedor.getAll()
//productos.length = 0

const fakeApi = () => productos

/**
 *  Productos EndPoint - Users and Admin
 */

productosRouters.get('/:id?', (req, res) => { 
    res.render('page/productList', {productos: fakeApi(), isEmpty: fakeApi().length? false:true})
})

/**
 *  Productos EndPoints - ADMIN ONLY
 */

productosRouters.post('/', (req, res) => {
    let prod = req.body
    if ( Object.keys(prod).length !== 0 && prod.title !== '' && prod.price !== '' && prod.thumbnail !== '') {
        const max = productos.reduce((a,b) => a.id > b.id ? a:b, {id: 0} )
        prod.id = max.id + 1
        productos.push(prod)
        contenedor.save(prod) 
    }
    res.render('page/form')
})

productosRouters.put('/:id', (req, res) => { 
    res.json({status: "PUT"})
})

productosRouters.delete('/:id', (req, res) => {
    res.json({status: "DELETE"})
})


/**
 *  Carrito EndPoints
 */

carritoRouters.post('', (req, res) => {
    res.json({status: "POST CREATE CART RETURN ID", id: 12})
})

carritoRouters.delete('/:id', (req, res) => {
    res.json({status: `DELETE CART WITH ID: ${req.params.id}` })
})

carritoRouters.get('/:id/productos', (req, res) => {
    res.json({status: "GET PRODUCTOS FROM CART", id: req.params.id})
})

carritoRouters.post('/:id/productos', (req, res) => {
    res.json({status: "POST PRODUCTOS TO CART", id: req.params.id})
})

carritoRouters.delete('/:id/productos/:id_prod', (req, res) => {
    res.json({status: `DELETE PRODUCTO IDPROD: ${req.params.id_prod}  FROM CART ID: ${req.params.id_prod}`, id: req.params.id, id_prod: req.params.id})
})





