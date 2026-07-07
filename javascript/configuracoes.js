function sairDaConta() {
    localStorage.removeItem('usuarioLogadoNexusMarket');
    window.location.href = '../nexus_market/entrar.html';
}

window.sairDaConta = sairDaConta;

document.addEventListener('DOMContentLoaded', function () {
    const botaoSair = document.getElementById('btnSairConfiguracoes');
    const selectTema = document.getElementById('selectTema');

    if (botaoSair) {
        botaoSair.addEventListener('click', function (event) {
            event.preventDefault();
            sairDaConta();
        });
    }

    if (selectTema) {
        const temaSalvo = localStorage.getItem('nexusTheme') || 'light';
        selectTema.value = temaSalvo;

        selectTema.addEventListener('change', function () {
            const tema = selectTema.value;
            document.documentElement.setAttribute('data-theme', tema);
            localStorage.setItem('nexusTheme', tema);
        });
    }
});