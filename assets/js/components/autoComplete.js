import { input, header, dialogVsMode } from '../interface/reactiveElements.js';
import Data from '../data/data.js';
import InfoPoke from './infoPoke.js';

//Auto complete Methods
export function autoCompleteMethod() {
  Data.set__pokedex([...Data.get__pokedexBackup()]);

  removeElements();
  for (let i of Data.get__pokedex()) {
    //convert input to lowercase and compare with each string

    if (
      i.name.toLowerCase().startsWith(input.value.toLowerCase()) &&
      input.value != ''
    ) {
      //create li element
      let listItem = document.createElement('li');

      //One common class name
      listItem.classList.add('list-items');
      listItem.style.cursor = 'pointer';
      listItem.onclick = function (e) {
        displayNames(i.name, e);
      };

      //Display matched part in bold
      let word = '<b>' + i.name.substr(0, input.value.length) + '</b>';
      word += i.name.substr(input.value.length);

      //display the value in array
      listItem.innerHTML = word;
      document.querySelector('.list').appendChild(listItem);
    }
  }
}

export function displayNames(value, e) {
  input.value = value;
  const showSearch = Data.get__pokedex().filter(
    (poke) =>
      poke.name.toLowerCase().startsWith(input.value.toLowerCase()) &&
      input.value != ''
  );
  Data.set__pokedex(showSearch);

  header.style.transform = 'translateY(-60px)';
  dialogVsMode.style.display = 'none';

  InfoPoke.showInfoCard(Data.get__pokedex()[0], 0, e);
  removeElements();
}

export function removeElements() {
  let items = document.querySelectorAll('.list-items');
  items.forEach((item) => {
    item.remove();
  });
}

export default { autoCompleteMethod, displayNames, removeElements };
