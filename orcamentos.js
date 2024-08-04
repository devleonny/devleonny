
    document.getElementById('campo-pesquisa').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            var termo = document.getElementById('campo-pesquisa').value
            pesquisar(termo)
            event.preventDefault();
        }
    })

    pesquisar() // Atualmente traz os dados armazenados;

    setTimeout(function () {
        setInterval(recuperar(), 60000)
    }, 60000)

    recuperar_projetos() // Deixar os dados mais atualizados;

    function pesquisar(termo) {

        document.querySelector('tbody').innerHTML = ''

        var data = JSON.parse(localStorage.getItem('dados_orcamentos'));

        var linhas = Object.keys(data)

        var orcamentos = {};

        linhas.forEach(function (orcamento) {
            let textos = [];
            let orcamento_parse = data[orcamento];
            let id_orcamento = orcamento;
            orcamentos[id_orcamento] = orcamento_parse;

            let tr = document.createElement('tr');

            tr.classList = 'linha_destacada'

            tr.addEventListener('click', function (event) {
                var target = event.target;
                var cells = tr.querySelectorAll('td');
                var lastCell = cells[cells.length - 1];

                // Verifica se o alvo do clique não é o último <td> nem um filho do último <td>
                if (target !== lastCell && !lastCell.contains(target)) {
                    abrir_detalhes_chamado(id_orcamento);
                }
            });

            //Data Início;
            let td = document.createElement('td');
            if (new Date(orcamento_parse['dados_orcam']['data']).toLocaleDateString('pt-BR') != 'Invalid Date') {
                var data_inicial = new Date(orcamento_parse['dados_orcam']['data']).toLocaleDateString('pt-BR');
            } else {
                var data_inicial = '-- / -- / ----';
            }

            td.textContent = data_inicial;
            textos.push(data_inicial);
            tr.appendChild(td);

            //Data Previsão;
            let td1 = document.createElement('td');
            if (new Date(orcamento_parse['dados_orcam']['data_previsao']).toLocaleDateString('pt-BR') != 'Invalid Date') {
                var data_previsao = new Date(orcamento_parse['dados_orcam']['data_previsao']).toLocaleDateString('pt-BR');
            } else {
                var data_previsao = '-- / -- / ----';
            }
            td1.textContent = data_previsao;
            textos.push(data_previsao);
            tr.appendChild(td1);

            //Progresso;

            if (data_previsao != '-- / -- / ----' && data_inicial != '-- / -- / ----') {
                var andamento = calcularProporcao(data_inicial, data_previsao)
            } else {
                var andamento = '0%'
            }

            var div_progresso = document.createElement('div')
            div_progresso.style = 'border-radius: 20px; width: 100%; background-color: #ddd;'
            var div_barra = document.createElement('div')
            div_barra.style = 'border-radius: 20px; width: ' + andamento + '; height: 20px; background-color: #4CAF50;'
            var label_prog = document.createElement('label')
            label_prog.textContent = andamento
            div_progresso.appendChild(div_barra)
            var td_prog = document.createElement('td')
            td_prog.appendChild(div_progresso)
            td_prog.appendChild(label_prog)
            tr.appendChild(td_prog)

            //Demais campos;
            let lista = ['contrato', 'cliente_selecionado', 'nome_projeto', 'cidade', 'analista'];

            lista.forEach(function (item) {
                let td = document.createElement('td');
                td.textContent = orcamento_parse['dados_orcam'][item];
                textos.push(orcamento_parse['dados_orcam'][item]);
                tr.appendChild(td);
            });

            let td2 = document.createElement('td');
            td2.textContent = orcamento_parse.total_geral;
            textos.push(orcamento_parse.total_geral);
            tr.appendChild(td2);

            // Status de Aprovação;

            var td_aprov = document.createElement('td');
            var label_aprov = document.createElement('label')

            if (orcamento_parse['dados_orcam']['status']) {
                var status = orcamento_parse['dados_orcam']['status']
                if (status == 'Aprovado') {
                    label_aprov.textContent = 'Aprovado'
                    label_aprov.style = 'color: white; border-radius: 20px; padding: 10px; background-color: green;'
                } else if (status == 'Atrasado') {
                    label_aprov.textContent = 'Atrasado'
                    label_aprov.style = 'color: white; border-radius: 20px; padding: 10px; background-color: red;'
                }
                textos.push(status)
            } else {
                label_aprov.textContent = 'Aguardando'
                label_aprov.style = 'color: white; border-radius: 20px; padding: 10px; background-color: orange;'
                textos.push('Aguardando')
            }
            td_aprov.appendChild(label_aprov)
            tr.appendChild(td_aprov)

            // Ações;

            let select = document.createElement('select');
            let lista_botoes = ['--', 'Excel', 'PDF', 'Duplicar', 'Editar', 'Excluir', 'Aprovar', 'Atrasado']
            lista_botoes.forEach(function (item) {
                let option = document.createElement('option');
                option.textContent = item;
                select.appendChild(option);
            });
            select.addEventListener('change', function () {
                funcionalidades(select, id_orcamento, orcamento_parse['id']);
            });
            let td_select = document.createElement('td');
            td_select.appendChild(select);
            tr.appendChild(td_select);
            if (!termo || termo.trim() === '') {
                document.querySelector('tbody').appendChild(tr);
            } else {
                let adicionaLinha = false;
                textos.forEach(function (texto) {
                    if (typeof texto === 'string' && texto.toLowerCase().includes(termo.toLowerCase())) {
                        adicionaLinha = true;
                    }
                });
                if (adicionaLinha) {
                    document.querySelector('tbody').appendChild(tr);
                }
            }
        });
    }


    function recuperar() {

        document.querySelector('tbody').innerHTML = ''
        document.getElementById('loading').style.display = 'flex'
        document.getElementById('botao_atualizar').style.display = 'none'
        document.getElementById('excel').style.display = 'none'


        let url = 'https://script.google.com/macros/s/AKfycbx40241Ogk6vqiPxQ3RDjf4XURo3l_yG0x9j9cTNpeKIdnosEEewTnw7epPrc2Ir9EX/exec?bloco=orcamentos'

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar os dados');
                }
                return response.json();
            })
            .then(data => {

                let i = 1;

                var orcamentos = {}
                data.forEach(function (orcamento) {

                    let orcamento_parse = JSON.parse(orcamento)

                    let id_orcamento = orcamento_parse.id

                    orcamentos[id_orcamento] = orcamento_parse

                    let lista = ['contrato', 'cliente_selecionado', 'nome_projeto', 'cidade', 'analista']

                    let tr = document.createElement('tr');

                    tr.addEventListener('click', function (event) {
                        var target = event.target;
                        var cells = tr.querySelectorAll('td');
                        var lastCell = cells[cells.length - 1];

                        // Verifica se o alvo do clique não é o último <td> nem um filho do último <td>
                        if (target !== lastCell && !lastCell.contains(target)) {
                            abrir_detalhes_chamado(id_orcamento);
                        }
                    });

                    let td = document.createElement('td');

                    if (new Date(orcamento_parse['dados_orcam']['data']).toLocaleDateString('pt-BR') != 'Invalid Date') {
                        var data_inicial = new Date(orcamento_parse['dados_orcam']['data']).toLocaleDateString('pt-BR')
                    } else {
                        var data_inicial = '-- / -- / ----'
                    }
                    td.textContent = data_inicial
                    tr.appendChild(td)

                    //Data Previsão;
                    let td1 = document.createElement('td');
                    if (new Date(orcamento_parse['dados_orcam']['data_previsao']).toLocaleDateString('pt-BR') != 'Invalid Date') {

                        var data_previsao = new Date(orcamento_parse['dados_orcam']['data_previsao']).toLocaleDateString('pt-BR');

                    } else {
                        var data_previsao = '-- / -- / ----';
                    }
                    td1.textContent = data_previsao;
                    tr.appendChild(td1);

                    //Progresso;

                    if (data_previsao != '-- / -- / ----' && data_inicial != '-- / -- / ----') {
                        var andamento = calcularProporcao(data_inicial, data_previsao)
                    } else {
                        var andamento = '0%'
                    }

                    var div_progresso = document.createElement('div')
                    div_progresso.style = 'border-radius: 20px; width: 100%; background-color: #ddd;'
                    var div_barra = document.createElement('div')
                    div_barra.style = 'border-radius: 20px; width: ' + andamento + '; height: 20px; background-color: #4CAF50;'
                    var label_prog = document.createElement('label')
                    label_prog.textContent = andamento
                    div_progresso.appendChild(div_barra)
                    var td_prog = document.createElement('td')
                    td_prog.appendChild(div_progresso)
                    td_prog.appendChild(label_prog)
                    tr.appendChild(td_prog)

                    //Restante dos itens;

                    lista.forEach(function (item) {
                        let td = document.createElement('td');
                        td.textContent = orcamento_parse['dados_orcam'][item]
                        tr.appendChild(td);

                    })

                    //Coluna TOTAL GERAL
                    let td2 = document.createElement('td');
                    td2.textContent = orcamento_parse.total_geral;
                    tr.appendChild(td2);

                    // Status de Aprovação;

                    var td_aprov = document.createElement('td');
                    var label_aprov = document.createElement('label')

                    if (orcamento_parse['dados_orcam']['status']) {
                        var status = orcamento_parse['dados_orcam']['status']
                        if (status == 'Aprovado') {
                            label_aprov.textContent = 'Aprovado'
                            label_aprov.style = 'color: white; border-radius: 20px; padding: 10px; background-color: green;'
                        } else if (status == 'Atrasado') {
                            label_aprov.textContent = 'Atrasado'
                            label_aprov.style = 'color: white; border-radius: 20px; padding: 10px; background-color: red;'
                        }
                    } else {
                        label_aprov.textContent = 'Aguardando'
                        label_aprov.style = 'color: white; border-radius: 20px; padding: 10px; background-color: orange;'
                    }

                    td_aprov.appendChild(label_aprov)
                    tr.appendChild(td_aprov)

                    //BOTÕES

                    let select = document.createElement('select')

                    let lista_botoes = ['--', 'Excel', 'PDF', 'Duplicar', 'Editar', 'Excluir', 'Aprovar', 'Atrasado']

                    lista_botoes.forEach(function (item) {
                        let option = document.createElement('option')
                        option.textContent = item
                        select.appendChild(option)
                    })

                    select.addEventListener('change', function () {
                        funcionalidades(select, id_orcamento, orcamento_parse['id'])
                    })

                    let td_select = document.createElement('td')
                    td_select.appendChild(select)
                    tr.appendChild(td_select)
                    document.querySelector('tbody').appendChild(tr);

                    i++
                })

                localStorage.setItem('dados_orcamentos', JSON.stringify(orcamentos))

                document.getElementById('loading').style.display = 'none'

                document.getElementById('botao_atualizar').style.display = 'block'

                document.getElementById('excel').style.display = 'block'


            })

    }

    function funcionalidades(select, id, codigo_orcamento) {

        switch (true) {
            case select.value == 'Excel':
                ir_excel(id)
                break
            case select.value == 'PDF':
                ir_pdf(id)
                break
            case select.value == 'Duplicar':
                duplicar(id)
                break
            case select.value == 'Editar':
                editar(id)
                break
            case select.value == 'Aprovar':
                status('Aprovado', codigo_orcamento)
                break
            case select.value == 'Atrasado':
                status('Atrasado', codigo_orcamento)
                break
            case select.value == 'Excluir':
                openPopup('Deseja realmente excluir o orçamento?')
                document.getElementById('sim_nao_orcamento').style = 'display: flex; align-items: center; justify-content: space-evenly;'
                document.getElementById('confirmar_exclusao_orcamento').addEventListener('click', function () {
                    document.getElementById('sim_nao_orcamento').style.display = 'none'
                    apagar(codigo_orcamento)
                    setInterval(function () {
                        location.href = 'orcamentos.html'
                    }, 3000)
                })
                break
            default:
        }

        select.value = '--'

    }

    function status(acao, id_orcam) {
        let dados_orcamentos = JSON.parse(localStorage.getItem('dados_orcamentos'))

        dados_orcamentos[id_orcam]['dados_orcam']['status'] = acao

        localStorage.setItem('dados_orcamentos', JSON.stringify(dados_orcamentos))

        sincronizar_orcamento(dados_orcamentos[id_orcam])

        pesquisar()
    }


    function editar(orcam_) {
        let dados_orcamentos = JSON.parse(localStorage.getItem('dados_orcamentos'))

        localStorage.setItem('editar_orcam', orcam_) // A diferença entre editar e duplicar está aqui; o ID fica salvo;

        localStorage.setItem('dados_preenchidos', JSON.stringify(dados_orcamentos[orcam_]['dados_orcam']))
        localStorage.setItem('dados_adicionar', JSON.stringify(dados_orcamentos[orcam_]['dados_composicoes']))

        window.location.href = 'adicionar.html'
    }

    function duplicar(orcam_) {
        let dados_orcamentos = JSON.parse(localStorage.getItem('dados_orcamentos'))

        localStorage.setItem('dados_preenchidos', JSON.stringify(dados_orcamentos[orcam_]['dados_orcam']))
        localStorage.setItem('dados_adicionar', JSON.stringify(dados_orcamentos[orcam_]['dados_composicoes']))

        window.location.href = 'adicionar.html'
    }