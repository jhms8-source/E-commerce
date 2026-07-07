const PAGAMENTOS_KEY = 'pagamentosNexusMarket';

function lerPagamentos() {
    const dados = localStorage.getItem(PAGAMENTOS_KEY);
    return dados ? JSON.parse(dados) : [];
}

function salvarPagamentos(pagamentos) {
    localStorage.setItem(PAGAMENTOS_KEY, JSON.stringify(pagamentos));
}

function formatarNumeroCartao(valor) {
    return valor.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatarValidade(valor) {
    const apenasDigitos = valor.replace(/\D/g, '').slice(0, 4);
    if (apenasDigitos.length <= 2) return apenasDigitos;
    return `${apenasDigitos.slice(0, 2)}/${apenasDigitos.slice(2)}`;
}

function formatarCvv(valor) {
    return valor.replace(/\D/g, '').slice(0, 4);
}

function renderizarPagamentos() {
    const container = document.getElementById('lista-pagamentos');
    if (!container) return;

    const pagamentos = lerPagamentos();

    if (pagamentos.length === 0) {
        container.innerHTML = '<p class="descricao">Nenhum cartão cadastrado ainda.</p>';
        return;
    }

    container.innerHTML = pagamentos.map((pagamento, index) => `
        <div class="card-pagamento">
            <h3>${pagamento.nome}</h3>
            <p><strong>Número:</strong> **** **** **** ${pagamento.numero.slice(-4)}</p>
            <p><strong>Validade:</strong> ${pagamento.validade}</p>
            <div class="botoes">
                <button class="btn-remover" data-index="${index}">Remover</button>
            </div>
        </div>
    `).join('');
}

function abrirFormulario() {
    const form = document.getElementById('formCartao');
    const botao = document.getElementById('btnAdicionarCartao');
    if (form && botao) {
        form.classList.remove('hidden');
        botao.classList.add('hidden');
        document.getElementById('nomeCartao')?.focus();
    }
}

function fecharFormulario() {
    const form = document.getElementById('formCartao');
    const botao = document.getElementById('btnAdicionarCartao');
    if (form && botao) {
        form.reset();
        form.classList.add('hidden');
        botao.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    renderizarPagamentos();

    const numeroInput = document.getElementById('numeroCartao');
    const validadeInput = document.getElementById('validadeCartao');
    const cvvInput = document.getElementById('cvvCartao');

    numeroInput?.addEventListener('input', function (event) {
        event.target.value = formatarNumeroCartao(event.target.value);
    });

    validadeInput?.addEventListener('input', function (event) {
        event.target.value = formatarValidade(event.target.value);
    });

    cvvInput?.addEventListener('input', function (event) {
        event.target.value = formatarCvv(event.target.value);
    });

    document.getElementById('btnAdicionarCartao')?.addEventListener('click', abrirFormulario);
    document.getElementById('btnCancelarCartao')?.addEventListener('click', fecharFormulario);

    document.getElementById('formCartao')?.addEventListener('submit', function (event) {
        event.preventDefault();

        const nome = document.getElementById('nomeCartao').value.trim();
        const numero = document.getElementById('numeroCartao').value.replace(/\s+/g, '');
        const validade = document.getElementById('validadeCartao').value.trim();
        const cvv = document.getElementById('cvvCartao').value.trim();

        if (!nome || !numero || !validade || !cvv) {
            alert('Preencha todos os campos do cartão.');
            return;
        }

        const pagamentos = lerPagamentos();
        pagamentos.push({ nome, numero, validade, cvv });
        salvarPagamentos(pagamentos);
        renderizarPagamentos();
        fecharFormulario();
    });

    document.getElementById('lista-pagamentos')?.addEventListener('click', function (event) {
        const botao = event.target.closest('.btn-remover');
        if (!botao) return;

        const index = Number(botao.getAttribute('data-index'));
        const pagamentos = lerPagamentos();
        pagamentos.splice(index, 1);
        salvarPagamentos(pagamentos);
        renderizarPagamentos();
    });
});
