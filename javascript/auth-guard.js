(function () {
    const STORAGE_KEY = 'usuarioLogadoNexusMarket';
    const usuario = localStorage.getItem(STORAGE_KEY);
    const pathname = window.location.pathname.replace(/\\/g, '/');
    const nomePagina = pathname.split('/').pop().toLowerCase();

    const paginasProtegidas = [
        'minha-conta.html',
        'meus-pedidos.html',
        'enderecos.html',
        'pagamentos.html',
        'configuracoes.html',
        'carrinho.html'
    ];

    const paginasPublicas = [
        'entrar.html',
        'cadastro.html',
        'esqueceu_senha.html',
        'inicio.html',
        'fones.html',
        'iphones.html',
        'androids.html',
        'notebook.html',
        'sair.html'
    ];

    const precisaAutenticacao = paginasProtegidas.includes(nomePagina);
    const ePaginaPublica = paginasPublicas.includes(nomePagina);

    if (precisaAutenticacao && !usuario) {
        window.location.replace('../nexus_market/entrar.html');
        return;
    }

    if (ePaginaPublica && usuario && nomePagina !== 'inicio.html') {
        window.location.replace('../nexus_market/inicio.html');
    }
})();
