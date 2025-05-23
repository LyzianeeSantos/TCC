import './avaliacoes/avaliacoes.js'

import { loadNavbar } from './componentes/navbar.js'
import { loadServicos } from "./componentes/servicos.js"
import { loadContato } from "./componentes/contato.js"
import { loadAvaliacao } from "./componentes/avaliacao.js"
import { loadFooter } from "./componentes/footer.js"
import { loadLogin } from "./componentes/login-registro.js"
import { loadFooterSecundario } from './componentes/footer2.js'
import { loadAddServico } from './componentes/modal/addServico.js'
import { loadResumo } from './componentes/modal/resumo.js'
import { loadSair } from './componentes/modal/sair.js'

loadNavbar ()
loadServicos ()
loadLogin ()
loadContato ()
loadAvaliacao ()
loadFooter ()
loadFooterSecundario ()
loadAddServico ()
loadResumo ()
loadSair ()