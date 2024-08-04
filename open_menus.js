itens_menu()

inicializar()

recuperar_itens()

function unicoID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now();
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

function carregar_orcamentos() {

    fetch('https://script.google.com/macros/s/AKfycbx40241Ogk6vqiPxQ3RDjf4XURo3l_yG0x9j9cTNpeKIdnosEEewTnw7epPrc2Ir9EX/exec?bloco=orcamentos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar os dados');
            }
            return response.json();
        })
        .then(data => {


            var orcamentos = {}
            data.forEach(function (orcamento) {

                let orcamento_parse = JSON.parse(orcamento)

                let id_orcamento = orcamento_parse.id

                orcamentos[id_orcamento] = orcamento_parse
            })

            localStorage.setItem('dados_orcamentos', JSON.stringify(orcamentos))

        })

}

function inicializar() {

    try {

        document.getElementById('itens').style.display = 'none'
        document.getElementById('menu').style.width = '0px'
        document.getElementById('content').style.marginLeft = '20px'

        document.getElementById('menu-toggle').addEventListener('click', function () {
            var menu = document.getElementById('menu');
            var content = document.getElementById('content');
            if (menu.style.width === '0px' || menu.style.width === '') {
                menu.style.width = '250px';
                content.style.marginLeft = '270px';
                document.getElementById('itens').style.display = 'block'
            } else {
                menu.style.width = '0';
                content.style.marginLeft = '20px';
                document.getElementById('itens').style.display = 'none'
            }
        });

        var div = document.createElement('div')
        div.style.height = '200px'

        var footer = document.createElement('footer')
        var span = document.createElement('span')
        span.innerHTML = '&copy; Grupo Costa Silva - Ferramenta de gestão de projetos'
        footer.style.position = 'fixed'
        footer.appendChild(span)
        document.body.appendChild(div)
        document.body.appendChild(footer)

    } catch { console.log('Erro no script inicializar do Open_menus') }
}

function maiorId(prefixo) {
    var ids = document.querySelectorAll('[id^="' + prefixo + '"]');
    var maiorValor = 0;

    ids.forEach(function (elemento) {
        var numeroId = parseInt(elemento.id.substring(prefixo.length));

        if (!isNaN(numeroId) && numeroId > maiorValor) {
            maiorValor = numeroId;
        }
    });

    return maiorValor + 1;
}

function ampliar(url) {
    var div = document.getElementById('imagem');
    document.getElementById('img').src = url
    div.classList.toggle('show');
}

function fechar() {
    var div = document.getElementById('imagem');
    div.classList.remove('show');
    try {
        document.getElementById('fileInput').style.display = 'none'
    } catch { }
}

function conversor(stringMonetario) {

    if (typeof stringMonetario === 'number') {
        return stringMonetario
    } else {
        stringMonetario = stringMonetario.trim();
        stringMonetario = stringMonetario.replace(/[^\d,]/g, '');
        stringMonetario = stringMonetario.replace(',', '.');
        var valorNumerico = parseFloat(stringMonetario);

        if (isNaN(valorNumerico)) {
            return 0;
        }

        return valorNumerico;
    }
}

function dinheiro(valor) {
    if (valor === '') {
        return 'R$ 0,00';
    } else {
        valor = Number(valor);
        return 'R$ ' + valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
}

function carregar_pagina(html, css, scripts) {

    function loadAndInsertCSS(url) {
        fetch(url)
            .then(response => response.text())
            .then(cssContent => {
                const styleElement = document.createElement('style');
                styleElement.textContent = cssContent;
                document.head.appendChild(styleElement);
            })
            .catch(error => console.error(`Erro ao carregar o CSS ${url}:`, error));
    }


    function loadAndExecuteScript(url) {
        fetch(url)
            .then(response => response.text())
            .then(scriptContent => {
                const scriptElement = document.createElement('script');
                scriptElement.textContent = scriptContent;
                document.body.appendChild(scriptElement);
            })
            .catch(error => console.error(`Erro ao carregar o script ${url}:`, error));
    }


    fetch(htmlUrl)
        .then(response => response.text())
        .then(data => {
            const div = document.createElement('div');
            div.innerHTML = data;
            document.getElementById('content').appendChild(div);

            cssUrls.forEach(loadAndInsertCSS);

            scriptUrls.forEach(loadAndExecuteScript);
        })
        .catch(error => console.error('Erro ao buscar a página:', error));
}

var dados_paginas = {
    'PÁGINA INICIAL': {
        html: 'https://raw.githubusercontent.com/devleonny/devleonny/main/inicial.html',
        css: [
            'https://raw.githubusercontent.com/devleonny/devleonny/main/gcsobras.css',
        ],
        scripts: [
            'https://raw.githubusercontent.com/devleonny/devleonny/main/open_menus.js'
        ]
    }
}

function itens_menu() {

    var divMenu = document.createElement('div')
    divMenu.id = 'menu'
    var corpo = document.body

    corpo.appendChild(divMenu)

    // Vou meter um popup também

    let divP = document.createElement('div')
    divP.id = "popup"
    divP.classList = "popup_alerta"
    var div_botoes = document.createElement('div')
    let h2P = document.createElement('h2')
    h2P.style.textAlign = 'center'
    h2P.id = 'mensagem'

    let button_baixar = document.createElement('button')
    button_baixar.textContent = 'Baixar'
    button_baixar.id = 'baixar'

    let buttonP = document.createElement('button')
    buttonP.textContent = 'Fechar'
    buttonP.addEventListener('click', function () {
        fecharPopup()
    })

    div_botoes.style = 'display: flex; justify-content: space-evenly;'

    div_botoes.append(button_baixar, buttonP)
    divP.append(h2P, div_botoes)
    corpo.appendChild(divP)
    // Fim do pop up

    var acesso = JSON.parse(localStorage.getItem('acesso'))

    var nomes = [
        'PÁGINA INICIAL',
        'CRIAR ORÇAMENTO',
        'ORÇAMENTOS',
        'PROJETOS',
        'COMPOSIÇÕES',
        'FINANCEIRO',
        'SAIR'
    ];

    var menu = document.getElementById('menu');

    var div = document.createElement('div');
    div.id = 'menu-toggle';
    div.innerHTML = '&#9776';
    menu.appendChild(div);

    var ul = document.createElement('ul');
    var div = document.createElement('div')
    var h2 = document.createElement('h2')
    var p = document.createElement('p')
    p.textContent = acesso.permissao
    h2.textContent = acesso.usuario
    h2.style.padding = '10px'

    div.style = 'margin-bottom: 20%; cursor: pointer; border: 1px solid white; padding: 10px;display: flex; justify-content: center; align-items: center; background-color: #ab0000; color: white; border-radius: 20px; width: 80%'
    div.appendChild(h2)
    div.appendChild(p)
    div.addEventListener('click', function () {
        location.href = 'perfil.html'
    })

    ul.appendChild(div)

    ul.id = 'itens';
    ul.style.marginTop = '100px';
    ul.style.marginLeft = '20px'

    nomes.forEach(function (item) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.textContent = item;
        a.href = '#'; 
    
        a.addEventListener('click', function (event) {
            event.preventDefault(); 
            carregar_pagina(dados_paginas[item].html, dados_paginas[item].css, dados_paginas[item].scripts);
            
            if (item == 'SAIR') {
                localStorage.removeItem('acesso');
            }
        });
    
        li.appendChild(a);
        ul.appendChild(li);
    });

    menu.appendChild(ul);
}

function mostrarPopup(mensagem, link) {
    var popup = document.getElementById('popup');
    popup.classList.add('aberto');
    document.getElementById('mensagem').textContent = mensagem
    var div = document.getElementById('popup')
    var button = document.getElementById('baixar')
    button.addEventListener('click', function () {
        window.location.href = link;
        fecharPopup()
    });
}

function fecharPopup() {
    var popup = document.getElementById('popup');
    popup.classList.remove('aberto');
}


function ir_pdf(orcam_) {
    let dados_orcamentos = JSON.parse(localStorage.getItem('dados_orcamentos'))

    localStorage.setItem('pdf', JSON.stringify(dados_orcamentos[orcam_]))

    window.location.href = ('pdf.html');
}


function recuperar_projetos() {

    let url = 'https://script.google.com/macros/s/AKfycbx40241Ogk6vqiPxQ3RDjf4XURo3l_yG0x9j9cTNpeKIdnosEEewTnw7epPrc2Ir9EX/exec?bloco=projetos'

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar os dados');
            }
            return response.json();
        })
        .then(data => {

            localStorage.setItem('dados_projetos', JSON.stringify(data))

        })
}

function removerLinha(select) {
    var linha = select.closest('tr');
    linha.parentNode.removeChild(linha);
}

function apagar(codigo_orcamento) {

    var acesso = JSON.parse(localStorage.getItem('acesso'))

    if (acesso.permissao != 'adm') {

        openPopup('Seu acesso não permite esta ação. Apenas adms podem fazer isso.')

    } else {

        var exclusao_orcamento = {
            'tabela': 'excluir',
            'id': codigo_orcamento
        }

        fetch('https://script.google.com/a/macros/hopent.com.br/s/AKfycbx40241Ogk6vqiPxQ3RDjf4XURo3l_yG0x9j9cTNpeKIdnosEEewTnw7epPrc2Ir9EX/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(exclusao_orcamento)
        })
        openPopup('Orçamento Excluído');

        var dados_orcamentos = JSON.parse(localStorage.getItem('dados_orcamentos'));

        delete dados_orcamentos[codigo_orcamento]

        localStorage.setItem('dados_orcamentos', JSON.stringify(dados_orcamentos))
    }

}

function calcularProporcao(dataInicio, dataFim) {
    var hoje = new Date();

    var inicio = new Date(formatodata(dataInicio));
    var fim = new Date(formatodata(dataFim));


    if (inicio > hoje) {
        return '0%';
    }

    var diferenca = Math.abs(fim - inicio);
    var diasTotais = diferenca / (1000 * 3600 * 24);

    var diferencaHoje = Math.abs(hoje - inicio);
    var diasPassados = diferencaHoje / (1000 * 3600 * 24);

    var proporcao = (diasPassados / diasTotais) * 100;

    var resultado = Math.min(proporcao, 100).toFixed(2) + '%';

    return resultado;
}

function formatodata(data) {

    var partes = data.split('/');
    var dia = partes[0];
    var mes = partes[1];
    var ano = partes[2];
    return `${ano}-${mes}-${dia}`;
}

function sincronizar_orcamento(orcamento) {

    fetch('https://script.google.com/a/macros/hopent.com.br/s/AKfycbx40241Ogk6vqiPxQ3RDjf4XURo3l_yG0x9j9cTNpeKIdnosEEewTnw7epPrc2Ir9EX/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orcamento)
    })

}

function pesquisar_itens() {
    var pesquisa = document.getElementById('campo-pesquisa-itens').value

    local_dados_itens(pesquisa)
}

function local_dados_itens(pesquisa) {

    var tabela = document.getElementById('tabela_itens')

    tabela.innerHTML = ''

    let dados_itens = JSON.parse(localStorage.getItem('dados_itens'))

    if (dados_itens) {

        dados_itens.forEach(function (linha) {

            let tr = document.createElement('tr');

            var textos = []

            for (let i = 0; i < 8; i++) {

                var td = document.createElement('td');

                if (i === 7) {
                    let img = document.createElement('img')
                    img.src = linha[i]
                    img.style = 'width: 30px;'
                    img.addEventListener('click', function () {
                        ampliar(linha[i])
                    })
                    td.style.width = '5vh'
                    td.appendChild(img)
                    tr.appendChild(td);
                } else if (i === 4 || i === 6) {
                    continue
                } else {
                    td.textContent = linha[i]
                    textos.push(linha[i])
                    tr.appendChild(td);
                }


            }

            if (!pesquisa || pesquisa.trim() === '') {
                tabela.appendChild(tr)
            } else {
                let adicionaLinha = false

                textos.forEach(function (texto) {
                    if (typeof texto === 'string' && texto.toLowerCase().includes(pesquisa.toLowerCase())) {
                        adicionaLinha = true
                    }
                })

                if (adicionaLinha) {
                    tabela.appendChild(tr)
                }
            }

        });
    }

}


function recuperar_itens() {

    let url = 'https://script.google.com/macros/s/AKfycbx40241Ogk6vqiPxQ3RDjf4XURo3l_yG0x9j9cTNpeKIdnosEEewTnw7epPrc2Ir9EX/exec?bloco=itens'

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar os dados');
            }
            return response.json();
        })
        .then(data => {

            data['9999-nulo'] = {
                'descricao': '--',
                'familia': '--',
                'grupo': '--',
                'imagem': 'https://i.imgur.com/Nb8sPs0.png',
                'ncm': '--',
                'tipo': '--',
                'unidade': '--'
            }

            localStorage.setItem('dados_itens', JSON.stringify(data))

        })
        .catch(error => {
            console.error('Ocorreu um erro:', error);
        });
}


//Scripts da guia Composições;

function autorizar_alteracao(tipo_1_2) {

    var acesso = JSON.parse(localStorage.getItem('acesso'))

    if (acesso.permissao == 'adm') {
        openPopup("Deseja confirmar a alteração?")
        document.getElementById('sim_nao_alterar').style.display = 'block'
        var botao = document.getElementById('alterar_composicao')

        botao.addEventListener('click', function () {
            enviar_composicao(tipo_1_2)
            closePopup()
        })


    } else {
        openPopup('Seu acesso não permite esta ação. Apenas adms podem fazer isso.')
    }

}

var grupos = JSON.parse(localStorage.getItem('dados_grupos'))
var grupos_keys = Object.keys(grupos)


function confirmacao() {

    openPopup('Você tem certeza que deseja excluir')
    ocultarRetangulo()
    document.getElementById('sim_nao').style.display = 'block'

}

function cancelar() {
    closePopup()
    document.getElementById('sim_nao').style.display = 'none'
}

function excluir() {

    var codigo_excluir = document.getElementById('campo_0').textContent
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('tabela_alterar_ocultar').style.display = 'none';

    var composicao = {
        'tabela': 'composicoes',
        'operacao': 'excluir',
        'codigo': codigo_excluir
    }

    fetch('https://script.google.com/a/macros/hopent.com.br/s/AKfycbx40241Ogk6vqiPxQ3RDjf4XURo3l_yG0x9j9cTNpeKIdnosEEewTnw7epPrc2Ir9EX/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(composicao)
    });

    recuperar();
    ocultarRetangulo();
    document.getElementById('loading').style.display = 'none';
    document.getElementById('tabela_alterar_ocultar').style.display = 'block';
    local_dados();
    openPopup('Item excluído');
}


function mais_item() {
    var dados_composicoes = JSON.parse(localStorage.getItem('dados_composicoes'))

    var tabela = document.getElementById('incluir_composicoes')

    var tr = document.createElement('tr')
    var td1 = document.createElement('td')
    var label = document.createElement('label')
    label.textContent = Object.keys(dados_composicoes)[0]
    var cod1 = 'X' + maiorId('X')
    label.id = cod1
    td1.appendChild(label)

    var td2 = document.createElement('td')
    var select = document.createElement('select')
    var cod2 = 'Y' + maiorId('Y')
    select.id = cod2
    select.addEventListener('change', function () {
        var dados_composicoes = JSON.parse(localStorage.getItem('dados_composicoes'))
        var descricao = document.getElementById(cod2).value
        for (codigo in dados_composicoes) {
            if (dados_composicoes[codigo].descricao == descricao) {
                document.getElementById(cod1).textContent = codigo
                break
            }
        }

    })
    for (codigo in dados_composicoes) {
        var option = document.createElement('option')
        option.textContent = dados_composicoes[codigo].descricao
        select.appendChild(option)
    }
    td2.appendChild(select)

    var td3 = document.createElement('td')
    var input2 = document.createElement('input')
    input2.type = 'number'
    var cod3 = 'Z' + maiorId('Z')
    input2.id = cod3

    td3.appendChild(input2)

    var button = document.createElement('button')
    button.textContent = 'Remover'
    button.addEventListener('click', function () {
        tabela.removeChild(tr);
    })

    tr.append(td1, td2, td3, button)
    tabela.appendChild(tr)

}


function enviar_composicao(enviar) {
    var dados_composicoes = JSON.parse(localStorage.getItem('dados_composicoes'))
    let descricao;
    let composicao;

    if (enviar == 1) {
        var codigo = document.getElementById('codigo_').textContent;

        descricao = String(document.getElementById('descricao_').value).toUpperCase();
        composicao = {
            'tabela': 'composicoes',
            'codigo': String(codigo),
            'composicao': {
                'descricao': descricao,
                'grupo': document.getElementById('grupos').value,
                'tipo': document.getElementById('tipo_').value,
                'omie': document.getElementById('omie_').value,
                'carrefour': document.getElementById('carrefour_').value,
                'geral': document.getElementById('geral_').value,
                'imagem': ''
            }
        };
        enviar_ok();
        abrir_fechar();

    } else {
        var tamanho = maiorId('X');
        var comp_ = [];
        for (let i = 1; i < tamanho; i++) {
            try {
                var cod = document.getElementById('X' + i).textContent;
                var qtde = document.getElementById('Z' + i).value;
                comp_.push({ cod: cod, qtde: qtde });
            } catch (error) {
                console.log('Item ' + i + ' foi excluído...');
            }
        }

        descricao = String(document.getElementById('campo_1').value).toUpperCase();
        var codigo = document.getElementById('campo_0').textContent

        composicao = {
            'tabela': 'composicoes',
            'codigo': codigo,
            'composicao': {
                'descricao': descricao,
                'grupo': document.getElementById('campo_2').value,
                'tipo': document.getElementById('campo_3').value,
                'omie': document.getElementById('campo_4').value,
                'composicao': JSON.stringify(comp_), // Stringfy aqui para preservar a estrutura;
                'carrefour': Number(document.getElementById('campo_5').value),
                'geral': Number(document.getElementById('campo_6').value),
                'imagem': dados_composicoes[codigo].imagem
            }
        };

        enviar_ok();
        document.getElementById('sim_nao_alterar').style.display = 'none'
    }

    function enviar_ok() {
        // Salvamento provisório no localStorage
        var composicoes_provisorias = JSON.parse(localStorage.getItem('dados_composicoes')) || {};
        composicoes_provisorias[composicao.codigo] = composicao['composicao'];
        localStorage.setItem('dados_composicoes', JSON.stringify(composicoes_provisorias));

        // Enviando dados para a API
        fetch('https://script.google.com/a/macros/hopent.com.br/s/AKfycbx40241Ogk6vqiPxQ3RDjf4XURo3l_yG0x9j9cTNpeKIdnosEEewTnw7epPrc2Ir9EX/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(composicao)
        });

        document.getElementById('loading').style.display = 'flex';
        document.getElementById('tabela_alterar_ocultar').style.display = 'none';

        setTimeout(function () {
            recuperar()
            ocultarRetangulo();
            openPopup('Composição salva');
            document.getElementById('loading').style.display = 'none';
            document.getElementById('tabela_alterar_ocultar').style.display = 'block';
            local_dados(descricao);
        }, 1000);
    }
}

function abrir_fechar() {
    var tabela = document.getElementById('nova_composicao');
    tabela.classList.toggle('show');
    document.getElementById('codigo_').textContent = unicoID()
}

function ocultarRetangulo() {
    document.getElementById('retangulo').style.display = 'none';
}

function pesquisar() {
    var pesquisa = document.getElementById('campo-pesquisa').value
    local_dados(pesquisa)
}

function local_dados(pesquisa) {
    let dados_composicoes = JSON.parse(localStorage.getItem('dados_composicoes'));
    let tabela_produtos = document.getElementById('tabela_produtos');
    tabela_produtos.innerHTML = '';

    if (!dados_composicoes) {
        openPopup('Aguarde...');
        setTimeout(function () {
            closePopup();
            location.reload();
        }, 2000);
        return; // Sai da função, pois `dados_composicoes` não está disponível.
    }

    var itens = Object.keys(dados_composicoes);
    var cabecalho = document.getElementById('cabecalho');

    // Limpa o cabeçalho antes de adicionar novas colunas
    cabecalho.innerHTML = '';

    var colunas = Object.keys(dados_composicoes[itens[0]]); // Inclui 'Código' como a primeira coluna

    colunas.forEach(function (item) {
        var th = document.createElement('th');
        th.textContent = String(item).toUpperCase();
        cabecalho.appendChild(th);
    });

    // Adiciona as linhas à tabela
    itens.forEach(function (composicao) {
        var tr = document.createElement('tr');

        // Clique na linha para abrir
        tr.addEventListener('click', function () {
            let linhaDados = Array.from(tr.children).map(td => td.textContent);
            alterar(linhaDados);
        });

        var textos = [];

        colunas.forEach(function (coluna) {
            let tdColuna = document.createElement('td');
            let dado = dados_composicoes[composicao][coluna];

            if (String(coluna).includes('lpu')) {
                dado = dinheiro(conversor(dado));
            }

            if (coluna == 'imagem') {
                var img = document.createElement('img')
                img.style = 'width: 25px;'
                img.src = dado
                tdColuna.appendChild(img)
            } else {
                tdColuna.textContent = dado;
            }
            tr.appendChild(tdColuna);
            textos.push(dado);
        });

        if (!pesquisa || pesquisa.trim() === '') {
            // Adiciona todas as linhas se a pesquisa estiver vazia ou nula
            tabela_produtos.appendChild(tr);
        } else {
            let adicionaLinha = false;

            textos.forEach(function (texto) {
                if (typeof texto === 'string' && texto.toLowerCase().includes(pesquisa.toLowerCase())) {
                    adicionaLinha = true;
                }
            });

            if (adicionaLinha) {
                tabela_produtos.appendChild(tr);
            }
        }
    });
}

function alterar(linhaDados) {

    document.getElementById('incluir_composicoes').innerHTML = '';

    var dados_composicoes = JSON.parse(localStorage.getItem('dados_composicoes'))

    try {
        var composicao_ = JSON.parse(dados_composicoes[linhaDados[0]].composicao)

        composicao_.forEach(function (linha) {
            mais_item()
            document.getElementById('X' + (maiorId('X') - 1)).textContent = linha.cod
            document.getElementById('Y' + (maiorId('Y') - 1)).value = dados_composicoes[linha.cod].descricao
            document.getElementById('Z' + (maiorId('Z') - 1)).value = linha.qtde
        })

    } catch { }

    document.getElementById('retangulo').style.display = 'block';
}

function recuperar() {

    var requisicoes = {
        'dados_etiquetas': 'etiquetas',
        'dados_composicoes': 'composicoes',
        'dados_medidas': 'medidas',
        'dados_grupos': 'grupos',
        'dados_categorias': 'categorias',
        'dados_clientes': 'clientes',
        'dados_departamentos': 'departamentos',
        'dados_pagamentos': 'pagamentos',
        'vendedores': 'vendedores',
    }

    var alicia_keys = Object.keys(requisicoes)

    alicia_keys.forEach(function (api) {

        let url = 'https://script.google.com/macros/s/AKfycbx40241Ogk6vqiPxQ3RDjf4XURo3l_yG0x9j9cTNpeKIdnosEEewTnw7epPrc2Ir9EX/exec?bloco=' + requisicoes[api]

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar os dados');
                }
                return response.json();
            })
            .then(data => {

                localStorage.setItem(api, JSON.stringify(data))

            })
            .catch(error => {
                console.error('Ocorreu um erro:', error);
            });
    })
}

function formatartextoHtml(texto) {
    return texto.replace(/\n/g, '<br>');
}

function baixar_em_excel(nome_tabela, filename) {

    var table = document.getElementById(nome_tabela)

    var wb = XLSX.utils.table_to_book(table, { sheet: "GCS" });

    filename = filename ? filename + '.xlsx' : 'excel_data.xlsx';

    XLSX.writeFile(wb, filename);
}

function criar_pagamento(desc, v_pag, ini, fim, cat, usuario, st, pagamento_id, autorz, anexs, recbdr, salvar) {
    var pagamentos = document.getElementById('d_pagamentos');

    var descricao_pagamento = desc || document.getElementById('descricao_pagamento').value;
    var valor_pagamento = v_pag || document.getElementById('valor_pagamento').value;
    var inicio_pagamento = ini || document.getElementById('inicio_pagamento').value;
    var final_pagamento = fim || document.getElementById('final_pagamento').value;
    var categoria_pagamento = cat || document.getElementById('categoria_pagamento').value;
    var id = pagamento_id || unicoID();
    var acesso = JSON.parse(localStorage.getItem('acesso'));
    var autorizado = autorz || '--';
    var status = st || 'pendente';
    var anexos = anexs || [];
    var recebedor = recbdr || '--';

    try {
        var lista_pagamentos = JSON.parse(localStorage.getItem('lista_pagamentos')) || {};
    } catch {
        var lista_pagamentos = {};
    }

    if (salvar || salvar == undefined) {
        if (!lista_pagamentos[conteiner_id_orcamento]) {
            lista_pagamentos[conteiner_id_orcamento] = {};
        }

        lista_pagamentos[conteiner_id_orcamento][id] = {
            descricao: descricao_pagamento,
            inicio: inicio_pagamento,
            fim: final_pagamento,
            categoria: categoria_pagamento,
            valor: valor_pagamento,
            criado: JSON.parse(localStorage.getItem('acesso')).usuario,
            autorizado: autorizado,
            status: 'pendente',
            anexos: [],
            recebedor: recebedor
        };

        localStorage.setItem('lista_pagamentos', JSON.stringify(lista_pagamentos));

        // Limpar campos
        document.getElementById('descricao_pagamento').value = '';
        document.getElementById('valor_pagamento').value = '';
        document.getElementById('inicio_pagamento').value = '';
        document.getElementById('final_pagamento').value = '';
        document.getElementById('categoria_pagamento').value = '';

        fechar_formulario();
    }

    var div_maior = document.createElement('div');
    div_maior.classList = 'label_pagamento';

    var label_valor = document.createElement('label');
    var label_inicio = document.createElement('label');
    var label_fim = document.createElement('label');
    var img_aprov = document.createElement('img');
    var img_reprov = document.createElement('img');
    var label_recebedor = document.createElement('label');

    img_aprov.src = 'aprovar.png';
    img_reprov.src = 'cancelar.png';
    img_aprov.style.width = '2vw';
    img_reprov.style.width = '2vw';
    var id_background = 'A' + maiorId('A');

    img_aprov.addEventListener('click', function () {
        var lista_pagamentos = JSON.parse(localStorage.getItem('lista_pagamentos'));

        lista_pagamentos[conteiner_id_orcamento][id].status = 'aprovado';
        lista_pagamentos[conteiner_id_orcamento][id].autorizado = acesso.usuario;

        localStorage.setItem('lista_pagamentos', JSON.stringify(lista_pagamentos));

        document.getElementById(id_background).style.backgroundColor = 'green';

        abrir_detalhes_chamado(conteiner_id_orcamento); // Atualizar os dados logo após mudar o status
        enviar_lista_pagamentos()
    });

    img_reprov.addEventListener('click', function () {
        var lista_pagamentos = JSON.parse(localStorage.getItem('lista_pagamentos'));

        lista_pagamentos[conteiner_id_orcamento][id].status = 'pendente';
        lista_pagamentos[conteiner_id_orcamento][id].autorizado = '--';

        localStorage.setItem('lista_pagamentos', JSON.stringify(lista_pagamentos));

        document.getElementById(id_background).style.backgroundColor = '#B12425';

        abrir_detalhes_chamado(conteiner_id_orcamento); // Atualizar os dados logo após mudar o status
        enviar_lista_pagamentos()
    });

    label_valor.textContent = dinheiro(valor_pagamento);
    label_inicio.textContent = 'de ' + new Date(inicio_pagamento).toLocaleDateString('pt-BR');
    label_fim.textContent = 'até ' + new Date(final_pagamento).toLocaleDateString('pt-BR');

    var div_linha_1 = document.createElement('div');
    div_linha_1.id = id_background;
    div_linha_1.textContent = categoria_pagamento;
    div_linha_1.classList = 'label_chamados';

    var cor_status = status == 'pendente' ? '#B12425' : 'green';
    div_linha_1.style.backgroundColor = cor_status;

    var permissao = acesso.permissao; // Verificar se deve incluir os botões de aprovação; ADM

    if (permissao == 'adm') {
        div_linha_1.append(label_valor, label_inicio, label_fim, img_aprov, img_reprov);
    } else {
        div_linha_1.append(label_valor, label_inicio, label_fim);
    }

    var label_desc = document.createElement('label');
    var label_criado = document.createElement('label');
    var label_autorizado = document.createElement('label');

    label_autorizado.style = 'font-weight: bold; margin-top: 10px;';
    label_criado.style = 'font-weight: bold; margin-top: 10px;';
    label_recebedor.style = 'font-weight: bold; margin-top: 10px;';

    label_desc.textContent = 'Descrição: ' + descricao_pagamento;
    label_criado.textContent = 'Criado por: ' + usuario;
    label_autorizado.textContent = 'Autorizado por: ' + autorizado;
    label_recebedor.textContent = 'Beneficiado: ' + recebedor

    var label_anexo = document.createElement('label');
    label_anexo.textContent = 'Anexar documento (Imagem, PDF, doc...)';
    label_anexo.classList = 'trello_button';
    label_anexo.htmlFor = 'adicionar_anexo_pagamento_' + id; // Adicionando ID único

    var input = document.createElement('input');
    input.type = 'file';
    input.id = 'adicionar_anexo_pagamento_' + id; // Adicionando ID único
    input.style.display = 'none';

    input.addEventListener('change', function () {
        var file = this.files[0];
        if (file) {
            var fileInput = document.getElementById('adicionar_anexo_pagamento_' + id); // Garantindo que pega o input correto
            var file = fileInput.files[0];
            var fileName = file.name;

            if (!file) {
                alert('Please select a file.');
                return;
            }

            var reader = new FileReader();
            reader.onload = async (e) => {
                var base64 = e.target.result.split(',')[1];
                var mimeType = file.type;

                var response = await fetch('http://localhost:3000/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: fileName,
                        mimeType: mimeType,
                        base64: base64
                    })
                });

                var result = await response.json();
                if (response.ok) {
                    var data = new Date().toLocaleDateString('pt-BR');

                    var lista_pagamentos = JSON.parse(localStorage.getItem('lista_pagamentos'));

                    var anexo = {
                        'id': unicoID(),
                        'nome_arquivo': fileName,
                        'data': data,
                        'link': result.fileId
                    };

                    if (!lista_pagamentos[conteiner_id_orcamento][id].anexos) {
                        lista_pagamentos[conteiner_id_orcamento][id].anexos = [];
                    }

                    lista_pagamentos[conteiner_id_orcamento][id].anexos.push(anexo);

                    localStorage.setItem('lista_pagamentos', JSON.stringify(lista_pagamentos));

                    abrir_detalhes_chamado(conteiner_id_orcamento);
                    enviar_lista_pagamentos()

                } else {
                    openPopup(result.message);
                }
            };

            reader.readAsDataURL(file);
        }

    });

    div_maior.append(div_linha_1, label_desc, label_recebedor, label_criado, label_autorizado, label_anexo, input);

    // Percorrer anexos se existirem
    anexos.forEach(function (anexo) {
        var div_anexo = document.createElement('div');
        div_anexo.style = 'display: flex; justify-content: space-evenly; margin: 10px; background-color: #22272B; border-radius: 5px; margin: 5px; padding: 5px;';

        var label_data = document.createElement('label');
        var a = document.createElement('a');
        var label_excluir = document.createElement('label');
        label_excluir.textContent = 'Excluir';
        label_excluir.style.textDecoration = 'underline';
        label_excluir.style.cursor = 'pointer';
        label_excluir.addEventListener('click', function () {

            openPopup('Deseja realmente excluir o anexo?');
            document.getElementById('sim_nao_anexo_pagamento').style = 'display: flex; justify-content: space-evenly; align-items: center;';

            document.getElementById('confirmar_exclusao_anexo_pagamento').addEventListener('click', function () {
                var anexoIdParaRemover = anexo.id;

                if (lista_pagamentos[conteiner_id_orcamento][id].anexos) {
                    lista_pagamentos[conteiner_id_orcamento][id].anexos = lista_pagamentos[conteiner_id_orcamento][id].anexos.filter(function (anexo) {
                        return anexo.id !== anexoIdParaRemover;
                    });
                    localStorage.setItem('lista_pagamentos', JSON.stringify(lista_pagamentos));
                }

                document.getElementById('sim_nao_anexo_pagamento').style.display = 'none';
                closePopup_projetos();
                abrir_detalhes_chamado(conteiner_id_orcamento);
                enviar_lista_pagamentos()
            });

        });

        label_data.textContent = anexo.data;
        a.textContent = anexo.nome_arquivo;
        a.href = 'https://drive.google.com/uc?id=' + anexo.link;

        if (usuario == acesso.usuario) {
            div_anexo.append(label_data, a, label_excluir);
        } else {
            div_anexo.append(label_data, a);
        }

        div_maior.appendChild(div_anexo);
    });

    pagamentos.appendChild(div_maior);
    enviar_lista_pagamentos()
}


function enviar_lista_pagamentos() {

    var dados = {
        'tabela': 'lista_pagamentos',
        'lista_pagamentos': JSON.parse(localStorage.getItem('lista_pagamentos'))
    }

    fetch('https://script.google.com/a/macros/hopent.com.br/s/AKfycbx40241Ogk6vqiPxQ3RDjf4XURo3l_yG0x9j9cTNpeKIdnosEEewTnw7epPrc2Ir9EX/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })

}

function obter_lista_pagamentos() {

    var url = 'https://script.google.com/macros/s/AKfycbx40241Ogk6vqiPxQ3RDjf4XURo3l_yG0x9j9cTNpeKIdnosEEewTnw7epPrc2Ir9EX/exec?bloco=lista_pagamentos'

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar os dados');
            }
            return response.json();
        })
        .then(data => {

            localStorage.setItem('lista_pagamentos', JSON.stringify(data))

        })
        .catch(error => {
            console.error('Ocorreu um erro:', error);
        });

}

function abrir_detalhes_chamado(id_orcamento) {

    var campo_observacao = document.getElementById('d_descricao_chamado_div')

    campo_observacao.addEventListener('click', function () {
        document.getElementById('d_descricao_chamado_div').style.display = 'none'
        document.getElementById('painel_descricao_chamado').style.display = 'flex'
    })

    conteiner_id_orcamento = id_orcamento

    // Carregar todas as categorias; 

    var categorias = JSON.parse(localStorage.getItem('dados_categorias'))
    var select = document.getElementById('categoria_pagamento')

    for (categoria in categorias) {
        var option = document.createElement('option')
        option.textContent = categorias[categoria]
        select.appendChild(option)
    }

    var clientes = JSON.parse(localStorage.getItem('dados_clientes'))
    var datalist = document.getElementById('clientes');

    for (cliente in clientes) {
        var option = document.createElement('option');
        option.value = cliente;
        datalist.appendChild(option);
    }

    try {
        var lista_pagamentos = JSON.parse(localStorage.getItem('lista_pagamentos'))[id_orcamento]
    } catch {
        var lista_pagamentos = {}
    }

    document.getElementById('d_pagamentos').innerHTML = ''
    campo_observacao.innerHTML = ''

    var total_custo = 0
    var total_pendente = 0

    for (pagamento in lista_pagamentos) {

        if (pagamento != 'observacao') {
            var descricao = lista_pagamentos[pagamento].descricao
            var valor = lista_pagamentos[pagamento].valor
            var inicio = lista_pagamentos[pagamento].inicio
            var fim = lista_pagamentos[pagamento].fim
            var categoria = lista_pagamentos[pagamento].categoria
            var usuario = lista_pagamentos[pagamento].criado
            var st = lista_pagamentos[pagamento].status
            var salvar = false
            var autorizado = lista_pagamentos[pagamento].autorizado
            var recebedor = lista_pagamentos[pagamento].recebedor

            if (lista_pagamentos[pagamento].anexos) {
                var anexos = lista_pagamentos[pagamento].anexos
            } else {
                var anexos = []
            }

            criar_pagamento(descricao, valor, inicio, fim, categoria, usuario, st, pagamento, autorizado, anexos, recebedor, salvar)

            if (st == 'aprovado') {
                total_custo += conversor(valor)
            } else {
                total_pendente += conversor(valor)
            }

        } else if (pagamento == 'observacao') {

            campo_observacao.innerHTML = formatartextoHtml(lista_pagamentos[pagamento])
            document.getElementById('d_descricao_textarea_chamado').value = lista_pagamentos[pagamento]

            enviar_lista_pagamentos()
        }
    }

    document.getElementById('total_custo').textContent = dinheiro(total_custo)
    document.getElementById('total_pendente').textContent = dinheiro(total_pendente)


    document.getElementById('abrir_chamado').style.display = 'block'
    var dados_orcamentos = JSON.parse(localStorage.getItem('dados_orcamentos'))

    var nome_cartao = dados_orcamentos[id_orcamento].dados_orcam.nome_projeto + ' → ' + dados_orcamentos[id_orcamento].dados_orcam.contrato

    document.getElementById('nome_chamado').textContent = nome_cartao

}

function fecharTabela(nome_tabela) {
    document.getElementById(nome_tabela).style.display = 'none'
}
