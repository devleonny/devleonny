document.addEventListener('DOMContentLoaded', function () {
    var filtros = document.querySelectorAll('input.filtro');
    filtros.forEach(function (filtro) {
        filtro.addEventListener('input', buscar_pagamentos);
    });
    buscar_pagamentos();
});

function atualizar() {
    document.getElementById('loading').style = "display: flex; justify-content: center; align-items: center;"
    document.getElementById('tabela').style.display = 'none'
    obter_lista_pagamentos()

    setTimeout(function () {
        buscar_pagamentos()
        document.getElementById('loading').style.display = 'none'
        document.getElementById('tabela').style.display = 'block'
    }, 2000)
}

function buscar_pagamentos() {
    var lista_pagamentos = JSON.parse(localStorage.getItem('lista_pagamentos'));
    var dados_orcamentos = JSON.parse(localStorage.getItem('dados_orcamentos'));

    var listagem = document.getElementById('listagem')
    var filtro_cc = document.getElementById('filtro-cc').value.toLowerCase();
    var filtro_orcamento = document.getElementById('filtro-orcamento').value.toLowerCase();
    var filtro_descricao = document.getElementById('filtro-descricao').value.toLowerCase();
    var filtro_valor = document.getElementById('filtro-valor').value.toLowerCase();
    var filtro_inicio = document.getElementById('filtro-inicio').value.toLowerCase();
    var filtro_fim = document.getElementById('filtro-fim').value.toLowerCase();
    var filtro_categoria = document.getElementById('filtro-categoria').value.toLowerCase();
    var filtro_autorizado = document.getElementById('filtro-autorizado').value.toLowerCase();

    listagem.innerHTML = ''

    for (var orcamento in lista_pagamentos) {
        for (var pagamento in lista_pagamentos[orcamento]) {
            if (pagamento !== 'observacao') {
                var pagamentoDetalhes = lista_pagamentos[orcamento][pagamento];

                var descricao = pagamentoDetalhes.descricao.toLowerCase();
                var valor = pagamentoDetalhes.valor.toString().toLowerCase();
                var inicio = new Date(pagamentoDetalhes.inicio).toLocaleDateString('pt-BR').toLowerCase();
                var fim = new Date(pagamentoDetalhes.fim).toLocaleDateString('pt-BR').toLowerCase();
                var categoria = pagamentoDetalhes.categoria.toLowerCase();
                var usuario = pagamentoDetalhes.criado.toLowerCase();
                var st = pagamentoDetalhes.status;
                var salvar = false;
                var autorizado = pagamentoDetalhes.autorizado.toLowerCase();

                var anexos = pagamentoDetalhes.anexos ? pagamentoDetalhes.anexos : [];

                var nome_projeto = dados_orcamentos[orcamento]['dados_orcam'].nome_projeto.toLowerCase();
                var contrato = dados_orcamentos[orcamento]['dados_orcam'].contrato.toLowerCase();

                if (
                    (filtro_cc === '' || nome_projeto.includes(filtro_cc)) &&
                    (filtro_orcamento === '' || contrato.includes(filtro_orcamento)) &&
                    (filtro_descricao === '' || descricao.includes(filtro_descricao)) &&
                    (filtro_valor === '' || valor.includes(filtro_valor)) &&
                    (filtro_inicio === '' || inicio.includes(filtro_inicio)) &&
                    (filtro_fim === '' || fim.includes(filtro_fim)) &&
                    (filtro_categoria === '' || categoria.includes(filtro_categoria)) &&
                    (filtro_autorizado === '' || autorizado.includes(filtro_autorizado))
                ) {
                    var tr = document.createElement('tr')

                    var label_cc = document.createElement('td')
                    var label_orcamento = document.createElement('td')
                    var label_descricao = document.createElement('td')
                    var label_valor = document.createElement('td')
                    var label_inicio = document.createElement('td')
                    var label_fim = document.createElement('td')
                    var label_categoria = document.createElement('td')
                    var label_autorizado = document.createElement('td')

                    var label_aprov = document.createElement('td')
                    var label_rep = document.createElement('td')

                    var button_aprov = document.createElement('button')
                    var button_rep = document.createElement('button')
                    button_aprov.textContent = 'Aprovar'
                    button_rep.textContent = 'Reprovar'
                    button_aprov.style.backgroundColor = 'green'

                    button_aprov.dataset.orcamento = orcamento;
                    button_aprov.dataset.pagamento = pagamento;
                    button_rep.dataset.orcamento = orcamento;
                    button_rep.dataset.pagamento = pagamento;

                    button_rep.addEventListener('click', function (event) {
                        var orcamento = event.target.dataset.orcamento;
                        var pagamento = event.target.dataset.pagamento;
                        var lista_pagamentos = JSON.parse(localStorage.getItem('lista_pagamentos'));

                        lista_pagamentos[orcamento][pagamento].status = 'pendente';
                        lista_pagamentos[orcamento][pagamento].autorizado = '--';

                        localStorage.setItem('lista_pagamentos', JSON.stringify(lista_pagamentos));

                        enviar_lista_pagamentos()

                        buscar_pagamentos()
                    });

                    button_aprov.addEventListener('click', function (event) {
                        var orcamento = event.target.dataset.orcamento;
                        var pagamento = event.target.dataset.pagamento;
                        var lista_pagamentos = JSON.parse(localStorage.getItem('lista_pagamentos'));

                        var usuario = JSON.parse(localStorage.getItem('acesso')).usuario

                        lista_pagamentos[orcamento][pagamento].status = 'aprovado';
                        lista_pagamentos[orcamento][pagamento].autorizado = usuario

                        localStorage.setItem('lista_pagamentos', JSON.stringify(lista_pagamentos));

                        enviar_lista_pagamentos()

                        buscar_pagamentos()
                    });

                    label_aprov.appendChild(button_aprov)
                    label_rep.appendChild(button_rep)

                    label_cc.textContent = dados_orcamentos[orcamento]['dados_orcam'].nome_projeto
                    label_orcamento.textContent = dados_orcamentos[orcamento]['dados_orcam'].contrato
                    label_descricao.textContent = descricao
                    label_valor.textContent = dinheiro(valor)
                    label_inicio.textContent = inicio
                    label_fim.textContent = fim
                    label_categoria.textContent = categoria
                    label_autorizado.textContent = autorizado

                    if (st == 'pendente') {
                        tr.append(label_cc, label_orcamento, label_descricao, label_valor, label_inicio, label_fim, label_categoria, label_autorizado, label_aprov)
                    } else {
                        tr.append(label_cc, label_orcamento, label_descricao, label_valor, label_inicio, label_fim, label_categoria, label_autorizado, label_rep)
                    }

                    listagem.appendChild(tr)
                    listagem.style.width = '100%'
                }
            }
        }
    }
}