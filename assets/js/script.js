import Utils from './utils.js';

//variaveis globais

let pokemonToSearch = 1;
let pokes = [];

// elementos reativos da pagina

const loading = document.querySelector('.loading');
const select = document.getElementById('selectPokemon');
const handleButton = document.getElementById('submit');
const input = document.getElementById('searchInput');
const corDeFundo = (tipoPokemon) => {
  document.documentElement.style.setProperty(
    '--mainColor',
    Utils.retornaCodigoCorDoTipo(tipoPokemon)
  );
};

// dados reativos
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

// adiciona eventos

select.addEventListener('change', mudouPoke);
handleButton.addEventListener('click', buscaPoke);
_hpPoke.addEventListener('mouseenter', changeStatsInfo);
_ataquePoke.addEventListener('mouseenter', changeStatsInfo);
_defesaPoke.addEventListener('mouseenter', changeStatsInfo);
_ataqueEspecialPoke.addEventListener('mouseenter', changeStatsInfo);
_defesaEspecialPoke.addEventListener('mouseenter', changeStatsInfo);
_velocidadePoke.addEventListener('mouseenter', changeStatsInfo);

// funcões

function getPokes() {
  loading.style.display = 'block';
  let results = [];

  fetch(`https://pokeapi.co/api/v2/pokemon-species/?limit=386`)
    .then((data) => {
      return data.json();
    })
    .then((info) => {
      results = info.results;
    })
    .then(() => {
      for (let x = 0; x < results.length; x++) {
        pokes.push({
          value: x + 1,
          label: `#${x + 1} - ${
            results[x].name[0].toUpperCase() +
            results[x].name.substring(1, results[x].name.length)
          }`,
        });
      }

      let selectHtml = '';

      pokes.forEach((poke) => {
        selectHtml += `<option value="${poke.value}">${poke.label}</option>`;
      });

      select.innerHTML = selectHtml;
    });
}

function getCaracteristicas() {
  loading.style.display = 'block';

  fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonToSearch}`)
    .then((data) => {
      return data.json();
    })
    .then((info) => {
      //altera info poke selecionado

      _descricaoPoke.innerHTML =
        info.flavor_text_entries[8].flavor_text.replace(/\n/g, ' ');

      const especie = info.genera.find((item) => {
        if (item.language.name === 'en') return item.genus;
      }).genus;

      _especiePoke.innerHTML = especie.split('Pokémon')[0];
    });
}

function getInformacoesGerais() {
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonToSearch}`)
    .then((data) => {
      return data.json();
    })
    .then((info) => {
      //turn off loading
      setTimeout(() => {
        loading.style.display = 'none';
      }, 300);

      _fotoPoke.src = info.sprites.other['official-artwork'].front_default;

      _fotoPokeMobile.src =
        info.sprites.other['official-artwork'].front_default;

      _identificacaoPoke.innerHTML = `#${info.id} - ${
        info.name[0].toUpperCase() + info.name.substring(1, info.name.length)
      }`;

      const tiposEncontrados = info.types.map((item) => {
        return item.type.name;
      });
      _tipoPoke.innerHTML = Utils.retornaTipos(tiposEncontrados);

      corDeFundo(tiposEncontrados[0]); // muda cor de fundo

      _alturaPoke.innerHTML = info.height / 10 + 'm';

      _pesoPoke.innerHTML = info.weight / 10 + ' kgs';

      const habilidadesEncontradas = info.abilities.map((item) => {
        return item.ability.name;
      });
      _habilidadePoke.innerHTML = Utils.retornaHabilidades(
        habilidadesEncontradas
      );

      _hpPoke.value = info.stats[0].base_stat;
      _ataquePoke.value = info.stats[1].base_stat;
      _defesaPoke.value = info.stats[2].base_stat;
      _ataqueEspecialPoke.value = info.stats[3].base_stat;
      _defesaEspecialPoke.value = info.stats[4].base_stat;
      _velocidadePoke.value = info.stats[5].base_stat;

      //verificar se o pokemon voa, inserir animação
      verificaVoador(tiposEncontrados, habilidadesEncontradas);

      /* tratamento para outliers */
      tratamentoOutliers();
    });
}

function mudouPoke() {
  document.querySelector('.noResult').style.display = 'none';
  input.value = '';

  pokemonToSearch = select.options[select.selectedIndex].value;

  getCaracteristicas();
  getInformacoesGerais();
}

function buscaPoke() {
  event.preventDefault();
  document.querySelector('.noResult').style.display = 'none';

  const result = pokes.find((pokemon) => {
    let name = pokemon.label.split(' ')[2];
    return name.toUpperCase() === input.value.toUpperCase();
  });

  if (result) {
    pokemonToSearch = result.value;
    select.selectedIndex = result.value - 1;
    getCaracteristicas();
    getInformacoesGerais();
    input.value = '';
  } else document.querySelector('.noResult').style.display = 'block';
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

// chama métodos

getPokes();
getCaracteristicas();
getInformacoesGerais();
