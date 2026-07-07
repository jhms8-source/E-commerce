const CARRINHO_KEY = 'carrinhoNexusMarket';
const PEDIDOS_KEY = 'pedidosNexusMarket';
const USUARIO_LOGADO_KEY = 'usuarioLogadoNexusMarket';

function lerCarrinho() {
    const dados = localStorage.getItem(CARRINHO_KEY);
    return dados ? JSON.parse(dados) : [];
}

function salvarCarrinho(carrinho) {
    localStorage.setItem(CARRINHO_KEY, JSON.stringify(carrinho));
}

function animarFeedback(botao) {
    if (!botao || botao.dataset.feedbackAtivo === 'true') return;

    const textoOriginal = botao.textContent.trim();
    botao.dataset.feedbackAtivo = 'true';
    botao.classList.add('btn-comprar-adicionado');
    botao.textContent = 'Adicionado!';
    botao.disabled = true;

    window.setTimeout(() => {
        botao.classList.remove('btn-comprar-adicionado');
        botao.textContent = textoOriginal;
        botao.disabled = false;
        botao.dataset.feedbackAtivo = 'false';
    }, 900);
}

function adicionarAoCarrinho(produto) {
    const carrinho = lerCarrinho();
    const existente = carrinho.find((item) => item.id === produto.id);

    if (existente) {
        existente.quantidade += 1;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }

    salvarCarrinho(carrinho);
    atualizarContadores();
}

function removerDoCarrinho(id) {
    const carrinho = lerCarrinho().filter((item) => item.id !== id);
    salvarCarrinho(carrinho);
    renderizarCarrinho();
    atualizarContadores();
}

function alterarQuantidade(id, delta) {
    const carrinho = lerCarrinho();
    const item = carrinho.find((produto) => produto.id === id);

    if (!item) return;

    item.quantidade += delta;
    if (item.quantidade <= 0) {
        removerDoCarrinho(id);
        return;
    }

    salvarCarrinho(carrinho);
    renderizarCarrinho();
    atualizarContadores();
}

function formatarPreco(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderizarCarrinho() {
    const container = document.querySelector('.itens-carrinho');
    const resumo = document.querySelector('.resumo-carrinho');
    const h2 = document.querySelector('.container-carrinho h2');

    if (!container || !resumo || !h2) return;

    const carrinho = lerCarrinho();

    if (carrinho.length === 0) {
        container.innerHTML = `
            <div class="carrinho-vazio">
                <h3>Seu carrinho está vazio.</h3>
                <p>Adicione produtos para continuar suas compras.</p>
                <a href="./inicio.html" class="btn-continuar">← Continuar Comprando</a>
            </div>
        `;
        h2.textContent = 'Carrinho (0)';

        const linhas = resumo.querySelectorAll('.linha-resumo');
        if (linhas[0]) linhas[0].querySelector('span:last-child').textContent = 'R$ 0,00';
        if (linhas[1]) linhas[1].querySelector('span:last-child').textContent = 'A calcular';
        if (linhas[2]) linhas[2].querySelector('span:last-child').textContent = 'R$ 0,00';
        const totalLinha = resumo.querySelector('.linha-resumo.total span:last-child');
        if (totalLinha) totalLinha.textContent = 'R$ 0,00';
        return;
    }

    h2.textContent = `Carrinho (${carrinho.reduce((total, item) => total + item.quantidade, 0)})`;

    const subtotal = carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);
    const frete = subtotal > 0 ? 'Grátis' : 'A calcular';
    const total = subtotal;

    container.innerHTML = carrinho.map((item) => `
        <div class="item-produto">
            <img src="${item.imagem}" alt="${item.nome}">
            <div class="detalhes-item">
                <h3>${item.nome}</h3>
                <p class="categoria-item">${item.categoria}</p>
            </div>
            <div class="quantidade-item">
                <button class="btn-qtd" data-action="menos" data-id="${item.id}">-</button>
                <span>${item.quantidade}</span>
                <button class="btn-qtd" data-action="mais" data-id="${item.id}">+</button>
            </div>
            <div class="preco-item">${formatarPreco(item.preco * item.quantidade)}</div>
            <button class="btn-remover" data-id="${item.id}" title="Remover">×</button>
        </div>
    `).join('');

    const linhas = resumo.querySelectorAll('.linha-resumo');
    if (linhas[0]) linhas[0].querySelector('span:last-child').textContent = formatarPreco(subtotal);
    if (linhas[1]) linhas[1].querySelector('span:last-child').textContent = frete;
    if (linhas[2]) linhas[2].querySelector('span:last-child').textContent = 'R$ 0,00';
    const totalLinha = resumo.querySelector('.linha-resumo.total span:last-child');
    if (totalLinha) totalLinha.textContent = formatarPreco(total);
}

function atualizarContadores() {
    const carrinho = lerCarrinho();
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    const linksCarrinho = document.querySelectorAll('a[href*="carrinho.html"]');

    linksCarrinho.forEach((link) => {
        if (link.textContent.includes('Meu Carrinho')) {
            link.textContent = totalItens > 0 ? `Meu Carrinho (${totalItens})` : 'Meu Carrinho (0)';
        }
    });
}

function atualizarUsuarioNaTela() {
    const usuarioLogado = JSON.parse(localStorage.getItem(USUARIO_LOGADO_KEY) || 'null');
    const elemento = document.getElementById('usuarioLogado');
    const linkConta = document.getElementById('linkConta');

    if (!elemento || !linkConta) return;

    if (usuarioLogado) {
        elemento.textContent = `Olá, ${usuarioLogado.nome}`;
        linkConta.textContent = 'Minha Conta';
        linkConta.href = '/nexus_market/minha-conta.html';
    } else {
        elemento.textContent = '';
        linkConta.textContent = 'Minha Conta';
        linkConta.href = '/nexus_market/entrar.html';
    }
}

function salvarPedido(carrinho) {
    const pedidos = JSON.parse(localStorage.getItem(PEDIDOS_KEY) || '[]');
    const novoPedido = {
        id: Date.now(),
        data: new Date().toLocaleDateString('pt-BR'),
        status: 'Preparando',
        valor: carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0),
        itens: carrinho.map((item) => ({
            nome: item.nome,
            quantidade: item.quantidade,
            preco: item.preco,
            imagem: item.imagem,
            categoria: item.categoria
        }))
    };

    pedidos.unshift(novoPedido);
    localStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidos));
}

document.addEventListener('DOMContentLoaded', function () {
    atualizarUsuarioNaTela();
    renderizarCarrinho();
    atualizarContadores();

    document.addEventListener('click', function (event) {
        const botaoComprar = event.target.closest('.btn-comprar');
        if (botaoComprar) {
            animarFeedback(botaoComprar);
        }
    });

    const botaoFinalizar = document.getElementById('btnFinalizarCompra');
    if (botaoFinalizar) {
        botaoFinalizar.addEventListener('click', function () {
            const carrinho = lerCarrinho();
            if (carrinho.length === 0) {
                alert('Seu carrinho está vazio.');
                return;
            }

            const confirmado = confirm('Deseja finalizar sua compra?');
            if (confirmado) {
                salvarPedido(carrinho);
                localStorage.removeItem(CARRINHO_KEY);
                renderizarCarrinho();
                atualizarContadores();
                alert('Compra finalizada com sucesso!');
            }
        });
    }

    document.addEventListener('click', function (event) {
        const botao = event.target.closest('.btn-qtd');
        if (botao) {
            const id = botao.getAttribute('data-id');
            const action = botao.getAttribute('data-action');
            alterarQuantidade(id, action === 'mais' ? 1 : -1);
        }

        const remover = event.target.closest('.btn-remover');
        if (remover) {
            removerDoCarrinho(remover.getAttribute('data-id'));
        }
    });
});

window.__carrinhoAdicionar = adicionarAoCarrinho;
window.adicionarAoCarrinho = adicionarAoCarrinho;
window.atualizarContadores = atualizarContadores;
window.animarFeedback = animarFeedback;
