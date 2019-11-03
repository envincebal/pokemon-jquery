var pokemonRepository = (() => {
  var repository = [];
  var apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
  var $modalContainer = $('.modal');
  var $overlay = $(".overlay");

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
    var $pokemonList = $("ul");
    var $listItem = $("<li></li>");
    var $button = $("<button></button>");

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
        $modalContainer.addClass("modal-visible");
        $overlay.addClass("overlay-visible");
        $modalContainer.removeClass("modal");
        $pokemonName.text(item.name);
        $pokemonImg.attr("src", item.imageUrl);
        $pokemonHeight.text(item.height);
      });
  }

  function hideDetails() {
    $modalContainer.removeClass("modal-visible");
    $overlay.removeClass("overlay-visible");
    $modalContainer.addClass("modal");
  }

  $(".modal-close").on("click", () => {
    hideDetails();
  });

  $(window).on('keydown', (e) => {
    if (e.key === 'Escape' && $modalContainer.hasClass('modal-visible')) {
      hideDetails();
    }
  });

  $overlay.on('click', (e) => {
    var target = $(e.target);

    if (target.hasClass("overlay")) {
      hideDetails();
    }
  });

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