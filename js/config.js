/* =====================================================================
   CONFIGURAÇÃO DO CONVITE
   Tudo o que pode mudar fica aqui. Campos vazios ("") são escondidos
   no site ou tratados com uma mensagem alternativa.
   ===================================================================== */
window.CONFIG = {
  formanda: {
    nome: "Dra. Mara Brena Aragão Catunda",
    curso: "Medicina",
    instituicao: "Universidade Federal do Ceará"
  },

  frase: "Com grande satisfação, venho convidar você para a minha festa de formatura",

  evento: {
    // Fuso de Fortaleza (UTC-3, sem horário de verão). Se mudar, ajuste o "-03:00".
    dataISO: "2027-01-16T22:00:00-03:00",
    dataTexto: "16 de janeiro de 2027",
    dia: "16",
    mesAno: "janeiro de 2027",
    diaSemana: "sábado",
    horaTexto: "22h"
  },

  local: {
    nome: "Buffet Dona Flor",
    endereco: "R. Iolanda P. C. Barreto, nº 46, Bairro Jocely Dantas (Derby), Sobral - CE, CEP 62.041-050",
    mapa: "https://maps.app.goo.gl/vvv9hiH9sSTKDGEM9?g_st=ic"
  },

  // Citação exibida abaixo do título "Uma trajetória". Cada item da lista é um parágrafo:
  // para editar, troque o texto entre aspas; para criar outro parágrafo, adicione uma linha nova com vírgula.
  // (Dentro do texto, evite aspas duplas ""; use aspas simples ou “curvas”.)
  citacao: [
    "A Deus, minha eterna gratidão. Por ter guiado meus passos, sustentado minha fé e me dado forças para continuar mesmo diante dos dias mais difíceis. Hoje, reconheço que cada detalhe dessa caminhada esteve sob Seus cuidados.",
    "Aos meus pais, minha família e meu namorado, meu amor e agradecimento mais profundo. Essa conquista também pertence a vocês. Obrigada por acreditarem em mim, por cada incentivo, cada renúncia, cada oração e por nunca medirem esforços para que esse sonho se tornasse realidade. Se hoje chego até aqui, é porque tive vocês como alicerce em todos os momentos.",
    "Às minhas amigas, obrigada por dividirem comigo os desafios, as inseguranças e tantas alegrias ao longo desses anos. Vocês estiveram comigo acompanhando tudo antes mesmo da faculdade começar, tornaram os dias difíceis mais leves antes e depois e fizeram dessa trajetória uma história ainda mais especial.",
    "A todos os professores e mestres que contribuíram para minha formação, obrigada por cada ensinamento, pela dedicação e por me mostrarem que a Medicina vai muito além do conhecimento técnico: é, acima de tudo, cuidado, humanidade e compromisso com o próximo.",
    "Hoje, encerro um ciclo que transformou não apenas minha história, mas também quem sou. Levo comigo muito mais do que um diploma: levo aprendizados, pessoas, pacientes, memórias e a certeza de que cada passo valeu a pena.",
    "A tão sonhada conquista chegou. E, embora apenas meu nome esteja neste diploma, essa vitória é de todos que caminharam comigo até aqui.",
    "Com o coração cheio de gratidão, inicio uma nova jornada: a de cuidar de vidas."
  ],
  citacaoAutor: "",

  ingresso: {
    valor: 350      // por pessoa, em reais. O valor "oficial" fica também no Codigo.gs
  },

  pix: {
    chave: "60367566311",
    tipo: "CPF",
    titular: "MARA BRENA ARAGÃO CATUNDA"
  },

  // WhatsApp da organização (somente números, com 55 + DDD)
  whatsapp: "5588999130080",

  // URL do web app do Google Apps Script (termina em /exec). Preencher após o deploy (veja o README).
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbwffTRswDSXV_9wSLJJ12pwPmRh6qzMOTTL_-skJC4zprPhPh4ogPRLAZfNeo_7K9ySAw/exec",

  // Máximo de pessoas por confirmação, INCLUINDO o responsável (6 = você + até 5 acompanhantes)
  maxPessoas: 6,

  // Música de fundo: sem música (deixe vazio). Para ativar, ponha o arquivo em /audio
  // e escreva o caminho, ex.: "audio/musica.mp3"
  musica: ""
};
