.🗓️ Mini Sistema de Agendamento Esportivo (Arena Lazer)

.📝 Definição do Projeto:
Este projeto consiste em uma aplicação web interativa desenvolvida para automatizar e gerenciar a reserva de horários em complexos esportivos e arenas de lazer. A proposta principal é substituir processos manuais de agendamento por uma interface digital simples, onde o próprio usuário pode verificar a disponibilidade e garantir sua reserva em tempo real.

.🛠️ Arquitetura e Definições Técnicas
O sistema foi construído utilizando a tríade fundamental do desenvolvimento Front-end, onde cada tecnologia cumpre um papel semântico e estrutural bem definido:
.HTML5 (Estruturação Semântica): Organiza a estrutura da aplicação. Utiliza formulários nativos (`<form>`), campos de seleção (`<select>`), entradas de dados (`<input type="date">`) e seções organizadas para garantir acessibilidade e uma árvore de elementos limpa.

.CSS3 (Estilização e Design Responsivo): Responsável por toda a identidade visual (inspirada em ambientes esportivos). Utiliza propriedades modernas de layout como "Flexbox" para alinhar os elementos e "Media Queries" para garantir que o sistema funcione perfeitamente tanto em computadores quanto em telas de celulares.

.JavaScript ES6+ (Lógica e Persistência): É o cérebro da aplicação. Ele escuta as ações do usuário, processa as regras de negócio e renderiza as respostas na tela de forma dinâmica.


.⚙️ Funcionalidades e Regras de Negócio Explicadas:
.Captura Dinâmica de Dados: O JavaScript monitora o evento de envio (`submit`) do formulário. Quando o usuário escolhe o esporte, o dia e o horário, o script captura esses valores manipulando o DOM (Document Object Model).
.Persistência Local (LocalStorage): Como o projeto não utiliza um banco de dados no servidor (Back-end), foi implementada a API do `localStorage`. Isso significa que os agendamentos feitos ficam salvos na memória do navegador do usuário. Mesmo se a página for atualizada ou fechada, os dados não são perdidos.
.Tratamento de Eventos e Feedback: O sistema valida se todos os campos foram preenchidos corretamente e exibe alertas de confirmação para o usuário, garantindo uma excelente experiência de uso (UX).
