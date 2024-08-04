window.onclick = function (event) {
    if (event.target == document.getElementById('myPopup')) {
        closePopup();
    }
}

function openPopup(mensagem) {
    document.getElementById('myPopup').style.display = 'block';
    document.getElementById('aviso_popup').textContent = mensagem
}

function closePopup(tela) {
    document.getElementById('myPopup').style.display = 'none';
    if (tela == 'itens') {
        window.location.href = 'adicionar.html';
    }
    if(tela == 'cadastro'){
        window.location.href = 'login.html'
    }
}