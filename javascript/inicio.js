const USUARIO_LOGADO_KEY = 'usuarioLogadoNexusMarket';

function adicionarAoCarrinhoFallback(produto) {
    const carrinho = JSON.parse(localStorage.getItem('carrinhoNexusMarket') || '[]');
    const existente = carrinho.find((item) => item.id === produto.id);

    if (existente) {
        existente.quantidade += 1;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }

    localStorage.setItem('carrinhoNexusMarket', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
}

window.adicionarAoCarrinho = function (produto) {
    if (typeof window.__carrinhoAdicionar === 'function') {
        return window.__carrinhoAdicionar(produto);
    }

    adicionarAoCarrinhoFallback(produto);
};

function atualizarUsuarioNaTela() {
    const usuarioLogado = JSON.parse(localStorage.getItem(USUARIO_LOGADO_KEY) || 'null');
    let elemento = document.getElementById('usuarioLogado');
    let linkConta = document.getElementById('linkConta');

    if (!elemento || !linkConta) {
        const nav = document.querySelector('nav');
        if (nav) {
            if (!elemento) {
                elemento = document.createElement('span');
                elemento.id = 'usuarioLogado';
                elemento.className = 'usuario-logado';
                nav.insertBefore(elemento, nav.firstChild);
            }
            if (!linkConta) {
                linkConta = document.createElement('a');
                linkConta.id = 'linkConta';
                linkConta.href = '/nexus_market/entrar.html';
                nav.insertBefore(linkConta, nav.firstChild.nextSibling);
            }
        }
    }

    if (elemento) {
        if (usuarioLogado) {
            elemento.textContent = `Olá, ${usuarioLogado.nome}`;
            if (linkConta) {
                linkConta.textContent = 'Minha Conta';
                linkConta.href = '/nexus_market/minha-conta.html';
            }
        } else {
            elemento.textContent = 'Olá, visitante';
            if (linkConta) {
                linkConta.textContent = 'Entrar';
                linkConta.href = '/nexus_market/entrar.html';
            }
        }
    }
}

function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinhoNexusMarket') || '[]');
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    const linkCarrinho = document.querySelector('a[href*="carrinho.html"]');

    if (linkCarrinho) {
        linkCarrinho.textContent = totalItens > 0 ? `Meu Carrinho (${totalItens})` : 'Meu Carrinho (0)';
    }
}

function sairDaConta() {
    localStorage.removeItem(USUARIO_LOGADO_KEY);
    window.location.href = './entrar.html';
}

function criarProdutoAPartirDoCard(card) {
    const nome = card.querySelector('h3')?.textContent?.trim() || 'Produto';
    const imagem = card.querySelector('img')?.getAttribute('src') || '';
    const precoTexto = card.querySelector('.preco')?.textContent || '0';
    const precoNumerico = parseFloat(precoTexto.replace(/[R$\.]/g, '').replace(',', '.').trim()) || 0;
    const categoria = document.querySelector('h2')?.textContent?.trim() || 'Produtos';

    return {
        id: nome.toLowerCase().normalize('NFD').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
        nome,
        preco: precoNumerico,
        imagem,
        categoria
    };
}

function removerAcentos(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function extrairPreco(card) {
    const precoTexto = card.querySelector('.preco')?.textContent || '';
    const numero = precoTexto.match(/(\d[\d.,]*)/);

    if (!numero) return null;

    return parseFloat(numero[1].replace('.', '').replace(',', '.'));
}

function normalizarTexto(texto) {
    return removerAcentos(texto).replace(/[^a-z0-9]+/g, ' ').trim();
}

function cardCorrespondeAoFiltro(card, filtro) {
    const texto = normalizarTexto(card.textContent);
    const imagem = normalizarTexto(card.querySelector('img')?.getAttribute('src') || '');
    const alt = normalizarTexto(card.querySelector('img')?.getAttribute('alt') || '');
    const marca = normalizarTexto(card.dataset.brand || '');
    const tipo = normalizarTexto(card.dataset.type || '');
    const preco = extrairPreco(card);
    const filtroNormalizado = normalizarTexto(filtro);

    if (filtroNormalizado.includes('ate r$')) {
        const valor = parseFloat(filtroNormalizado.replace(/[^\d,\.]/g, '').replace('.', '').replace(',', '.'));
        return preco !== null && preco <= valor;
    }

    if (filtroNormalizado.includes('acima de r$')) {
        const valor = parseFloat(filtroNormalizado.replace(/[^\d,\.]/g, '').replace('.', '').replace(',', '.'));
        return preco !== null && preco > valor;
    }

    if (filtroNormalizado.includes('r$') && filtroNormalizado.includes('-')) {
        const numeros = filtroNormalizado.match(/(\d[\d.,]*)/g) || [];
        if (numeros.length >= 2) {
            const minimo = parseFloat(numeros[0].replace('.', '').replace(',', '.'));
            const maximo = parseFloat(numeros[1].replace('.', '').replace(',', '.'));
            return preco !== null && preco >= minimo && preco <= maximo;
        }
    }

    if (filtroNormalizado.includes('gb')) {
        const storage = normalizarTexto(card.dataset.storage || '');
        return storage.includes(filtroNormalizado.replace(/[^\d]/g, ''));
    }

    return marca.includes(filtroNormalizado) || tipo.includes(filtroNormalizado) || texto.includes(filtroNormalizado) || imagem.includes(filtroNormalizado) || alt.includes(filtroNormalizado);
}

function filtrarProdutos() {
    const campoBusca = document.getElementById('campoBusca') || document.querySelector('input[placeholder*="Buscar"]');
    const cards = document.querySelectorAll('.lista-produtos .produto-card, .produtos .card');

    if (!cards.length) return;

    const termo = campoBusca ? campoBusca.value.trim() : '';
    const filtrosSelecionados = Array.from(document.querySelectorAll('.filtros input[type="checkbox"]:checked'))
        .map((checkbox) => checkbox.parentElement?.textContent?.trim() || '')
        .filter(Boolean);

    let produtosVisiveis = 0;
    let mensagem = document.getElementById('mensagemBusca');

    if (!mensagem) {
        mensagem = document.createElement('p');
        mensagem.id = 'mensagemBusca';
        mensagem.style.display = 'none';
        mensagem.style.textAlign = 'center';
        mensagem.style.margin = '0 0 20px';
        mensagem.style.color = '#64748b';
        mensagem.style.fontWeight = '600';

        const containerProdutos = document.querySelector('.lista-produtos, .produtos');
        if (containerProdutos && containerProdutos.parentNode) {
            containerProdutos.parentNode.insertBefore(mensagem, containerProdutos);
        }
    }

    cards.forEach((card) => {
        const textoCard = removerAcentos(card.textContent);
        const correspondeAoTermo = !termo || textoCard.includes(removerAcentos(termo));
        const correspondeAoFiltro = filtrosSelecionados.length === 0 || filtrosSelecionados.every((filtro) => cardCorrespondeAoFiltro(card, filtro));
        const corresponde = correspondeAoTermo && correspondeAoFiltro;

        card.style.display = corresponde ? '' : 'none';

        if (corresponde) {
            produtosVisiveis += 1;
        }
    });

    if (mensagem) {
        mensagem.style.display = produtosVisiveis === 0 && (termo || filtrosSelecionados.length > 0) ? 'block' : 'none';
        mensagem.textContent = produtosVisiveis === 0 && (termo || filtrosSelecionados.length > 0)
            ? `Nenhum produto encontrado com os filtros selecionados.`
            : '';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    atualizarUsuarioNaTela();
    atualizarContadorCarrinho();

    const campoBusca = document.getElementById('campoBusca') || document.querySelector('input[placeholder*="Buscar"]');
    if (campoBusca) {
        campoBusca.addEventListener('input', filtrarProdutos);
    }

    document.querySelectorAll('.filtros input[type="checkbox"]').forEach((checkbox) => {
        checkbox.addEventListener('change', filtrarProdutos);
    });

    document.addEventListener('click', function (event) {
        const botao = event.target.closest('button');
        const card = botao?.closest('.produto-card, .card');

        if (!botao || !card) return;
        if (botao.dataset.carrinhoProcessado === 'true') return;

        const estaNaVitrine = botao.closest('.lista-produtos, .produtos');
        if (!estaNaVitrine) return;

        event.preventDefault();
        botao.dataset.carrinhoProcessado = 'true';

        if (typeof window.adicionarAoCarrinho === 'function') {
            window.adicionarAoCarrinho(criarProdutoAPartirDoCard(card));
        }

        if (typeof window.animarFeedback === 'function') {
            window.animarFeedback(botao);
        } else {
            botao.textContent = 'Adicionado!';
            botao.classList.add('btn-comprar-adicionado');
            window.setTimeout(() => {
                botao.textContent = 'Adicionar ao Carrinho';
                botao.classList.remove('btn-comprar-adicionado');
                delete botao.dataset.carrinhoProcessado;
            }, 900);
        }
    });

    filtrarProdutos();
});

const botaoSair = document.getElementById('btnSair');
if (botaoSair) {
    botaoSair.addEventListener('click', function (event) {
        event.preventDefault();
        sairDaConta();
    });
}
