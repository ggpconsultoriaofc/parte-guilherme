
const PRODUTOS = [
    {
        id: "brigadeiro", nome: "Brigadeiro Tradicional", preco: 3.5, imagem: "./img/brigadeiro.jpg",
        descricao: "O clássico cozido no ponto, enrolado à mão e coberto de granulado de chocolate.",
        chefe: true, badge: "Mais Vendido"
    },
    {
        id: "combo-brigadeiros", nome: "Combo de Brigadeiros (12 un.)", preco: 55, imagem: "./img/combo-brigadeiros.jpg",
        descricao: "Caixa com 12 brigadeiros em sabores sortidos. Perfeita para presentear.",
        chefe: true, badge: "Carro-Chefe"
    },
    {
        id: "beijinho", nome: "Beijinho", preco: 3.5, imagem: "./img/beijinho.jpg",
        descricao: "Leite condensado e coco, finalizado com coco ralado e um cravo."
    },
    {
        id: "branco-acucar", nome: "Brigadeiro Branco no Açúcar", preco: 3.5, imagem: "./img/Brigadeiro-branco-no-acucar.jpg",
        descricao: "Cremoso, de leite, passado no açúcar cristal para dar crocância."
    },
    {
        id: "combo-mista", nome: "Combo Beijinho + Brigadeiro", preco: 55, imagem: "./img/combo-beijinho-e-brigadeiro.jpg",
        descricao: "Caixa mista com beijinhos e brigadeiros, metade de cada.", badge: "Caixa mista", rosa: true
    },
    {
        id: "cone", nome: "Cone Trufado", preco: 18, imagem: "./img/cone-trufado.jpg",
        descricao: "Casquinha crocante coberta de chocolate e recheada de trufa."
    },
    {
        id: "mousse", nome: "Mousse de Chocolate com Leite", preco: 15, imagem: "./img/mousse-de-choclate-com-leite.jpg",
        descricao: "Mousse aerada, com chantilly e raspas de chocolate."
    }
];


const carrinho = {};

const $ = (id) => document.getElementById(id);
const formatarReal = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const buscar = (id) => PRODUTOS.find((p) => p.id === id);
const totalItens = () => Object.values(carrinho).reduce((a, q) => a + q, 0);
const totalValor = () => Object.entries(carrinho).reduce((a, [id, q]) => a + buscar(id).preco * q, 0);

function criarCard(p) {
    const badge = p.badge ? `<span class="badge ${p.rosa ? "badge--rosa" : ""}">${p.badge}</span>` : "";
    return `
    <article class="card ${p.chefe ? "card--chefe" : ""}">
      ${badge}
      <div class="card__foto"><img src="${p.imagem}" alt="${p.nome}" loading="lazy"></div>
      <div class="card__corpo">
        <h3>${p.nome}</h3>
        <p class="card__desc">${p.descricao}</p>
        <div class="card__rodape">
          <span class="preco">${formatarReal(p.preco)}</span>
          <button class="btn-add" data-id="${p.id}">Adicionar ao carrinho</button>
        </div>
      </div>
    </article>`;
}

function renderizarCardapio() {
    $("gradeDestaques").innerHTML = PRODUTOS.filter((p) => p.chefe).map(criarCard).join("");
    $("gradeProdutos").innerHTML = PRODUTOS.filter((p) => !p.chefe).map(criarCard).join("");
}

function renderizarCarrinho() {
    const ids = Object.keys(carrinho);
    const corpo = $("itensCarrinho");

    if (ids.length === 0) {
        corpo.innerHTML = `
      <div class="vazio">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M9 8a3 3 0 0 1 6 0" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>
        <strong>Seu carrinho está vazio</strong>
        Adicione um doce do cardápio para começar o pedido.
      </div>`;
    } else {
        corpo.innerHTML = ids.map((id) => {
            const p = buscar(id), q = carrinho[id];
            return `
        <div class="item">
          <img src="${p.imagem}" alt="">
          <div>
            <div class="item__nome">${p.nome}</div>
            <div class="item__unit">${formatarReal(p.preco)} cada</div>
            <div class="item__qtd">
              <button data-acao="menos" data-id="${id}" aria-label="Diminuir quantidade">−</button>
              <span>${q}</span>
              <button data-acao="mais" data-id="${id}" aria-label="Aumentar quantidade">+</button>
            </div>
          </div>
          <div class="item__lado">
            <div class="item__sub">${formatarReal(p.preco * q)}</div>
            <button class="item__remover" data-acao="remover" data-id="${id}">Remover</button>
          </div>
        </div>`;
        }).join("");
    }

    $("rodapeCarrinho").hidden = ids.length === 0; 
    $("total").textContent = formatarReal(totalValor());
    $("contador").textContent = totalItens();
}

function adicionar(id) {
    carrinho[id] = (carrinho[id] || 0) + 1;
    renderizarCarrinho();
}

function alterar(id, delta) {
    carrinho[id] += delta;
    if (carrinho[id] <= 0) delete carrinho[id];
    renderizarCarrinho();
}

let timerToast;
function mostrarToast(texto) {
    const t = $("toast");
    t.textContent = texto;
    t.classList.add("mostra");
    clearTimeout(timerToast);
    timerToast = setTimeout(() => t.classList.remove("mostra"), 2000);
}

function feedbackAdicionado(botao, id) {
   
    const original = "Adicionar ao carrinho";
    botao.classList.add("ok");
    botao.textContent = "Adicionado ✓";
    setTimeout(() => { botao.classList.remove("ok"); botao.textContent = original; }, 1200);

    const icone = $("abrirCarrinho");
    icone.classList.remove("pulo");
    void icone.offsetWidth;           
    icone.classList.add("pulo");

    mostrarToast(`${buscar(id).nome} no carrinho`);
}

function abrirGaveta() {
    $("gaveta").classList.add("aberta");
    $("veu").classList.add("aberto");
    $("gaveta").setAttribute("aria-hidden", "false");
}
function fecharGaveta() {
    $("gaveta").classList.remove("aberta");
    $("veu").classList.remove("aberto");
    $("gaveta").setAttribute("aria-hidden", "true");
}

function finalizarPedido() {
    if (totalItens() === 0) return;
    const forma = $("pagamento").value;
    const linhas = Object.entries(carrinho).map(([id, q]) => `${q}× ${buscar(id).nome}`).join("\n");
    $("confirmacaoTexto").textContent =
        `${linhas}\n\nTotal: ${formatarReal(totalValor())}\nPagamento: ${forma}\n\nJá estamos enrolando o seu pedido.`;

    for (const id in carrinho) delete carrinho[id];   // esvazia o carrinho
    renderizarCarrinho();
    fecharGaveta();
    $("confirmacao").showModal();
}

document.addEventListener("click", (e) => {
    const add = e.target.closest(".btn-add");
    if (add) { adicionar(add.dataset.id); feedbackAdicionado(add, add.dataset.id); return; }

    const acao = e.target.closest("[data-acao]");
    if (acao) {
        const { acao: a, id } = acao.dataset;
        if (a === "mais") alterar(id, 1);
        if (a === "menos") alterar(id, -1);
        if (a === "remover") alterar(id, -carrinho[id]);
    }
});

$("abrirCarrinho").addEventListener("click", abrirGaveta);
$("fecharCarrinho").addEventListener("click", fecharGaveta);
$("veu").addEventListener("click", fecharGaveta);
$("finalizar").addEventListener("click", finalizarPedido);
$("fecharConfirmacao").addEventListener("click", () => $("confirmacao").close());
document.addEventListener("keydown", (e) => { if (e.key === "Escape") fecharGaveta(); });

renderizarCardapio();
renderizarCarrinho();