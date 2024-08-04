

function atualizar_precos() {
    recuperar()
    openPopup('Aguarde...')
    setTimeout(function () {
        tabela_produtos()
        closePopup()
        total('RESET')
    }, 3000)
}

document.addEventListener('DOMContentLoaded', function () {
    var filtros = document.querySelectorAll('input.filtro');
    filtros.forEach(function (filtro) {
        filtro.addEventListener('input', tabela_produtos);
    });
});

function ocultar_tabela() {
    document.getElementById('detalhes').style.display = 'none'
    document.getElementById('botao_exibir').style.display = 'block'
    document.getElementById('botao_ocultar').style.display = 'none'
}

function backtop() {
    window.scrollTo(0, 0);
}

function fechar_ir_orcamentos() {
    location.href = 'orcamentos.html'
}

try {

    var dados_composicoes = JSON.parse(localStorage.getItem('dados_composicoes'))

    var alicia_keys = Object.keys(dados_composicoes)

    var keys_alicia_para_colocar_imagens = Object.keys(dados_composicoes)

    keys_alicia_para_colocar_imagens.forEach(function (key) {

        if (dados_composicoes[key]['imagem'] == "" || dados_composicoes[key]['imagem'] == undefined) {
            dados_composicoes[key]['imagem'] = 'https://i.imgur.com/Nb8sPs0.png'
        }

    })


    var select_descricao = {} // Chave DESCRICAO:CÓD_PRODUTO;
    alicia_keys.forEach(function (codigo) {
        select_descricao[dados_composicoes[codigo]['descricao']] = codigo
    });
    var select_keys = Object.keys(select_descricao) // Apenas a descrição para o select;

} catch {

    openPopup("Você será redirecionado para as composições...")

    setTimeout(function () {
        location.href = 'composicoes.html'
    }, 2000)

}

recuperar()
total()

function apagar_orçamento() {

    document.getElementById('sim_nao_orcamento').style.display = 'block'
    openPopup('Tem certeza que deseja apagar o Orçamento?')
}

function confirmar_exclusao() {
    localStorage.removeItem('dados_preenchidos')
    localStorage.removeItem('dados_adicionar')
    localStorage.removeItem('dados_composicoes_orcamento')
    localStorage.removeItem('editar_orcam')

    location.href = 'adicionar.html'
    document.getElementById('sim_nao_orcamento').style.display = 'none'
    closePopup()
}

function salvar_dados() {

    var dados_composicoes = JSON.parse(localStorage.getItem('dados_composicoes'))
    var dados_adicionar = []
    var ul = maiorId('A')
    var dados_composicoes_orcamento = {}

    for (var i = 1; i < ul; i++) {

        if (document.getElementById('A' + i)) {
            var codigo = document.getElementById('A' + i).textContent
            var linha = {
                'codigo': codigo,
                'ncm': document.getElementById('B' + i).textContent,
                'descricao': document.getElementById('C' + i).textContent,
                'medida': document.getElementById('D' + i).textContent,
                'qtde': document.getElementById('E' + i).value,
                'custo': document.getElementById('F' + i).value,
                'total': document.getElementById('G' + i).textContent,
                'tipo': document.getElementById('H' + i).textContent,
                'imagem': document.getElementById('I' + i).getAttribute('src')
            }

            dados_adicionar.push(linha)

        }

    }

    var total_geral = document.getElementById('total_geral').textContent
    localStorage.setItem('total_geral', total_geral)
    localStorage.setItem('dados_adicionar', JSON.stringify(dados_adicionar))
}

function atualizar_lista_de_lpus() {

    var LPUS = []
    var dados_composicoes = JSON.parse(localStorage.getItem('dados_composicoes'))
    var itens = Object.keys(dados_composicoes);

    Object.keys(dados_composicoes[itens[0]]).forEach(function (item) {
        if (String(item).includes('lpu')) {
            LPUS.push(String(item).toUpperCase());
        }

    });

    var select_lpu = document.getElementById('lpu')
    select_lpu.innerHTML = ''

    LPUS.forEach(function (item) {
        var option = document.createElement('option')
        option.textContent = item
        select_lpu.appendChild(option)
    })

    select_lpu.addEventListener('change', function () {
        var tabela = document.getElementById('lpu').value
        openPopup(`Os preços serão alterados para a ${tabela}, deseja confirmar?`)
        document.getElementById('sim_nao_lpu').style.display = 'block'
        document.getElementById('alterar_lpu').addEventListener('click', function () {
            total()
            document.getElementById('sim_nao_lpu').style.display = 'none'
            closePopup()
            tabela_produtos()
        })

    })

}

function recuperar() {
    atualizar_lista_de_lpus()

    var dados_adicionar = JSON.parse(localStorage.getItem('dados_adicionar'));
    document.getElementById('linhas').innerHTML = ''

    if (dados_adicionar) {
        for (var i = 0; i < dados_adicionar.length; i++) {
            adicionarLinha();

            var id = i + 1; // + 1 ao índice para se comparar ao ID da tabela;

            document.getElementById('A' + id).textContent = dados_adicionar[i].codigo;
            document.getElementById('B' + id).textContent = dados_adicionar[i].ncm;
            document.getElementById('C' + id).textContent = dados_adicionar[i].descricao;
            document.getElementById('D' + id).textContent = dados_adicionar[i].medida;
            document.getElementById('E' + id).value = dados_adicionar[i].qtde;
            document.getElementById('F' + id).value = dados_adicionar[i].custo;
            document.getElementById('G' + id).textContent = dados_adicionar[i].total;
            document.getElementById('H' + id).textContent = dados_adicionar[i].tipo;
            document.getElementById('I' + id).src = dados_adicionar[i].imagem;
        }
    }
    salvar_dados();
}


function adicionarLinha() {

    document.getElementById('cabecalho_').style.display = 'block';

    var tr = document.createElement('tr');
    var id_da_linha = 'T' + maiorId('T')
    tr.id = id_da_linha

    for (var i = 1; i <= 10; i++) {

        var td = document.createElement('td');

        if (i == 1) {

            var label = document.createElement('label');
            label.textContent = '';
            label.id = 'A' + maiorId('A');
            td.appendChild(label);
        }

        if (i == 2) {

            var label = document.createElement('label');
            label.textContent = '';
            label.id = 'B' + maiorId('B');

            td.appendChild(label);
        }

        if (i == 3) {

            var label = document.createElement('label');

            label.id = 'C' + maiorId('C');
            label.classList = 'label_items';

            var div_victor = document.createElement('div');
            div_victor.style = 'margin-left: 2vw';
            div_victor.id = 'V' + maiorId('V');
            td.id = 'W' + maiorId('W');

            td.append(label, datalist, div_victor);

        }

        if (i == 4) {

            var label = document.createElement('label');

            label.textContent = '';
            label.id = 'D' + maiorId('D');

            td.appendChild(label);
        }

        if (i == 5) {

            var input = document.createElement('input');
            input.type = 'number';
            var maior = maiorId('E');
            input.id = 'E' + maior;
            input.value = 1;
            input.classList = 'quantidade'
            input.addEventListener('change', function () {
                total();
                salvar_dados();
            });
            td.appendChild(input);
        }

        if (i == 6) {

            var input = document.createElement('input');

            input.id = 'F' + maiorId('F');
            input.value = 0
            input.style.cursor = 'pointer';
            input.classList = 'input_valor'
            input.addEventListener('change', function () {
                total();
                salvar_dados();
            });
            input.addEventListener('click', function () {
                limpar(input, maior);
            });

            var div = document.createElement('div')
            div.style = 'display: flex; justify-content: space-evenly;'

            var label_valor_imposto = document.createElement('label')
            label_valor_imposto.textContent = 'R$ --'
            label_valor_imposto.classList = 'label_imposto_porcentagem'
            label_valor_imposto.id = 'Z' + maiorId('Z')

            var label_porcentagem = document.createElement('label')
            label_porcentagem.classList = 'label_imposto_porcentagem'
            label_porcentagem.textContent = '--%'
            label_porcentagem.id = 'P' + maiorId('P')

            div.append(label_valor_imposto, label_porcentagem)
            td.append(input, div);
        }

        if (i == 7) {
            var div = document.createElement('div')
            div.style = 'display: grid;'

            var label = document.createElement('label');
            label.classList = 'input_valor'
            label.textContent = 'R$ 0,00';
            label.id = 'G' + maiorId('G');

            var label_total_imposto = document.createElement('label')
            label_total_imposto.textContent = 'R$ --'
            label_total_imposto.id = 'M' + maiorId('M');
            label_total_imposto.classList = 'label_imposto_porcentagem'

            div.append(label, label_total_imposto)
            td.appendChild(div);
        }

        if (i == 8) {

            td.style.width = 'max-content';
            var label = document.createElement('label');
            label.textContent = '';
            label.id = 'H' + maiorId('H');
            td.appendChild(label);
        }

        if (i == 9) {

            var img = document.createElement('img');
            var url = '';
            img.src = url;
            var id = 'I' + maiorId('I');
            img.id = id;
            img.style = 'width: 30px';
            img.addEventListener('click', function () {
                ampliar_especial(id, 'exibir');
            });
            td.appendChild(img);
            td.style.cursor = 'pointer';

        }

        if (i == 10) {

            var img = document.createElement('img');
            img.src = 'excluir.png';
            img.style.cursor = 'pointer';
            img.addEventListener('click', function () {
                removerLinha(this);
            });
            td.appendChild(img);
        }

        tr.appendChild(td);
    }

    document.getElementById('linhas').appendChild(tr);

    total();
    salvar_dados();
}

function ocultar_linhas(linha_mantida) {
    var tabela = document.getElementById('linhas');
    var elementos = tabela.querySelectorAll('[id^="T"]');

    elementos.forEach(function (elemento) {
        if (elemento.id != linha_mantida) {
            elemento.style.display = 'none'
        }
    })
}

function reexibir_linhas() {
    var tabela = document.getElementById('linhas');
    var elementos = tabela.querySelectorAll('[id^="T"]');
    elementos.forEach(function (elemento) {
        elemento.style.display = 'table-row'; // Garantir que as linhas sejam exibidas como table-row;
        var celulas = elemento.getElementsByTagName('td');
        for (var j = 0; j < celulas.length; j++) {
            celulas[j].style.display = 'table-cell'; // Garantir que cada td seja exibido como table-cell;
        }
    });
}


function limpar(input, maior) {
    input.value = ''
    document.getElementById('G' + maior).textContent = 'R$ 0,00'
}

function ampliar_especial(local_img, exibir) {
    var div = document.getElementById('imagem');
    var url = document.getElementById(local_img).getAttribute('src')
    document.getElementById('img').src = url
    document.getElementById('img').style.width = '60%'
    div.classList.toggle('show');
    id_imagem = local_img
    if (exibir == 'exibir') {
        document.getElementById('fileInput').style.display = 'block'
    }
}

function removerLinha(botao) {
    var linha = botao.parentNode.parentNode;

    try { // No caso de excluir algum item que tenha composição armazenada;
        var dados_composicoes_orcamento = JSON.parse(localStorage.getItem('dados_composicoes_orcamento'))

        if (dados_composicoes_orcamento[linha.querySelector('td').textContent]) {
            localStorage.removeItem('dados_composicoes_orcamento')
        }

    } catch { }

    linha.parentNode.removeChild(linha);
    salvar_dados()
    total()
}

function enviar_dados() {

    total()
    salvar_dados()
    salvar_preenchido()

    var dados_orcam = JSON.parse(localStorage.getItem('dados_preenchidos'))
    var dados_composicoes = JSON.parse(localStorage.getItem('dados_adicionar'))
    var dados_composicoes_orcamento = JSON.parse(localStorage.getItem('dados_composicoes_orcamento'))
    var total_geral = dinheiro(conversor(localStorage.getItem('total_geral')))

    var cli = dados_orcam.cliente_selecionado
    var o_chamado = dados_orcam.contrato
    var estad_ = dados_orcam.estado
    var cnpj = dados_orcam.cnpj

    if (
        cli == '' ||
        cli == "Cliente Consumidor / Sem Tomador" ||
        o_chamado == '' ||
        estad_ == '--' ||
        cnpj == ''
    ) {

        openPopup('Em branco: Cliente, Chamado, Estado ou CNPJ. Clique em "Dados do Cliente" para preencher.')

    } else if (String(o_chamado).slice(0, 1) != 'D') {

        openPopup('O número do chamado deve começar com "D"')

    } else {

        if (localStorage.getItem('editar_orcam') != null) {
            var id = localStorage.getItem('editar_orcam')
            localStorage.removeItem('editar_orcam')
        } else {
            var id = 'ORCA_' + unicoID()
        }

        var orcamentos = {
            'id': id,
            dados_orcam,
            dados_composicoes_orcamento,
            dados_composicoes,
            'total_geral': total_geral,
            'tabela': 'orcamentos'
        }

        fetch('https://script.google.com/a/macros/hopent.com.br/s/AKfycbx40241Ogk6vqiPxQ3RDjf4XURo3l_yG0x9j9cTNpeKIdnosEEewTnw7epPrc2Ir9EX/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orcamentos)
        })

        openPopup('Orçamento salvo! Dados disponíveis na aba Orçamentos')
        localStorage.removeItem('dados_adicionar')
        localStorage.removeItem('dados_preenchidos')
        localStorage.removeItem('dados_composicoes_orcamento')
        localStorage.removeItem('total_geral')

        setTimeout(function () {
            location.href = 'orcamentos.html'
        }, 2000)

    }

}

function tabela_produtos() {
    document.getElementById('tabela_produtos').innerHTML = '';

    var colunas = ['fabricante', 'descricao', 'modelo', 'tipo', 'grupo', 'qtde', 'unidade', 'valor', 'imagem'];

    var dados_itens = JSON.parse(localStorage.getItem('dados_itens'));
    var dados_composicoes = JSON.parse(localStorage.getItem('dados_composicoes'));

    var filtros = {
        codigo: document.getElementById('codigo').value.toLowerCase(),
        fabricante: document.getElementById('fabricante').value.toLowerCase(),
        descricao: document.getElementById('descricao').value.toLowerCase(),
        modelo: document.getElementById('modelo').value.toLowerCase(),
        tipo: document.getElementById('tipo').value.toLowerCase(),
        grupo: document.getElementById('grupo').value.toLowerCase(),
        qtde: document.getElementById('qtde').value.toLowerCase(),
        unidade: document.getElementById('unidade').value.toLowerCase(),
        valor: document.getElementById('valor').value.toLowerCase(),
    };

    Object.keys(dados_composicoes).forEach(function (composicao) {

        var textos = [];

        var tr = document.createElement('tr');
        var tdCodigo = document.createElement('td');
        tdCodigo.textContent = composicao;
        tr.appendChild(tdCodigo);

        textos.push(composicao)

        colunas.forEach(function (coluna) {
            var td = document.createElement('td');
            var valor = dados_composicoes[composicao][coluna] || '';
            if (coluna == 'valor') {
                var lpuvis = String(document.getElementById('lpu').value).toLowerCase()
                td.textContent = dinheiro(conversor(dados_composicoes[composicao][lpuvis]))
                textos.push(dinheiro(conversor(dados_composicoes[composicao][lpuvis])));
            } else if (coluna === 'qtde') {
                var input = document.createElement('input');
                input.type = 'number';
                input.classList = 'quantidade'
                var id = 'K' + maiorId('K');
                input.id = id;
                input.value = valor;
                input.addEventListener('change', function () {

                    incluir_item(composicao, id)

                });
                td.appendChild(input);
            } else if (coluna === 'imagem') {
                var img = document.createElement('img');

                if (dados_composicoes[composicao].imagem == '') {
                    img.src = 'https://i.imgur.com/Nb8sPs0.png';
                } else {
                    img.src = dados_composicoes[composicao].imagem;
                }

                img.style.width = '30px';
                img.style.cursor = 'pointer';
                var id_img = 'Y' + maiorId('Y');
                img.id = id_img;
                img.addEventListener('click', function () {
                    ampliar_especial(id_img);
                });
                td.appendChild(img);
            } else {
                td.textContent = valor;
            }
            tr.appendChild(td);
            textos.push(valor.toString().toLowerCase());
        });

        var adicionaLinha = true;
        for (var filtro in filtros) {
            if (filtros[filtro] && !textos.some(texto => texto.includes(filtros[filtro]))) {
                adicionaLinha = false;
                break;
            }
        }

        if (adicionaLinha) {
            document.getElementById('tabela_produtos').appendChild(tr);
        }
    });

    document.getElementById('detalhes').style.display = 'block';
    document.getElementById('botao_ocultar').style.display = 'block'
    document.getElementById('botao_exibir').style.display = 'none'
}

function incluir_item(codigo, id) { // id do INPUT
    var tamanho = maiorId('A');
    var item_existente = false;
    var dados_composicoes = JSON.parse(localStorage.getItem('dados_composicoes'))
    var dados_composicoes_orcamento = JSON.parse(localStorage.getItem('dados_composicoes_orcamento')) || {}
    var qtde = Number(document.getElementById(id).value);

    var composicao_regiao = dados_composicoes[codigo].fabricante

    if (composicao_regiao == 'REGIÃO') {

        var estado = document.getElementById('estado').textContent
        var regiao = regioes_por_estado[estado]

        if (regiao == 'Não definido') {

            openPopup('Para lançar este custo indireto, defina um estado antes: no botão "Dados Clientes"')

        } else {

            var lpu_ativa = String(document.getElementById('lpu').value).toLowerCase()

            var valor_do_custo_indireto = conversor(dados_composicoes[codigo][lpu_ativa])
            var codigo_regiao = codigos_regioes_custo[regiao]

            if (!dados_composicoes_orcamento[codigo_regiao]) {
                dados_composicoes_orcamento[codigo_regiao] = {};
            }

            if (!dados_composicoes_orcamento[codigo_regiao][codigo]) {
                dados_composicoes_orcamento[codigo_regiao][codigo] = {};
            }

            dados_composicoes_orcamento[codigo_regiao][codigo] = {
                'qtde': qtde,
                'valor_unit': valor_do_custo_indireto,
                'valor_total': valor_do_custo_indireto * qtde,
                'descricao': dados_composicoes[codigo].descricao
            }

            localStorage.setItem('dados_composicoes_orcamento', JSON.stringify(dados_composicoes_orcamento))

            for (var i = 1; i < tamanho; i++) {
                var codigo_existente = document.getElementById('A' + i).textContent;

                if (codigo_existente == codigo_regiao) {
                    document.getElementById('E' + i).value = qtde;
                    item_existente = true;
                    composicao(i)
                    break;
                }
            }

            if (!item_existente) {
                adicionarLinha();

                document.getElementById('A' + tamanho).textContent = codigo_regiao;
                document.getElementById('E' + tamanho).value = qtde;
                composicao(tamanho)
            }

            total()
        }


    } else {

        var tabela = document.getElementById('linhas');
        var As = tabela.querySelectorAll('[id^="A"]');

        As.forEach(function (codigo_existente) {
            if (codigo_existente.textContent == codigo) {
                var i = String(codigo_existente.id).slice(0, 1)
                document.getElementById('E' + i).value = qtde;
                item_existente = true;
            }
        })

        if (!item_existente) {
            adicionarLinha();

            var novo = maiorId('A') - 1
            document.getElementById('A' + novo).textContent = codigo;
            document.getElementById('E' + novo).value = qtde;
        }

        total()
    }
}

function composicao(i) {
    var td = document.getElementById('W' + i);
    var div = document.getElementById('V' + i);
    var codigo = document.getElementById('A' + i).textContent;
    var dados_composicoes_orcamento = JSON.parse(localStorage.getItem('dados_composicoes_orcamento'));
    var dados_composicoes = JSON.parse(localStorage.getItem('dados_composicoes'));
    var janela = document.getElementById('retangulo_glass');
    var janela_dados = document.getElementById('composicoes_tabela');
    var composicoes = dados_composicoes_orcamento[codigo];
    var lpu_ativa = String(document.getElementById('lpu').value).toLowerCase()

    div.innerHTML = '';

    function reset_janela() {
        janela.style.display = 'block';
        janela_dados.innerHTML = '';

        for (var item in composicoes) {
            var campos = ['descricao', 'valor_unit', 'qtde', 'valor_total'];
            var tr = document.createElement('tr');

            var tdKey = document.createElement('td');
            tdKey.textContent = item;
            tr.appendChild(tdKey);

            campos.forEach(function (coluna) {
                var tdx = document.createElement('td');
                if (coluna == 'valor_unit' || coluna == 'valor_total') {
                    tdx.textContent = dinheiro(composicoes[item][coluna])
                } else if (coluna == 'qtde') {
                    var input = document.createElement('input')
                    input.type = 'number'
                    input.value = composicoes[item][coluna];
                    input.classList = 'quantidade'
                    input.style.width = '100px'
                    input.style.height = '40px'

                    var item_input = item // Deve-se armazenar a variável antes de colocar no Input, porque do contrário vai capturar os dados do último item no looping;

                    input.addEventListener('change', function () {
                        var nova_qtde = this.value
                        var unit = conversor(dados_composicoes_orcamento[codigo][item_input]['valor_unit'])

                        dados_composicoes_orcamento[codigo][item_input].qtde = this.value
                        dados_composicoes_orcamento[codigo][item_input].valor_total = nova_qtde * unit
                        localStorage.setItem('dados_composicoes_orcamento', JSON.stringify(dados_composicoes_orcamento))
                        reset_janela()
                        total()
                    })

                    tdx.appendChild(input)
                } else {
                    tdx.textContent = composicoes[item][coluna];
                }

                tr.appendChild(tdx);
            });

            var td_botao = document.createElement('td')
            td_botao.style.width = '10px'
            var img = document.createElement('img')
            img.src = 'excluir.png'
            img.style.cursor = 'pointer'

            var item_input = item // Deve-se armazenar a variável antes de colocar no Input, porque do contrário vai capturar os dados do último item no looping;

            img.addEventListener('click', function () {
                delete dados_composicoes_orcamento[codigo][item_input]
                localStorage.setItem('dados_composicoes_orcamento', JSON.stringify(dados_composicoes_orcamento))
                reset_janela()
            })

            td_botao.appendChild(img)
            tr.appendChild(td_botao)

            janela_dados.appendChild(tr);
        }
    }

    var img = document.createElement('img');
    img.addEventListener('click', function () {
        reset_janela()
    });

    // Calcular as composições;
    var valor_item_regiao = conversor(dados_composicoes[codigo][lpu_ativa])
    var total_soma = 0
    for (var item in composicoes) {
        total_soma += composicoes[item].valor_total
    }
    var quantidade_convertida = total_soma / valor_item_regiao

    //Já que não se pode chamar total(); vou fazer o cálculo isoladamente;
    document.getElementById('E' + i).value = quantidade_convertida.toFixed(2)
    document.getElementById('F' + i).value = dinheiro(valor_item_regiao)
    document.getElementById('G' + i).textContent = dinheiro(quantidade_convertida * valor_item_regiao)
    calculo_imposto(i, 0, valor_item_regiao, Number(quantidade_convertida))

    document.getElementById('total_composicao').textContent = dinheiro(total_soma)

    img.src = 'construcao.png';
    img.style.width = '25px';
    img.style.cursor = 'pointer';
    div.appendChild(img);
    td.style = 'display: flex; align-items: center;';

}

function fechar_popup_composicoes() {
    document.getElementById('retangulo_glass').style.display = 'none'
}

function calculo_imposto(i, porcentagem, valor, qtde) {

    var qtde = conversor(qtde)

    if (porcentagem != 0) {
        var valor_unt_sem_imposto = valor / (porcentagem + 1)
    } else {
        var valor_unt_sem_imposto = valor
    }

    document.getElementById('P' + i).textContent = (porcentagem * 100).toFixed(1) + '%'
    document.getElementById('Z' + i).textContent = 'Unit Liq ' + dinheiro(valor_unt_sem_imposto)
    document.getElementById('M' + i).textContent = 'Total Liq ' + dinheiro(valor_unt_sem_imposto * qtde)

}

function total() {
    var dados_itens = JSON.parse(localStorage.getItem('dados_itens'));
    var dados_composicoes = JSON.parse(localStorage.getItem('dados_composicoes'));
    var dados_composicoes_orcamento = JSON.parse(localStorage.getItem('dados_composicoes_orcamento'));

    var tabela = document.getElementById('linhas');
    var valores = tabela.querySelectorAll('[id^="F"]');
    var soma = 0;
    var estado = document.getElementById('estado').textContent;

    valores.forEach(function (linha_) {
        var i = linha_.id.substring(1);
        var codigo = document.getElementById('A' + i).textContent;
        var qtde = Number(document.getElementById('E' + i).value);
        var lpu_ativo = String(document.getElementById('lpu').value).toLowerCase();
        var campo_valor = document.getElementById('F' + i);

        try {
            if (dados_composicoes_orcamento[codigo] != undefined) {
                composicao(i)
            }
        } catch { }

        if (codigo != '') {

            if (qtde == '') {
                removerLinha(document.getElementById('A' + i)) // pode ser qualquer elemento da linha; 
            } else {

                try {
                    var tipo = dados_composicoes[codigo].tipo;
                } catch {
                    var tipo = '--'
                }

                var porcentagem;
                if (estado == 'BA' && (tipo == 'VENDA' || tipo == '--' || tipo == 'COTAÇÃO')) {
                    porcentagem = 0.205
                } else if (estado != '--' && estado != 'BA' && (tipo == 'VENDA' || tipo == '--' || tipo == 'COTAÇÃO')) {
                    porcentagem = 0.12
                } else {
                    porcentagem = 0
                }

                if (dados_composicoes[codigo]) {
                    var valor = conversor(dados_composicoes[codigo][lpu_ativo])
                    campo_valor.value = dinheiro(valor);
                    calculo_imposto(i, porcentagem, valor, qtde)
                }

                var valorTexto = conversor(document.getElementById('F' + i).value);
                var quantidade = Number(document.getElementById('E' + i).value);
                var total_linha = document.getElementById('G' + i);
                var valor = conversor(valorTexto) * quantidade;

                if (valor == 0) {
                    total_linha.classList = 'label_zerada';
                } else {
                    total_linha.classList = 'label_ok';
                }

                if (!isNaN(valor)) {
                    soma += valor;
                }

                total_linha.textContent = dinheiro(valor);

                document.getElementById('A' + i).textContent = codigo;
                document.getElementById('B' + i).textContent = dados_composicoes[codigo].ncm
                document.getElementById('C' + i).textContent = dados_composicoes[codigo].descricao;
                document.getElementById('D' + i).textContent = dados_composicoes[codigo].unidade;
                document.getElementById('H' + i).textContent = tipo;

                var imagemSrc = dados_composicoes[codigo].imagem || 'https://i.imgur.com/Nb8sPs0.png';

                document.getElementById('I' + i).src = imagemSrc;
            }
        }
    });

    document.getElementById('total_geral').textContent = dinheiro(soma);

    salvar_dados()
}
