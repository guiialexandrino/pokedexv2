/* Importações */
import InterfaceUtils from './interface/interfaceUtils.js';
import generateInfoPoke from './interface/generateInfoPoke.js';
import generateVsMode from './interface/generateVsMode.js';
import Api from './utils/connectApi.js';

/* Variaveis Globais */

let __pokedex = [];
let __pokedexBackup = [];
let __selectedPoke = {};
let __pokesToCompare = [];
let __dialogInfo = false;

/* Elementos Reativos da página */

const body = document.querySelector('body');
const header = document.querySelector('.headerNav');
const content = document.querySelector('.content');
const footer = document.querySelector('footer');
const searchDiv = document.querySelector('.searchPoke');
const input = document.getElementById('show-poke-list');
const loading = document.querySelector('.show_dialog_loading');
const closeInfoButton = document.querySelector('#closeInfoButton');
const addToCompare = document.querySelector('#addToVsMode');
const handleVsMode = document.querySelector('#handleVsMode');
const dialogPokeInfo = document.querySelector('.show_dialog_info');
const dialogVsMode = document.querySelector('.show_dialog_vs');
const closeVsMode = document.querySelector('#closeVsMode');

/* Dados Reativos */
const _maxContentCards = document.querySelector('#maxContentCards');
const slot1 = document.querySelector('#slot1');
const slot2 = document.querySelector('#slot2');

/* Adiciona Eventos */

closeInfoButton.addEventListener('click', handleCloseInfo);
addToCompare.addEventListener('click', addToComparePoke);
handleVsMode.addEventListener('click', vsMode);
closeVsMode.addEventListener('click', handleCloseVsMode);
input.addEventListener('keyup', autoCompleteMethod);
body.addEventListener('click', cleanInput);
window.addEventListener('scroll', scrolling);
window.addEventListener('resize', resizeWindow);

/* Métodos para restaurar padrão */

function cleanInput() {
  if (input.value) {
    __pokedex = [...__pokedexBackup];
    createInterface();
  }
  removeElements();
}

function scrolling(e) {
  //Condição para mobile e normal atualizar o top do dialogPoke Info
  if (e.target.defaultView.outerWidth > 1100) {
    dialogPokeInfo.style.top = `${window.pageYOffset + 30}px`;
    dialogVsMode.style.top = `${window.pageYOffset + 30}px`;
  } else {
    dialogPokeInfo.style.top = `0px`;
    dialogVsMode.style.top = `0px`;
  }

  //aparecer nav Header
  if (window.pageYOffset >= 220) {
    header.style.transform = 'translateY(0px)';
    document.querySelector('.maxHeaderContent').appendChild(searchDiv);
  }

  if (window.pageYOffset < 220) {
    header.style.transform = 'translateY(-60px)';
    content.insertBefore(searchDiv, content.children[1]);
  }
}

function resizeWindow(e) {
  const event = { view: e.currentTarget };
  handleCloseInfo(event);
  handleCloseVsMode(event);
}

function createInterface() {
  setTimeout(() => (loading.style.display = 'none'), 300);
  const utils = InterfaceUtils.retornaMiniCards(__pokedex);
  _maxContentCards.innerHTML = utils.html;

  // Adiciona eventos para mini card
  utils.idPoke.forEach((poke, index) => {
    const card = document.querySelector(`#${poke.name}`);
    const info = document.querySelector(`#${poke.name}-info`);
    const number = document.querySelector(`#${poke.name}-number`);
    const addVsMode = document.querySelector(`#${poke.name}-vsMode`);

    let cor = InterfaceUtils.retornaCodigoCorDoTipo(poke.type);

    card.addEventListener('mouseenter', () => {
      card.style.background = cor;
      if (InterfaceUtils.mudaCorTexto(poke.type) === 'white') {
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

    addVsMode.addEventListener('click', () => {
      __selectedPoke = { ...poke, id: index };
      addToComparePoke();
    });

    card.addEventListener('click', (e) => {
      showInfoCard(poke, index, e);
    });
  });
}

function showInfoCard(poke, index, e) {
  __selectedPoke = { ...poke, id: index };

  if (e.target.id.includes('vsMode')) return;

  if (e.view.outerWidth <= 1100) {
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
  generateInfoPoke.loadPokeInfo(showPokeInfo);

  //exibe dados ao clicar no card
  __dialogInfo = true;
  dialogPokeInfo.style.display = 'flex';
  header.style.transform = 'translateY(0px)';

  if (window.pageYOffset < 220) {
    document.querySelector('.maxHeaderContent').appendChild(searchDiv);
  }
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

    if (e.view.outerWidth <= 1100) {
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

/* VS MODE Methods */
function addToComparePoke() {
  footer.style.transform = 'translateY(0px)';

  const check = __pokesToCompare.filter((poke) => {
    return poke.name === __selectedPoke.name;
  });

  if (check.length === 0) {
    const searchPoke = __pokedexBackup.find((poke) => {
      return poke.name === __selectedPoke.name;
    });

    //adiciona o total de pontos - 6 (hp,def,atk,satk,sdef,spd)
    let totalPoints = 0;
    searchPoke.stats.forEach((statsPoke, index) => {
      if (index < 7) {
        totalPoints += statsPoke.base_stat;
      }
    });
    searchPoke.stats.push({ base_stat: totalPoints });

    if (__pokesToCompare.length < 2) {
      __pokesToCompare.push(searchPoke);
      const htmlUpdate = InterfaceUtils.updateVsModeFooter(__pokesToCompare);

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
      const htmlUpdate = InterfaceUtils.updateVsModeFooter(__pokesToCompare);

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

  if (__pokesToCompare.length === 0) {
    footer.style.transform = 'translateY(60px)';
  }

  handleVsMode.disabled = true;
}

/*Método executado ao clicar para comparar os pokes VS Mode */
function vsMode(e) {
  if (e.view.outerWidth <= 1100) {
    body.style.overflowY = 'scroll';
    body.style.overflowX = 'hidden';
    content.style.display = 'none';
    body.scrollIntoView();
  } else {
    body.style.overflowY = 'hidden';
    body.style.overflowX = 'hidden';
    content.style.display = 'flex';
  }

  __dialogInfo = true;
  dialogPokeInfo.style.display = 'none';

  // faz aparecer o nav header
  header.style.transform = 'translateY(0px)';
  document.querySelector('.maxHeaderContent').appendChild(searchDiv);

  //liga o dialog VS Mode
  dialogVsMode.style.display = 'flex';
  document.documentElement.style.setProperty(
    '--mainColor',
    `rgba(23, 26, 51, 0.95)`
  );

  generateVsMode.updateVsModeInterface(__pokesToCompare);
}

function handleCloseVsMode(e) {
  dialogVsMode.style.display = 'none';
  body.style.overflowY = 'scroll';
  header.style.transform = 'translateY(-60px)';
  content.style.display = 'flex';
  content.insertBefore(searchDiv, content.children[1]);
  document.documentElement.style.setProperty(
    '--mainColor',
    `rgba(23, 26, 51, 0.95)`
  );

  if (e.view.outerWidth <= 1100 && __pokesToCompare.length > 0) {
    if (__pokesToCompare[0].name) {
      const el = document.querySelector(`#${__pokesToCompare[0].name}`);
      el.scrollIntoView();
      window.scrollTo(0, window.scrollY - 90);
    } else if (!__pokesToCompare[0].name && __pokesToCompare[1].name) {
      const el = document.querySelector(`#${__pokesToCompare[1].name}`);
      el.scrollIntoView();
      window.scrollTo(0, window.scrollY - 90);
    }
  }
}

//Auto complete Methods
function autoCompleteMethod() {
  __pokedex = [...__pokedexBackup];

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

  header.style.transform = 'translateY(-60px)';
  dialogVsMode.style.display = 'none';

  showInfoCard(__pokedex[0], 0, e);
  removeElements();
}

function removeElements() {
  let items = document.querySelectorAll('.list-items');
  items.forEach((item) => {
    item.remove();
  });
}

/* Chama Método Inicial para carregar lista de pokes*/

__pokedex = await Api.getPokedex();
__pokedexBackup = [...__pokedex]; // cópia - para resetar as buscas

createInterface();
