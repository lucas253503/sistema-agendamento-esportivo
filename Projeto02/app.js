// --- VALIDAÇÃO DE USUÁRIO ATIVO ---
const usuarioAtivo = JSON.parse(localStorage.getItem('usuarioLogado'));
if (!usuarioAtivo) {
    window.location.href = 'index.html';
} else {
    document.getElementById('nome-usuario-logado').innerText = `Olá, ${usuarioAtivo.nome}`;
    
    // Carrega a foto salva se existir
    const fotoSalva = localStorage.getItem(`foto_${usuarioAtivo.email}`);
    if (fotoSalva) {
        document.getElementById('foto-perfil-exibida').src = fotoSalva;
    }
}

// Carrega o tema salvo do usuário antes de renderizar tudo
if (localStorage.getItem('tema-escuro') === 'ativo') {
    document.body.classList.add('dark-mode');
}

document.getElementById('btn-sair').addEventListener('click', () => {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
});

// --- BANCO DE DADOS DE LOCAIS ---
const bancoLocaisNacionais = {
    "Parque do Ibirapuera - São Paulo/SP": { tipo: "Parque", endereco: "Av. Pedro Álvares Cabral - Vila Mariana, São Paulo - SP", mapaUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14626.241517028448!2d-46.66421035!3d-23.5874162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5a2b2ed7f3a1%3A0xab10507de1cf40c!2sParque%20Ibirapuera!5e0!3m2!1spt-BR!2sbr!4v1680000000001" },
    "Espaço Arena Copacabana - Rio de Janeiro/RJ": { tipo: "Espaço", endereco: "Avenida Atlântica, Quadra 4 - Copacabana, Rio de Janeiro - RJ", mapaUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14697.554030638545!2d-43.1895642!3d-22.9712174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9bd542ca02b66d%3A0x4a4d6f46995079a4!2sPraia%20de%20Copacabana!5e0!3m2!1spt-BR!2sbr!4v1680000000002" },
    "Sede Central Complexo Esportivo - Brasília/DF": { tipo: "Sede", endereco: "Setor de Clubes Esportivos Sul, Trecho 2 - Brasília - DF", mapaUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15354.510619053351!2d-47.8595462!3d-15.8239843!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a216fe02d73f1%3A0xda7ca57973c7e7ba!2sSetor%20de%20Clubes%20Esportivos%20Sul!5e0!3m2!1spt-BR!2sbr!4v1680000000003" },
    "Parque Barigui - Curitiba/PR": { tipo: "Parque", endereco: "Av. Cândido Hartmann, S/N - Bigorrilho, Curitiba - PR", mapaUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14412.35728876495!2d-49.313437!3d-25.4353457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce3f6f1c4df7b%3A0xac1e428df1eb8c9c!2sParque%20Barigui!5e0!3m2!1spt-BR!2sbr!4v1680000000004" },
    "Sede Aquática Nacional - Belo Horizonte/MG": { tipo: "Sede", endereco: "Rua da Bahia, 2200 - Lourdes, Belo Horizonte - MG", mapaUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15001.31420123561!2d-43.943142!3d-19.923412!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa69987f6fe000001%3A0xdba7ca57973c7e7ba!2sLourdes%2C%20Belo%20Horizonte%20-%20MG!5e0!3m2!1spt-BR!2sbr!4v1680000000008" }
};

let agendamentos = JSON.parse(localStorage.getItem('agendamentos_arena')) || [];
const form = document.getElementById('form-agendamento');
const tabela = document.getElementById('tabela-agendamentos');
const msgSistema = document.getElementById('mensagem-sistema');
const inputBusca = document.getElementById('busca-regiao');
const listaSugestoes = document.getElementById('lista-sugestoes');
const boxEndereco = document.getElementById('endereco-exibido');
const iframeMapa = document.getElementById('mapa-google');
const modalComp = document.getElementById('modal-comprovante');
const btnFecharModal = document.getElementById('fechar-modal');

// Elementos de Configurações, Foto e Temas
const btnConfig = document.getElementById('btn-configuracoes');
const painelConfig = document.getElementById('painel-config');
const uploadFoto = document.getElementById('upload-foto');
const fotoExibida = document.getElementById('foto-perfil-exibida');

const modalGooglePhotos = document.getElementById('modal-google-photos');
const btnOpenGooglePhotos = document.getElementById('btn-google-photos');
const btnFecharModalFotos = document.getElementById('fechar-modal-fotos');
const btnCancelarFotos = document.getElementById('btn-cancelar-fotos');
const btnConfirmarFotos = document.getElementById('btn-confirmar-fotos');
const inputUrlFotos = document.getElementById('input-url-fotos');

const btnModoEscuro = document.getElementById('btn-modo-escuro');
const btnModoClaro = document.getElementById('btn-modo-claro');

// --- CONTROLE DO MENU DROP-DOWN DE CONFIGURAÇÕES ---
btnConfig.addEventListener('click', function(e) {
    e.stopPropagation();
    painelConfig.classList.toggle('style-hidden');
});

document.addEventListener('click', function(e) {
    if (!painelConfig.contains(e.target) && e.target !== btnConfig) {
        painelConfig.classList.add('style-hidden');
    }
});

// --- ENVIAR FOTO DO DISPOSITIVO ---
uploadFoto.addEventListener('change', function() {
    const arquivo = this.files[0];
    if (arquivo) {
        const leitor = new FileReader();
        leitor.onload = function(e) {
            const resultadoBase64 = e.target.result;
            fotoExibida.src = resultadoBase64;
            localStorage.setItem(`foto_${usuarioAtivo.email}`, resultadoBase64);
            alert("✔️ Foto de perfil atualizada com sucesso!");
        }
        leitor.readAsDataURL(arquivo);
    }
});

// --- JANELA PERSONALIZADA DO GOOGLE FOTOS ---
btnOpenGooglePhotos.addEventListener('click', () => {
    painelConfig.classList.add('style-hidden');
    inputUrlFotos.value = "";
    modalGooglePhotos.classList.remove('style-hidden');
});

function fecharJanelaFotos() {
    modalGooglePhotos.classList.add('style-hidden');
}
btnFecharModalFotos.addEventListener('click', fecharJanelaFotos);
btnCancelarFotos.addEventListener('click', fecharJanelaFotos);

btnConfirmarFotos.addEventListener('click', () => {
    const urlDigitada = inputUrlFotos.value.trim();
    if (urlDigitada) {
        fotoExibida.src = urlDigitada;
        localStorage.setItem(`foto_${usuarioAtivo.email}`, urlDigitada);
        fecharJanelaFotos();
        alert("✔️ Foto sincronizada com o Google Fotos!");
    } else {
        alert("⚠️ Por favor, cole um link válido para continuar.");
    }
});

// --- SIMULAR TIRAR FOTO ---
document.getElementById('btn-tirar-foto').addEventListener('click', () => {
    alert("📸 Abrindo a lente da câmara... (Permissão Concedida)");
    const fotoCapturada = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
    fotoExibida.src = fotoCapturada;
    localStorage.setItem(`foto_${usuarioAtivo.email}`, fotoCapturada);
    alert("📸 Foto capturada e updated com sucesso!");
});

// --- ACESSIBILIDADE E TEMAS ESCURO/CLARO ---
document.getElementById('btn-aumentar-fonte').addEventListener('click', () => {
    document.body.style.fontSize = "1.25rem";
    alert("🔎 Tamanho do texto aumentado!");
});
document.getElementById('btn-resetar-fonte').addEventListener('click', () => {
    document.body.style.fontSize = "1rem";
});

btnModoEscuro.addEventListener('click', () => {
    document.body.classList.add('dark-mode');
    localStorage.setItem('tema-escuro', 'ativo');
});
btnModoClaro.addEventListener('click', () => {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('tema-escuro', 'inativo');
});

// --- FILTRO DE AUTOCOMPLETAR (BUSCA) ---
inputBusca.addEventListener('input', function() {
    const textoDigitado = this.value.toLowerCase();
    listaSugestoes.innerHTML = ''; 
    if (!textoDigitado) {
        listaSugestoes.classList.add('style-hidden');
        return;
    }
    const chavesFiltradas = Object.keys(bancoLocaisNacionais).filter(c => c.toLowerCase().includes(textoDigitado));
    if (chavesFiltradas.length > 0) {
        listaSugestoes.classList.remove('style-hidden');
        chavesFiltradas.forEach(local => {
            const dados = bancoLocaisNacionais[local];
            const item = document.createElement('div');
            item.className = 'sugestao-item';
            item.innerHTML = `📍 ${local}`;
            item.addEventListener('click', () => {
                inputBusca.value = local;
                boxEndereco.innerText = dados.endereco;
                boxEndereco.classList.add('endereco-ativo');
                iframeMapa.src = dados.mapaUrl; 
                listaSugestoes.classList.add('style-hidden'); 
            });
            listaSugestoes.appendChild(item);
        });
    } else {
        listaSugestoes.classList.add('style-hidden');
    }
});

// --- CONFIRMAÇÃO DO FORMULÁRIO ---
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const responsavel = document.getElementById('responsavel').value;
    const regiao = inputBusca.value; 
    const esporte = document.getElementById('esporte').value;
    const dataHora = document.getElementById('data-hora').value;
    const duracao = document.getElementById('duracao').value;
    
    if (!bancoLocaisNacionais[regiao]) {
        alert("⚠️ Selecione um local válido clicando nas opções sugeridas!");
        return;
    }

    const conflito = agendamentos.some(r => r.regiao === regiao && r.esporte === esporte && r.dataHora === dataHora);
    if (conflito) {
        mostrarMensagem('❌ Horário já ocupado neste local!', 'erro');
        return;
    }

    agendamentos.push({ id: Date.now().toString(), responsavel, regiao, esporte, dataHora, duracao, address: bancoLocaisNacionais[regiao].endereco });
    localStorage.setItem('agendamentos_arena', JSON.stringify(agendamentos));
    form.reset();
    boxEndereco.innerText = "Busque e selecione um local acima...";
    boxEndereco.classList.remove('endereco-ativo');
    mostrarMensagem('✔️ Reserva confirmada!', 'sucesso');
    atualizarQuadroDiario();
});

// --- RENDERIZAR TABELA ---
function atualizarQuadroDiario() {
    tabela.innerHTML = '';
    agendamentos.sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora));
    agendamentos.forEach(reserva => {
        const dataFmt = new Date(reserva.dataHora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td><strong>${dataFmt}</strong></td>
            <td><small>${reserva.regiao}</small><br><strong>${reserva.esporte}</strong></td>
            <td>${reserva.responsavel}</td>
            <td><button class="btn-ticket" onclick="abrirComprovante('${reserva.id}')">Ver Bilhete</button></td>
            <td><button class="btn-delete" onclick="cancelarReserva('${reserva.id}')">Excluir</button></td>
        `;
        tabela.appendChild(linha);
    });
}

// --- GERENCIAMENTO DE EXIBIÇÃO DO COMPROVANTE (CORRIGIDO) ---
window.abrirComprovante = function(id) {
    const r = agendamentos.find(res => res.id === id);
    if (!r) {
        alert("⚠️ Comprovante não encontrado.");
        return;
    }
    
    const dataFmt = new Date(r.dataHora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    
    // Injeta os dados do usuário de forma segura
    document.getElementById('comp-responsavel').innerText = r.responsavel;
    document.getElementById('comp-esporte').innerText = r.esporte;
    document.getElementById('comp-local').innerText = r.regiao;
    document.getElementById('comp-endereco').innerText = r.address || "Não Informado";
    document.getElementById('comp-data').innerText = dataFmt;
    document.getElementById('comp-duracao').innerText = r.duracao;
    
    // Altera o display diretamente para garantir a exibição física na tela
    modalComp.style.display = 'flex';

    document.getElementById('share-pdf').onclick = () => { window.print(); };
    document.getElementById('share-whatsapp').onclick = () => { 
        const textoWhats = `📌 *Reserva Arena Lazer* \n👤 *Quem:* ${r.responsavel}\n🏟️ *Local:* ${r.regiao}\n⚽ *Modalidade:* ${r.esporte}\n📅 *Data:* ${dataFmt}`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textoWhats)}`, '_blank'); 
    };
};

// Fechar Modal do Comprovante
btnFecharModal.addEventListener('click', () => { 
    modalComp.style.display = 'none'; 
});

window.addEventListener('click', (e) => {
    if (e.target === modalComp) {
        modalComp.style.display = 'none';
    }
});

window.cancelarReserva = function(id) {
    agendamentos = agendamentos.filter(r => r.id !== id);
    localStorage.setItem('agendamentos_arena', JSON.stringify(agendamentos));
    atualizarQuadroDiario();
    mostrarMensagem('🗑️ Reserva removida.', 'sucesso');
};

function mostrarMensagem(texto, tipo) {
    msgSistema.innerText = texto;
    msgSistema.className = `mensagem ${tipo}`;
    msgSistema.style.display = 'block';
    setTimeout(() => { msgSistema.style.display = 'none'; }, 4000);
}

atualizarQuadroDiario();