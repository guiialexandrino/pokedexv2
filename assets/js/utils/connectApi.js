import { loading } from '../interface/reactiveElements.js';

let __loadingProcess = 0;
const __pokedexNumber = 151;

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
  let __pokedex = [];

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

  return __pokedex;
}

export default { getPokedex };
