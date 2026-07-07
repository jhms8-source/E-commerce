const STORAGE_KEY = 'usuariosNexusMarket';

function carregarUsuarios() {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
}

function mostrarMensagemLogin(texto, isErro = false) {
    const mensagem = document.getElementById('mensagemLogin');
    if (mensagem) {
        mensagem.textContent = texto;
        mensagem.style.color = isErro ? '#b91c1c' : '#0f766e';
    }
}

function entrarUsuario(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim().toLowerCase();
    const senha = document.getElementById('senha').value;

    if (!email || !senha) {
        mostrarMensagemLogin('Preencha e-mail e senha.', true);
        return;
    }

    const usuarios = carregarUsuarios();
    const usuarioEncontrado = usuarios.find((usuario) => usuario.email.toLowerCase() === email);

    if (!usuarioEncontrado) {
        mostrarMensagemLogin('Usuário não encontrado.', true);
        return;
    }

    if (usuarioEncontrado.senha !== senha) {
        mostrarMensagemLogin('Senha incorreta.', true);
        return;
    }

    localStorage.setItem('usuarioLogadoNexusMarket', JSON.stringify(usuarioEncontrado));
    mostrarMensagemLogin(`Login realizado com sucesso, ${usuarioEncontrado.nome}!`);
    window.location.href = './inicio.html';
}

document.getElementById('formLogin').addEventListener('submit', entrarUsuario);
