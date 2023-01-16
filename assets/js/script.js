/* Importações */
import Utils from './utils.js';

/* Variaveis Globais */

const __pokedexNumber = 251;
let __pokedex = [];
let __pokedexBackup = [];
let __selectedPoke = {};
let __clickPosition = {};
let __dialogInfo = false;

/* Elementos Reativos da página */

const body = document.querySelector('body');
const content = document.querySelector('.content');
const input = document.getElementById('show-poke-list');
const loading = document.querySelector('.show_dialog_loading');
const closeInfoButton = document.querySelector('#closeInfoButton');
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

/* Adiciona Eventos */

_hpPoke.addEventListener('mouseenter', changeStatsInfo);
_ataquePoke.addEventListener('mouseenter', changeStatsInfo);
_defesaPoke.addEventListener('mouseenter', changeStatsInfo);
_ataqueEspecialPoke.addEventListener('mouseenter', changeStatsInfo);
_defesaEspecialPoke.addEventListener('mouseenter', changeStatsInfo);
_velocidadePoke.addEventListener('mouseenter', changeStatsInfo);
closeInfoButton.addEventListener('click', handleCloseInfo);
window.addEventListener('resize', resizeWindow);
input.addEventListener('keyup', autoCompleteMethod);
body.addEventListener('click', () => removeElements());

/* Métodos iniciais para carregar pokes */

async function getGeneralInfoPokes(id) {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((response) =>
    response.json()
  );
}

async function addExtraInfo(pokedexArray, id) {
  return fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
    .then((response) => response.json())
    .then((info) =>
      Object.assign(pokedexArray[id - 1], {
        genera: info.genera,
        flavor_text_entries: info.flavor_text_entries,
      })
    );
}

async function getPokedex() {
  for (let i = 1; i <= __pokedexNumber; i++) {
    loading.style.display = 'flex';
    try {
      __pokedex.push(await getGeneralInfoPokes(i));
      await addExtraInfo(__pokedex, i);
      document.querySelector('#loading-status').innerHTML = `${Math.round(
        (i / __pokedexNumber) * 100
      )} %`;
    } catch (error) {
      console.error(error);
    }
  }

  for (let i in __pokedex) {
    __pokedex[i].name =
      __pokedex[i].name[0].toUpperCase() + __pokedex[i].name.substring(1);
    __pokedex[i].idNumber = Number(i) + 1;
  }

  createInterface();
}

function createInterface() {
  loading.style.display = 'none';
  const utils = Utils.retornaMiniCards(__pokedex);
  _maxContentCards.innerHTML = utils.html;

  // Adiciona eventos para mini card
  utils.idPoke.forEach((poke, index) => {
    const card = document.querySelector(`#${poke.name}`);
    const info = document.querySelector(`#${poke.name}-info`);

    let cor = Utils.retornaCodigoCorDoTipo(poke.type);

    let fixColor = cor.split(',');
    fixColor[fixColor.length - 1] = ' 0.2)';
    const finalColor = fixColor.join(',');

    card.addEventListener('mouseenter', () => {
      card.style.background = cor;
      info.style.background = 'rgba(255,255,255,0.5)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.background = 'white';
      info.style.background = finalColor;
    });

    card.addEventListener('click', (e) => {
      showInfoCard(poke, index, card, e);
    });
  });
}

function showInfoCard(poke, index, card, e) {
  __selectedPoke = { ...poke, id: index };
  if (e.view.outerWidth <= 1000) {
    body.style.overflowY = 'scroll';
    body.style.overflowX = 'hidden';
    content.style.display = 'none';
  } else {
    body.style.overflowY = 'hidden';
    body.style.overflowX = 'hidden';
    content.style.display = 'flex';
  }
  __dialogInfo = true;

  const clickYAxis = e.pageY; // Posição do eixo Y do Click
  const differenceClickYAxis = e.offsetY; // diferença entre o click no eixo Y e onde o elemento começa no eixo Y.
  const scrollingTotal = window.document.documentElement.scrollHeight; // total de scroll da pagina
  const windowUserNavigatorHeight = window.innerHeight; // altura da janela navegador do usuário
  const actualScroll = e.view.scrollY; // quanto de scroll atual

  // correção do .top
  __clickPosition = {
    card: card,
    position: clickYAxis - differenceClickYAxis,
  };

  dialogPokeInfo.style.top = `${__clickPosition.position}px`;

  // correção para exibição dos cards quando no fim do scroll!
  if (
    !(__clickPosition.position + windowUserNavigatorHeight <= scrollingTotal)
  ) {
    dialogPokeInfo.style.top = `${
      scrollingTotal - windowUserNavigatorHeight
    }px`;
  }

  card.scrollIntoView();
  handlePoke();
}

/* Chama Método Inicial para carregar lista de pokes*/

await getPokedex();
__pokedexBackup = [...__pokedex]; // cópia - para resetar as buscas

/* Métodos ao clicar no poke para visualizar detalhes */

function handlePoke() {
  const poke = __pokedex[__selectedPoke.id];
  loadPokeInfo(poke);
  //colocar animação no dialog
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

  dialogPokeInfo.style.display = 'flex';
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

function handleCloseInfo() {
  resizeWindow();
}

function resizeWindow() {
  if (__dialogInfo) {
    dialogPokeInfo.style.display = 'none';
    content.style.display = 'flex';
    body.style.overflowY = 'scroll';
    __clickPosition.card.scrollIntoView();
    document.documentElement.style.setProperty(
      '--mainColor',
      `rgba(61, 64, 168, 0.9)`
    );
    __dialogInfo = false;
  }
}

function verificaVoadorMiniCard(arrayTipos, arrayHabilidades, poke) {
  if (arrayTipos.includes('flying') || arrayHabilidades.includes('levitate'))
    _fotoPoke.style.animation = 'flyingPoke 2s ease-in-out infinite';
  else _fotoPoke.style.animation = '';
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
      listItem.onclick = function () {
        displayNames(i.name);
      };

      //Display matched part in bold
      let word = '<b>' + i.name.substr(0, input.value.length) + '</b>';
      word += i.name.substr(input.value.length);

      //display the value in array
      listItem.innerHTML = word;
      document.querySelector('.list').appendChild(listItem);
    }
  }

  setTimeout(() => removeElements(), 2000);

  const showSearch = __pokedex.filter(
    (poke) =>
      poke.name.toLowerCase().startsWith(input.value.toLowerCase()) &&
      input.value != ''
  );
  __pokedex = showSearch;
  createInterface();
}

function displayNames(value) {
  input.value = value;
  const showSearch = __pokedex.filter(
    (poke) =>
      poke.name.toLowerCase().startsWith(input.value.toLowerCase()) &&
      input.value != ''
  );
  __pokedex = showSearch;
  createInterface();
  removeElements();
}

function removeElements() {
  let items = document.querySelectorAll('.list-items');
  items.forEach((item) => {
    item.remove();
  });
}
