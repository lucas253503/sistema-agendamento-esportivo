const secaoLogin = document.getElementById('secao-login');
const secaoCadastro = document.getElementById('secao-cadastro');
const secaoRecuperar = document.getElementById('secao-recuperar');
const msgAuth = document.getElementById('mensagem-auth');

let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
if (usuarios.length === 0) {
    usuarios.push({ nome: "Administrador", email: "teste@email.com", senha: "123" });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

if(document.getElementById('ir-para-cadastro')) {
    document.getElementById('ir-para-cadastro').addEventListener('click', (e) => {
        e.preventDefault();
        secaoLogin.classList.add('style-hidden');
        secaoCadastro.classList.remove('style-hidden');
    });
}
if(document.getElementById('ir-para-login')) {
    document.getElementById('ir-para-login').addEventListener('click', (e) => {
        e.preventDefault();
        secaoCadastro.classList.add('style-hidden');
        secaoLogin.classList.remove('style-hidden');
    });
}
if(document.getElementById('ir-para-recuperar')) {
    document.getElementById('ir-para-recuperar').addEventListener('click', (e) => {
        e.preventDefault();
        secaoLogin.classList.add('style-hidden');
        secaoRecuperar.classList.remove('style-hidden');
    });
}
if(document.getElementById('voltar-da-recuperacao')) {
    document.getElementById('voltar-da-recuperacao').addEventListener('click', (e) => {
        e.preventDefault();
        secaoRecuperar.classList.add('style-hidden');
        secaoLogin.classList.remove('style-hidden');
    });
}

function forcarEntradaNoPainel() {
    window.location.href = "dashboard.html";
}

document.getElementById('form-login').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;
    usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioValidado = usuarios.find(u => u.email === email && u.senha === senha);

    if (!usuarioValidado) {
        alertaAuth('❌ E-mail ou senha incorretos!', 'erro');
        return;
    }
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioValidado));
    alertaAuth('✔️ Login realizado! Entrando...', 'sucesso');
    setTimeout(forcarEntradaNoPainel, 800);
});

document.getElementById('form-cadastro').addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = document.getElementById('cad-nome').value;
    const email = document.getElementById('cad-email').value;
    const senha = document.getElementById('cad-senha').value;
    usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    if (usuarios.some(u => u.email === email)) {
        alertaAuth('❌ Este e-mail já está cadastrado!', 'erro');
        return;
    }
    usuarios.push({ nome, email, senha });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    alertaAuth('✔️ Conta criada com sucesso!', 'sucesso');
    document.getElementById('form-cadastro').reset();
    setTimeout(() => { document.getElementById('ir-para-login').click(); }, 1200);
});

document.getElementById('btn-google').addEventListener('click', function(e) {
    e.preventDefault(); 
    const usuarioGoogle = { nome: "Usuário Google", email: "conta.google@gmail.com" };
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioGoogle));
    alertaAuth('🌐 Conectado via Google! Entrando...', 'sucesso');
    setTimeout(forcarEntradaNoPainel, 800);
});

function alertaAuth(texto, tipo) {
    msgAuth.innerText = texto;
    msgAuth.className = `mensagem ${tipo}`;
    msgAuth.style.display = 'block';
    setTimeout(() => { msgAuth.style.display = 'none'; }, 4000);
}