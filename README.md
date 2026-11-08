# Convite de formatura: Dra. Mara Aragão

Site estático (HTML, CSS e JavaScript puro), pronto para o **GitHub Pages**, com confirmação de presença que grava numa **planilha do Google** e abre uma mensagem pronta no **WhatsApp**.

## O que já está pronto

- Capa, contagem regressiva, local com botão do Google Maps, traje e valor do ingresso, galeria com ampliação e botão "Confirmar presença".
- Confirmação em janela (nome, total de pessoas e nome de cada acompanhante).
- Regra de ingresso: o **convidado da lista** tem ingresso gratuito; **acompanhantes pagam R$ 350 cada**.
- Fotos já otimizadas (WebP) e imagem de prévia para o WhatsApp.

## O que VOCÊ precisa preencher

Tudo fica em `js/config.js`:

| Campo | Situação |
|---|---|
| `local.endereco` | Vazio. Preencha o endereço do buffet (se ficar vazio, a linha some do site). |
| `pix.chave`, `pix.tipo`, `pix.titular` | Vazios. Sem a chave, o site avisa que ela será enviada pelo WhatsApp. |
| `appsScriptUrl` | Vazio até você fazer o passo "Planilha e Apps Script". Sem ele, a confirmação só abre o WhatsApp e não grava na planilha. |
| `formanda.nome` | Conferir a grafia. |
| `musica` | Opcional. Coloque o MP3 em `audio/` e escreva `"audio/musica.mp3"`. Vazio = sem player. |

E em `index.html`, no começo do arquivo, troque `SEU-USUARIO` (e o nome do repositório, se mudar) na linha `og:image` pela URL final do seu site. Sem isso, o link no WhatsApp não mostra a imagem de prévia.

## Passo 1. Publicar no GitHub Pages

1. Crie uma conta no GitHub (se não tiver) e um repositório **público** chamado `convite-formatura`.
2. Envie todo o conteúdo desta pasta para o repositório. Pela interface: **Add file → Upload files**, arraste os arquivos e pastas e clique em **Commit changes**.
3. No repositório, vá em **Settings → Pages**. Em *Build and deployment*, escolha **Deploy from a branch**, branch **main**, pasta **/ (root)**, e salve. Os nomes dos menus podem variar um pouco; confira na tela.
4. Em 1 a 2 minutos o site abre em `https://SEU-USUARIO.github.io/convite-formatura/`.

## Passo 2. Planilha e Apps Script

1. Crie uma planilha no Google Sheets.
2. Abra **Extensões → Apps Script**. Apague o código que aparecer e cole o conteúdo de `apps-script/Codigo.gs`.
3. Confira `PRECO: 350` no começo do script (deve ser igual ao valor do `config.js`).
4. Selecione a função **configurarPlanilha** no topo e clique em **Executar**. Autorize quando o Google pedir. Isso cria as abas **Convidados** e **Confirmações**, com o cabeçalho e as listas suspensas.
5. Na aba **Convidados**, a partir da linha 2, digite na coluna A o nome completo de cada convidado com ingresso gratuito.
6. Clique em **Implantar → Nova implantação**. Em tipo, escolha **App da Web**. Configure:
   - *Executar como*: **Eu**.
   - *Quem pode acessar*: **Qualquer pessoa**.
7. Copie a URL que termina em `/exec` e cole em `appsScriptUrl` no `js/config.js`. Envie o arquivo atualizado para o GitHub.
8. Abra a URL `/exec` no navegador. Deve aparecer `{"ok":true,"status":"online"}`.

Sempre que mudar o `Codigo.gs`, é preciso **Implantar → Gerenciar implantações → editar → Nova versão**. Salvar o código sozinho não atualiza o site.

### Como acompanhar na planilha (aba Confirmações)

- **Pagamento**: nasce como *Pendente* (ou *Isento*, se tudo for gratuito). Mude para *Pago* quando o PIX chegar.
- **Situação**: nasce como *Aguardando pagamento* (ou *Confirmado* para isentos). Mude para *Confirmado* após o pagamento.
- Se a mesma pessoa confirmar de novo, a linha é **atualizada** (não duplica) e a coluna *Observações* registra o reenvio. Seus campos Pagamento e Situação são preservados.

## Passo 3. Testar antes de divulgar

1. Abra o site no celular e faça uma confirmação com um **nome que não está na lista** (deve cobrar o ingresso) e outra com **um nome da lista** (deve mostrar cortesia para o responsável e cobrar os acompanhantes).
2. Confira se as linhas apareceram na planilha e se o botão do WhatsApp abre a mensagem pronta.
3. Apague as linhas de teste da aba **Confirmações**.
4. Mande o link para você mesma no WhatsApp e veja se a prévia mostra a imagem. Se não mostrar, confira a URL do `og:image`. O WhatsApp guarda a prévia em cache, então pode demorar a atualizar.

## Limitações que você deve conhecer

- **Qualquer pessoa pode digitar o nome de um convidado gratuito** e receber a cortesia. O site não consegue provar quem está digitando. Se isso for um risco, confira a lista no dia da festa ou use link individual por convidado (dá para adaptar).
- O nome precisa bater com o da lista (o site ignora maiúsculas, acentos e espaços extras, mas não corrige erros de digitação, como "Joao Silva" versus "João da Silva").
- A mensagem do WhatsApp só abre quando o convidado toca no botão verde da tela de resumo. Isso é proposital: navegadores de celular bloqueiam janelas abertas automaticamente depois de uma consulta à internet.
- Se o Google estiver fora do ar ou o convidado estiver sem internet, o site avisa e ainda oferece a mensagem pelo WhatsApp, marcada como "não registrada". Nesse caso, confira a lista manualmente.
- A chave PIX e o número do WhatsApp ficam visíveis no código do site (é inevitável num site público).
- As fotos e os nomes de familiares ficam num site público. Se alguém não quiser aparecer, remova a foto de `fotos/` e do `index.html`.

## Estrutura

```
index.html            página
css/style.css         visual
js/config.js          dados editáveis
js/main.js            contagem, galeria, confirmação
fotos/                fotos (WebP) + og-convite.jpg (prévia do link)
audio/                música opcional
apps-script/Codigo.gs código da planilha (colar no Apps Script)
```
