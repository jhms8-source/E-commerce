const USUARIO_LOGADO_KEY = 'usuarioLogadoNexusMarket';

function carregarDadosUsuario() {
    const usuario = JSON.parse(localStorage.getItem(USUARIO_LOGADO_KEY) || 'null');

    if (!usuario) {
        window.location.href = '/nexus_market/entrar.html';
        return;
    }

    document.getElementById('nomeUsuario').textContent = usuario.nome || 'Usuário';
    document.getElementById('emailUsuario').textContent = usuario.email || '---';
    document.getElementById('telefoneUsuario').textContent = usuario.telefone || '---';
    document.getElementById('cpfUsuario').textContent = usuario.cpf || '---';
}

document.addEventListener('DOMContentLoaded', function () {
    carregarDadosUsuario();
});
