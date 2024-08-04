

var id_imagem;

document.getElementById('fileInput').addEventListener('change', function (event) {
    var file = event.target.files[0];
    document.getElementById('uploadButton').style.display = 'block'

    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var base64String = e.target.result;
            document.getElementById('base64Output').value = base64String;
            document.getElementById('img').src = base64String;
            document.getElementById('img').style.display = 'block';

            document.getElementById(id_imagem).src = base64String
        };
        reader.readAsDataURL(file);
    }

});

document.getElementById('uploadButton').addEventListener('click', async function () {
    var apiUrl = 'https://api.imgur.com/3/image';
    var base64String = document.getElementById('base64Output').value;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': 'Client-ID 9403017266f9102',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: base64String.replace(/^data:image\/\w+;base64,/, ''),
                type: 'base64',
            }),
        });

        const responseData = await response.json();

        if (responseData.data.error) {
            openPopup("Ocorreu um erro aqui, mas tudo bem... tenta de novo.")
            consolee.log(responseData.data.error);
        } else {
            openPopup("Imagem Salva na Memória")
            var dados_composicoes = JSON.parse(localStorage.getItem('dados_composicoes'))

            var linha = id_imagem[id_imagem.length - 1]
            var src_ = responseData.data.link
            var codigo = document.getElementById('A' + linha).textContent

            if (!dados_composicoes[codigo]) {
                dados_composicoes[codigo] = {};
            }

            if (!dados_composicoes[codigo]['imagem']) {
                dados_composicoes[codigo]['imagem'] = {};
            }

            dados_composicoes[codigo]['imagem'] = src_;

            localStorage.setItem('dados_composicoes', JSON.stringify(dados_composicoes))

            var composicao = {
                'tabela': 'composicoes',
                'codigo': codigo,
                'composicao': dados_composicoes[codigo]
            }
            
            // Enviando dados para a API
            fetch('https://script.google.com/a/macros/hopent.com.br/s/AKfycbx40241Ogk6vqiPxQ3RDjf4XURo3l_yG0x9j9cTNpeKIdnosEEewTnw7epPrc2Ir9EX/exec', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(composicao)
            });


            document.getElementById('I' + linha).src = src_

            salvar_dados()

        }
    } catch (error) {
        openPopup("Ocorreu um erro aqui, mas tudo bem... tenta de novo.")
        console.log(error)
    }

    document.getElementById('fileInput').style.display = 'none'
    document.getElementById('uploadButton').style.display = 'none'
    
});