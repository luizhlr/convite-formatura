/* =====================================================================
   Convite de formatura — comportamento
   Depende de js/config.js (window.CONFIG).
   ===================================================================== */
(function () {
  "use strict";

  var C = window.CONFIG;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  function get(path) {
    return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, C);
  }
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (text != null) n.textContent = text;
    return n;
  }

  /* ---------- 1. Preenche textos a partir do config ---------- */
  $$("[data-cfg]").forEach(function (n) {
    var v = get(n.getAttribute("data-cfg"));
    if (v) n.textContent = v;
    else if (n.hasAttribute("data-hide-empty")) n.hidden = true;
  });
  $$("[data-cfg-money]").forEach(function (n) {
    var v = get(n.getAttribute("data-cfg-money"));
    if (typeof v === "number") n.textContent = brl.format(v);
  });
  var btnMapa = $("#btn-mapa");
  if (C.local.mapa) btnMapa.href = C.local.mapa; else btnMapa.hidden = true;

  /* ---------- 2. Contagem regressiva ---------- */
  var alvo = new Date(C.evento.dataISO).getTime();
  var cd = { d: $("#cd-d"), h: $("#cd-h"), m: $("#cd-m"), s: $("#cd-s") };
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function tick() {
    var diff = alvo - Date.now();
    if (diff <= 0) {
      $("#countdown").hidden = true;
      $("#cd-done").hidden = false;
      return false;
    }
    var s = Math.floor(diff / 1000);
    cd.d.textContent = Math.floor(s / 86400);
    cd.h.textContent = pad(Math.floor((s % 86400) / 3600));
    cd.m.textContent = pad(Math.floor((s % 3600) / 60));
    cd.s.textContent = pad(s % 60);
    return true;
  }
  if (tick()) {
    var timer = setInterval(function () { if (!tick()) clearInterval(timer); }, 1000);
  }

  /* ---------- 3. Entrada suave ao rolar ---------- */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add("is-in"); });
  }

  /* ---------- 4. Barra fixa de confirmação (celular) ---------- */
  var sticky = $("#sticky-cta");
  var hero = $("#topo");
  var cta = $("#confirmar");
  var heroGone = false, ctaVisible = false;
  function syncSticky() {
    var on = heroGone && !ctaVisible;
    sticky.classList.toggle("is-visible", on);
    sticky.setAttribute("aria-hidden", on ? "false" : "true");
    $("button", sticky).tabIndex = on ? 0 : -1;
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) { heroGone = !e[0].isIntersecting; syncSticky(); }, { threshold: 0.35 }).observe(hero);
    new IntersectionObserver(function (e) { ctaVisible = e[0].isIntersecting; syncSticky(); }, { threshold: 0.2 }).observe(cta);
  }

  /* ---------- 5. Galeria + lightbox ---------- */
  var thumbs = $$("#gallery button");
  var lb = el("div", { "class": "lightbox", role: "dialog", "aria-modal": "true", "aria-label": "Foto ampliada", hidden: "" });
  var lbImg = el("img", { alt: "" });
  var lbClose = el("button", { type: "button", "class": "lb-close", "aria-label": "Fechar" }, "×");
  var lbPrev = el("button", { type: "button", "class": "lb-prev", "aria-label": "Foto anterior" }, "‹");
  var lbNext = el("button", { type: "button", "class": "lb-next", "aria-label": "Próxima foto" }, "›");
  lb.appendChild(lbImg); lb.appendChild(lbClose); lb.appendChild(lbPrev); lb.appendChild(lbNext);
  document.body.appendChild(lb);
  var lbIndex = 0, lbOpener = null;

  function lbShow(i) {
    lbIndex = (i + thumbs.length) % thumbs.length;
    var b = thumbs[lbIndex];
    lbImg.src = b.getAttribute("data-full");
    lbImg.alt = $("img", b).alt;
  }
  function lbOpen(i, opener) {
    lbOpener = opener;
    lbShow(i);
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    lbClose.focus();
  }
  function lbHide() {
    lb.hidden = true;
    document.body.style.overflow = "";
    if (lbOpener) lbOpener.focus();
  }
  thumbs.forEach(function (b, i) { b.addEventListener("click", function () { lbOpen(i, b); }); });
  lbClose.addEventListener("click", lbHide);
  lbPrev.addEventListener("click", function () { lbShow(lbIndex - 1); });
  lbNext.addEventListener("click", function () { lbShow(lbIndex + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) lbHide(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") lbHide();
    else if (e.key === "ArrowLeft") lbShow(lbIndex - 1);
    else if (e.key === "ArrowRight") lbShow(lbIndex + 1);
  });
  var tx = null;
  lb.addEventListener("touchstart", function (e) { tx = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (tx == null) return;
    var dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) lbShow(lbIndex + (dx < 0 ? 1 : -1));
    tx = null;
  }, { passive: true });

  /* ---------- 6. Música de fundo (só se houver arquivo configurado) ---------- */
  if (C.musica) {
    var audio = new Audio(C.musica);
    audio.loop = true;
    audio.volume = 0.35;
    var mb = el("button", { type: "button", "class": "music-btn", "aria-pressed": "false", "aria-label": "Tocar ou pausar a música" });
    mb.innerHTML =
      '<svg class="i-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>' +
      '<svg class="i-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="m17 9 5 6m0-6-5 6"/></svg>';
    mb.addEventListener("click", function () {
      if (audio.paused) {
        audio.play().then(function () { mb.setAttribute("aria-pressed", "true"); }).catch(function () {});
      } else {
        audio.pause();
        mb.setAttribute("aria-pressed", "false");
      }
    });
    document.body.appendChild(mb);
  }

  /* ---------- 7. Confirmação de presença ---------- */
  var dlg = $("#rsvp");
  var form = $("#rsvp-form");
  var result = $("#rsvp-result");
  var fNome = $("#f-nome");
  var fTotal = $("#f-total");
  var fAcomp = $("#f-acomp");
  var fErro = $("#f-erro");
  var fEnviar = $("#f-enviar");
  var lastOpener = null;

  for (var i = 1; i <= C.maxPessoas; i++) {
    fTotal.appendChild(el("option", { value: String(i) }, i === 1 ? "1 pessoa (somente eu)" : i + " pessoas"));
  }

  function renderAcompanhantes() {
    var n = parseInt(fTotal.value, 10) - 1;
    var atuais = $$("input", fAcomp).map(function (x) { return x.value; });
    $$(".field", fAcomp).forEach(function (f) { f.remove(); });
    fAcomp.hidden = n < 1;
    for (var k = 0; k < n; k++) {
      var lab = el("label", { "class": "field" });
      lab.appendChild(el("span", null, "Nome do acompanhante " + (k + 1)));
      var inp = el("input", { type: "text", name: "acomp", maxlength: "120", autocomplete: "off", "aria-label": "Nome do acompanhante " + (k + 1) });
      inp.value = atuais[k] || "";
      lab.appendChild(inp);
      fAcomp.appendChild(lab);
    }
  }
  fTotal.addEventListener("change", renderAcompanhantes);

  function showError(msg) { fErro.textContent = msg; fErro.hidden = false; }
  function clearError() { fErro.hidden = true; fErro.textContent = ""; }

  function resetForm() {
    form.hidden = false;
    result.hidden = true;
    result.innerHTML = "";
    clearError();
    setLoading(false);
  }
  function setLoading(on) {
    fEnviar.disabled = on;
    fEnviar.classList.toggle("is-loading", on);
    $(".btn__label", fEnviar).textContent = on ? "Enviando..." : "Confirmar";
  }

  function openRsvp(opener) {
    lastOpener = opener || null;
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    fNome.focus();
  }
  function closeRsvp() {
    if (typeof dlg.close === "function") dlg.close(); else dlg.removeAttribute("open");
    if (lastOpener) lastOpener.focus();
  }
  $$("[data-open-rsvp]").forEach(function (b) { b.addEventListener("click", function () { openRsvp(b); }); });
  $$("[data-close]", dlg).forEach(function (b) { b.addEventListener("click", closeRsvp); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) closeRsvp(); });

  function nomeValido(s, minPalavras) {
    var p = s.trim().split(/\s+/).filter(Boolean);
    return p.length >= minPalavras && s.trim().length >= 3;
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    clearError();

    var nome = fNome.value.replace(/\s+/g, " ").trim();
    var total = parseInt(fTotal.value, 10);
    var acomp = $$("input", fAcomp).map(function (x) { return x.value.replace(/\s+/g, " ").trim(); });

    if (!nomeValido(nome, 2)) { showError("Informe seu nome completo (nome e sobrenome)."); fNome.focus(); return; }
    for (var k = 0; k < acomp.length; k++) {
      if (!nomeValido(acomp[k], 1)) { showError("Preencha o nome do acompanhante " + (k + 1) + "."); $$("input", fAcomp)[k].focus(); return; }
    }

    enviar({ acao: "confirmar", nome: nome, total: total, acompanhantes: acomp });
  });

  function enviar(payload) {
    setLoading(true);
    var chamada;

    if (!C.appsScriptUrl) {
      chamada = Promise.resolve({ registrado: false, motivo: "sem-url" });
    } else {
      var ctrl = typeof AbortController === "function" ? new AbortController() : null;
      var t = setTimeout(function () { if (ctrl) ctrl.abort(); }, 15000);
      chamada = fetch(C.appsScriptUrl, {
        method: "POST",
        // text/plain evita o "preflight" CORS, que o Apps Script não responde.
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
        signal: ctrl ? ctrl.signal : undefined
      })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          clearTimeout(t);
          if (!d || !d.ok) throw new Error((d && d.erro) || "Falha ao registrar.");
          return { registrado: true, dados: d };
        })
        .catch(function () { clearTimeout(t); return { registrado: false, motivo: "erro" }; });
    }

    chamada.then(function (r) { mostrarResultado(payload, r); });
  }

  function msgWhatsApp(payload, r) {
    var L = [];
    L.push("Olá! Confirmo presença na formatura de " + C.formanda.nome + " (" + C.evento.dataTexto + ", " + C.evento.horaTexto + " - " + C.local.nome + ").");
    L.push("");
    L.push("Responsável: " + payload.nome);
    L.push("Total de pessoas: " + payload.total);
    if (payload.acompanhantes.length) L.push("Acompanhantes: " + payload.acompanhantes.join(", "));
    if (r.registrado) {
      var d = r.dados;
      L.push("Ingressos gratuitos: " + d.gratuitos + " | Pagantes: " + d.pagantes);
      L.push("Valor total: " + brl.format(d.valor));
      if (d.valor > 0) L.push("Vou enviar o comprovante do PIX por aqui.");
    } else {
      L.push("(Atenção: não foi possível registrar na planilha. Favor conferir a lista e o valor.)");
    }
    return L.join("\n");
  }

  function dlItem(dl, k, v) {
    var row = el("div");
    row.appendChild(el("dt", null, k));
    row.appendChild(el("dd", null, v));
    dl.appendChild(row);
  }

  function mostrarResultado(payload, r) {
    var wrap = el("div", { "class": "res" });
    var icon = el("div", { "class": "res__icon", "aria-hidden": "true" });
    icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
    wrap.appendChild(icon);

    var d = r.registrado ? r.dados : null;
    wrap.appendChild(el("h2", null, r.registrado ? "Presença registrada!" : "Quase lá!"));

    if (!r.registrado) {
      wrap.appendChild(el("p", { "class": "res__note" },
        "Não conseguimos registrar sua confirmação automaticamente. Sem problemas: faça o PIX (se for pagar ingresso) e envie a mensagem pelo WhatsApp que confirmamos por lá."));
    } else if (d.gratuitos > 0 && d.pagantes === 0) {
      wrap.appendChild(el("p", null, "Seu ingresso é cortesia. Enviar a mensagem pelo WhatsApp conclui a confirmação."));
    } else {
      wrap.appendChild(el("p", null, "Falta só o pagamento dos ingressos e o envio da mensagem pelo WhatsApp."));
    }

    var dl = el("dl", { "class": "res__list" });
    dlItem(dl, "Responsável", payload.nome);
    dlItem(dl, "Total de pessoas", String(payload.total));
    if (payload.acompanhantes.length) dlItem(dl, "Acompanhantes", payload.acompanhantes.join(", "));
    if (d) {
      dlItem(dl, "Ingressos gratuitos", String(d.gratuitos));
      dlItem(dl, "Ingressos a pagar", String(d.pagantes));
      var tot = el("div", { "class": "res__total" });
      tot.appendChild(el("dt", null, "Valor total"));
      tot.appendChild(el("dd", null, brl.format(d.valor)));
      dl.appendChild(tot);
    }
    wrap.appendChild(dl);

    var precisaPagar = !d || d.valor > 0;
    if (precisaPagar) {
      var pix = el("div", { "class": "pix" });
      pix.appendChild(el("p", { "class": "pix__label" }, "Pagamento via PIX"));
      if (!d) {
        // Sem registro automático: mostra o PIX do mesmo jeito; o valor final é confirmado no WhatsApp.
        pix.appendChild(el("p", { "class": "hint" }, "Ingresso: " + brl.format(C.ingresso.valor) + " por pessoa. O valor final será confirmado na conversa do WhatsApp."));
      }
      if (C.pix.chave) {
        pix.appendChild(el("p", { "class": "pix__key" }, C.pix.chave));
        var info = [C.pix.tipo, C.pix.titular].filter(Boolean).join(" · ");
        if (info) pix.appendChild(el("p", { "class": "hint" }, info));
        var cp = el("button", { type: "button", "class": "btn" }, "Copiar chave");
        cp.addEventListener("click", function () { copiar(C.pix.chave, cp); });
        pix.appendChild(cp);
      } else {
        pix.appendChild(el("p", { "class": "pix__key" }, "A chave PIX será enviada na conversa do WhatsApp."));
      }
      wrap.appendChild(pix);
    }

    var numero = String(C.whatsapp).replace(/\D/g, "");
    var link = el("a", {
      "class": "btn btn--wa btn--block",
      href: "https://wa.me/" + numero + "?text=" + encodeURIComponent(msgWhatsApp(payload, r)),
      target: "_blank",
      rel: "noopener"
    }, "Enviar confirmação no WhatsApp");
    wrap.appendChild(link);

    if (precisaPagar) {
      wrap.appendChild(el("p", { "class": "hint" }, "Envie o comprovante do PIX na conversa para finalizar."));
    }
    var fechar = el("button", { type: "button", "class": "btn btn--block" }, "Fechar");
    fechar.addEventListener("click", function () { closeRsvp(); });
    wrap.appendChild(fechar);

    form.hidden = true;
    result.innerHTML = "";
    result.appendChild(wrap);
    result.hidden = false;
    dlg.scrollTop = 0;
    setLoading(false);
  }

  function copiar(texto, btn) {
    var ok = function () { var o = btn.textContent; btn.textContent = "Copiado!"; setTimeout(function () { btn.textContent = o; }, 1800); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(ok).catch(function () { fallback(); });
    } else { fallback(); }
    function fallback() {
      var ta = el("textarea"); ta.value = texto; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); ok(); } catch (e) {}
      ta.remove();
    }
  }

  dlg.addEventListener("close", function () {
    // Ao reabrir, volta ao formulário limpo se a confirmação anterior já foi concluída.
    if (!result.hidden) { form.reset(); renderAcompanhantes(); resetForm(); }
  });

  renderAcompanhantes();
})();
