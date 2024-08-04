    function excluir_item() {
        var acesso = localStorage.getItem('acesso').permissao == 'adm'

        if (acesso) {
            document.getElementById('excluir_composicao').addEventListener('click', function () {
                document.getElementById('sim_nao').style.display = 'block'
                excluir()
            })
        } else {
            openPopup('Seu acesso não permite esta ação. Apenas adms podem fazer isso.')
        }
    }

    function atualizar() {
        recuperar()
        document.getElementById('ocultar_para_carregar').style.display = 'none'
        document.getElementById('loading').style = "display: flex; justify-content: center; align-items: center;"

        setInterval(function () {
            local_dados()
            document.getElementById('loading').style.display = 'none'
            document.getElementById('ocultar_para_carregar').style.display = 'block'
        }, 2000)
    }

    recuperar()
    local_dados()

    grupos_keys.forEach(function (grupo) {
        let option = document.createElement('option');
        option.textContent = grupos[grupo].nome;
        document.getElementById('grupos').appendChild(option)
    });

    document.getElementById('campo-pesquisa').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            var pesquisa = document.getElementById('campo-pesquisa').value
            local_dados(pesquisa)
            // Impede o comportamento padrão, se necessário (por exemplo, submissão de formulário)
            event.preventDefault();
        }
    })
