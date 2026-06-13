// ======================================
// OBTÉM O PARÂMETRO "produto" DA URL
// Exemplo: produto.html?produto=base-ruby-rose
// ======================================

const params = new URLSearchParams(window.location.search);
const slugProduto = params.get("produto");

// Variável global que armazenará a variação escolhida pelo usuário
window.variacaoSelecionada = null;


// ======================================
// VERIFICA SE EXISTE UM PRODUTO NA URL
// ======================================

if (!slugProduto) {

    // Exibe mensagem de erro caso não exista
    document.querySelector(".quadro").innerHTML =
        "<h1>Produto inválido</h1>";

    throw new Error("Produto inválido");
}


// ======================================
// PREENCHE UM CAMPO OU O OCULTA CASO ESTEJA VAZIO
// ======================================

function preencherOuOcultar(id, valor) {

    const elemento = document.getElementById(id);

    if (!elemento) return;

    if (valor) {

        // Preenche o conteúdo
        elemento.textContent = valor;

    } else {

        // Oculta o elemento pai caso não exista valor
        elemento.parentElement.style.display = "none";

    }
}


// ======================================
// CARREGA OS PRODUTOS
// ======================================

fetch("produtos.json")
    .then(response => response.json())
    .then(produtos => {

        // Procura o produto pelo slug
        const produto =
            produtos.find(p => p.slug == slugProduto);

        // Caso não exista
        if (!produto) {

            document.querySelector(".quadro").innerHTML =
                "<h1>Produto não encontrado</h1>";

            return;
        }


        // ======================================
        // PREENCHE A IMAGEM
        // ======================================

        const imagem =
            document.getElementById("produto-imagem");

        if (imagem) {

            imagem.src = produto.imagem || "";
            imagem.alt = produto.nome || "";

        }


        // ======================================
        // PREENCHE O NOME
        // ======================================

        const nome =
            document.getElementById("produto-nome");

        if (nome)
            nome.textContent = produto.nome || "";


        // ======================================
        // PREENCHE A MARCA
        // ======================================

        const marca =
            document.getElementById("produto-marca");

        if (marca)
            marca.textContent = produto.marca || "";


        // ======================================
        // PREENCHE O PREÇO
        // ======================================

        const preco =
            document.getElementById("produto-preco");

        if (preco)

            preco.textContent =
                "R$ " +
                Number(produto.preco)
                    .toFixed(2)
                    .replace(".", ",");


        // ======================================
        // PREENCHE A CATEGORIA (TIPO)
        // ======================================

        const tipo =
            document.getElementById("produto-tipo");

        const linkTipo =
            document.getElementById("link-tipo");

        if (tipo) {
            tipo.textContent = produto.tipo || "";
        }

        // Configura o link da categoria
        if (linkTipo) {

            linkTipo.href =
                `categoria.html?tipo=${encodeURIComponent(produto.tipo)}`;

        }


        // ======================================
        // BREADCRUMB
        // ======================================

        const bcNome =
            document.getElementById("breadcrumb-nome");

        if (bcNome)
            bcNome.textContent = produto.nome || "";


        // ======================================
        // CAMPOS OPCIONAIS
        // Se estiverem vazios serão ocultados
        // ======================================

        preencherOuOcultar("produto-descricao", produto.descricao);
        preencherOuOcultar("produto-composicao", produto.composicao);
        preencherOuOcultar("produto-anvisa", produto.anvisa);
        preencherOuOcultar("produto-validade", produto.validade);
        preencherOuOcultar("produto-cruelty", produto.crueltyfree);
        preencherOuOcultar("produto-manha", produto.usoManha);
        preencherOuOcultar("produto-noite", produto.usoNoite);
        preencherOuOcultar("produto-usos", produto.usos);


        // ======================================
        // OCULTA TÍTULOS SEM CONTEÚDO
        // ======================================

        const tituloDescricao =
            document.querySelector(".sobre h2");

        if (!produto.descricao && tituloDescricao) {

            tituloDescricao.style.display = "none";

        }

        const tituloUso =
            document.querySelectorAll(".sobre h2")[1];

        if (
            !produto.usos &&
            !produto.usoManha &&
            !produto.usoNoite &&
            tituloUso
        ) {

            tituloUso.style.display = "none";

        }


        // ======================================
        // CONFIGURA O BOTÃO DE ADICIONAR AO CARRINHO
        // ======================================

        const botao =
            document.querySelector(".adc");

        if (botao) {

            botao.dataset.slug = produto.slug;
            botao.dataset.name = produto.nome;
            botao.dataset.price = produto.preco;
            botao.dataset.image = produto.imagem;

            // Informa se o produto possui variações
            botao.dataset.temVariacao =
                produto.variacoes &&
                produto.variacoes.length > 0;
        }


        // ======================================
        // CRIA OS BOTÕES DAS VARIAÇÕES
        // ======================================

        const areaVariacoes =
            document.getElementById("variacoes");

        if (areaVariacoes) {

            if (
                produto.variacoes &&
                produto.variacoes.length > 0
            ) {

                areaVariacoes.innerHTML =
                    "<h3>Escolha uma opção:</h3>";

                produto.variacoes.forEach(v => {

                    const btn =
                        document.createElement("button");

                    btn.textContent = v.nome;
                    btn.className = "btnVariacao";

                    btn.onclick = function () {

                        // Salva a opção escolhida
                        window.variacaoSelecionada = v.nome;

                        // Remove seleção dos demais botões
                        document
                            .querySelectorAll(".btnVariacao")
                            .forEach(b =>
                                b.classList.remove("ativo")
                            );

                        // Destaca o botão clicado
                        btn.classList.add("ativo");

                        // Libera o botão do carrinho
                        const adc =
                            document.querySelector(".adc");

                        adc.disabled = false;
                        adc.innerText =
                            "Adicionar ao Carrinho";
                    };

                    areaVariacoes.appendChild(btn);

                });

            } else {

                // Esconde a área caso não existam variações
                areaVariacoes.style.display = "none";

            }

        }


        // ======================================
        // CONTROLA O BOTÃO DO CARRINHO
        // ======================================

        const botaoCarrinho =
            document.querySelector(".adc");

        if (
            produto.variacoes &&
            produto.variacoes.length > 0
        ) {

            botaoCarrinho.disabled = true;
            botaoCarrinho.innerText =
                "Escolha uma opção";

        } else {

            botaoCarrinho.disabled = false;
            botaoCarrinho.innerText =
                "Adicionar ao Carrinho";

        }


        // ======================================
        // ALTERA O TÍTULO DA ABA DO NAVEGADOR
        // ======================================

        document.title =
            `${produto.nome} | Deyse Makeup`;

    })

    // ======================================
    // TRATAMENTO DE ERROS
    // ======================================

    .catch(error => {

        console.error(error);

        document.querySelector(".quadro").innerHTML =
            "<h1>Erro ao carregar o produto.</h1>";

    });


// =======================================================
// A PARTIR DAQUI É O SLIDER DE PRODUTOS RELACIONADOS
// =======================================================

// Seleciona os elementos do slider
const wrapperProdutos =
    document.querySelector(".slide-wrapper1");

const areaProdutos =
    document.querySelector(".area-produtos");

// Variáveis de controle
let slideAtualProdutos = 0;
let totalSlidesProdutos = 0;


// Embaralha um array aleatoriamente
function embaralhar(array) {

    for (let i = array.length - 1; i > 0; i--) {

        let j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] =
            [array[j], array[i]];
    }

    return array;
}


// Atualiza a posição do slider
function atualizarSliderProdutos() {

    if (!wrapperProdutos || !areaProdutos)
        return;

    let largura =
        areaProdutos.offsetWidth;

    wrapperProdutos.style.transform =
        `translateX(-${slideAtualProdutos * largura}px)`;
}


// Avança um slide
function proximoSlideProdutos() {

    slideAtualProdutos++;

    if (slideAtualProdutos >= totalSlidesProdutos) {

        slideAtualProdutos = 0;

    }

    atualizarSliderProdutos();
}


// Volta um slide
function slideAnteriorProdutos() {

    slideAtualProdutos--;

    if (slideAtualProdutos < 0) {

        slideAtualProdutos =
            totalSlidesProdutos - 1;

    }

    atualizarSliderProdutos();
}


// Cria o slider com produtos da mesma categoria
// excluindo o produto atual
function criarSlider(produtos, tipoAtual, slugAtual) {

    wrapperProdutos.innerHTML = "";

    // Filtra apenas produtos da mesma categoria
    let produtosCategoria =
        produtos.filter(p =>
            p.tipo === tipoAtual &&
            p.slug !== slugAtual
        );

    // Embaralha os produtos
    produtosCategoria =
        embaralhar(produtosCategoria);

    // Divide em grupos de 5 produtos
    for (
        let i = 0;
        i < produtosCategoria.length;
        i += 5
    ) {

        // Cria um slide e seus cartões
        // adicionando-os ao wrapper
    }

    totalSlidesProdutos =
        document.querySelectorAll(".slide1").length;

    slideAtualProdutos = 0;

    atualizarSliderProdutos();
}


// Eventos das setas do slider
document.querySelectorAll(".seta2")
.forEach(botao => {

    botao.addEventListener("click", () => {

        let direcao =
            botao.getAttribute("direcao");

        if (direcao == "frente") {

            proximoSlideProdutos();

        }

        if (direcao == "atras") {

            slideAnteriorProdutos();

        }

    });

});


// Reajusta o slider quando a janela muda de tamanho
window.addEventListener("resize", () => {

    atualizarSliderProdutos();

});


// Obtém novamente o produto atual pela URL
const parametro =
    new URLSearchParams(window.location.search);

const slugAtual =
    parametro.get("produto");

const idAtual =
    parametro.get("id");


// Carrega os produtos relacionados
fetch("produtos.json")
.then(res => res.json())
.then(produtos => {

    let produtoAtual;

    if (slugAtual) {

        produtoAtual =
            produtos.find(
                p => p.slug == slugAtual
            );

    } else {

        produtoAtual =
            produtos.find(
                p => p.id == idAtual
            );

    }

    if (!produtoAtual) return;

    // Cria o slider com produtos semelhantes
    criarSlider(
        produtos,
        produtoAtual.tipo,
        produtoAtual.slug
    );

})
.catch(erro => {

    console.log(erro);

});