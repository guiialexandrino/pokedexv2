import {
  footer,
  slot1,
  slot2,
  handleVsMode,
  body,
  content,
  dialogPokeInfo,
  header,
  dialogVsMode,
  searchDiv,
} from '../interface/reactiveElements.js';
import InterfaceUtils from '../utils/interfaceUtils.js';
import generateVsMode from '../interface/generateVsMode.js';
import Data from '../data/data.js';

/*Adiciona o poke ao slot */
export function addToComparePoke() {
  footer.style.transform = 'translateY(0px)';

  const check = Data.get__pokesToCompare().filter((poke) => {
    return poke.name === Data.get__selectedPoke().name;
  });

  if (check.length === 0) {
    const searchPoke = Data.get__pokedexBackup().find((poke) => {
      return poke.name === Data.get__selectedPoke().name;
    });

    //adiciona o total de pontos - 6 (hp,def,atk,satk,sdef,spd)
    let totalPoints = 0;
    searchPoke.stats.forEach((statsPoke, index) => {
      if (index < 7) {
        totalPoints += statsPoke.base_stat;
      }
    });
    searchPoke.stats.push({ base_stat: totalPoints });

    if (Data.get__pokesToCompare().length < 2) {
      Data.get__pokesToCompare().push(searchPoke);
      const htmlUpdate = InterfaceUtils.updateVsModeFooter(
        Data.get__pokesToCompare()
      );

      slot1.innerHTML = htmlUpdate.poke1;
      document.querySelector('#slot1-del').addEventListener('click', (e) => {
        deletePokeOfSlot(e, 1);
      });

      slot2.innerHTML = htmlUpdate.poke2;
      if (htmlUpdate.poke2 !== 'Sem pokémon')
        document.querySelector('#slot2-del').addEventListener('click', (e) => {
          deletePokeOfSlot(e, 2);
        });

      if (Data.get__pokesToCompare().length === 2)
        handleVsMode.disabled = false;

      return;
    }

    if (Data.get__pokesToCompare().length === 2) {
      Data.get__pokesToCompare()[0] = Data.get__pokesToCompare()[1];
      Data.get__pokesToCompare()[1] = searchPoke;
      const htmlUpdate = InterfaceUtils.updateVsModeFooter(
        Data.get__pokesToCompare()
      );

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

/*Deleta poke do slot de comparação do VsMode */
function deletePokeOfSlot(e, slot) {
  const pokemon = e.target.parentNode.innerHTML.split(' <div');
  Data.set__pokesToCompare(
    Data.get__pokesToCompare().filter((poke) => {
      return poke.name !== pokemon[0];
    })
  );
  if (slot === 1) slot1.innerHTML = 'Sem Pokémon';
  else slot2.innerHTML = 'Sem Pokémon';

  if (Data.get__pokesToCompare().length === 0) {
    footer.style.transform = 'translateY(60px)';
  }

  handleVsMode.disabled = true;
}

/*Método executado ao clicar para comparar os pokes VS Mode -> Abre o Dialog */
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

  Data.set__dialogInfo(true);
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

  generateVsMode.updateVsModeInterface(Data.get__pokesToCompare());
}

/*Método para fechar o vs mode */
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

  if (e.view.outerWidth <= 1100 && Data.get__pokesToCompare.length > 0) {
    if (Data.get__pokesToCompare()[0].name) {
      const el = document.querySelector(
        `#${Data.get__pokesToCompare()[0].name}`
      );
      el.scrollIntoView();
      window.scrollTo(0, window.scrollY - 90);
    } else if (
      !Data.get__pokesToCompare()[0].name &&
      Data.get__pokesToCompare()[1].name
    ) {
      const el = document.querySelector(
        `#${Data.get__pokesToCompare()[1].name}`
      );
      el.scrollIntoView();
      window.scrollTo(0, window.scrollY - 90);
    }
  }
}

export default { addToComparePoke, vsMode, handleCloseVsMode };
