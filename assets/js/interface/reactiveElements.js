import InfoPoke from '../components/infoPoke.js';
import VsMode from '../components/vsMode.js';
import AutoComplete from '../components/autoComplete.js';
import ResizeWindow from '../utils/resizeWindow.js';

/* Elementos Reativos da página */

export const body = document.querySelector('body');
export const header = document.querySelector('.headerNav');
export const content = document.querySelector('.content');
export const footer = document.querySelector('footer');
export const searchDiv = document.querySelector('.searchPoke');
export const input = document.getElementById('show-poke-list');
export const loading = document.querySelector('.show_dialog_loading');
export const closeInfoButton = document.querySelector('#closeInfoButton');
export const addToCompare = document.querySelector('#addToVsMode');
export const handleVsMode = document.querySelector('#handleVsMode');
export const dialogPokeInfo = document.querySelector('.show_dialog_info');
export const dialogVsMode = document.querySelector('.show_dialog_vs');
export const closeVsMode = document.querySelector('#closeVsMode');

/* Dados Reativos */
export const _maxContentCards = document.querySelector('#maxContentCards');
export const slot1 = document.querySelector('#slot1');
export const slot2 = document.querySelector('#slot2');

/* Adiciona Eventos */

closeInfoButton.addEventListener('click', InfoPoke.handleCloseInfo);
addToCompare.addEventListener('click', VsMode.addToComparePoke);
handleVsMode.addEventListener('click', VsMode.vsMode);
closeVsMode.addEventListener('click', VsMode.handleCloseVsMode);
input.addEventListener('keyup', AutoComplete.autoCompleteMethod);
body.addEventListener('click', ResizeWindow.cleanInput);
window.addEventListener('scroll', ResizeWindow.scrolling);
window.addEventListener('resize', ResizeWindow.resizeWindow);
