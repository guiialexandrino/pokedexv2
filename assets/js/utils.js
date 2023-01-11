function retornaTipos(array) {
  let html = '';
  array.forEach((item) => {
    html += `<span style="color: ${mudaCorTexto(
      item
    )}; background-color: ${retornaCodigoCorDoTipo(
      item
    )} !important">${traduzNomeTipo(item)}</span>`;
  });
  return html;
}

function traduzNomeTipo(item) {
  if (item == 'electric') return 'Elétrico';
  if (item == 'normal') return 'Normal';
  if (item == 'fire') return 'Fogo';
  if (item == 'grass') return 'Grama';
  if (item == 'poison') return 'Veneno';
  if (item == 'water') return 'Water';
  if (item == 'psychic') return 'Psíquico';
  if (item == 'fairy') return 'Fada';
  if (item == 'ground') return 'Terra';
  if (item == 'steel') return 'Metal';
  if (item == 'bug') return 'Inseto';
  if (item == 'fighting') return 'Lutador';
  if (item == 'rock') return 'Pedra';
  if (item == 'dragon') return 'Dragão';
  if (item == 'flying') return 'Voador';
  if (item == 'ice') return 'Gelo';
  if (item == 'ghost') return 'Fantasma';
  if (item == 'dark') return 'Noturno';
}

function retornaCodigoCorDoTipo(item) {
  if (item == 'electric') return 'rgba(254, 225, 103, 0.9)';
  if (item == 'normal') return 'rgba(246, 153, 181, 0.9)';
  if (item == 'fire') return 'rgba(243, 42, 42, 0.9)';
  if (item == 'grass') return 'rgba(128, 240, 129, 0.9)';
  if (item == 'poison') return 'rgba(197, 153, 246, 0.9)';
  if (item == 'water') return 'rgba(0, 183, 211, 0.9)';
  if (item == 'psychic') return 'rgba(116, 14, 142, 0.9)';
  if (item == 'fairy') return 'rgba(225, 68, 178, 0.9)';
  if (item == 'ground') return 'rgba(102, 57, 17, 0.9)';
  if (item == 'steel') return 'rgba(189, 187, 184, 0.9)';
  if (item == 'bug') return 'rgba(214, 249, 123, 0.9)';
  if (item == 'fighting') return 'rgba(186, 173, 146, 0.9)';
  if (item == 'rock') return 'rgba(67, 66, 65, 0.9)';
  if (item == 'dragon') return 'rgba(193, 203, 251, 0.9)';
  if (item == 'flying') return 'rgba(193, 249, 251, 0.9)';
  if (item == 'ice') return 'rgba(103, 243, 241, 0.9)';
  if (item == 'ghost') return 'rgba(80, 12, 176, 0.9)';
  if (item == 'dark') return 'rgba(80, 12, 176, 0.9)';
}

function mudaCorTexto(item) {
  if (
    item == 'fire' ||
    item == 'psychic' ||
    item == 'ground' ||
    item == 'rock' ||
    item == 'ghost' ||
    item == 'dark'
  )
    return 'white';
  return 'black';
}

function retornaHabilidades(array) {
  let html = '';
  array.forEach((item) => {
    html += `<span>${
      item[0].toUpperCase() + item.substring(1, item.length)
    }</span><br/>`;
  });
  return html;
}

function retornaMiniCards(array) {
  let html = '';
  let idPoke = [];

  array.forEach((item, index) => {
    let tipos = item.types.map((poke) => {
      return poke.type.name;
    });

    const habilidadesEncontradas = item.abilities.map((poke) => {
      return poke.ability.name;
    });

    // Verifica se o pokemon é voador ou tem levitate
    let flyPoke = '';
    if (tipos.includes('flying') || habilidadesEncontradas.includes('levitate'))
      flyPoke = 'animation: flyingPoke 2s ease-in-out infinite';
    else flyPoke = '';

    // Salva informação do poke
    idPoke.push({ name: item.name, type: tipos[0] });

    // Gera cor do tipo
    let cor = retornaCodigoCorDoTipo(tipos[0]);
    let fixColor = cor.split(',');
    fixColor[fixColor.length - 1] = ' 0.2)';
    const finalColor = fixColor.join(',');

    // Cria mini card para todos os pokemons
    html += `
    <div id="${item.name}" class="miniCardPoke">
    <div class="outlinedEffect"></div>
    <div class="miniImgCard"">
    <h3>#${index + 1}</h3>
    <div class="img-miniImg" style="background-image: url(${
      item.sprites.other['official-artwork'].front_default
    }); ${flyPoke}"></div>

    </div>
    <div id="${
      item.name
    }-info" class="infoPokeMiniCard" style="background-color: ${finalColor}">
    <h2>
    ${item.name[0].toUpperCase() + item.name.substring(1)}</h2>
    <div>
    ${retornaTipos(tipos)} 
    </div>
    </div>
    </div>
    `;
  });
  return { html, idPoke };
}

export default {
  retornaTipos,
  retornaCodigoCorDoTipo,
  retornaHabilidades,
  retornaMiniCards,
};
