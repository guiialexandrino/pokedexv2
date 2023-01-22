import { loading, _maxContentCards } from '../interface/reactiveElements.js';
import InterfaceUtils from '../utils/interfaceUtils.js';
import VsMode from './vsMode.js';
import InfoPoke from './infoPoke.js';
import Data from '../data/data.js';

export function createInterface() {
  setTimeout(() => (loading.style.display = 'none'), 300);
  const utils = InterfaceUtils.retornaMiniCards(Data.get__pokedex());
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
      Data.set__selectedPoke({ ...poke, id: index });
      VsMode.addToComparePoke();
    });

    card.addEventListener('click', (e) => {
      InfoPoke.showInfoCard(poke, index, e);
    });
  });
}

export default { createInterface };
