const PEDIDOS_KEY = 'pedidosNexusMarket';

function lerPedidos() {
    return JSON.parse(localStorage.getItem(PEDIDOS_KEY) || '[]');
}

function formatarPreco(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderizarPedidos() {
    const container = document.getElementById('lista-pedidos');
    if (!container) return;

    const pedidos = lerPedidos();

    if (pedidos.length === 0) {
        container.innerHTML = '<p>Você não tem pedidos ainda.</p>';
        return;
    }

    container.innerHTML = pedidos.map((pedido) => `
        <div class="pedido">
            <div class="info">
                <h3>Pedido #${pedido.id}</h3>
                <p><strong>Data:</strong> ${pedido.data}</p>
                <p><strong>Status:</strong> <span class="status-pedido">${pedido.status}</span></p>
                <p><strong>Itens:</strong> ${pedido.itens.map((item) => `${item.nome} x${item.quantidade}`).join(', ')}</p>
            </div>
            <div class="valor">
                <h3>${formatarPreco(pedido.valor)}</h3>
                <button class="btn-detalhes" data-id="${pedido.id}">Ver detalhes</button>
            </div>
            <div class="detalhes-pedido" id="detalhes-${pedido.id}">
                <h4>Itens do pedido</h4>
                ${pedido.itens.map((item) => `
                    <div class="item-pedido">
                        <span>${item.nome}</span>
                        <span>Qtd: ${item.quantidade}</span>
                        <span>${formatarPreco(item.preco * item.quantidade)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.btn-detalhes').forEach((botao) => {
        botao.addEventListener('click', function () {
            const pedidoId = botao.getAttribute('data-id');
            const detalhes = document.getElementById(`detalhes-${pedidoId}`);
            if (detalhes) {
                detalhes.classList.toggle('ativo');
                botao.textContent = detalhes.classList.contains('ativo') ? 'Esconder detalhes' : 'Ver detalhes';
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', renderizarPedidos);
