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

  // Citação exibida abaixo do título "Uma trajetória". Edite o texto à vontade.
  // Deixe "citacaoAutor" vazio ("") para não mostrar autor.
  citacao: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
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
