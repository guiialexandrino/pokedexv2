/* Importações */
import Utils from './utils.js';

/* Variaveis Globais */

const __pokedexNumber = 23; //486
let __loadingProcess = 0;
let __pokedex = [];
let __pokedexBackup = [];
let __selectedPoke = {};
let __pokesToCompare = [];
let __dialogInfo = false;

/* Elementos Reativos da página */

const body = document.querySelector('body');
const content = document.querySelector('.content');
const header = document.querySelector('.headerNav');
const searchDiv = document.querySelector('.searchPoke');
const input = document.getElementById('show-poke-list');
const loading = document.querySelector('.show_dialog_loading');
const closeInfoButton = document.querySelector('#closeInfoButton');
const addToCompare = document.querySelector('#addToVsMode');
const handleVsMode = document.querySelector('#handleVsMode');
const dialogPokeInfo = document.querySelector('.show_dialog_info');
const corDeFundo = (tipoPokemon) => {
  document.documentElement.style.setProperty(
    '--mainColor',
    Utils.retornaCodigoCorDoTipo(tipoPokemon)
  );
};

/* Dados Reativos */
const _maxContentCards = document.querySelector('#maxContentCards');
const _identificacaoPoke = document.querySelector('#num_nome');
const _fotoPoke = document.querySelector('#foto');
const _fotoPokeMobile = document.querySelector('#fotoMobile');
const _tipoPoke = document.querySelector('#tipo');
const _alturaPoke = document.querySelector('#altura');
const _pesoPoke = document.querySelector('#peso');
const _especiePoke = document.querySelector('#especie');
const _habilidadePoke = document.querySelector('#habilidade');
const _descricaoPoke = document.querySelector('#desc');
const _hpPoke = document.querySelector('#hp');
const _ataquePoke = document.querySelector('#ataque');
const _defesaPoke = document.querySelector('#defesa');
const _ataqueEspecialPoke = document.querySelector('#ataqueE');
const _defesaEspecialPoke = document.querySelector('#defesaE');
const _velocidadePoke = document.querySelector('#velocidade');
const slot1 = document.querySelector('#slot1');
const slot2 = document.querySelector('#slot2');

/* Adiciona Eventos */

_hpPoke.addEventListener('mouseenter', changeStatsInfo);
_ataquePoke.addEventListener('mouseenter', changeStatsInfo);
_defesaPoke.addEventListener('mouseenter', changeStatsInfo);
_ataqueEspecialPoke.addEventListener('mouseenter', changeStatsInfo);
_defesaEspecialPoke.addEventListener('mouseenter', changeStatsInfo);
_velocidadePoke.addEventListener('mouseenter', changeStatsInfo);
closeInfoButton.addEventListener('click', handleCloseInfo);
addToCompare.addEventListener('click', addToComparePoke);
handleVsMode.addEventListener('click', vsMode);
window.addEventListener('resize', resizeWindow);
input.addEventListener('keyup', autoCompleteMethod);
body.addEventListener('click', cleanInput);
window.addEventListener('scroll', scrolling);

/* Métodos para restaurar padrão */

function cleanInput() {
  if (input.value) {
    __pokedex = [...__pokedexBackup];
    createInterface();
  }
  removeElements();
}

dialogPokeInfo.style.top = `${window.pageYOffset + 30}px`;

function scrolling(e) {
  //Condição para mobile e normal atualizar o top do dialogPoke Info
  if (e.target.defaultView.outerWidth > 1000) {
    dialogPokeInfo.style.top = `${window.pageYOffset + 30}px`;
  } else {
    dialogPokeInfo.style.top = `0px`;
  }

  //aparecer nav Header
  if (window.pageYOffset > 220) {
    header.style.transform = 'translateY(0px)';
    document.querySelector('.maxHeaderContent').appendChild(searchDiv);
  } else {
    header.style.transform = 'translateY(-60px)';
    content.insertBefore(searchDiv, content.children[1]);
  }
}

/* Métodos iniciais para carregar pokes */

async function getGeneralInfoPokes(id) {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((response) => {
    __loadingProcess++;

    document.querySelector('#loading-status').innerHTML = `${Math.round(
      (__loadingProcess / (__pokedexNumber * 2)) * 100
    )} %`;

    return response.json();
  });
}

async function addExtraInfo(id) {
  return fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(
    (response) => {
      __loadingProcess++;

      document.querySelector('#loading-status').innerHTML = `${Math.round(
        (__loadingProcess / (__pokedexNumber * 2)) * 100
      )} %`;

      return response.json();
    }
  );
}

async function getPokedex() {
  const pokemonPromises = [];
  const pokemonInfoPromises = [];

  loading.style.display = 'flex';
  for (let i = 1; i <= __pokedexNumber; i++) {
    pokemonPromises.push(getGeneralInfoPokes(i));
  }

  await Promise.all(pokemonPromises).then((pokes) => {
    __pokedex = pokes;
  });

  for (let i = 1; i <= __pokedexNumber; i++) {
    pokemonInfoPromises.push(addExtraInfo(i));
  }

  await Promise.all(pokemonInfoPromises).then((infoPokes) => {
    infoPokes.forEach((poke, index) => {
      Object.assign(__pokedex[index], {
        genera: poke.genera,
        flavor_text_entries: poke.flavor_text_entries,
      });
    });
  });

  for (let i in __pokedex) {
    __pokedex[i].name =
      __pokedex[i].name[0].toUpperCase() + __pokedex[i].name.substring(1);
    __pokedex[i].idNumber = Number(i) + 1;
  }
  createInterface();
}

function createInterface() {
  // removeElements();
  setTimeout(() => (loading.style.display = 'none'), 300);
  const utils = Utils.retornaMiniCards(__pokedex);
  _maxContentCards.innerHTML = utils.html;

  // Adiciona eventos para mini card
  utils.idPoke.forEach((poke, index) => {
    const card = document.querySelector(`#${poke.name}`);
    const info = document.querySelector(`#${poke.name}-info`);
    const number = document.querySelector(`#${poke.name}-number`);

    let cor = Utils.retornaCodigoCorDoTipo(poke.type);

    card.addEventListener('mouseenter', () => {
      card.style.background = cor;
      if (Utils.mudaCorTexto(poke.type) === 'white') {
        info.classList.add('addWhiteColor');
        number.classList.add('addWhiteColor');
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.background = 'white';
      info.style.background = 'none';
      info.classList.remove('addWhiteColor');
      number.classList.remove('addWhiteColor');
    });

    card.addEventListener('click', (e) => {
      showInfoCard(poke, index, e);
    });
  });
}

function showInfoCard(poke, index, e) {
  __selectedPoke = { ...poke, id: index };
  if (e.view.outerWidth <= 1000) {
    body.style.overflowY = 'scroll';
    body.style.overflowX = 'hidden';
    content.style.display = 'none';
    body.scrollIntoView();
  } else {
    body.style.overflowY = 'hidden';
    body.style.overflowX = 'hidden';
    content.style.display = 'flex';
  }

  const showPokeInfo = __pokedex[__selectedPoke.id];
  loadPokeInfo(showPokeInfo);

  //exibe dados ao clicar no card
  __dialogInfo = true;
  dialogPokeInfo.style.display = 'flex';
  header.style.transform = 'translateY(0px)';
  if (window.pageYOffset < 220) {
    document.querySelector('.maxHeaderContent').appendChild(searchDiv);
  }
}

function loadPokeInfo(pokemon) {
  removeElements();

  _descricaoPoke.innerHTML = pokemon.flavor_text_entries[8].flavor_text.replace(
    /\n/g,
    ' '
  );

  const especie = pokemon.genera.find((item) => {
    if (item.language.name === 'en') return item.genus;
  }).genus;

  _especiePoke.innerHTML = especie.split('Pokémon')[0];

  _fotoPoke.src = pokemon.sprites.other['official-artwork'].front_default;

  _fotoPokeMobile.src = pokemon.sprites.other['official-artwork'].front_default;

  _identificacaoPoke.innerHTML = `#${pokemon.id} - ${
    pokemon.name[0].toUpperCase() +
    pokemon.name.substring(1, pokemon.name.length)
  }`;

  const tiposEncontrados = pokemon.types.map((item) => {
    return item.type.name;
  });
  _tipoPoke.innerHTML = Utils.retornaTipos(tiposEncontrados);

  corDeFundo(tiposEncontrados[0]); // muda cor de fundo

  _alturaPoke.innerHTML = pokemon.height / 10 + 'm';

  _pesoPoke.innerHTML = pokemon.weight / 10 + ' kgs';

  const habilidadesEncontradas = pokemon.abilities.map((item) => {
    return item.ability.name;
  });
  _habilidadePoke.innerHTML = Utils.retornaHabilidades(habilidadesEncontradas);

  _hpPoke.value = pokemon.stats[0].base_stat;
  _ataquePoke.value = pokemon.stats[1].base_stat;
  _defesaPoke.value = pokemon.stats[2].base_stat;
  _ataqueEspecialPoke.value = pokemon.stats[3].base_stat;
  _defesaEspecialPoke.value = pokemon.stats[4].base_stat;
  _velocidadePoke.value = pokemon.stats[5].base_stat;

  //verificar se o pokemon voa, inserir animação
  verificaVoador(tiposEncontrados, habilidadesEncontradas);

  /* tratamento para outliers */
  tratamentoOutliers();
}

function changeStatsInfo(e) {
  let info = '';
  if (e.srcElement.id === 'hp') info = `"${_hpPoke.value}"`;
  if (e.srcElement.id === 'ataque') info = `"${_ataquePoke.value}"`;
  if (e.srcElement.id === 'defesa') info = `"${_defesaPoke.value}"`;
  if (e.srcElement.id === 'ataqueE') info = `"${_ataqueEspecialPoke.value}"`;
  if (e.srcElement.id === 'defesaE') info = `"${_defesaEspecialPoke.value}"`;
  if (e.srcElement.id === 'velocidade') info = `"${_velocidadePoke.value}"`;

  document.documentElement.style.setProperty('--statsText', info);
}

function handleCloseInfo(e) {
  if (__dialogInfo) {
    dialogPokeInfo.style.display = 'none';
    content.style.display = 'flex';
    body.style.overflowY = 'scroll';
    document.documentElement.style.setProperty(
      '--mainColor',
      `rgba(23, 26, 51, 0.95)`
    );

    if (e.view.outerWidth <= 1000) {
      const el = document.querySelector(`#${__selectedPoke.name}`);
      el.scrollIntoView();
      window.scrollTo(0, window.scrollY - 100);
    }

    if (input.value) {
      __pokedex = [...__pokedexBackup];
      createInterface();
    }

    if (window.pageYOffset < 220) {
      header.style.transform = 'translateY(-60px)';
      document.querySelector('.maxHeaderContent').appendChild(searchDiv);
      content.insertBefore(searchDiv, content.children[1]);
    }

    __dialogInfo = false;
  }
}

function resizeWindow(e) {
  const event = { view: e.currentTarget };
  handleCloseInfo(event);
}

function verificaVoador(arrayTipos, arrayHabilidades) {
  if (arrayTipos.includes('flying') || arrayHabilidades.includes('levitate')) {
    _fotoPoke.style.animation = 'flyingPoke 2s ease-in-out infinite';
    _fotoPokeMobile.style.animation = 'flyingPoke 2s ease-in-out infinite';
  } else {
    _fotoPoke.style.animation = '';
    _fotoPokeMobile.style.animation = '';
  }
}

function tratamentoOutliers() {
  _defesaPoke.max = 230;
  _defesaEspecialPoke.max = 230;
  _hpPoke.max = 255;

  if (_defesaPoke.value >= 180) {
    _defesaPoke.classList.add('progress-black');
    _defesaPoke.classList.add('progress-star');
  } else {
    _defesaPoke.classList.remove('progress-black');
    _defesaPoke.classList.remove('progress-star');
    _defesaPoke.max = 170;
  }

  if (_defesaEspecialPoke.value >= 200) {
    _defesaEspecialPoke.classList.add('progress-black');
    _defesaEspecialPoke.classList.add('progress-star');
  } else {
    _defesaEspecialPoke.classList.remove('progress-black');
    _defesaEspecialPoke.classList.remove('progress-star');
    _defesaEspecialPoke.max = 170;
  }

  if (_hpPoke.value >= 170) {
    _hpPoke.classList.add('progress-black');
    _hpPoke.classList.add('progress-star');
  } else {
    _hpPoke.classList.remove('progress-black');
    _hpPoke.classList.remove('progress-star');
    _hpPoke.max = 170;
  }
}

//Auto complete Methods
function autoCompleteMethod() {
  __pokedex = [...__pokedexBackup];

  if (input.value === '') {
    createInterface();
    removeElements();
    return;
  }

  removeElements();
  for (let i of __pokedex) {
    //convert input to lowercase and compare with each string

    if (
      i.name.toLowerCase().startsWith(input.value.toLowerCase()) &&
      input.value != ''
    ) {
      //create li element
      let listItem = document.createElement('li');

      //One common class name
      listItem.classList.add('list-items');
      listItem.style.cursor = 'pointer';
      listItem.onclick = function (e) {
        displayNames(i.name, e);
      };

      //Display matched part in bold
      let word = '<b>' + i.name.substr(0, input.value.length) + '</b>';
      word += i.name.substr(input.value.length);

      //display the value in array
      listItem.innerHTML = word;
      document.querySelector('.list').appendChild(listItem);
    }
  }
}

function displayNames(value, e) {
  input.value = value;
  const showSearch = __pokedex.filter(
    (poke) =>
      poke.name.toLowerCase().startsWith(input.value.toLowerCase()) &&
      input.value != ''
  );
  __pokedex = showSearch;

  // const el = document.querySelector(`#${__pokedex[0].name}`);
  // el.scrollIntoView();
  // window.scrollTo(0, window.scrollY - 100);
  header.style.transform = 'translateY(-60px)';

  showInfoCard(__pokedex[0], 0, e);
  removeElements();
}

function removeElements() {
  let items = document.querySelectorAll('.list-items');
  items.forEach((item) => {
    item.remove();
  });
}

/* VS MODE Methods */
function addToComparePoke() {
  const check = __pokesToCompare.filter((poke) => {
    return poke.name === __selectedPoke.name;
  });

  if (check.length === 0) {
    const searchPoke = __pokedexBackup.find((poke) => {
      return poke.name === __selectedPoke.name;
    });

    if (__pokesToCompare.length < 2) {
      __pokesToCompare.push(searchPoke);
      const htmlUpdate = Utils.updateVsModeFooter(__pokesToCompare);

      slot1.innerHTML = htmlUpdate.poke1;
      document.querySelector('#slot1-del').addEventListener('click', (e) => {
        deletePokeOfSlot(e, 1);
      });

      slot2.innerHTML = htmlUpdate.poke2;
      if (htmlUpdate.poke2 !== 'Sem pokémon')
        document.querySelector('#slot2-del').addEventListener('click', (e) => {
          deletePokeOfSlot(e, 2);
        });

      if (__pokesToCompare.length === 2) handleVsMode.disabled = false;

      return;
    }

    if (__pokesToCompare.length === 2) {
      __pokesToCompare[0] = __pokesToCompare[1];
      __pokesToCompare[1] = searchPoke;
      const htmlUpdate = Utils.updateVsModeFooter(__pokesToCompare);

      slot1.innerHTML = htmlUpdate.poke1;
      document.querySelector('#slot1-del').addEventListener('click', (e) => {
        deletePokeOfSlot(e, 1);
      });

      slot2.innerHTML = htmlUpdate.poke2;
      document.querySelector('#slot2-del').addEventListener('click', (e) => {
        deletePokeOfSlot(e, 2);
      });
    }
  }
}

function deletePokeOfSlot(e, slot) {
  const pokemon = e.target.parentNode.innerHTML.split(' <div');
  __pokesToCompare = __pokesToCompare.filter((poke) => {
    return poke.name !== pokemon[0];
  });
  if (slot === 1) slot1.innerHTML = 'Sem Pokémon';
  else slot2.innerHTML = 'Sem Pokémon';
  handleVsMode.disabled = true;
}

function vsMode() {
  console.log('clicou para comparar pokemons');
}

/* Chama Método Inicial para carregar lista de pokes*/

await getPokedex();
__pokedexBackup = [...__pokedex]; // cópia - para resetar as buscas
