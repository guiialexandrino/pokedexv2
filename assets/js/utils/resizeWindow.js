import {
  dialogPokeInfo,
  dialogVsMode,
  header,
  searchDiv,
  content,
  input,
} from '../interface/reactiveElements.js';
import AutoComplete from '../components/autoComplete.js';
import Data from '../data/data.js';
import InitialInterface from '../components/cards.js';
import InfoPoke from '../components/infoPoke.js';
import VsMode from '../components/vsMode.js';

/* Métodos para restaurar padrão */

export function cleanInput() {
  if (input.value) {
    Data.set__pokedex([...Data.get__pokedexBackup()]);
    InitialInterface.createInterface();
  }
  AutoComplete.removeElements();
}

export function scrolling(e) {
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

export function resizeWindow(e) {
  const event = { view: e.currentTarget };
  InfoPoke.handleCloseInfo(event);
  VsMode.handleCloseVsMode(event);
}

export default { cleanInput, scrolling, resizeWindow };
