// ======================================
// CARREGA OS PRODUTOS E FILTRA PELA CATEGORIA
// ======================================

fetch("produtos.json")
  // Converte a resposta em JSON
  .then(res => res.json())

  // Recebe o array de produtos
  .then(produtos => {

    // Obtém os parâmetros da URL
    const params = new URLSearchParams(window.location.search);

    // Captura o tipo da categoria
    const categoriaAtual = params.get("tipo");

    // Exibe o nome da categoria na página
    document.getElementById("categoria-atual").textContent =
      categoriaAtual || "Produtos";

    // Seleciona o container onde os produtos serão inseridos
    const container = document.getElementById("lista-produtos");

    // Limpa o conteúdo existente
    container.innerHTML = "";

    // Filtra apenas os produtos da categoria atual
    const produtosFiltrados = produtos.filter(produto =>
      produto.tipo.toLowerCase() === categoriaAtual.toLowerCase()
    );

    // Cria um cartão para cada produto encontrado
    produtosFiltrados.forEach(produto => {

      const card = document.createElement("div");

      card.classList.add("produto-card");

      card.innerHTML = `
        <a href="${produto.link}">
          <img
            src="${produto.imagem}"
            alt="${produto.nome}"
            class="produto"
          >

          <h2>
            <em>${produto.marca}</em>
          </h2>

          <p>
            ${produto.nome}
            <br>
            ${produto.preco}
          </p>
        </a>
      `;

      // Adiciona o cartão ao container
      container.appendChild(card);
    });
  });


// ======================================
// FUNÇÃO PARA EXIBIR PRODUTOS NA TELA
// ======================================

function exibirProdutos(produtos) {

  // Seleciona o container principal
  const container =
    document.getElementById("lista-produtos");

  // Limpa os produtos exibidos anteriormente
  container.innerHTML = "";

  // Percorre todos os produtos recebidos
  produtos.forEach(produto => {

    // Cria um cartão
    const card =
      document.createElement("div");

    card.classList.add("produto-card");

    // Monta o HTML do produto
    card.innerHTML = `
      <a href="produto.html?produto=${produto.slug}">

        <img
          src="${produto.imagem}"
          alt="${produto.nome}"
          class="produto"
        >

        <h2>
          ${produto.nome}
        </h2>

        <p>
          ${produto.marca}
          <br>

          R$ ${produto.preco
            .toFixed(2)
            .replace(".", ",")}
        </p>

      </a>
    `;

    // Adiciona o cartão na página
    container.appendChild(card);
  });
}


// ======================================
// CARREGA OS PRODUTOS E IMPLEMENTA A ORDENAÇÃO
// ======================================

fetch("produtos.json")

  // Converte a resposta em JSON
  .then(res => res.json())

  // Recebe os produtos
  .then(produtos => {

    // Obtém novamente a categoria atual pela URL
    const categoriaAtual =
      new URLSearchParams(window.location.search)
        .get("tipo");

    // Filtra apenas os produtos dessa categoria
    const produtosFiltrados = produtos.filter(
      produto =>
        produto.tipo.toLowerCase() ===
        categoriaAtual.toLowerCase()
    );

    // Exibe inicialmente os produtos filtrados
    exibirProdutos(produtosFiltrados);

    // Evento do seletor de ordenação
    document
      .getElementById("ordenar")
      .addEventListener("change", function () {

        // Cria uma cópia para não alterar o array original
        const produtosOrdenados =
          [...produtosFiltrados];

        // Verifica a opção escolhida
        switch (this.value) {

          // Ordena por nome
          case "nome":

            produtosOrdenados.sort(
              (a, b) =>
                a.nome.localeCompare(b.nome)
            );

            break;

          // Ordena por marca
          case "marca":

            produtosOrdenados.sort(
              (a, b) =>
                a.marca.localeCompare(b.marca)
            );

            break;

          // Ordena do menor para o maior preço
          case "menor-preco":

            produtosOrdenados.sort(
              (a, b) =>
                a.preco - b.preco
            );

            break;

          // Ordena do maior para o menor preço
          case "maior-preco":

            produtosOrdenados.sort(
              (a, b) =>
                b.preco - a.preco
            );

            break;
        }

        // Atualiza a lista exibida
        exibirProdutos(produtosOrdenados);

      });

  });