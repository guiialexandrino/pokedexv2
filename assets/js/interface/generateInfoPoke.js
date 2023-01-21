import InterfaceUtils from '../utils/interfaceUtils.js';

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

const corDeFundoDialogPoke = (tipoPokemon) => {
  document.documentElement.style.setProperty(
    '--pokeColor',
    InterfaceUtils.retornaCodigoCorDoTipo(tipoPokemon)
  );
};

function loadPokeInfo(pokemon) {
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
  _tipoPoke.innerHTML = InterfaceUtils.retornaTipos(tiposEncontrados);

  corDeFundoDialogPoke(tiposEncontrados[0]); // muda cor de fundo

  _alturaPoke.innerHTML = pokemon.height / 10 + 'm';

  _pesoPoke.innerHTML = pokemon.weight / 10 + ' kgs';

  const habilidadesEncontradas = pokemon.abilities.map((item) => {
    return item.ability.name;
  });
  _habilidadePoke.innerHTML = InterfaceUtils.retornaHabilidades(
    habilidadesEncontradas
  );

  _hpPoke.value = pokemon.stats[0].base_stat;
  _ataquePoke.value = pokemon.stats[1].base_stat;
  _defesaPoke.value = pokemon.stats[2].base_stat;
  _ataqueEspecialPoke.value = pokemon.stats[3].base_stat;
  _defesaEspecialPoke.value = pokemon.stats[4].base_stat;
  _velocidadePoke.value = pokemon.stats[5].base_stat;

  //verificar se o pokemon voa, inserir animação

  InterfaceUtils.verificaVoador(
    tiposEncontrados,
    habilidadesEncontradas,
    _fotoPoke,
    _fotoPokeMobile
  );

  /* tratamento para outliers */
  tratamentoOutliers();
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

export default { loadPokeInfo };
