import Data from './data/data.js';
import Api from './utils/connectApi.js';
import InitialInterface from './components/cards.js';

/* Chama Método Inicial para carregar lista de pokes e depois cria a interface*/
Data.set__pokedex(await Api.getPokedex());
Data.set__pokedexBackup([...Data.get__pokedex()]);

InitialInterface.createInterface();
