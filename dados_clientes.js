var lista = [
    'cliente_selecionado',
    'pedidos',
    'estado',
    'cep',
    'bairro',
    'cidade',
    'cnpj',
    'nome_projeto',
    'contrato',
    'data',
    'data_previsao',
    'analista',
    'email_analista',
    'telefone_analista',
    'vendedor',
    'email_vendedor',
    'telefone_vendedor',
    'consideracoes',
    'tipo_de_frete',
    'condicoes',
    'garantia'
];

var estados = {
    "--": "--",
    "Acre": "AC",
    "Alagoas": "AL",
    "Amapá": "AP",
    "Amazonas": "AM",
    "Bahia": "BA",
    "Ceará": "CE",
    "Distrito Federal": "DF",
    "Espírito Santo": "ES",
    "Goiás": "GO",
    "Maranhão": "MA",
    "Mato Grosso": "MT",
    "Mato Grosso do Sul": "MS",
    "Minas Gerais": "MG",
    "Pará": "PA",
    "Paraíba": "PB",
    "Paraná": "PR",
    "Pernambuco": "PE",
    "Piauí": "PI",
    "Rio de Janeiro": "RJ",
    "Rio Grande do Norte": "RN",
    "Rio Grande do Sul": "RS",
    "Rondônia": "RO",
    "Roraima": "RR",
    "Santa Catarina": "SC",
    "São Paulo": "SP",
    "Sergipe": "SE",
    "Tocantins": "TO"
};

var regioes_por_estado = {
    "--": "Não definido",
    "AC": "Norte",
    "AL": "Nordeste",
    "AP": "Norte",
    "AM": "Norte",
    "BA": "Nordeste",
    "CE": "Nordeste",
    "DF": "Centro-Oeste",
    "ES": "Sudeste",
    "GO": "Centro-Oeste",
    "MA": "Nordeste",
    "MT": "Centro-Oeste",
    "MS": "Centro-Oeste",
    "MG": "Sudeste",
    "PA": "Norte",
    "PB": "Nordeste",
    "PR": "Sul",
    "PE": "Nordeste",
    "PI": "Nordeste",
    "RJ": "Sudeste",
    "RN": "Nordeste",
    "RS": "Sul",
    "RO": "Norte",
    "RR": "Norte",
    "SC": "Sul",
    "SP": "Sudeste",
    "SE": "Nordeste",
    "TO": "Norte"
};

recuperar()
vendedores_analistas()
carregar_pagamentos()
estados_siglas()
recuperar_preenchido()
incluir_listeners()


// Opções no input de clientes; 
var clientes = JSON.parse(localStorage.getItem('dados_clientes'))
var datalist = document.getElementById('datalist_clientes');

for (cliente in clientes) {
    var option = document.createElement('option');
    option.value = cliente;
    datalist.appendChild(option);
}

// Opções no input de departamentos; 
var departamentos = JSON.parse(localStorage.getItem('dados_departamentos'))
var datalist = document.getElementById('datalist_departamentos');

for (departamento in departamentos) {
    var option = document.createElement('option');
    option.value = departamento;
    datalist.appendChild(option);
}


function limpar_campos() {
    openPopup('Limpar os campos?')
    document.getElementById('sim_nao_limpar').style.display = 'block'
    document.getElementById('limpar_campos').addEventListener('click', function () {

        document.getElementById('aux_estado').value = '--'
        document.getElementById('estado').textContent = '--'
        lista.forEach(function (item) {
            document.getElementById(item).value = ''
        })
        document.getElementById('sim_nao_limpar').style.display = 'none'
        closePopup()
        salvar_preenchido()
        total()
    })
}

var codigos_regioes_custo = {
    'Nordeste': 'gcs-272',
    'Norte': 'gcs-274',
    'Centro-Oeste': 'gcs-273',
    'Sul': 'gcs-271',
    'Sudeste': 'gcs-270'
}

function estados_siglas() {
    var select = document.getElementById('aux_estado')
    select.addEventListener('change', function () {
        var estado = estados[document.getElementById('aux_estado').value]

        try {
            var dados_composicoes_orcamento = JSON.parse(localStorage.getItem('dados_composicoes_orcamento'));

            var regiao = regioes_por_estado[estado]
            var codigo = codigos_regioes_custo[regiao] // Código da região modificado;

            document.getElementById('estado').textContent = estado

            var codigo_atual = Object.keys(dados_composicoes_orcamento)[0] // Código atual nos dados;

            var composicao_atual = dados_composicoes_orcamento[codigo_atual]

            delete dados_composicoes_orcamento[codigo_atual]

            dados_composicoes_orcamento[codigo] = composicao_atual

            localStorage.setItem('dados_composicoes_orcamento', JSON.stringify(dados_composicoes_orcamento))

            var tabela = document.getElementById('linhas');
            var As = tabela.querySelectorAll('[id^="A"]');

            As.forEach(function (codigo_existente) {

                if (codigo_existente.textContent == codigo_atual) {

                    var i = String(codigo_existente.id).slice(1)
                    document.getElementById('A' + i).textContent = codigo
                }
            })
        } catch {
            'Sem composições: script Dados_clientes '
        }

    })

    var estados_ = Object.keys(estados)

    estados_.forEach(function (item) {
        var option = document.createElement('option')
        option.textContent = item
        select.appendChild(option)
    })

}

function carregar_pagamentos() {
    var dados_pagamentos = JSON.parse(localStorage.getItem('dados_pagamentos'))
    var condicoes = document.getElementById('condicoes')

    dados_pagamentos.forEach(function (item) {
        var option = document.createElement('option')
        option.textContent = item
        condicoes.appendChild(option)
    })
}


function toggleTabela() {
    var tabela = document.getElementById('tabela_dados_cliente');
    tabela.classList.toggle('show');
}

function pagina_adicionar() {
    salvar_preenchido()
    window.location.href = 'adicionar.html'
}

function vendedores_analistas() {
    var dados_vendedores = JSON.parse(localStorage.getItem('vendedores'))
    var vendedores = Object.keys(dados_vendedores)

    var select = document.getElementById('vendedor')

    select.addEventListener('change', function () {
        atualizar_dados_vendedores()
        salvar_preenchido()
    })

    vendedores.forEach(function (vend_) {
        var option = document.createElement('option')
        option.textContent = vend_
        select.appendChild(option)
    })

    var dados_acesso = JSON.parse(localStorage.getItem('acesso'))

    document.getElementById('analista').textContent = dados_acesso.nome_completo
    document.getElementById('email_analista').textContent = dados_acesso.email
    document.getElementById('telefone_analista').textContent = dados_acesso.telefone

    atualizar_dados_vendedores()

}

function atualizar_dados_vendedores() {

    var dados_vendedores = JSON.parse(localStorage.getItem('vendedores'))
    var vendedor = document.getElementById('vendedor').value
    document.getElementById('email_vendedor').textContent = dados_vendedores[vendedor]['email']
    document.getElementById('telefone_vendedor').textContent = dados_vendedores[vendedor]['telefone']
}


function incluir_listeners() {
    lista.forEach(function (item) {
        document.getElementById(item).addEventListener('change', function () {
            preencher()
            salvar_preenchido()
        })
    })
    document.getElementById('aux_estado').addEventListener('click', function () {
        total()
        salvar_preenchido()
    })
}


function salvar_preenchido() {

    let dados_preenchidos = {};

    lista.forEach(function (item) {
        let elemento = document.getElementById(item);
        if (item == 'garantia') {
            if (elemento.value == '') {
                dados_preenchidos[item] = '1 ano'
            } else {
                dados_preenchidos[item] = elemento.value
            }
        } else if (item == 'condicoes') {
            dados_preenchidos[item] = elemento.value
        } else if (item == 'estado') {
            var vsk = document.getElementById('aux_estado').value
            dados_preenchidos['aux_estado'] = vsk
            dados_preenchidos['estado'] = estados[vsk]
        } else {
            dados_preenchidos[item] = elemento ? elemento.value || elemento.textContent : null;
        }
    });

    localStorage.setItem('dados_preenchidos', JSON.stringify(dados_preenchidos));
}


function recuperar_preenchido() {

    let dados_preenchidos = JSON.parse(localStorage.getItem('dados_preenchidos'));

    //Acrescenta-se uma option nova no selection ao recuperar, pra garantir que o valor seja mostrado;
    try {
        var option = document.createElement('option')
        option.textContent = dados_preenchidos['cliente_selecionado']
        document.getElementById('cliente_selecionado').appendChild(option)

        var option2 = document.createElement('option')
        option2.textContent = dados_preenchidos['nome_projeto']
        document.getElementById('nome_projeto').appendChild(option2)
        let alicia_keys = Object.keys(dados_preenchidos)

        alicia_keys.forEach(function (chave) {

            if (chave == 'estado') {

                document.getElementById(chave).textContent = dados_preenchidos[chave]
                document.getElementById('aux_estado').value = dados_preenchidos['aux_estado']

            } else {

                document.getElementById(chave).value = dados_preenchidos[chave]

            }

        })
    } catch {
        console.log('Não foi inserido a option[input] porque não existem dados preenchidos')
    }

}

function formatarCEP(cep) {
    cep = String(cep);
    cep = cep.replace(/\D/g, '');
    cep = cep.replace(/^(\d{5})(\d{3})/, '$1-$2');
    return cep;
}

function preencher(cliente) {

    var dados_clientes = JSON.parse(localStorage.getItem('dados_clientes'))

    if (cliente == null) {
        var cliente = document.getElementById('cliente_selecionado').value
    }

    let lista = ['estado', 'cep', 'bairro', 'cidade', 'cnpj']

    try {
        lista.forEach(function (item) {
            var campo_atual = document.getElementById(item)

            if (item == 'cep') {
                if (campo_atual.value == '') {
                    campo_atual.value = formatarCEP(dados_clientes[cliente][item])
                } else {
                    campo_atual.value = formatarCEP(campo_atual.value)
                }
            } else if (item == 'estado') {
                if (campo_atual.value == '') {
                    campo_atual.textContent = dados_clientes[cliente][item]
                }
            } else {
                if (campo_atual.value == '') {
                    campo_atual.value = dados_clientes[cliente][item]
                }
            }

        })

    } catch {

        document.getElementById('cep').value = formatarCEP(document.getElementById('cep').value)

    }

    if (document.getElementById('data').value == "") {
        document.getElementById('data').value = new Date().toISOString().split('T')[0];
    }

}


