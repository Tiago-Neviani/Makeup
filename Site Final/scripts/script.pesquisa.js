// Carrega o arquivo produtos.json
fetch("produtos.json")
  // Converte a resposta para JSON
  .then(res => res.json())

  // Recebe o array de produtos
  .then(produtos => {

    // Seleciona a lista onde os produtos serão exibidos
    const ul = document.getElementById("Lista_Pro");

    // Percorre todos os produtos
    produtos.forEach(produto => {

      // Cria um elemento <li> para cada produto
      const li = document.createElement("li");

      // Monta o conteúdo do item
      li.innerHTML = `
        <a href="produto.html?produto=${produto.slug}">
          <img src="${produto.imagem}">
          
          <div class="info-produto">
            <strong>${produto.nome}</strong>
            <span class="marca">${produto.marca}</span>
          </div>

          <span class="preco">
            R$ ${produto.preco.toFixed(2).replace(".", ",")}
          </span>
        </a>
      `;

      // Adiciona o item na lista
      ul.appendChild(li);
    });
  });


// ======================================
// FUNÇÃO DE FILTRAGEM DA PESQUISA
// ======================================

function filtrar() {

  // Declaração das variáveis utilizadas
  var input,
      filter,
      ul,
      li,
      a,
      i,
      span,
      txtValue,
      count = 0;

  // Obtém o campo de pesquisa
  input = document.getElementById('Buscador');

  // Converte o texto digitado para maiúsculas
  // para tornar a pesquisa insensível a letras maiúsculas/minúsculas
  filter = input.value.toUpperCase();

  // Seleciona a lista de produtos
  ul = document.getElementById('Lista_Pro');

  // Obtém todos os itens da lista
  li = ul.getElementsByTagName("li");

  // ======================================
  // CASO O CAMPO DE PESQUISA ESTEJA VAZIO
  // ======================================

  if (filter === "") {

    // Esconde completamente a lista
    ul.style.display = "none";

    // Oculta todos os itens individualmente
    for (i = 0; i < li.length; i++) {
      li[i].style.display = "none";
    }

    return;
  }

  // Reinicia o contador de resultados encontrados
  count = 0;

  // Percorre todos os produtos cadastrados
  for (i = 0; i < li.length; i++) {

    // Obtém o link do produto
    a = li[i].getElementsByTagName("a")[0];

    // Captura todo o texto presente no item
    txtValue = a.textContent || a.innerText;

    // Verifica se o texto pesquisado existe no item
    // e limita a exibição a no máximo 10 resultados
    if (
      txtValue.toUpperCase().indexOf(filter) > -1 &&
      count < 10
    ) {

      // Exibe o produto correspondente
      li[i].style.display = "";

      // Incrementa a quantidade de resultados exibidos
      count++;

    } else {

      // Oculta os produtos que não correspondem à pesquisa
      li[i].style.display = "none";

    }
  }

  // ======================================
  // MOSTRA OU ESCONDE A LISTA FINAL
  // ======================================

  // Se nenhum produto foi encontrado, esconde a lista
  if (count === 0) {

    ul.style.display = "none";

  } else {

    // Caso contrário, exibe a lista com os resultados
    ul.style.display = "block";

  }
}