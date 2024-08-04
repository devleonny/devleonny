recuperar()

function closePopup_projetos() {

    var respostas_ = [
        'myPopup',
        'sim_nao_anexo_pagamento',
        'sim_nao_anexo',
        'sim_nao',
        'sim_nao_comentario'
    ]
    respostas_.forEach(function (item) {
        document.getElementById(item).style.display = 'none'
    })
}

function abrir_formulario() {
    document.getElementById('formulario_pagamento').style.display = 'grid'
    document.getElementById('abrir_formulario').style.display = 'none'
    document.getElementById('fechar_formulario').style.display = 'block'
}

function fechar_formulario() {
    document.getElementById('formulario_pagamento').style.display = 'none'
    document.getElementById('abrir_formulario').style.display = 'block'
    document.getElementById('fechar_formulario').style.display = 'none'
}

if (document.title == 'Projetos') {
    document.getElementById('adicionar_anexo').addEventListener('change', function () {
        var file = this.files[0];
        if (file) {

            var fileInput = document.getElementById('adicionar_anexo');
            var file = fileInput.files[0];
            var fileName = file.name

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
                if (response.ok) { //29
                    var data = new Date().toLocaleDateString('pt-BR')
                    var id = unicoID()
                    salvar_anexo(fileName, mimeType, result.fileId, data, id)
                    adicionar_anexos_card(fileName, result.fileId, mimeType, data, id)

                } else {
                    openPopup(result.message)
                }
            };

            reader.readAsDataURL(file);
        }
    });
}

var conteiner_id_orcamento;

function salvar_descricao_chamado() {
    var textarea = document.getElementById('d_descricao_textarea_chamado');
    var observacao_div = document.getElementById('d_descricao_chamado_div');
    observacao_div.style.display = 'block';
    document.getElementById('painel_descricao_chamado').style.display = 'none';

    var lista_pagamentos;
    try {
        lista_pagamentos = JSON.parse(localStorage.getItem('lista_pagamentos')) || {};
    } catch {
        lista_pagamentos = {};
    }

    if (!lista_pagamentos[conteiner_id_orcamento]) {
        lista_pagamentos[conteiner_id_orcamento] = {};
    }

    lista_pagamentos[conteiner_id_orcamento]['observacao'] = textarea.value;

    observacao_div.innerHTML = formatartextoHtml(textarea.value);

    localStorage.setItem('lista_pagamentos', JSON.stringify(lista_pagamentos));

    abrir_detalhes_chamado(conteiner_id_orcamento)
}


function adicionar_anexos_card(nome_arquivo, link, tipo, data, id) {

    var anexos = document.getElementById('anexos')
    var div_caixa = document.createElement('div')
    var div_anexo = document.createElement('div')
    var div_tipo = document.createElement('div')
    var a = document.createElement('a')
    var p = document.createElement('p')
    var div_data_excluir = document.createElement('div')
    div_data_excluir.style = 'display: flex; align-items: center;'

    p.style.marginLeft = '10px'
    a.style.marginLeft = '10px'
    div_caixa.classList = 'caixa_anexo'
    div_anexo.classList = 'anexo'
    div_tipo.classList = 'tipo'
    var tipo_ = formato(tipo)
    div_tipo.textContent = tipo_
    a.href = 'https://drive.google.com/uc?id=' + link
    a.textContent = nome_arquivo

    p.textContent = 'Adicionado: ' + data

    var a2 = document.createElement('a')
    a2.style = 'margin-left: 10px; text-decoration: underline; cursor: pointer;'
    a2.addEventListener('click', function () {
        openPopup('Deseja realmente excluir o anexo?')
        document.getElementById('sim_nao_anexo').style = 'display: flex; align-items: center; justify-content: space-evenly;'
        document.getElementById('confirmar_exclusao_anexo').addEventListener('click', function () {
            excluir_anexo(id)
        })
    })
    a2.textContent = 'Excluir'

    div_data_excluir.append(p, a2)
    div_anexo.append(a, div_data_excluir)
    div_caixa.append(div_tipo, div_anexo)
    anexos.appendChild(div_caixa)
}

function formato(texto) {
    switch (true) {
        case String(texto).includes('pdf'):
            return 'PDF'
        case String(texto).includes('image'):
            return 'IMAGEM'
        case String(texto).includes('text'):
            return 'TXT'
        case String(texto).includes('sheet'):
            return 'PLANILHA'
        default:
            return 'OUTROS'
    }
}

function flex() {
    var quadro = document.getElementById('quadro');
    var estilo = window.getComputedStyle(quadro);
    var flexWrap = estilo.getPropertyValue('flex-wrap');

    if (flexWrap === 'wrap') {
        quadro.style.flexWrap = 'nowrap';
    } else {
        quadro.style.flexWrap = 'wrap';
    }
}

var quadros = [
    'ORÇAMENTO',
    'MEETING - PLANEJAMENTO',
    'AGUARDANDO MATERIAL',
    'MATERIAL SEPARADO',
    'MATERIAL ENVIADO',
    'STAND BY',
    'MOBILIZAÇÃO',
    'START',
    'INFRA',
    'INSTALAÇÕES',
    'CONFIGURAÇÃO',
    'PENTE FINO',
    'CONCLUÍDA',
    'COM RETORNO',
    'FATURADO',
    'PAGAMENTO CONCLUÍDO'
];


if (document.title == 'Projetos') {
    quadros.forEach(function (quadro) {
        criar_quadros(quadro);
    });

    preencher();

    setInterval(atualizarDados, 60000);
}

function atualizarDados() {

    obter_lista_pagamentos()

    document.getElementById('loading').style = "display: flex; justify-content: center; align-items: center;"
    document.getElementById('quadro').innerHTML = ''
    document.getElementById('botao_atualizar').style.display = 'none'

    recuperar_projetos();
    carregar_orcamentos();

    setTimeout(function () {
        quadros.forEach(function (quadro) {
            criar_quadros(quadro);
        });

        preencher();
        document.getElementById('loading').style.display = 'none'
        document.getElementById('botao_atualizar').style.display = 'block'
    }, 3000)

}

function criar_quadros(nome_quadro) {
    var div1 = document.createElement('div');
    div1.classList.add('column');

    var div2 = document.createElement('div');
    div2.classList.add('column-header');
    div2.textContent = nome_quadro;

    var div3 = document.createElement('div');
    div3.classList.add('card-list');
    div3.id = nome_quadro;

    div1.appendChild(div2);
    div1.appendChild(div3);

    document.getElementById('quadro').appendChild(div1);

    // Inicializa Sortable.js para cada quadro criado
    Sortable.create(div3, {
        group: 'shared',
        animation: 150,
        onEnd: function (/**Event*/evt) {
            posicao_cards()
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // A inicialização de Sortable.js para cada lista é feita na função criar_quadros
});

function carregar_tabela_etiquetas() {
    var tabela = document.getElementById('painel_etiquetas');
    tabela.innerHTML = '';
    var etiquetas_ = JSON.parse(localStorage.getItem('dados_etiquetas'));
    var etiquetas_key = Object.keys(etiquetas_);

    var h3 = document.createElement('h3');
    h3.innerHTML = '&#10061 Etiquetas';

    var button = document.createElement('button');
    button.innerHTML = '&times;';
    button.classList = 'close-btn';
    button.addEventListener('click', function () {
        fecharEtiqueta();
    });

    tabela.appendChild(h3);
    tabela.appendChild(button);

    etiquetas_key.forEach(function (etiq_) {
        var label = document.createElement('label');
        label.textContent = etiquetas_[etiq_].nome;
        label.classList = 'etiqueta';
        label.style.backgroundColor = etiquetas_[etiq_].cor;
        label.addEventListener('click', function () {
            incluir_etiqueta_no_projeto(etiq_)
        })
        tabela.appendChild(label);
    });

    var input = document.createElement('input');
    input.classList = 'etiqueta';
    input.style.marginRight = '5px'
    input.placeholder = 'Nome da Etiqueta';
    input.id = 'nova_etiqueta'
    var inputColor = document.createElement('input');
    inputColor.type = 'color';
    inputColor.style.display = 'none';

    var colorInputDisplay = document.createElement('input');
    colorInputDisplay.classList = 'etiqueta';
    colorInputDisplay.placeholder = 'Cor da Etiqueta';
    colorInputDisplay.readOnly = true;
    colorInputDisplay.id = 'nova_cor'
    colorInputDisplay.addEventListener('click', function () {
        inputColor.click();
    });

    var button = document.createElement('button');
    button.textContent = 'Incluir';
    button.classList = 'etiqueta';
    button.style = 'margin-left: 5px';
    button.addEventListener('click', function () {
        salvar_etiqueta()
    })

    inputColor.addEventListener('input', function () {
        colorInputDisplay.value = inputColor.value;
    });

    var div = document.createElement('div');
    div.style = 'display: flex; margin-top: 10px';

    div.append(input, colorInputDisplay, button, inputColor)

    tabela.appendChild(div);
    tabela.style.display = 'flex';
}

function incluir_etiqueta_no_projeto(id_da_etiqueta) {
    var dados_projetos = JSON.parse(localStorage.getItem('dados_projetos'));
    var projeto_atual = document.getElementById('d_nome_projeto').textContent;

    dados_projetos[projeto_atual]['etiquetas'].push(id_da_etiqueta);

    localStorage.setItem('dados_projetos', JSON.stringify(dados_projetos));

    abrir(projeto_atual)
    preencher()
    sincronizar_api(dados_projetos)
}

var idEtiquetaParaRemover = null;

function remover_etiqueta_do_projeto(id_da_etiqueta) {
    idEtiquetaParaRemover = id_da_etiqueta;
    openPopup('Tem certeza que deseja remover a Etiqueta?');
    document.getElementById('sim_nao').style = 'display: flex; align-items: center; justify-content: space-evenly;';
}

function confirmarRemocao() {
    if (idEtiquetaParaRemover === null) {
        return;
    }

    var dados_projetos = JSON.parse(localStorage.getItem('dados_projetos'));
    var projeto_atual = document.getElementById('d_nome_projeto').textContent;

    dados_projetos[projeto_atual]['etiquetas'] = dados_projetos[projeto_atual]['etiquetas'].filter(function (item) {
        return item !== idEtiquetaParaRemover;
    });

    localStorage.setItem('dados_projetos', JSON.stringify(dados_projetos));

    abrir(projeto_atual);
    sincronizar_api(dados_projetos);
    preencher()

    idEtiquetaParaRemover = null; // Resetar o ID da etiqueta
    document.getElementById('sim_nao').style.display = 'none';
    closePopup_projetos()
}

function salvar_etiqueta() {

    var etiquetas_ = JSON.parse(localStorage.getItem('dados_etiquetas')) || {}

    var nova_etiqueta = document.getElementById('nova_etiqueta').value
    var nova_cor = document.getElementById('nova_cor').value

    etiquetas_[unicoID()] = {
        'nome': nova_etiqueta,
        'cor': nova_cor
    }

    localStorage.setItem('dados_etiquetas', JSON.stringify(etiquetas_))
    carregar_tabela_etiquetas()
    preencher()
    sincronizar_api_etiquetas(etiquetas_)

}

var nome_projeto = document.getElementById('d_nome_projeto') // campo que recebe o nome do projeto;


function preencher() {
    var dados_projetos = JSON.parse(localStorage.getItem('dados_projetos'));
    var nomes_projetos = Object.keys(dados_projetos);
    var etiquetas_ = JSON.parse(localStorage.getItem('dados_etiquetas'));

    function compararOrdem(a, b) {
        var ordemA = dados_projetos[a].ordem;
        var ordemB = dados_projetos[b].ordem;
        return ordemA - ordemB;
    }

    nomes_projetos.sort(compararOrdem);

    quadros.forEach(function (quadro) {
        document.getElementById(quadro).innerHTML = '';
    });

    nomes_projetos.forEach(function (proj) {
        var div_maior = document.createElement('div')
        div_maior.classList = 'card';
        var div_etics = document.createElement('div')

        div_etics.style = 'display: flex; flex-wrap: wrap; margin-bottom: 2px'

        dados_projetos[proj].etiquetas.forEach(function (etiq_) {

            let label = document.createElement('label')
            label.classList = 'etiqueta'
            label.style = 'font-size: 10px; padding: 2px; margin: 2px;'
            label.style.backgroundColor = etiquetas_[etiq_].cor
            label.textContent = etiquetas_[etiq_].nome
            div_etics.appendChild(label)
        })

        var div = document.createElement('div');
        div.textContent = proj;
        div.id = 'proj'
        div_maior.addEventListener('click', function () {
            abrir(proj);
        });

        div_maior.appendChild(div_etics)
        div_maior.appendChild(div)

        document.getElementById(dados_projetos[proj].cartao).appendChild(div_maior);
    });

}


function abrir(projeto) {

    var dados_projetos = JSON.parse(localStorage.getItem('dados_projetos'))
    var nomes_projetos = Object.keys(dados_projetos)
    var etiquetas_ = JSON.parse(localStorage.getItem('dados_etiquetas'))
    var descricao_div = document.getElementById('d_descricao_div')
    var descricao_textarea = document.getElementById('d_descricao_textarea')
    var anexos = document.getElementById('anexos')

    //Resetar comentários;
    document.getElementById('area_comentarios').innerHTML = ''

    detalhes.style.display = 'block'
    nome_projeto.textContent = projeto

    anexos.innerHTML = ''
    dados_projetos[projeto].anexos.forEach(function (linha) { //29
        try {
            adicionar_anexos_card(linha.nome, linha.link, linha.tipo, linha.data, linha.id)
        } catch { 'Sem Anexos' }

    })

    descricao_div.innerHTML = formatartextoHtml(dados_projetos[projeto].descricao) //Tem que ser innerHTML

    descricao_div.addEventListener('click', function () {
        descricao_div.style.display = 'none'
        descricao_textarea.style.display = 'block'
        document.getElementById('d_descricao_textarea_button').style.display = 'block'
    })
    descricao_textarea.value = dados_projetos[projeto].descricao

    var etiquetas = dados_projetos[projeto].etiquetas

    document.getElementById('d_etiquetas').innerHTML = ''
    etiquetas.forEach(function (etiq_) {

        let label = document.createElement('label')
        label.classList = 'etiqueta'
        label.style.backgroundColor = etiquetas_[etiq_].cor
        label.textContent = etiquetas_[etiq_].nome
        label.addEventListener('click', function () {
            remover_etiqueta_do_projeto(etiq_)
        })
        document.getElementById('d_etiquetas').appendChild(label)
    })
    let label = document.createElement('label')
    label.classList = 'etiqueta'
    label.textContent = '+'
    label.addEventListener('click', function () {
        carregar_tabela_etiquetas()
    })
    document.getElementById('d_etiquetas').appendChild(label)

    //Comentários 

    tab_coments = document.getElementById('area_comentarios')

    var usuario = JSON.parse(localStorage.getItem('acesso')).usuario

    dados_projetos[projeto].comentarios.forEach(function (comentario) {

        var div = document.createElement('div')
        div.classList = 'card'
        div.style = 'display:flex; flex-direction: column'
        var label = document.createElement('label')
        label.style.marginBottom = '10px'
        label.textContent = comentario.comentario
        var label2 = document.createElement('label')
        label2.style.fontSize = '10px'
        label2.textContent = 'Em ' + comentario.data + ' por ' + comentario.nome

        if (usuario == comentario.nome) { //29
            var label3 = document.createElement('label')
            label3.style = 'margin-left: 10px; text-decoration: underline; cursor: pointer; font-size: 10px;'
            var div_ = document.createElement('div')
            div_.style = 'display: flex; align-items: center;'
            label3.textContent = 'Excluir'
            label3.addEventListener('click', function () {
                openPopup('Deseja realmente excluir o comentário?')
                document.getElementById('sim_nao_comentario').style = 'display: flex; align-items: center; justify-content: space-evenly;'
                document.getElementById('confirmar_exclusao_comentario').addEventListener('click', function () {
                    excluir_comentario(comentario.id)
                })
            })
            div_.append(label2, label3)
            div.append(label, div_)
        } else {
            div.append(label, label2)
        }

        tab_coments.appendChild(div)
    })

    var dados_orcamentos = JSON.parse(localStorage.getItem('dados_orcamentos'))
    var ids_orcam = Object.keys(dados_orcamentos)

    div_orcs = document.getElementById('orcamentos_')
    div_orcs.innerHTML = ''
    ids_orcam.forEach(function (orc_) {

        if (dados_orcamentos[orc_].dados_orcam.nome_projeto == projeto) {
            var div = document.createElement('div')
            div.classList = 'label_chamados'
            div.addEventListener('click', function () {
                abrir_detalhes_chamado(orc_)
            })
            var label1 = document.createElement('label')
            label1.style = 'cursor: pointer;'
            label1.textContent = 'Chamado: ' + dados_orcamentos[orc_].dados_orcam.contrato

            var label2 = document.createElement('label')
            label2.style = 'cursor: pointer;'
            label2.textContent = 'Total: ' + dados_orcamentos[orc_].total_geral

            div.append(label1, label2)

            var div_maior = document.createElement('div')
            div_maior.style = 'display: flex; align-items: center; justify-content: left;'
            var img_excel = document.createElement('img')
            img_excel.src = 'excel.png'
            img_excel.classList = 'mini_icone'

            var img_pdf = document.createElement('img')
            img_pdf.src = 'pdf.png'
            img_pdf.classList = 'mini_icone'

            div_maior.append(div, img_excel, img_pdf)

            if (dados_orcamentos[orc_].dados_orcam.status != null) {
                var status = dados_orcamentos[orc_].dados_orcam.status
                if (status == 'Aprovado') {
                    div.style.backgroundColor = 'green'
                } else if (status == 'Pendente') {
                    div.style.backgroundColor = '#B12425'
                }
            } else {
                div.style.backgroundColor = 'orange'
                div.style.color = '#222'
            }

            img_excel.addEventListener('click', function () {
                ir_excel(orc_)
            })

            img_pdf.addEventListener('click', function () {
                ir_pdf(orc_)
            })

            div_orcs.appendChild(div_maior)
        }

    })

}

function adicionar_etiqueta() {

    var dados_projetos = JSON.parse(localStorage.getItem('dados_projetos'))
    var nomes_projetos = Object.keys(dados_projetos)

    dados_projetos[nome_projeto].etiquetas.push()

    localStorage.setItem('dados_projetos', JSON.stringify(dados_projetos))
    sincronizar_api(dados_projetos)

}

function salvar_descricao() {

    var dados_projetos = JSON.parse(localStorage.getItem('dados_projetos'))

    var descricao_ = document.getElementById('d_descricao_textarea').value

    var n_projeto = document.getElementById('d_nome_projeto').textContent

    dados_projetos[n_projeto].descricao = descricao_

    localStorage.setItem('dados_projetos', JSON.stringify(dados_projetos))

    enviar_descricao(descricao_, n_projeto)

    var descricao_textarea = document.getElementById('d_descricao_textarea')

    document.getElementById('d_descricao_textarea_button').style.display = 'none'
    descricao_textarea.style.display = 'none'
    document.getElementById('d_descricao_div').style.display = 'block'
    document.getElementById('d_descricao_div').innerHTML = formatartextoHtml(descricao_) //Tem que ser innerHTML

}

function salvar_anexo(nome, tipo, link, data, id) { //29

    var dados_projetos = JSON.parse(localStorage.getItem('dados_projetos'))

    var n_projeto = document.getElementById('d_nome_projeto').textContent

    var anexo = {
        'id': id,
        'nome': nome,
        'tipo': formato(tipo),
        'link': link,
        'data': data

    }

    dados_projetos[n_projeto].anexos.push(anexo)

    localStorage.setItem('dados_projetos', JSON.stringify(dados_projetos))

    enviar_anexo(anexo, n_projeto)

}

function fecharEtiqueta() {
    document.getElementById('painel_etiquetas').style.display = 'none'
}

function salvar_comentario() {
    var proj_atual = document.getElementById('d_nome_projeto').textContent;
    var usuario = JSON.parse(localStorage.getItem('acesso')).usuario;
    var coments = document.getElementById('d_comentarios');

    var dados_projetos = JSON.parse(localStorage.getItem('dados_projetos'));

    if (!dados_projetos[proj_atual]) {
        console.error('Projeto não encontrado:', proj_atual);
        return;
    }

    if (!dados_projetos[proj_atual].comentarios) {
        dados_projetos[proj_atual].comentarios = [];
    }

    var comentario = {
        'id': unicoID(),
        'nome': usuario,
        'data': new Date().toLocaleDateString('pt-BR'),
        'comentario': coments.value
    }

    dados_projetos[proj_atual].comentarios.push(comentario);

    openPopup('Comentário salvo com sucesso');
    coments.value = '';

    localStorage.setItem('dados_projetos', JSON.stringify(dados_projetos));

    document.getElementById('area_comentarios').innerHTML = "";

    abrir(proj_atual);
    preencher();

    enviar_comentario(comentario, proj_atual)

}


function posicao_cards() {
    var dados_projetos = JSON.parse(localStorage.getItem('dados_projetos'))
    var posicoes = {}

    quadros.forEach(function (quadro) {

        var div_quadros = document.getElementById(quadro)
        var cards = div_quadros.querySelectorAll('#proj')
        cards.forEach(function (card, ordem_) {
            dados_projetos[card.textContent].cartao = quadro
            dados_projetos[card.textContent].ordem = ordem_

            posicoes[card.textContent] = {
                'posicao': ordem_,
                'quadro': quadro
            }

        })

    })

    localStorage.setItem('dados_projetos', JSON.stringify(dados_projetos))

    enviar_posicao(posicoes)
}

function enviar_descricao(descricao, id_projeto) {

    var resposta_api = {
        'tabela': 'descricao',
        'descricao': descricao,
        'id': id_projeto
    }

    fetch('https://script.google.com/a/macros/hopent.com.br/s/AKfycbx40241Ogk6vqiPxQ3RDjf4XURo3l_yG0x9j9cTNpeKIdnosEEewTnw7epPrc2Ir9EX/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resposta_api)
    })
}

function enviar_anexo(anexo, id_projeto) {

    var resposta_api = {
        'tabela': 'anexo',
        'anexo': anexo,
        'id': id_projeto
    }

    fetch('https://script.google.com/a/macros/hopent.com.br/s/AKfycbx40241Ogk6vqiPxQ3RDjf4XURo3l_yG0x9j9cTNpeKIdnosEEewTnw7epPrc2Ir9EX/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resposta_api)
    })
}

function sincronizar_api_etiquetas(etiquetas_) {

    var resposta_api = {
        'tabela': 'etiquetas',
        'etiquetas': etiquetas_,
    }

    fetch('https://script.google.com/a/macros/hopent.com.br/s/AKfycbx40241Ogk6vqiPxQ3RDjf4XURo3l_yG0x9j9cTNpeKIdnosEEewTnw7epPrc2Ir9EX/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resposta_api)
    })
}

function sincronizar_api(projeto_) {

    var resposta_api = {
        'tabela': 'trello',
        'projetos': projeto_,
    }

    fetch('https://script.google.com/a/macros/hopent.com.br/s/AKfycbx40241Ogk6vqiPxQ3RDjf4XURo3l_yG0x9j9cTNpeKIdnosEEewTnw7epPrc2Ir9EX/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resposta_api)
    })

}

function excluir_anexo(id_anexo) {

    var id_projeto = document.getElementById('d_nome_projeto').textContent
    var dados_projetos = JSON.parse(localStorage.getItem('dados_projetos'))
    var proj = dados_projetos[id_projeto]

    var index = dados_projetos[id_projeto].anexos.findIndex(anexo => anexo.id === id_anexo);
    if (index !== -1) {
        dados_projetos[id_projeto].anexos.splice(index, 1)
    }

    localStorage.setItem('dados_projetos', JSON.stringify(dados_projetos))

    abrir(id_projeto)

    document.getElementById('sim_nao_anexo').style.display = 'none'
    closePopup_projetos()

    var resposta_api = {
        'tabela': 'anexo',
        'operacao': 'excluir',
        'id': id_projeto,
        'id_anexo': id_anexo
    }

    fetch('https://script.google.com/a/macros/hopent.com.br/s/AKfycbx40241Ogk6vqiPxQ3RDjf4XURo3l_yG0x9j9cTNpeKIdnosEEewTnw7epPrc2Ir9EX/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resposta_api)
    })

}

function excluir_comentario(id_comentario) {

    var id_projeto = document.getElementById('d_nome_projeto').textContent
    var dados_projetos = JSON.parse(localStorage.getItem('dados_projetos'))
    var proj = dados_projetos[id_projeto]

    var index = dados_projetos[id_projeto].comentarios.findIndex(comentario => comentario.id === id_comentario);
    if (index !== -1) {
        dados_projetos[id_projeto].comentarios.splice(index, 1)
    }

    localStorage.setItem('dados_projetos', JSON.stringify(dados_projetos))

    abrir(id_projeto)

    document.getElementById('sim_nao_comentario').style.display = 'none'
    closePopup_projetos()

    var resposta_api = {
        'tabela': 'comentario',
        'operacao': 'excluir',
        'id': id_projeto,
        'id_comentario': id_comentario
    }

    fetch('https://script.google.com/a/macros/hopent.com.br/s/AKfycbx40241Ogk6vqiPxQ3RDjf4XURo3l_yG0x9j9cTNpeKIdnosEEewTnw7epPrc2Ir9EX/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resposta_api)
    })

}

function enviar_comentario(comentario, id_projeto) {

    var resposta_api = {
        'tabela': 'comentario',
        'comentario': comentario,
        'id': id_projeto
    }

    fetch('https://script.google.com/a/macros/hopent.com.br/s/AKfycbx40241Ogk6vqiPxQ3RDjf4XURo3l_yG0x9j9cTNpeKIdnosEEewTnw7epPrc2Ir9EX/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resposta_api)
    })

}

function enviar_posicao(posicoes) {

    var resposta_api = {
        'tabela': 'posicao',
        'posicoes': posicoes,
    }

    fetch('https://script.google.com/a/macros/hopent.com.br/s/AKfycbx40241Ogk6vqiPxQ3RDjf4XURo3l_yG0x9j9cTNpeKIdnosEEewTnw7epPrc2Ir9EX/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resposta_api)
    })

}

