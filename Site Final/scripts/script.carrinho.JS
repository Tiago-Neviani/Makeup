// Seleciona os elementos do HTML
let iconCart = document.querySelector(".icon-cart");
let closeCart = document.querySelector(".close");
let listCart = document.querySelector(".listCart");
let contador = document.querySelector(".icon-cart span");

// Recupera o carrinho salvo no localStorage ou cria um array vazio
let carts = JSON.parse(localStorage.getItem("cart")) || [];


// ===========================
// ABRIR E FECHAR O CARRINHO
// ===========================

// Abre ou fecha o carrinho ao clicar no ícone
iconCart.onclick = () => {
    document.body.classList.toggle("showCart");
};

// Fecha o carrinho ao clicar no botão de fechar
closeCart.onclick = () => {
    document.body.classList.remove("showCart");
};


// ===========================
// BOTÃO ADICIONAR AO CARRINHO
// ===========================

// Seleciona o botão de adicionar
const botao = document.querySelector(".adc");

if (botao) {

    // Adiciona o evento de clique
    botao.addEventListener("click", () => {

        // Se o produto possui variação e nenhuma foi escolhida
        if (
            botao.dataset.temVariacao === "true" &&
            !window.variacaoSelecionada
        ) {
            alert("Escolha uma opção.");
            return;
        }

        // Cria o objeto do produto usando os atributos data-*
        const produto = {
            slug: botao.dataset.slug,
            name: botao.dataset.name,
            price: Number(botao.dataset.price),
            image: botao.dataset.image,
            variacao: window.variacaoSelecionada || "",
            quantity: 1
        };

        // Adiciona ao carrinho
        addToCart(produto);
    });
}


// ===========================
// ADICIONAR PRODUTO AO CARRINHO
// ===========================

function addToCart(produto) {

    // Procura um produto igual (mesmo slug e mesma variação)
    const item = carts.find(p =>
        p.slug == produto.slug &&
        p.variacao == produto.variacao
    );

    if (item) {
        // Se já existir, aumenta a quantidade
        item.quantity++;
    } else {
        // Caso contrário, adiciona um novo item
        carts.push(produto);
    }

    salvar();
}


// ===========================
// SALVAR NO LOCALSTORAGE
// ===========================

function salvar() {

    // Salva o carrinho atualizado
    localStorage.setItem(
        "cart",
        JSON.stringify(carts)
    );

    // Atualiza a interface
    atualizarCarrinho();
}


// ===========================
// ATUALIZAR O CARRINHO NA TELA
// ===========================

function atualizarCarrinho() {

    // Limpa o conteúdo anterior
    listCart.innerHTML = "";

    let quantidadeTotal = 0;
    let total = 0;

    // Percorre todos os itens do carrinho
    carts.forEach(item => {

        quantidadeTotal += item.quantity;

        const subtotal =
            item.price * item.quantity;

        total += subtotal;

        // Cria o HTML de cada produto
        listCart.innerHTML += `

        <div class="item"
            data-slug="${item.slug}"
            data-variacao="${item.variacao}">

            <div class="imagem">
                <img src="${item.image}" width="80">
            </div>

            <div class="info">

                <h3>${item.name}</h3>

                ${
                    item.variacao
                    ?
                    `<p><strong>Opção:</strong> ${item.variacao}</p>`
                    :
                    ""
                }

                <p>
                    Preço:
                    R$ ${item.price.toFixed(2)}
                </p>

                <div class="quantidade">

                    <button class="menos">
                        -
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button class="mais">
                        +
                    </button>

                </div>

                <p class="subtotal">
                    Subtotal:
                    R$ ${subtotal.toFixed(2)}
                </p>

            </div>

        </div>

        <hr>

        `;
    });

    // Atualiza o contador do carrinho
    contador.textContent = quantidadeTotal;

    // Adiciona o total e o botão de compra
    listCart.innerHTML += `

    <div class="totalCarrinho">

        <h2>
            Total:
            R$ ${total.toFixed(2)}
        </h2>

        <button class="comprar">
            Finalizar Pedido
        </button>

    </div>

    `;
}


// ===========================
// EVENTOS DOS BOTÕES DO CARRINHO
// ===========================

listCart.addEventListener("click", e => {

    // Obtém o item clicado
    const produto =
        e.target.closest(".item");

    if (produto) {

        const slug = produto.dataset.slug;
        const variacao = produto.dataset.variacao;

        // Botão +
        if (
            e.target.classList.contains("mais")
        ) {
            alterarQuantidade(
                slug,
                variacao,
                1
            );
        }

        // Botão -
        if (
            e.target.classList.contains("menos")
        ) {
            alterarQuantidade(
                slug,
                variacao,
                -1
            );
        }
    }

    // Botão finalizar compra
    if (
        e.target.classList.contains("comprar")
    ) {
        comprar();
    }
});


// ===========================
// ALTERAR QUANTIDADE
// ===========================

function alterarQuantidade(
    slug,
    variacao,
    valor
) {

    // Procura o produto no carrinho
    const item = carts.find(p =>
        p.slug == slug &&
        p.variacao == variacao
    );

    if (!item) return;

    // Soma ou diminui a quantidade
    item.quantity += valor;

    // Remove caso a quantidade seja zero ou menor
    if (item.quantity <= 0) {

        carts = carts.filter(p =>
            !(
                p.slug == slug &&
                p.variacao == variacao
            )
        );
    }

    salvar();
}


// ===========================
// FINALIZAR PEDIDO
// ===========================

function comprar() {

    // Verifica se o carrinho está vazio
    if (carts.length == 0) {

        alert("Seu carrinho está vazio!");

        return;
    }

    // Inicia a mensagem do WhatsApp
    let mensagem =
        "🛍️ *NOVO PEDIDO*%0A%0A";

    let total = 0;

    // Percorre todos os produtos
    carts.forEach((item, i) => {

        const subtotal =
            item.price * item.quantity;

        total += subtotal;

        mensagem +=
            `${i + 1}️⃣ ${item.name}%0A`;

        if (item.variacao) {
            mensagem +=
                `Opção: ${item.variacao}%0A`;
        }

        mensagem +=
            `Quantidade: ${item.quantity}%0A`;

        mensagem +=
            `Subtotal: R$ ${subtotal.toFixed(2)}%0A%0A`;
    });

    // Adiciona linha separadora
    mensagem +=
        "────────────────%0A";

    // Adiciona o valor total
    mensagem +=
        `💰 Total: R$ ${total.toFixed(2)}%0A%0A`;

    // Mensagem final
    mensagem +=
        "Olá! Gostaria de confirmar este pedido.";

    // Número do WhatsApp que receberá o pedido
    const numero = "5517981673774";

    // Monta o link do WhatsApp
    const link =
        `https://wa.me/${numero}?text=${mensagem}`;

    // Abre o WhatsApp em uma nova aba
    window.open(link, "_blank");

    // Após 2 segundos, limpa o carrinho
    setTimeout(() => {

        carts = [];

        localStorage.removeItem("cart");

        atualizarCarrinho();

    }, 2000);
}




// Atualiza o carrinho quando a página é carregada
atualizarCarrinho();