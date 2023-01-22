/* Variaveis Globais */

let __pokedex = [];
let __pokedexBackup = [];
let __selectedPoke = {};
let __pokesToCompare = [];
let __dialogInfo = false;

//Getters & Setters

export const get__pokedex = () => {
  return __pokedex;
};
export const set__pokedex = (value) => {
  __pokedex = value;
};

export const get__pokedexBackup = () => {
  return __pokedexBackup;
};
export const set__pokedexBackup = (value) => {
  __pokedexBackup = value;
};

export const get__selectedPoke = () => {
  return __selectedPoke;
};
export const set__selectedPoke = (value) => {
  __selectedPoke = value;
};

export const get__pokesToCompare = () => {
  return __pokesToCompare;
};
export const set__pokesToCompare = (value) => {
  __pokesToCompare = value;
};

export const get__dialogInfo = () => {
  return __dialogInfo;
};
export const set__dialogInfo = (value) => {
  __dialogInfo = value;
};

export default {
  get__pokedex,
  set__pokedex,
  get__pokedexBackup,
  set__pokedexBackup,
  get__selectedPoke,
  set__selectedPoke,
  get__pokesToCompare,
  set__pokesToCompare,
  get__dialogInfo,
  set__dialogInfo,
};
