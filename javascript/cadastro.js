//Telefone

function mascaraTelefone(input) {
    let valor = input.value.replace(/\D/g, '');

    valor = valor.substring(0, 11);

    if (valor.length > 2) {
        valor = '(' + valor.substring(0, 2) + ') ' + valor.substring(2);
    }
    if (valor.length > 9) {
        valor = valor.substring(0, 9) + '-' + valor.substring(9);
    }

    input.value = valor;
}

//CPF

function mascaraCPF(input) {
    let valor = input.value.replace(/\D/g, '');
    if (valor.length > 3) {
        valor = valor.substring(0, 3) + '.' + valor.substring(3);
    }
    if (valor.length > 7) {
        valor = valor.substring(0, 7) + '.' + valor.substring(7);
    }
    if (valor.length > 11) {
        valor = valor.substring(0, 11) + '-' + valor.substring(11, 13);
    }

    input.value = valor;
}

//Senha

function alternarSenha() {
    const inputSenha = document.getElementById('senha');
    if (inputSenha.type === 'password') {
        inputSenha.type = 'text';
    } else {
        inputSenha.type = 'password';
    }
}

const STORAGE_KEY = 'usuariosNexusMarket';

function carregarUsuarios() {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
}

let usuarios = carregarUsuarios();

function salvarUsuarios() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
}

function mostrarMensagem(texto, isErro = false) {
    const mensagem = document.getElementById('mensagemCadastro');
    if (mensagem) {
        mensagem.textContent = texto;
        mensagem.style.color = isErro ? '#b91c1c' : '#0f766e';
    }
}

function registrarUsuario(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    if (!nome || !email || !senha || !confirmarSenha) {
        mostrarMensagem('Preencha todos os campos obrigatórios.', true);
        return;
    }

    if (senha.length < 4) {
        mostrarMensagem('A senha deve ter pelo menos 4 caracteres.', true);
        return;
    }

    if (senha !== confirmarSenha) {
        mostrarMensagem('As senhas não conferem.', true);
        return;
    }

    const usuarioJaExiste = usuarios.some((usuario) => usuario.email.toLowerCase() === email.toLowerCase());
    if (usuarioJaExiste) {
        mostrarMensagem('Este e-mail já está cadastrado.', true);
        return;
    }

    usuarios.push({ nome, email, telefone, cpf, senha });
    salvarUsuarios();

    document.getElementById('formCadastro').reset();
    mostrarMensagem(`Conta criada com sucesso! Usuário salvo: ${nome}`);
}

document.getElementById('formCadastro').addEventListener('submit', registrarUsuario);
