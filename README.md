# Convite de formatura: Dra. Mara Brena Aragão Catunda

Site estático (HTML, CSS e JavaScript puro) para o **GitHub Pages**, com confirmação de presença que grava numa **planilha do Google** e abre uma mensagem pronta no **WhatsApp**.

URL final prevista: `https://luizhlr.github.io/convite-formatura/`
(Isso vale se o repositório se chamar exatamente `convite-formatura`. Se usar outro nome, troque-o nas duas URLs `og:` no começo do `index.html`.)

## O que já está preenchido

Data, horário, buffet e endereço, mapa, valor do ingresso (R$ 350), PIX (CPF, titular MARA BRENA ARAGÃO CATUNDA), WhatsApp da organização, nome da formanda, fotos otimizadas e imagem de prévia do link. As fontes (Cormorant Garamond e Hanken Grotesk) vêm do Google Fonts, sem arquivos para instalar. O site está sem música.

Regras da confirmação: o convidado da lista tem ingresso gratuito; acompanhantes pagam R$ 350 cada; no máximo 5 acompanhantes por confirmação (6 pessoas no total).

## O que ainda depende de você

| Item | Onde | Observação |
|---|---|---|
| URL do Apps Script | `js/config.js`, campo `appsScriptUrl` | Só existe depois do Passo 2 abaixo. Sem ela, a confirmação não grava na planilha, mas o PIX e o WhatsApp continuam funcionando. |
| Lista de convidados gratuitos | aba "Convidados" da planilha | Nomes completos, um por linha, a partir da linha 2. |
| Texto da citação | `js/config.js`, campos `citacao` e `citacaoAutor` | Está com lorem ipsum. |

## Passo 1. Publicar no GitHub Pages

1. Entre no GitHub com o usuário **luizhlr** e crie um repositório **público** chamado `convite-formatura`.
2. Envie todo o conteúdo desta pasta (descompactada). Pela interface: **Add file → Upload files**, arraste os arquivos e pastas e clique em **Commit changes**. Confira se `index.html` ficou na raiz do repositório, e não dentro de outra pasta.
3. Vá em **Settings → Pages**. Em *Build and deployment*, escolha **Deploy from a branch**, branch **main**, pasta **/ (root)**, e salve. Os nomes dos menus podem variar um pouco; confira na tela.
4. Em 1 a 2 minutos o site abre em `https://luizhlr.github.io/convite-formatura/`.

## Passo 2. Planilha e Apps Script

1. Crie uma planilha no Google Sheets.
2. Abra **Extensões → Apps Script**. Apague o código que aparecer e cole o conteúdo de `apps-script/Codigo.gs`.
3. Confira, no começo do script, `PRECO: 350` e `MAX_PESSOAS: 6` (devem bater com o `config.js`).
4. Selecione a função **configurarPlanilha** no topo e clique em **Executar**. Autorize quando o Google pedir. Isso cria as abas **Convidados** e **Confirmações**, com cabeçalho e listas suspensas.
5. Na aba **Convidados**, a partir da linha 2, digite na coluna A o nome completo de cada convidado com ingresso gratuito.
6. Clique em **Implantar → Nova implantação**. Em tipo, escolha **App da Web**. Configure *Executar como*: **Eu**, e *Quem pode acessar*: **Qualquer pessoa**.
7. Copie a URL que termina em `/exec` e cole em `appsScriptUrl` no `js/config.js` (no GitHub: abra o arquivo, clique no lápis, edite e faça o commit).
8. Abra a URL `/exec` no navegador. Deve aparecer `{"ok":true,"status":"online"}`.

Sempre que mudar o `Codigo.gs`, é preciso **Implantar → Gerenciar implantações → editar → Nova versão**. Salvar o código sozinho não atualiza o site.

### Como acompanhar (aba Confirmações)

- **Pagamento**: nasce como *Pendente* (ou *Isento*, se tudo for gratuito). Mude para *Pago* quando o PIX chegar.
- **Situação**: nasce como *Aguardando pagamento* (ou *Confirmado* para isentos). Mude para *Confirmado* após o pagamento.
- Se a mesma pessoa confirmar de novo, a linha é **atualizada** (não duplica), e a coluna *Observações* registra o reenvio. Pagamento e Situação ficam preservados.

## Passo 3. Testar antes de divulgar

1. No celular, faça uma confirmação com um **nome fora da lista** (deve cobrar o ingresso) e outra com **um nome da lista** (cortesia para o responsável, acompanhantes pagam).
2. Confira se as linhas apareceram na planilha e se o botão do WhatsApp abre a mensagem pronta.
3. Apague as linhas de teste da aba **Confirmações**.
4. Mande o link para você mesmo no WhatsApp e veja se a prévia mostra a imagem. O WhatsApp guarda a prévia em cache, então pode demorar a atualizar.

## Limitações que você deve conhecer

- **O CPF fica visível no site.** A chave PIX aparece para quem confirmar, e também está no código público do GitHub. Se preferir não expor o CPF, crie uma chave aleatória no app do banco e troque `pix.chave` e `pix.tipo` no `config.js`.
- **Qualquer pessoa pode digitar o nome de um convidado gratuito** e receber a cortesia. O site não consegue provar quem está digitando. Confira a lista no dia da festa.
- O nome precisa bater com o da lista (o site ignora maiúsculas, acentos e espaços extras, mas não corrige erros de digitação).
- A mensagem do WhatsApp abre quando o convidado toca no botão verde da tela de resumo. Navegadores de celular bloqueiam janelas abertas automaticamente depois de uma consulta à internet.
- Se o Google estiver fora do ar ou o convidado estiver sem internet, o site avisa, mostra o PIX e o botão do WhatsApp, e a mensagem sai marcada como "não registrada". Nesse caso, confira a lista manualmente.
- Fotos e nomes de familiares ficam num site público. Se alguém não quiser aparecer, remova a foto de `fotos/` e do `index.html`.
- A imagem de prévia do link (`fotos/og-convite.jpg`) é uma imagem pronta, com texto fixo. Se mudar nome, data ou local, ela precisa ser refeita.

## Estrutura

```
index.html            página
css/style.css         visual (cores e fontes no começo do arquivo)
js/config.js          dados editáveis
js/main.js            contagem, galeria, confirmação
fotos/                fotos (WebP) + og-convite.jpg (prévia do link)
audio/                música opcional (vazio)
apps-script/Codigo.gs código da planilha (colar no Apps Script)
```
