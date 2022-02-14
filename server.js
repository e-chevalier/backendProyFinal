import express from 'express';
import { Contenedor } from './Contenedor.js'

const app = express()

const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('node_modules/bootstrap/dist'))


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

app.get('/productos', (req, res) => { 
    res.render('page/productList', {productos: fakeApi(), isEmpty: fakeApi().length? false:true})
})

app.post('/productos', (req, res) => {
    let prod = req.body
    if ( Object.keys(prod).length !== 0 && prod.title !== '' && prod.price !== '' && prod.thumbnail !== '') {
        const max = productos.reduce((a,b) => a.id > b.id ? a:b, {id: 0} )
        prod.id = max.id + 1
        productos.push(prod)
        contenedor.save(prod) 
    }
    res.render('page/form')
})







