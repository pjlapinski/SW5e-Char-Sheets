import { sheet } from 'char-sheet-interfaces'

var characterSheet: sheet
var updateHTML

// #region variables
const attributeNames: Array<String> = [
  'strength',
  'dexterity',
  'constitution',
  'intelligence',
  'wisdom',
  'charisma',
]
const attributeScores: Array<HTMLInputElement> = []
attributeNames.forEach(att =>
  attributeScores.push(
    <HTMLInputElement>document.getElementById(`${att}-score`)
  )
)
// #endregion

// #region event listeners
for (let att of attributeScores) {
  att.addEventListener('change', () => {
    let name = att.id.split('-')[0]
    characterSheet.attributes[name] = Number(att.value)
    updateHTML()
  })
}
// #endregion
