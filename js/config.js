/* =====================================================================
   CONFIGURAÇÃO DO CONVITE
   Tudo o que pode mudar fica aqui. Campos vazios ("") são escondidos
   no site ou tratados com uma mensagem alternativa.
   ===================================================================== */
window.CONFIG = {
  formanda: {
    nome: "Dra. Mara Aragão",          // CONFERIR a grafia/nome completo
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

  traje: "Passeio completo",

  ingresso: {
    valor: 350      // por pessoa, em reais. O valor "oficial" fica também no Codigo.gs
  },

  pix: {
    chave: "CPF",      // PREENCHER: chave PIX (CPF, e-mail, telefone ou aleatória)
    tipo: "60367566311",       // ex.: "CPF", "Celular", "E-mail", "Aleatória"
    titular: "MARA BRENA ARAGÃO CATUNDA"     // nome do titular
  },

  // WhatsApp da organização (somente números, com 55 + DDD)
  whatsapp: "+5588999130080",

  // URL do web app do Google Apps Script (termina em /exec). Preencher após o deploy.
  appsScriptUrl: "",

  // Máximo de pessoas por confirmação (incluindo o responsável)
  maxPessoas: 10,

};
