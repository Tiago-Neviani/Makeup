// Aguarda todo o HTML ser carregado antes de executar o código
document.addEventListener("DOMContentLoaded", () => {

    // ==================================
    // SLIDESHOW PRINCIPAL
    // ==================================

    // Seleciona os elementos do slideshow
    const containerSlider = document.querySelector(".slide-wrapper");
    const dots = document.querySelectorAll("#slideshow .dots");
    const slideshow = document.querySelector("#slideshow");

    // Controlam o slide atual e o último slide exibido
    let slideAtual = 0;
    let slideBackup = 0;

    // Move o slideshow para o slide indicado
    function proximoSlide(indice) {

        // Se os elementos não existirem, encerra a função
        if (!containerSlider || !slideshow) return;

        // Obtém a largura do slideshow
        let largura = slideshow.offsetWidth;

        // Move horizontalmente o container
        containerSlider.style.transform =
            `translateX(-${largura * indice}px)`;

        // Remove a seleção dos indicadores
        dots.forEach(dot => {
            dot.classList.remove("select-dot");
        });

        // Marca o indicador do slide atual
        if (dots[indice]) {
            dots[indice].classList.add("select-dot");
        }
    }

    // Evento de clique nos indicadores inferiores
    dots.forEach(dot => {

        dot.addEventListener("click", () => {

            const pg = parseInt(dot.id);

            slideAtual = pg;
            slideBackup = pg;

            proximoSlide(pg);

        });

    });

    // Evento das setas do slideshow
    document.querySelectorAll("#slideshow .seta").forEach(seta => {

        seta.addEventListener("click", () => {

            let direcao = seta.getAttribute("direcao");

            // Pausa a rotação automática
            slideAtual = "pausa";

            if (direcao === "frente") {

                slideBackup++;

                // Volta ao primeiro slide quando chegar ao último
                if (slideBackup > 3) {
                    slideBackup = 0;
                }

            } else {

                slideBackup--;

                // Vai para o último ao voltar antes do primeiro
                if (slideBackup < 0) {
                    slideBackup = 3;
                }

            }

            proximoSlide(slideBackup);

        });

    });

    // Pausa o slideshow ao passar o mouse
    if (slideshow) {

        slideshow.addEventListener("mouseenter", () => {

            slideAtual = "pausa";

        });

        // Retoma ao retirar o mouse
        slideshow.addEventListener("mouseleave", () => {

            slideAtual = slideBackup;

        });

    }

    // Troca automática de slide a cada 5 segundos
    setInterval(() => {

        if (slideAtual !== "pausa") {

            slideAtual++;

            if (slideAtual > 3) {
                slideAtual = 0;
            }

            proximoSlide(slideAtual);

            slideBackup = slideAtual;

        }

    }, 5000);


    // ==================================
    // SLIDER "QUERIDINHOS"
    // ==================================

    // Seleciona os elementos do slider
    const wrapperProdutos = document.querySelector(".slide-wrapper1");
    const areaProdutos = document.querySelector(".area-produtos");

    let slideAtualProdutos = 0;
    let totalSlidesProdutos = 0;
    let produtosCache = [];

    // Define quantos produtos aparecem por slide
    function quantidadeProdutos(){
        return 5;
    }

    // Embaralha um array aleatoriamente
    function embaralhar(array){
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Atualiza a posição do slider
    function atualizarSlider1(){
        if (!wrapperProdutos || !areaProdutos) return;

        let largura = areaProdutos.offsetWidth;

        wrapperProdutos.style.transform =
            `translateX(-${slideAtualProdutos * largura}px)`;
    }

    // Avança um slide
    function proximoSlide1(){

        if (slideAtualProdutos < totalSlidesProdutos - 1) {
            slideAtualProdutos++;
        } else {
            slideAtualProdutos = 0;
        }

        atualizarSlider1();
    }

    // Retorna um slide
    function slideAnterior1(){

        if (slideAtualProdutos > 0) {
            slideAtualProdutos--;
        } else {
            slideAtualProdutos = totalSlidesProdutos - 1;
        }

        atualizarSlider1();
    }

    // Cria dinamicamente o slider usando produtos.json
    function criarSlider(produtos){

        // Limpa o conteúdo existente
        wrapperProdutos.innerHTML = "";

        // Embaralha e seleciona apenas 10 produtos
        produtosCache = embaralhar([...produtos]).slice(0, 10);

        let produtosPorSlide = quantidadeProdutos();

        // Cria um slide para cada grupo de produtos
        for (let i = 0; i < produtosCache.length; i += produtosPorSlide){

            let slide = document.createElement("div");
            slide.className = "slide1";

            let produtosDiv = document.createElement("div");
            produtosDiv.className = "produtos";

            let grupo = produtosCache.slice(i, i + produtosPorSlide);

            // Cria o card de cada produto
            grupo.forEach(produto => {

                let card = document.createElement("div");
                card.className = "produto-card";

                card.innerHTML = `
                    <a href="produto.html?produto=${produto.slug}">
                        <img src="${produto.imagem}" alt="${produto.nome}">
                        <h2>${produto.nome}</h2>
                        <p><em>${produto.marca}</em></p>
                        <p>R$ ${Number(produto.preco).toFixed(2).replace(".", ",")}</p>
                    </a>
                `;

                produtosDiv.appendChild(card);

            });

            slide.appendChild(produtosDiv);
            wrapperProdutos.appendChild(slide);
        }

        // Conta quantos slides foram criados
        totalSlidesProdutos =
            document.querySelectorAll(".slide-wrapper1 .slide1").length;

        slideAtualProdutos = 0;

        atualizarSlider1();
    }

    // Eventos das setas do slider
    document.querySelectorAll(".seta2").forEach(botao => {

        botao.addEventListener("click", () => {

            let direcao = botao.getAttribute("direcao");

            if (direcao === "frente")
                proximoSlide1();
            else
                slideAnterior1();

        });

    });

    // Busca os produtos no arquivo JSON
    fetch("produtos.json")
        .then(res => res.json())
        .then(produtos => {

            criarSlider(produtos);

        })
        .catch(erro => {

            console.error(
                "Erro ao carregar produtos:",
                erro
            );

        });

});


// ==================================
// SLIDER DE PRODUTOS NOVOS
// ==================================

// Seleciona os elementos do segundo slider
const wrapperProdutos2 =
    document.querySelector(".slide-wrapper2");

const areaProdutos2 =
    document.querySelector(".area-produtos2");

let slideAtual2 = 0;
let totalSlides2 = 0;

// Quantidade de produtos por slide
function quantidadeProdutos2() {
    return 5;
}

// Atualiza a posição do slider
function atualizarSlider2() {

    if (!wrapperProdutos2 || !areaProdutos2) return;

    let largura = areaProdutos2.offsetWidth;

    wrapperProdutos2.style.transform =
        `translateX(-${slideAtual2 * largura}px)`;
}

// Avança um slide
function proximoSlide2() {

    slideAtual2++;

    if (slideAtual2 >= totalSlides2) {
        slideAtual2 = 0;
    }

    atualizarSlider2();
}

// Retorna um slide
function slideAnterior2() {

    slideAtual2--;

    if (slideAtual2 < 0) {
        slideAtual2 = totalSlides2 - 1;
    }

    atualizarSlider2();
}

// Cria o slider mostrando os produtos mais recentes
function criarSliderNovos(produtos) {

    wrapperProdutos2.innerHTML = "";

    // Ordena pelo ID em ordem decrescente
    let produtosNovos = [...produtos]
        .sort((a, b) => b.id - a.id)
        .slice(0, 10);

    let produtosPorSlide = quantidadeProdutos2();

    // Divide os produtos em grupos
    for (
        let i = 0;
        i < produtosNovos.length;
        i += produtosPorSlide
    ) {

        let slide = document.createElement("div");
        slide.className = "slide1";

        let produtosDiv = document.createElement("div");
        produtosDiv.className = "produtos";

        let grupo =
            produtosNovos.slice(
                i,
                i + produtosPorSlide
            );

        // Cria os cartões dos produtos
        grupo.forEach(produto => {

            let card =
                document.createElement("div");

            card.className = "produto-card";

            card.innerHTML = `
                <a href="produto.html?produto=${produto.slug}">
                    <img
                        src="${produto.imagem}"
                        alt="${produto.nome}"
                        class="produto"
                    >

                    <h2>${produto.nome}</h2>

                    <p>
                        <em>${produto.marca}</em>
                    </p>

                    <p>
                        R$ ${Number(produto.preco)
                            .toFixed(2)
                            .replace(".", ",")}
                    </p>
                </a>
            `;

            produtosDiv.appendChild(card);

        });

        slide.appendChild(produtosDiv);

        wrapperProdutos2.appendChild(slide);
    }

    // Atualiza a quantidade de slides
    totalSlides2 =
        wrapperProdutos2.querySelectorAll(".slide1").length;

    slideAtual2 = 0;

    atualizarSlider2();
}

// Eventos das setas do segundo slider
document.querySelectorAll(".seta3")
.forEach(botao => {

    botao.addEventListener("click", () => {

        let direcao =
            botao.getAttribute("direcao");

        if (direcao === "frente") {
            proximoSlide2();
        }

        if (direcao === "atras") {
            slideAnterior2();
        }

    });

});

// Recria o slider ao redimensionar a janela
window.addEventListener("resize", () => {

    fetch("produtos.json")
    .then(res => res.json())
    .then(produtos => {

        criarSliderNovos(produtos);

    });

});

// Carrega inicialmente os produtos do slider
fetch("produtos.json")
.then(res => res.json())
.then(produtos => {

    criarSliderNovos(produtos);

})
.catch(erro => {

    console.error(
        "Erro ao carregar produtos:",
        erro
    );

});