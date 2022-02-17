import { carritoApi } from '../components/carrito/index.js'
import { productosApi } from '../components/productos/index.js'

export const serverRoutes = ( app ) => {
    carritoApi(app)
    productosApi(app)
    app.get("/", (req, res, next) => {
        res.send("Todo ok")
    })
    /**
    * Undefined endpoint
    */
    app.all('*', (req, res, next) => {
        res.json({ error: -2, descripcion: `Ruta ${req.url} método ${req.method} no implementada.` })
    })
}