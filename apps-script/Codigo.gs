/**
 * Convite de formatura — backend na planilha Google
 *
 * O que faz:
 *  - Recebe a confirmação enviada pelo site (POST em JSON).
 *  - Confere se o responsável está na aba "Convidados" (ingresso gratuito).
 *  - Calcula gratuitos, pagantes e valor NO SERVIDOR (não confia no navegador).
 *  - Grava ou atualiza uma linha na aba "Confirmações".
 *
 * Gratuidade: vale somente para o convidado nomeado. Acompanhantes sempre pagam.
 *
 * Como instalar: veja o README.md (seção "Planilha e Apps Script").
 */

var CFG = {
  PRECO: 350,                    // valor do ingresso por pessoa (R$). Mantenha igual ao config.js
  MAX_PESSOAS: 6,                // responsável + até 5 acompanhantes
  MAX_TEXTO: 120,
  ABA_CONVIDADOS: 'Convidados',
  ABA_CONFIRMACOES: 'Confirmações'
};

var CABECALHO = [
  'Data/hora', 'Responsável', 'Total de pessoas', 'Acompanhantes',
  'Gratuitos', 'Pagantes', 'Valor a pagar (R$)', 'Pagamento', 'Situação', 'Observações'
];

/* ---------------------------------------------------------------
   Execute UMA VEZ manualmente (menu Executar > configurarPlanilha)
   para criar as abas, o cabeçalho e as listas suspensas.
   --------------------------------------------------------------- */
function configurarPlanilha() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var conv = ss.getSheetByName(CFG.ABA_CONVIDADOS) || ss.insertSheet(CFG.ABA_CONVIDADOS);
  if (conv.getRange('A1').getValue() === '') {
    conv.getRange('A1').setValue('Nome (convidados com ingresso gratuito)').setFontWeight('bold');
    conv.setColumnWidth(1, 360);
    conv.setFrozenRows(1);
  }

  var conf = ss.getSheetByName(CFG.ABA_CONFIRMACOES) || ss.insertSheet(CFG.ABA_CONFIRMACOES);
  if (conf.getRange('A1').getValue() === '') {
    conf.getRange(1, 1, 1, CABECALHO.length).setValues([CABECALHO]).setFontWeight('bold').setBackground('#d9ead3');
    conf.setFrozenRows(1);
    conf.setColumnWidths(1, CABECALHO.length, 140);
    conf.setColumnWidth(2, 240);
    conf.setColumnWidth(4, 300);
    conf.setColumnWidth(10, 260);
  }
  var pag = SpreadsheetApp.newDataValidation().requireValueInList(['Pendente', 'Pago', 'Isento'], true).build();
  conf.getRange('H2:H2000').setDataValidation(pag);
  var sit = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Aguardando pagamento', 'Confirmado', 'Cancelado'], true).build();
  conf.getRange('I2:I2000').setDataValidation(sit);
}

/* Teste rápido no navegador: abrir a URL do web app deve mostrar "online". */
function doGet() {
  return resposta_({ ok: true, status: 'online' });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
  } catch (err) {
    return resposta_({ ok: false, erro: 'Servidor ocupado. Tente novamente.' });
  }

  try {
    var corpo = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (corpo.acao !== 'confirmar') return resposta_({ ok: false, erro: 'Ação inválida.' });

    var entrada = validarEntrada_(corpo);
    if (entrada.erro) return resposta_({ ok: false, erro: entrada.erro });

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var conv = ss.getSheetByName(CFG.ABA_CONVIDADOS);
    var conf = ss.getSheetByName(CFG.ABA_CONFIRMACOES);
    if (!conv || !conf) return resposta_({ ok: false, erro: 'Planilha não configurada.' });

    var lista = lerLista_(conv);
    var calc = calcular_(entrada.nome, entrada.total, lista, CFG.PRECO);
    gravar_(conf, entrada, calc);

    return resposta_({
      ok: true,
      total: entrada.total,
      gratuitos: calc.gratuitos,
      pagantes: calc.pagantes,
      valor: calc.valor
    });
  } catch (err) {
    return resposta_({ ok: false, erro: 'Erro ao processar.' });
  } finally {
    lock.releaseLock();
  }
}

/* ======================= Lógica pura (testável) ======================= */

/** Remove acentos, caixa e espaços extras para comparar nomes. */
function normalizar_(s) {
  return String(s == null ? '' : s)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * Gratuito = 1 se o responsável está na lista, senão 0.
 * Pagantes = total - gratuitos. Valor = pagantes * preço.
 */
function calcular_(nome, total, listaNormalizada, preco) {
  var gratuitos = listaNormalizada.indexOf(normalizar_(nome)) !== -1 ? 1 : 0;
  var pagantes = Math.max(total - gratuitos, 0);
  return { gratuitos: gratuitos, pagantes: pagantes, valor: pagantes * preco };
}

function validarEntrada_(c) {
  var nome = limpar_(c.nome);
  if (nome.length < 3 || nome.split(' ').length < 2) return { erro: 'Nome inválido.' };

  var total = parseInt(c.total, 10);
  if (!(total >= 1 && total <= CFG.MAX_PESSOAS)) return { erro: 'Quantidade inválida.' };

  var acomp = Array.isArray(c.acompanhantes) ? c.acompanhantes.map(limpar_) : [];
  if (acomp.length !== total - 1) return { erro: 'Quantidade de acompanhantes não confere.' };
  for (var i = 0; i < acomp.length; i++) {
    if (acomp[i].length < 2) return { erro: 'Nome de acompanhante inválido.' };
  }
  return { nome: nome, total: total, acompanhantes: acomp };
}

function limpar_(s) {
  return String(s == null ? '' : s).replace(/[\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, CFG.MAX_TEXTO);
}

/* ======================= Planilha ======================= */

function lerLista_(aba) {
  var ultima = aba.getLastRow();
  if (ultima < 2) return [];
  return aba.getRange(2, 1, ultima - 1, 1).getValues()
    .map(function (r) { return normalizar_(r[0]); })
    .filter(function (n) { return n !== ''; });
}

/** Evita que um texto digitado vire fórmula na planilha (=, +, -, @). */
function seguro_(s) {
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function gravar_(aba, entrada, calc) {
  var agora = new Date();
  var acomp = seguro_(entrada.acompanhantes.join(', '));
  var nomeSeguro = seguro_(entrada.nome);
  var chave = normalizar_(entrada.nome);

  // Procura confirmação anterior do mesmo responsável (coluna B) para atualizar.
  var ultima = aba.getLastRow();
  var linha = -1;
  if (ultima >= 2) {
    var nomes = aba.getRange(2, 2, ultima - 1, 1).getValues();
    for (var i = 0; i < nomes.length; i++) {
      if (normalizar_(nomes[i][0]) === chave) { linha = i + 2; break; }
    }
  }

  var dados = [[agora, nomeSeguro, entrada.total, acomp, calc.gratuitos, calc.pagantes, calc.valor]];

  if (linha === -1) {
    var pagamento = calc.valor > 0 ? 'Pendente' : 'Isento';
    var situacao = calc.valor > 0 ? 'Aguardando pagamento' : 'Confirmado';
    aba.appendRow([agora, nomeSeguro, entrada.total, acomp, calc.gratuitos, calc.pagantes, calc.valor, pagamento, situacao, '']);
  } else {
    // Atualiza A:G e preserva Pagamento, Situação e Observações já editados à mão.
    aba.getRange(linha, 1, 1, 7).setValues(dados);
    var obs = aba.getRange(linha, 10);
    var atual = String(obs.getValue() || '');
    var aviso = 'Reenviou em ' + Utilities.formatDate(agora, 'America/Fortaleza', 'dd/MM HH:mm');
    obs.setValue(atual ? atual + ' | ' + aviso : aviso);
    // Se o valor mudou depois de pago, sinaliza para conferência.
    if (String(aba.getRange(linha, 8).getValue()) === 'Pago' && calc.valor > 0) {
      obs.setValue(String(obs.getValue()) + ' | CONFERIR: valor alterado após pagamento');
    }
  }
}

function resposta_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
