document.addEventListener('DOMContentLoaded', function () {
    const botaoConfirmar = document.getElementById('btnConfirmarSaida');

    if (botaoConfirmar) {
        botaoConfirmar.addEventListener('click', function (event) {
            event.preventDefault();
            localStorage.removeItem('usuarioLogadoNexusMarket');
            window.location.href = './inicio.html';
        });
    }
});
