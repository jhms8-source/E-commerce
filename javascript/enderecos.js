const ENDERECOS_KEY = 'enderecosNexusMarket';

function lerEnderecos() {
    const dados = localStorage.getItem(ENDERECOS_KEY);
    return dados ? JSON.parse(dados) : [];
}

function salvarEnderecos(enderecos) {
    localStorage.setItem(ENDERECOS_KEY, JSON.stringify(enderecos));
}

function renderizarEnderecos() {
    const container = document.getElementById('lista-enderecos');
    if (!container) return;

    const enderecos = lerEnderecos();

    if (enderecos.length === 0) {
        container.innerHTML = '<p class="descricao">Nenhum endereço cadastrado ainda.</p>';
        return;
    }

    container.innerHTML = enderecos.map((endereco) => `
        <article class="card-endereco">
            <h3>${endereco.titulo}</h3>
            <p><strong>CEP:</strong> ${endereco.cep}</p>
            <p><strong>Endereço:</strong> ${endereco.logradouro}</p>
            <p><strong>Número:</strong> ${endereco.numero}</p>
            <p><strong>Bairro:</strong> ${endereco.bairro}</p>
            <p><strong>Cidade:</strong> ${endereco.cidade}</p>
            <p><strong>Estado:</strong> ${endereco.estado}</p>
            <div class="botoes">
                <button class="btn-remover" data-id="${endereco.id}">Remover</button>
            </div>
        </article>
    `).join('');
}

function adicionarEndereco(endereco) {
    const enderecos = lerEnderecos();
    enderecos.push({ id: Date.now(), ...endereco });
    salvarEnderecos(enderecos);
    renderizarEnderecos();
}

function removerEndereco(id) {
    const enderecos = lerEnderecos().filter((endereco) => endereco.id !== Number(id));
    salvarEnderecos(enderecos);
    renderizarEnderecos();
}

function salvarEnderecoDoFormulario(formulario) {
    if (!formulario || formulario.dataset.saving === 'true') return;

    formulario.dataset.saving = 'true';

    const dados = {
        titulo: document.getElementById('tituloEndereco').value.trim(),
        cep: document.getElementById('cepEndereco').value.trim(),
        logradouro: document.getElementById('logradouroEndereco').value.trim(),
        numero: document.getElementById('numeroEndereco').value.trim(),
        bairro: document.getElementById('bairroEndereco').value.trim(),
        cidade: document.getElementById('cidadeEndereco').value.trim(),
        estado: document.getElementById('estadoEndereco').value.trim()
    };

    if (!dados.titulo || !dados.cep || !dados.logradouro || !dados.numero || !dados.bairro || !dados.cidade || !dados.estado) {
        alert('Preencha todos os campos do endereço.');
        formulario.dataset.saving = 'false';
        return;
    }

    adicionarEndereco(dados);
    formulario.reset();
    formulario.dataset.saving = 'false';
    alert('Endereço salvo com sucesso!');
}

document.addEventListener('DOMContentLoaded', function () {
    renderizarEnderecos();

    const formulario = document.getElementById('formEndereco');
    const botaoAdicionar = document.getElementById('btnAdicionarEndereco');
    const botaoSalvar = document.getElementById('btnSalvarEndereco');

    if (botaoAdicionar) {
        botaoAdicionar.addEventListener('click', function () {
            const formularioEndereco = document.getElementById('formEndereco');
            if (formularioEndereco) {
                formularioEndereco.scrollIntoView({ behavior: 'smooth', block: 'start' });
                document.getElementById('tituloEndereco').focus();
            }
        });
    }

    if (formulario) {
        formulario.addEventListener('submit', function (event) {
            event.preventDefault();
            salvarEnderecoDoFormulario(formulario);
        });
    }

    if (botaoSalvar) {
        botaoSalvar.addEventListener('click', function (event) {
            event.preventDefault();
            salvarEnderecoDoFormulario(formulario);
        });
    }

    document.addEventListener('click', function (event) {
        const remover = event.target.closest('.btn-remover');
        if (remover) {
            removerEndereco(remover.getAttribute('data-id'));
        }
    });
});
