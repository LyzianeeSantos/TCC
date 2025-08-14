import { loadNavbar } from './componentes/navbar.js'
import { atualizarNavbar } from './auth.js'

loadNavbar().then(() => {
    atualizarNavbar()
})

import { loadFooter } from "./componentes/footer/footer.js"
import { loadLogin } from "./componentes/login-registro.js"

loadLogin ()
loadFooter ()
