var pokemonRepository = (() => {
  var repository = [];
  var apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  function loadList() {
    return $.ajax(apiUrl, {
        dataType: 'json'
      })
      .then(pokemonList => {
        var response = pokemonList.results;
        response.forEach((item, index) => {
          const nameCapitalized = item.name.charAt(0).toUpperCase() + item.name.slice(1)
          var pokemon = {
            name: nameCapitalized,
            detailsUrl: item.url,
            index: index + 1
          };
          add(pokemon);
        });
      }).catch(err => {
        console.log(err);
      });
  }

  function add(item) {
    repository.push(item);
  }

  function loadDetails(item) {
    var url = item.detailsUrl;

    return $.ajax(url, {
        dataType: 'json'
      })
      .then(details => {
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
      }).catch(err => console.log(err))
  }

  function addListItem(pokemon) {
    var $pokemonList = $("ul.pokemon-list");
    var $listItem = $("<li class='list-group-item'></li>");
    var $button = $("<button class='btn btn-primary' data-toggle='modal' data-target='#pokemon-modal'></button>");

    $button.text(pokemon.index + ". " + pokemon.name);
    $button.addClass("list-button");
    $pokemonList.append($listItem);
    $listItem.append($button)
    addListener($button, pokemon);
  }

  function addListener(button, pokemon) {
    button.on("click", () => {
      showDetails(pokemon);
    });
  }

  function showDetails(item) {
    var $pokemonName = $(".pokemon-name");
    var $pokemonImg = $(".pokemon-img");
    var $pokemonHeight = $(".pokemon-height");

    pokemonRepository.loadDetails(item)
      .then(() => {
        $pokemonName.text(item.name);
        $pokemonImg.attr("src", item.imageUrl);
        $pokemonHeight.text(item.height);
      });
  }

  function getAll() {
    return repository;
  }

  return {
    loadList: loadList,
    loadDetails: loadDetails,
    addListItem: addListItem,
    getAll: getAll
  };
})();

pokemonRepository.loadList()
  .then(() => {
    pokemonRepository.getAll().forEach(pokemon => {
      pokemonRepository.addListItem(pokemon);
    });
  });