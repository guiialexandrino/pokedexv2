import InterfaceUtils from './interfaceUtils.js';

let __pokesToCompare = [];

function updateVsModeInterface(pokesToCompare) {
  __pokesToCompare = pokesToCompare;

  calculateScore();
  refreshImgs();
  refreshNames();
  refreshTypeAndColor();
  checkSlotsColorAreTheSame();

  refreshStats(
    'HP',
    '#hp_slot1_label',
    '#hp_slot2_label',
    '#hp_slot1',
    '#hp_slot2',
    '#result_HP',
    0
  );

  refreshStats(
    'ATK',
    '#atk_slot1_label',
    '#atk_slot2_label',
    '#atk_slot1',
    '#atk_slot2',
    '#result_ATK',
    1
  );

  refreshStats(
    'DEF',
    '#def_slot1_label',
    '#def_slot2_label',
    '#def_slot1',
    '#def_slot2',
    '#result_DEF',
    2
  );

  refreshStats(
    'SATK',
    '#satk_slot1_label',
    '#satk_slot2_label',
    '#satk_slot1',
    '#satk_slot2',
    '#result_SATK',
    3
  );

  refreshStats(
    'SDEF',
    '#sdef_slot1_label',
    '#sdef_slot2_label',
    '#sdef_slot1',
    '#sdef_slot2',
    '#result_SDEF',
    4
  );

  refreshStats(
    'SPD',
    '#spd_slot1_label',
    '#spd_slot2_label',
    '#spd_slot1',
    '#spd_slot2',
    '#result_SPD',
    5
  );

  refreshStats(
    'Pontos',
    '#tot_slot1_label',
    '#tot_slot2_label',
    '#tot_slot1',
    '#tot_slot2',
    '#result_TOT',
    6
  );
}

function calculateScore() {
  let score_slot1 = 0;
  let score_slot2 = 0;

  const poke1 = __pokesToCompare[0].stats;
  const poke2 = __pokesToCompare[1].stats;

  poke1.forEach((stats, index) => {
    if (index < 7) {
      if (stats.base_stat > poke2[index].base_stat) score_slot1++;
      else if (stats.base_stat < poke2[index].base_stat) score_slot2++;
      else if (stats.base_stat === poke2[index].base_stat) {
        score_slot1 = score_slot1;
        score_slot2 = score_slot2;
      }
    }
  });

  document.querySelector('#scoreSlot1').innerHTML = score_slot1;
  document.querySelector('#scoreSlot2').innerHTML = score_slot2;
}

function refreshImgs() {
  document.querySelector('#foto_slot1').src =
    __pokesToCompare[0].sprites.other['official-artwork'].front_default;

  document.querySelector('#foto_slot2').src =
    __pokesToCompare[1].sprites.other['official-artwork'].front_default;

  //Adiciona efeito de voador
  for (let i = 0; i < __pokesToCompare.length; i++) {
    const tipo = __pokesToCompare[i].types.map((item) => {
      return item.type.name;
    });

    const habilidadesEncontradas = __pokesToCompare[i].abilities.map((item) => {
      return item.ability.name;
    });

    if (
      tipo.includes('flying') ||
      habilidadesEncontradas.includes('levitate')
    ) {
      document.querySelector(`#foto_slot${i + 1}`).style.animation =
        'flyingPoke 2s ease-in-out infinite';
    } else {
      document.querySelector(`#foto_slot${i + 1}`).style.animation = '';
    }
  }
}

function refreshNames() {
  document.querySelector(
    '#name_slot1'
  ).innerHTML = `#${__pokesToCompare[0].id} - ${__pokesToCompare[0].name}`;
  document.querySelector(
    '#name_slot2'
  ).innerHTML = `#${__pokesToCompare[1].id} - ${__pokesToCompare[1].name}`;
}

function refreshTypeAndColor() {
  //atualiza tipo e cor
  //slot1
  const tiposPokeSlot1 = __pokesToCompare[0].types.map((item) => {
    return item.type.name;
  });

  document.querySelector('#type_slot1').innerHTML =
    InterfaceUtils.retornaTipos(tiposPokeSlot1);

  const corSlot1 = InterfaceUtils.retornaCodigoCorDoTipo(tiposPokeSlot1[0]);
  document.documentElement.style.setProperty('--slot1', corSlot1);

  //slot2
  const tiposPokeSlot2 = __pokesToCompare[1].types.map((item) => {
    return item.type.name;
  });

  document.querySelector('#type_slot2').innerHTML =
    InterfaceUtils.retornaTipos(tiposPokeSlot2);

  const corSlot2 = InterfaceUtils.retornaCodigoCorDoTipo(tiposPokeSlot2[0]);
  document.documentElement.style.setProperty('--slot2', corSlot2);

  //atualiza fundo degrade
  document.querySelector('.vsMode_header').style.background = `linear-gradient(
    -225deg,
    ${corSlot1} 10%,
    ${corSlot2} 90%
  )`;
}

function checkSlotsColorAreTheSame() {
  const tiposPokeSlot1 = __pokesToCompare[0].types.map((item) => {
    return item.type.name;
  });

  const color1 = InterfaceUtils.retornaCodigoCorDoTipo(tiposPokeSlot1[0]);

  const tiposPokeSlot2 = __pokesToCompare[1].types.map((item) => {
    return item.type.name;
  });

  const color2 = InterfaceUtils.retornaCodigoCorDoTipo(tiposPokeSlot2[0]);

  if (color1 === color2) {
    const newColor1 = color1.substring(0, color1.length - 4) + '0.3)';
    document.documentElement.style.setProperty('--slot1', newColor1);

    const newColor2 = color2.substring(0, color2.length - 4) + '1)';
    document.documentElement.style.setProperty('--slot2', newColor2);

    document.querySelector(
      '.vsMode_header'
    ).style.background = `linear-gradient(
    -200deg,
    ${newColor1} 0%,
    ${newColor2} 100%
  )`;
  }
}

function refreshStats(
  statsType,
  slot1Label,
  slot2Label,
  slot1Progress,
  slot2Progress,
  result,
  index
) {
  // Atualiza label com valores

  const firstSlot = __pokesToCompare[0].stats[index].base_stat;
  const secondSlot = __pokesToCompare[1].stats[index].base_stat;

  document.querySelector(slot1Label).innerHTML = firstSlot;
  document.querySelector(slot2Label).innerHTML = secondSlot;

  // Atualiza o value do progress

  document.querySelector(slot1Progress).value = firstSlot;
  document.querySelector(slot2Progress).value = secondSlot;

  //Checa qual poke tem maior Stats
  const maiorStats = firstSlot > secondSlot ? firstSlot : secondSlot;
  const menorStats = firstSlot < secondSlot ? firstSlot : secondSlot;
  const pokemaiorStatsName =
    __pokesToCompare[0].stats[index].base_stat === maiorStats
      ? __pokesToCompare[0].name
      : __pokesToCompare[1].name;

  //Atualiza o valor do max do progress
  document.querySelector(slot1Progress).max = maiorStats;
  document.querySelector(slot2Progress).max = maiorStats;

  //Mensagem informando %
  const percentualMaior = (maiorStats / menorStats).toFixed(2);
  const fixPercentual = (percentualMaior - 1) * 100;
  let msg = `${pokemaiorStatsName} tem <b>${
    String(fixPercentual.toFixed(2)).split('.')[0]
  }%</b> a mais de ${statsType}.`;
  if (fixPercentual === 0)
    msg = `Os pokémons possuem o <b>mesmo</b> ${statsType}.`;

  document.querySelector(result).innerHTML = msg;
}

export default { updateVsModeInterface };
