
document.getElementById('senha').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        acesso()
        event.preventDefault();
    }
})

verificar_login_automatico()

function carregar_pagina(htmlUrl, cssUrls, scriptUrls) {

    document.getElementById('content').innerHTML = ''

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

function verificar_login_automatico() {
    try {
        var acesso = JSON.parse(localStorage.getItem('acesso'))
        if (acesso.acesso == 'Autorizado') {
            var pagina = 'PÁGINA INICIAL'
            carregar_pagina(dados_paginas[pagina].html, dados_paginas[pagina].css, dados_paginas[pagina].scripts);
        }
    } catch {
        console.log('Usuário deslogado')
    }
}

function cadastro() {
    window.location.href = 'novo_usuario.html'
}

function acesso() {
    document.getElementById('acesso').style.display = 'none'
    document.getElementById('loading').style.display = 'block'

    var usuario = document.getElementById('usuario').value;
    var senha = document.getElementById('senha').value;

    let url = 'https://script.google.com/macros/s/AKfycbx40241Ogk6vqiPxQ3RDjf4XURo3l_yG0x9j9cTNpeKIdnosEEewTnw7epPrc2Ir9EX/exec?bloco=' + usuario + '*' + senha


    if (usuario == "" || senha == "") {
        openPopup("Senha e/ou usuário não informado(s)")
        document.getElementById('acesso').style.display = 'block'
        document.getElementById('loading').style.display = 'none'
    } else {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar os dados');
                }
                return response.json();
            })
            .then(data => {

                switch (true) {
                    case data == "Usuário não cadastrado":
                        openPopup(data)
                        break
                    case data == "Senha incorreta":
                        openPopup(data)
                        break
                    case data.acesso == "Autorizado":
                        localStorage.setItem('acesso', JSON.stringify(data))
                        var pagina = 'PÁGINA INICIAL'
                        carregar_pagina(dados_paginas[pagina].html, dados_paginas[pagina].css, dados_paginas[pagina].scripts);
                        break
                    default:
                        openPopup('Falha interna. Entre em contato com o planejamento.')
                }
                document.getElementById('acesso').style.display = 'block'
                document.getElementById('loading').style.display = 'none'

            })
            .catch(error => {
                console.error('Ocorreu um erro:', error);
            });

    }
}
