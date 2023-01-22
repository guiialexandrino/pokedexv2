import {
  body,
  content,
  header,
  dialogPokeInfo,
  searchDiv,
  input,
} from '../interface/reactiveElements.js';
import Data from '../data/data.js';
import generateInfoPoke from '../interface/generateInfoPoke.js';
import InitialInterface from './cards.js';

export function showInfoCard(poke, index, e) {
  Data.set__selectedPoke({ ...poke, id: index });

  if (e.target.id.includes('vsMode')) return;

  if (e.view.outerWidth <= 1100) {
    body.style.overflowY = 'scroll';
    body.style.overflowX = 'hidden';
    content.style.display = 'none';
    body.scrollIntoView();
  } else {
    body.style.overflowY = 'scroll';
    body.style.overflowX = 'hidden';
    content.style.display = 'flex';
  }

  const showPokeInfo = Data.get__pokedex()[Data.get__selectedPoke().id];
  generateInfoPoke.loadPokeInfo(showPokeInfo);

  //exibe dados ao clicar no card
  Data.set__dialogInfo(true);
  dialogPokeInfo.style.display = 'flex';
  header.style.transform = 'translateY(0px)';

  if (window.pageYOffset < 220) {
    document.querySelector('.maxHeaderContent').appendChild(searchDiv);
  }
}

export function handleCloseInfo(e) {
  if (Data.get__dialogInfo()) {
    dialogPokeInfo.style.animation = 'fadeOut 0.3s';
    setTimeout(() => {
      content.style.display = 'flex';
      body.style.overflowY = 'scroll';
      document.documentElement.style.setProperty(
        '--mainColor',
        `rgba(23, 26, 51, 0.95)`
      );

      if (e.view.outerWidth <= 1100) {
        const el = document.querySelector(`#${Data.get__selectedPoke().name}`);
        el.scrollIntoView();
        window.scrollTo(0, window.scrollY - 100);
      }

      if (input.value) {
        Data.set__pokedex([...Data.get__pokedexBackup()]);
        InitialInterface.createInterface();
      }

      if (window.pageYOffset < 220) {
        header.style.transform = 'translateY(-60px)';
        document.querySelector('.maxHeaderContent').appendChild(searchDiv);
        content.insertBefore(searchDiv, content.children[1]);
      }

      dialogPokeInfo.style.display = 'none';
      dialogPokeInfo.style.animation = 'fadeIn 0.3s';
      Data.set__dialogInfo(false);
    }, 250);
  }
}

export default { showInfoCard, handleCloseInfo };
