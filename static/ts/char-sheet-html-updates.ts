import { Feature, Attack, Item, Power, Sheet } from 'char-sheet-interfaces'
import {
  characterSheet,
  skills,
  getAttributeModifier,
  calculateAttackBonus,
  calculateAttackDamage,
  getPowerSaveDC,
  getPowerAttackBonus,
  calculateAC,
  getSkillMod,
  getPassiveSkill,
  getInitiativeBonus,
  getProficiencyBonus,
  stringCamelCaseToDashes,
  stringToCamelCase,
  addAllEventListeners,
  updateTitle,
} from './char-sheet-script.js'

// html elements that are going to be changing
//
// #region display elements
// #region basic info tab elements
const characterName: HTMLElement = document.getElementById('character-name')
const species: HTMLElement = document.getElementById('species')
const characterClass: HTMLElement = document.getElementById('class')
const archetype: HTMLElement = document.getElementById('archetype')
const level: HTMLElement = document.getElementById('level')
const background: HTMLElement = document.getElementById('background')
const alignment: HTMLElement = document.getElementById('alignment')
const proficiencyBonus: HTMLElement = document.getElementById(
  'proficiency-bonus'
)
const speed: HTMLElement = document.getElementById('speed')
const armorClass: HTMLElement = document.getElementById('armor-class')
const personalityTraits: HTMLElement = document.getElementById(
  'personality-traits'
)
const ideal: HTMLElement = document.getElementById('ideal')
const bond: HTMLElement = document.getElementById('bond')
const flaw: HTMLElement = document.getElementById('flaw')
const initiative: HTMLElement = document.getElementById('initiative')
//#endregion
// #region hp tab elements
const currHp: HTMLElement = document.getElementById('curr-hp')
const maxHp: HTMLElement = document.getElementById('max-hp')
const tempHp: HTMLElement = document.getElementById('temp-hp')
const healOrDamageSelect: HTMLSelectElement = document.getElementById(
  'heal-or-damage-choice'
) as HTMLSelectElement
const healOrDamageSubmit: HTMLInputElement = document.getElementById(
  'submit-heal-or-damage'
) as HTMLInputElement
const availableHitDice: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('hit-dice-available-amount')
)
const hitDiceMax: HTMLElement = document.getElementById('hit-dice-max')
const hitDiceDie: HTMLElement = document.getElementById('hit-dice-die')
const deathSavesSucc: HTMLElement = document.getElementById(
  'death-saves__successes'
)
const deathSavesFail: HTMLElement = document.getElementById(
  'death-saves__failures'
)
// #endregion
// #region skills and attributes elements
const strengthMod: HTMLElement = document.getElementById('strength-mod')
const strengthScore: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('strength-score')
)
const strengthSave: HTMLElement = document.getElementById('strength-save')
const dexterityMod: HTMLElement = document.getElementById('dexterity-mod')
const dexterityScore: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('dexterity-score')
)
const dexteritySave: HTMLElement = document.getElementById('dexterity-save')
const constitutionMod: HTMLElement = document.getElementById('constitution-mod')
const constitutionScore: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('constitution-score')
)
const constitutionSave: HTMLElement = document.getElementById(
  'constitution-save'
)
const intelligenceMod: HTMLElement = document.getElementById('intelligence-mod')
const intelligenceScore: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('intelligence-score')
)
const intelligenceSave: HTMLElement = document.getElementById(
  'intelligence-save'
)
const wisdomMod: HTMLElement = document.getElementById('wisdom-mod')
const wisdomScore: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('wisdom-score')
)
const wisdomSave: HTMLElement = document.getElementById('wisdom-save')
const charismaMod: HTMLElement = document.getElementById('charisma-mod')
const charismaScore: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('charisma-score')
)
const charismaSave: HTMLElement = document.getElementById('charisma-save')
const passivePerception: HTMLElement = document.getElementById(
  'passive-perception-score'
)
// #endregion
// #region features & traits elements
const otherProficiencies: HTMLElement = document.getElementById('proficiencies')
const languages: HTMLElement = document.getElementById('languages')
const featuresAndTraits: HTMLElement = document.getElementById(
  'features-and-traits'
)
// #endregion
// #region equipment elements
const credits: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('credits')
)
const equipment: HTMLElement = document.getElementById('equipment')
// #endregion
// #region attacks elements
const attacksTable: HTMLElement = document.getElementById('attacks-table')
// #endregion
// #region powers elements
const techSaveDC: HTMLElement = document.getElementById('tech-save-dc')
const techAttackBonus: HTMLElement = document.getElementById(
  'tech-attack-bonus'
)
const darkSideSaveDC: HTMLElement = document.getElementById('dark-side-save-dc')
const darkSideAttackBonus: HTMLElement = document.getElementById(
  'dark-side-attack-bonus'
)
const lightSideSaveDC: HTMLElement = document.getElementById(
  'light-side-save-dc'
)
const lightSideAttackBonus: HTMLElement = document.getElementById(
  'light-side-attack-bonus'
)
const currentPowerPoints: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('current-power-points')
)
const maxPowerPoints: HTMLElement = document.getElementById('max-power-points')
// #endregion
// #region notes elements
const notes: HTMLElement = document.getElementById('notes')
// #endregion
// #region bonuses elements
const bonuses: HTMLElement = document.getElementById('bonuses-section')
// #endregion
// #endregion
// #region edit elements
// #region basic info tab elements
const editCharacterName: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('character-name-edit')
)
const editSpecies: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('species-edit')
)
const editClass: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('class-edit')
)
const editArchetype: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('archetype-edit')
)
const editLevel: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('level-edit')
)
const editBackground: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('background-edit')
)
const editAlignment: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('alignment-edit')
)
const editSpeed: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('speed-edit')
)
const editBaseArmorClass: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('armor-class-edit')
)
const editPersonalityTraits: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('personality-traits-edit')
)
const editIdeal: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('ideal-edit')
)
const editBond: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('bond-edit')
)
const editFlaw: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('flaw-edit')
)
// #endregion
// #region hp tab elements
const editMaxHP: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('max-hp-edit')
)
const editHitDiceDie: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('hit-dice-die-edit')
)
// #endregion
// #region features & traits elements
const editOtherProficiencies: HTMLElement = document.getElementById(
  'proficiencies-edit'
)
const addProficiencyBtn: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('add-feature')
)
const editLanguages: HTMLElement = document.getElementById('languages-edit')
const addLanguageBtn: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('add-language')
)
const editFeaturesAndTraits: HTMLElement = document.getElementById(
  'features-and-traits-edit'
)
const addFeatureBtn: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('add-feature')
)
// #endregion
// #region equipment elements
const editEquipment: HTMLElement = document.getElementById('equipment-edit')
const addEquipmentBtn: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('add-equipment')
)
// #endregion
// #region attacks elements
const editAttacks: HTMLElement = document.getElementById('attacks-edit')
const addAttackBtn: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('add-attack')
)
// #endregion
// #region powers elements
const editMaxPowerPoints: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('current-power-points-edit')
)
// #endregion
// #region notes elements
const editNotes: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('notes-edit')
)
// #endregion
// #endregion

/**
 * Updates ALL fields of the html file.
 */
export function fillHTMLOnInitialize(): void {
  updateDisplayHTML()

  fillBasicInfoEditHTML()
  fillHPInfoEditHTML()
  fillFeaturesEditHTML()
  fillEquipmentEditHTML()
  fillAttacksEditHTML()
  fillPowersEditHTML()
  fillNotesEditHTML()
  fillBonusesHTML()
}

/**
 * Updates all display fields of the html file.
 */
export function updateDisplayHTML(): void {
  fillBasicInfoDisplayHTML()
  fillHPInfoDisplayHTML()
  fillFeaturesDisplayHTML()
  fillEquipmentDisplayHTML()
  fillAttacksDisplayHTML()
  fillPowersDisplayHTML()
  fillNotesDisplayHTML()
  fillAttributesAndSkillsHTML()
}

// #region functions filling display sections
function fillBasicInfoDisplayHTML(): void {
  characterName.innerText = characterSheet.name
  species.innerText = characterSheet.species
  characterClass.innerText = characterSheet.class
  archetype.innerText = characterSheet.archetype
  level.innerText = String(characterSheet.level)
  background.innerText = characterSheet.background
  alignment.innerText = characterSheet.alignment
  proficiencyBonus.innerText = `+${getProficiencyBonus(characterSheet.level)}`
  speed.innerText = String(characterSheet.speed)
  armorClass.innerText = String(calculateAC())
  personalityTraits.innerText = characterSheet.personalityTraits
  ideal.innerText = characterSheet.ideal
  bond.innerText = characterSheet.bond
  flaw.innerText = characterSheet.flaw
  initiative.innerText = String(getInitiativeBonus())
}

function fillHPInfoDisplayHTML(): void {
  currHp.innerText = String(characterSheet.hitPoints.current)
  maxHp.innerText = String(characterSheet.hitPoints.max)
  tempHp.innerText = String(characterSheet.hitPoints.temporary)
  availableHitDice.value = String(characterSheet.hitDice.left)
  hitDiceMax.innerText = String(characterSheet.level)
  hitDiceDie.innerText = String(characterSheet.hitDice.type)

  let displays = ['Take', 'Heal', 'Add']
  healOrDamageSubmit.innerText = displays[healOrDamageSelect.selectedIndex]

  let successes = deathSavesSucc.children
  let failures = deathSavesFail.children

  for (let i = 0; i < 3; i++) {
    let succ = <HTMLInputElement>successes[i]
    let fail = <HTMLInputElement>failures[i]
    succ.checked = i < characterSheet.deathSaves.succeeded
    fail.checked = i < characterSheet.deathSaves.failed
  }
}

function fillFeaturesDisplayHTML(): void {
  otherProficiencies.innerHTML = ''
  for (let prof of characterSheet.otherProficiencies) {
    let profHTML: HTMLElement = document.createElement('li')
    profHTML.innerText = prof
    otherProficiencies.appendChild(profHTML)
  }
  languages.innerHTML = ''
  for (let lang of characterSheet.languages) {
    let langHTML: HTMLElement = document.createElement('li')
    langHTML.innerText = lang
    languages.appendChild(langHTML)
  }
  featuresAndTraits.innerHTML = ''
  for (let feature of characterSheet.features) {
    let li: HTMLElement = document.createElement('li')
    let name: HTMLElement = document.createElement('h4')
    name.className = 'label'
    name.innerText = feature.name
    li.appendChild(name)
    if (feature.usesMax !== 0) {
      let restLabel: HTMLElement = document.createElement('h4')
      restLabel.className = 'label'
      restLabel.innerText = 'Rest:'
      li.appendChild(restLabel)
      let rest: HTMLElement = document.createElement('h4')
      if (feature.refresh === 'longRest') rest.innerText = 'long'
      else if (feature.refresh === 'shortRest') rest.innerText = 'short'
      else rest.innerText = 'none'
      li.appendChild(rest)
      let usesLabel: HTMLElement = document.createElement('h4')
      usesLabel.className = 'label'
      usesLabel.innerText = 'Uses:'
      li.appendChild(usesLabel)
      let limitedUsesWrapper: HTMLElement = document.createElement('div')
      limitedUsesWrapper.className = 'limited-uses-wrapper'
      let usesAmount: HTMLInputElement = document.createElement('input')
      usesAmount.type = 'number'
      usesAmount.className = 'number underlined-input__number'
      usesAmount.value = String(feature.usesLeft)
      limitedUsesWrapper.appendChild(usesAmount)
      let slash: HTMLElement = document.createElement('h4')
      slash.className = 'slash-separator'
      slash.innerText = '/'
      limitedUsesWrapper.appendChild(slash)
      let maxUses: HTMLElement = document.createElement('h4')
      maxUses.className = 'label'
      maxUses.innerText = String(feature.usesMax)
      limitedUsesWrapper.appendChild(maxUses)
      li.appendChild(limitedUsesWrapper)
    }
    let description: HTMLElement = document.createElement('p')
    description.innerText = feature.description
    li.appendChild(description)
    featuresAndTraits.appendChild(li)
  }
}

function fillEquipmentDisplayHTML(): void {
  credits.value = String(characterSheet.credits)
  equipment.innerHTML = ''
  for (let item of characterSheet.equipment) {
    let li: HTMLElement = document.createElement('li')
    li.className = 'equipment__item'
    let amountAndName: HTMLElement = document.createElement('div')
    amountAndName.className = 'item-amount-and-name'
    if (item.amount > 1) {
      let amount: HTMLElement = document.createElement('h4')
      amount.className = 'label'
      amount.innerText = `${item.amount}x`
      amountAndName.appendChild(amount)
    }
    let name: HTMLElement = document.createElement('h4')
    name.className = 'label'
    name.innerText = item.name
    amountAndName.appendChild(name)
    li.appendChild(amountAndName)
    if (item.usesMax !== 0) {
      let usesLabel: HTMLElement = document.createElement('h4')
      usesLabel.className = 'label'
      usesLabel.innerText = 'Uses:'
      li.appendChild(usesLabel)
      let limitedUsesWrapper: HTMLElement = document.createElement('div')
      limitedUsesWrapper.className = 'limited-uses-wrapper'
      let usesAmount: HTMLInputElement = document.createElement('input')
      usesAmount.type = 'number'
      usesAmount.className = 'number underlined-input__number'
      usesAmount.value = String(item.usesLeft)
      limitedUsesWrapper.appendChild(usesAmount)
      let slash: HTMLElement = document.createElement('h4')
      slash.className = 'slash-separator'
      slash.innerText = '/'
      limitedUsesWrapper.appendChild(slash)
      let maxUses: HTMLElement = document.createElement('h4')
      maxUses.className = 'label'
      maxUses.innerText = String(item.usesMax)
      limitedUsesWrapper.appendChild(maxUses)
      li.appendChild(limitedUsesWrapper)
    }
    let notes: HTMLElement = document.createElement('p')
    notes.innerText = item.notes
    li.appendChild(notes)
    equipment.appendChild(li)
  }
}

function fillAttacksDisplayHTML(): void {
  let atkTableHeader: HTMLElement = <HTMLElement>attacksTable.firstElementChild
  if (attacksTable.firstElementChild.nodeName === 'TBODY')
    atkTableHeader = <HTMLElement>atkTableHeader.firstElementChild
  attacksTable.innerHTML = ''
  attacksTable.appendChild(atkTableHeader)
  for (let atk of characterSheet.attacks)
    attacksTable.appendChild(createAttackTableRow(atk))
}

function createAttackTableRow(atk: Attack): HTMLElement {
  let row: HTMLElement = document.createElement('tr')
  let name: HTMLElement = document.createElement('td')
  name.className = 'attack-name'
  name.innerText = atk.name
  row.appendChild(name)
  let atkBonus: HTMLElement = document.createElement('td')
  atkBonus.className = 'attack-atk-bonus'
  let attackBonus = calculateAttackBonus(atk)
  let sign: string = attackBonus >= 0 ? '+' : ''
  atkBonus.innerText = `${sign}${attackBonus}`
  row.appendChild(atkBonus)
  let dmg: HTMLElement = document.createElement('td')
  dmg.className = 'attack-damage'
  dmg.innerText = calculateAttackDamage(atk)
  row.appendChild(dmg)
  let note: HTMLElement = document.createElement('td')
  note.className = 'attack-notes'
  note.innerText = atk.notes
  row.appendChild(note)
  return row
}

function fillPowersDisplayHTML(): void {
  maxPowerPoints.innerText = String(characterSheet.powerPointsMax)
  currentPowerPoints.value = String(characterSheet.powerPointsLeft)
  techSaveDC.innerText = String(getPowerSaveDC('tech'))
  let techAtk = getPowerAttackBonus('tech')
  techAttackBonus.innerText = techAtk >= 0 ? `+${techAtk}` : String(techAtk)
  darkSideSaveDC.innerText = String(getPowerSaveDC('dark'))
  let darkAtk = getPowerAttackBonus('dark')
  darkSideAttackBonus.innerText = darkAtk >= 0 ? `+${darkAtk}` : String(darkAtk)
  lightSideSaveDC.innerText = String(getPowerSaveDC('light'))
  let lightAtk = getPowerAttackBonus('light')
  lightSideAttackBonus.innerText =
    lightAtk >= 0 ? `+${lightAtk}` : String(lightAtk)
  for (let i = 0; i <= 9; i++) fillSinglePowerLevelDisplayHTML(i)
}

function fillNotesDisplayHTML(): void {
  notes.innerText = characterSheet.notes
}

function fillSinglePowerLevelDisplayHTML(level: number): void {
  let levelStr = level === 0 ? 'at-will' : `level-${level}`
  let powersAtLevel = document.getElementById(`powers__${levelStr}`)
  powersAtLevel.innerHTML = ''
  powersAtLevel.appendChild(document.createElement('br'))
  let ul: HTMLElement = document.createElement('ul')
  for (let power of characterSheet.powers[`level${level}`]) {
    let li: HTMLElement = document.createElement('li')
    li.className = 'power'
    let name: HTMLElement = document.createElement('h3')
    name.className = 'label'
    name.innerText = power.name
    li.appendChild(name)
    let alignmentDiv: HTMLElement = document.createElement('div')
    alignmentDiv.className = 'power__single-line'
    let alignmentLabel: HTMLElement = document.createElement('h4')
    alignmentLabel.className = 'label'
    alignmentLabel.innerText = 'Force Alignment:'
    alignmentDiv.appendChild(alignmentLabel)
    let alignment: HTMLElement = document.createElement('h4')
    alignment.innerText = power.alignment
    alignmentDiv.appendChild(alignment)
    li.appendChild(alignmentDiv)
    let castingPeriodDiv: HTMLElement = document.createElement('div')
    castingPeriodDiv.className = 'power__single-line'
    let castingPeriodLabel: HTMLElement = document.createElement('h4')
    castingPeriodLabel.className = 'label'
    castingPeriodLabel.innerText = 'Casting Period:'
    castingPeriodDiv.appendChild(castingPeriodLabel)
    let castingPeriod: HTMLElement = document.createElement('h4')
    castingPeriod.innerText = power.casting
    castingPeriodDiv.appendChild(castingPeriod)
    li.appendChild(castingPeriodDiv)
    let rangeDiv: HTMLElement = document.createElement('div')
    rangeDiv.className = 'power__single-line'
    let rangeLabel: HTMLElement = document.createElement('h4')
    rangeLabel.className = 'label'
    rangeLabel.innerText = 'Range:'
    rangeDiv.appendChild(rangeLabel)
    let range: HTMLElement = document.createElement('h4')
    range.innerText = power.range
    rangeDiv.appendChild(range)
    li.appendChild(rangeDiv)
    let durationDiv: HTMLElement = document.createElement('div')
    durationDiv.className = 'power__single-line'
    let durationLabel: HTMLElement = document.createElement('h4')
    durationLabel.className = 'label'
    durationLabel.innerText = 'Duration:'
    durationDiv.appendChild(durationLabel)
    let duration: HTMLElement = document.createElement('h4')
    duration.innerText = power.duration
    durationDiv.appendChild(duration)
    li.appendChild(durationDiv)
    let concentrationDiv: HTMLElement = document.createElement('div')
    concentrationDiv.className = 'power__single-line'
    let concentrationLabel: HTMLElement = document.createElement('h4')
    concentrationLabel.className = 'label'
    concentrationLabel.innerText = 'Concentration:'
    concentrationDiv.appendChild(concentrationLabel)
    let container: HTMLElement = document.createElement('label')
    container.className = 'checkbox-container'
    concentrationDiv.appendChild(container)
    let concentration: HTMLInputElement = document.createElement('input')
    concentration.className = 'checkbox unclickable-checkbox'
    concentration.type = 'checkbox'
    concentration.checked = power.concentration
    concentration.disabled = true
    container.appendChild(concentration)
    let checkmark: HTMLElement = document.createElement('span')
    checkmark.className = 'checkmark'
    container.appendChild(checkmark)
    concentrationDiv.appendChild(container)
    li.appendChild(concentrationDiv)
    let descriptionLabel: HTMLElement = document.createElement('h4')
    descriptionLabel.className = 'label'
    descriptionLabel.innerText = 'Description:'
    li.appendChild(descriptionLabel)
    let description: HTMLElement = document.createElement('p')
    description.innerText = power.description
    li.appendChild(description)
    ul.appendChild(li)
    powersAtLevel.appendChild(ul)
  }
}

// #endregion
// #region functions filling edit sections
function fillAttributesAndSkillsHTML(): void {
  strengthScore.value = String(characterSheet.attributes.strength)
  strengthMod.innerText = String(getAttributeModifier('strength'))
  dexterityScore.value = String(characterSheet.attributes.dexterity)
  dexterityMod.innerText = String(getAttributeModifier('dexterity'))
  constitutionScore.value = String(characterSheet.attributes.constitution)
  constitutionMod.innerText = String(getAttributeModifier('constitution'))
  intelligenceScore.value = String(characterSheet.attributes.intelligence)
  intelligenceMod.innerText = String(getAttributeModifier('intelligence'))
  wisdomScore.value = String(characterSheet.attributes.wisdom)
  wisdomMod.innerText = String(getAttributeModifier('wisdom'))
  charismaScore.value = String(characterSheet.attributes.charisma)
  charismaMod.innerText = String(getAttributeModifier('charisma'))
  for (let skill in skills) {
    let camelCase = stringToCamelCase(skill.replace(/-/g, ' '))
    let skillProficiencyHTML: HTMLInputElement = <HTMLInputElement>(
      document.getElementById(`${skill}-prof`)
    )
    let skillExpertiseHTML: HTMLInputElement = <HTMLInputElement>(
      document.getElementById(`${skill}-expertise`)
    )
    let skillScoreHTML: HTMLElement = document.getElementById(`${skill}-score`)
    for (let prof of characterSheet.proficiencies) {
      if (prof === camelCase) {
        skillProficiencyHTML.checked = true
        break
      }
    }
    for (let prof of characterSheet.expertise) {
      if (prof === camelCase) {
        skillExpertiseHTML.checked = true
        break
      }
    }
    if (skillExpertiseHTML != null) {
      skillExpertiseHTML.disabled = !skillProficiencyHTML.checked
      skillProficiencyHTML.disabled = skillExpertiseHTML.checked
    }
    skillScoreHTML.innerText = String(getSkillMod(skill))
  }
  passivePerception.innerText = String(getPassiveSkill('perception'))
}

function fillBonusesHTML(): void {
  bonuses.innerHTML = ''
  for (let bonusName in characterSheet.bonuses) {
    let bonusValue: number = characterSheet.bonuses[bonusName]
    let wrapper: HTMLElement = document.createElement('div')
    wrapper.className = 'bonus-wrapper'
    let name: HTMLElement = document.createElement('h4')
    name.className = 'label'
    name.innerText = bonusName
    wrapper.appendChild(name)
    let input: HTMLInputElement = document.createElement('input')
    input.className = 'number'
    input.type = 'number'
    // change the camel case name to being separated by dashes, so it fits html standard
    input.id = `${stringCamelCaseToDashes(bonusName)}-bonus-value`
    input.value = String(bonusValue)
    wrapper.appendChild(input)
    bonuses.appendChild(wrapper)
  }
}

export function fillBasicInfoEditHTML(): void {
  editCharacterName.value = characterSheet.name
  editSpecies.value = characterSheet.species
  editClass.value = characterSheet.class
  editArchetype.value = characterSheet.archetype
  editLevel.value = String(characterSheet.level)
  editBackground.value = characterSheet.background
  editAlignment.value = characterSheet.alignment
  editSpeed.value = String(characterSheet.speed)
  editBaseArmorClass.value = String(characterSheet.baseAc)
  editPersonalityTraits.value = characterSheet.personalityTraits
  editIdeal.value = characterSheet.ideal
  editBond.value = characterSheet.bond
  editFlaw.value = characterSheet.flaw
}

export function fillHPInfoEditHTML(): void {
  editMaxHP.value = String(characterSheet.hitPoints.max)
  editHitDiceDie.value = String(characterSheet.hitDice.type)
}

export function fillFeaturesEditHTML(): void {
  editOtherProficiencies.innerHTML = ''
  for (let prof of characterSheet.otherProficiencies) {
    let profLi: HTMLElement = document.createElement('li')
    let deleteBtn: HTMLInputElement = document.createElement('input')
    deleteBtn.className = 'button sheet-delete-btn-txt'
    deleteBtn.type = 'button'
    deleteBtn.value = 'Delete'
    profLi.appendChild(deleteBtn)
    let profInput: HTMLInputElement = document.createElement('input')
    profInput.className = 'text'
    profInput.type = 'text'
    profInput.value = prof
    profLi.appendChild(profInput)
    editOtherProficiencies.appendChild(profLi)
  }
  editLanguages.innerHTML = ''
  for (let lang of characterSheet.languages) {
    let langLi: HTMLElement = document.createElement('li')
    let deleteBtn: HTMLInputElement = document.createElement('input')
    deleteBtn.className = 'button sheet-delete-btn-txt'
    deleteBtn.type = 'button'
    deleteBtn.value = 'Delete'
    langLi.appendChild(deleteBtn)
    let langInput: HTMLInputElement = document.createElement('input')
    langInput.className = 'text'
    langInput.type = 'text'
    langInput.value = lang
    langLi.appendChild(langInput)
    editLanguages.appendChild(langLi)
  }
  editFeaturesAndTraits.innerHTML = ''
  for (let feature of characterSheet.features) {
    let li: HTMLElement = document.createElement('li')
    let deleteBtn: HTMLInputElement = document.createElement('input')
    deleteBtn.className = 'button sheet-delete-btn-txt'
    deleteBtn.type = 'button'
    deleteBtn.value = 'Delete'
    li.appendChild(deleteBtn)
    let name: HTMLInputElement = document.createElement('input')
    name.className = 'text'
    name.type = 'text'
    name.value = feature.name
    li.appendChild(name)
    let restLabel: HTMLElement = document.createElement('h4')
    restLabel.className = 'label'
    restLabel.innerText = 'Recharge:'
    li.appendChild(restLabel)
    let restSelect: HTMLSelectElement = document.createElement('select')
    let optionLong: HTMLElement = document.createElement('option')
    optionLong.innerText = 'long'
    let optionShort: HTMLElement = document.createElement('option')
    optionShort.innerText = 'short'
    let optionNone: HTMLElement = document.createElement('option')
    optionNone.innerText = 'none'
    restSelect.appendChild(optionLong)
    restSelect.appendChild(optionShort)
    restSelect.appendChild(optionNone)
    if (feature.refresh === 'longRest') restSelect.options.selectedIndex = 0
    else if (feature.refresh === 'shortRest')
      restSelect.options.selectedIndex = 1
    else restSelect.options.selectedIndex = 2
    li.appendChild(restSelect)
    let usesLabel: HTMLElement = document.createElement('h4')
    usesLabel.className = 'label'
    usesLabel.innerText = 'Max uses:'
    li.appendChild(usesLabel)
    let maxUses: HTMLInputElement = document.createElement('input')
    maxUses.className = 'number'
    maxUses.type = 'number'
    maxUses.value = String(feature.usesMax)
    li.appendChild(maxUses)
    let description: HTMLTextAreaElement = document.createElement('textarea')
    description.cols = 80
    description.rows = 5
    description.value = feature.description
    li.appendChild(description)
    editFeaturesAndTraits.appendChild(li)
  }
}

export function fillEquipmentEditHTML(): void {
  editEquipment.innerHTML = ''
  for (let item of characterSheet.equipment) {
    let li: HTMLElement = document.createElement('li')
    li.className = 'equipment__item'
    let deleteBtn: HTMLInputElement = document.createElement('input')
    deleteBtn.type = 'button'
    deleteBtn.className = 'button sheet-delete-btn-txt'
    deleteBtn.value = 'Delete'
    li.appendChild(deleteBtn)
    let name: HTMLInputElement = document.createElement('input')
    name.className = 'text'
    name.type = 'text'
    name.value = item.name
    li.appendChild(name)
    let amountLabel: HTMLElement = document.createElement('h4')
    amountLabel.className = 'label'
    amountLabel.innerText = 'Amount:'
    li.appendChild(amountLabel)
    let amount: HTMLInputElement = document.createElement('input')
    amount.type = 'number'
    amount.className = 'number'
    amount.value = String(item.amount)
    li.appendChild(amount)
    let usesLabel: HTMLElement = document.createElement('h4')
    usesLabel.className = 'label'
    usesLabel.innerText = 'Max Uses:'
    li.appendChild(usesLabel)
    let maxUses: HTMLInputElement = document.createElement('input')
    maxUses.type = 'number'
    maxUses.className = 'number'
    maxUses.value = String(item.usesMax)
    li.appendChild(maxUses)
    let notesLabel: HTMLElement = document.createElement('h4')
    notesLabel.className = 'label'
    notesLabel.innerText = 'Notes:'
    li.appendChild(notesLabel)
    let notes: HTMLTextAreaElement = document.createElement('textarea')
    notes.cols = 80
    notes.rows = 5
    notes.value = item.notes
    li.appendChild(notes)
    editEquipment.appendChild(li)
  }
}

export function fillAttacksEditHTML(): void {
  editAttacks.innerHTML = ''
  for (let attack of characterSheet.attacks) {
    let li: HTMLElement = document.createElement('li')
    let deleteBtn: HTMLInputElement = document.createElement('input')
    deleteBtn.className = 'button sheet-delete-btn-txt'
    deleteBtn.type = 'button'
    deleteBtn.value = 'Delete'
    li.appendChild(deleteBtn)
    let name: HTMLInputElement = document.createElement('input')
    name.className = 'text'
    name.type = 'text'
    name.value = attack.name
    li.appendChild(name)
    let proficientLabel: HTMLElement = document.createElement('h4')
    proficientLabel.className = 'label'
    proficientLabel.innerText = 'Proficient:'
    li.appendChild(proficientLabel)
    let proficientContainer: HTMLElement = document.createElement('label')
    proficientContainer.className = 'checkbox-container'
    li.appendChild(proficientContainer)
    let proficient: HTMLInputElement = document.createElement('input')
    proficient.className = 'checkbox'
    proficient.type = 'checkbox'
    proficient.checked = attack.proficiency
    proficientContainer.appendChild(proficient)
    let proficientCheckmark: HTMLElement = document.createElement('span')
    proficientCheckmark.className = 'checkmark'
    proficientContainer.appendChild(proficientCheckmark)
    let finesseLabel: HTMLElement = document.createElement('h4')
    finesseLabel.className = 'label'
    finesseLabel.innerText = 'Finesse:'
    li.appendChild(finesseLabel)
    let finesseContainer: HTMLElement = document.createElement('label')
    finesseContainer.className = 'checkbox-container'
    li.appendChild(finesseContainer)
    let finesse: HTMLInputElement = document.createElement('input')
    finesse.className = 'checkbox'
    finesse.type = 'checkbox'
    finesse.checked = attack.finesse
    finesseContainer.appendChild(finesse)
    let finesseCheckmark: HTMLElement = document.createElement('span')
    finesseCheckmark.className = 'checkmark'
    finesseContainer.appendChild(finesseCheckmark)
    let rangedLabel: HTMLElement = document.createElement('h4')
    rangedLabel.className = 'label'
    rangedLabel.innerText = 'Ranged:'
    li.appendChild(rangedLabel)
    let rangedContainer: HTMLElement = document.createElement('label')
    rangedContainer.className = 'checkbox-container'
    li.appendChild(rangedContainer)
    let ranged: HTMLInputElement = document.createElement('input')
    ranged.className = 'checkbox'
    ranged.type = 'checkbox'
    ranged.checked = attack.ranged
    rangedContainer.appendChild(ranged)
    let rangedCheckmark: HTMLElement = document.createElement('span')
    rangedCheckmark.className = 'checkmark'
    rangedContainer.appendChild(rangedCheckmark)
    let dmgDiceAmountLabel: HTMLElement = document.createElement('h4')
    dmgDiceAmountLabel.className = 'label'
    dmgDiceAmountLabel.innerText = 'Damage Dice Amount:'
    li.appendChild(dmgDiceAmountLabel)
    let dmgDiceAmount: HTMLInputElement = document.createElement('input')
    dmgDiceAmount.className = 'number'
    dmgDiceAmount.type = 'number'
    dmgDiceAmount.value = String(attack.dmgDiceAmount)
    li.appendChild(dmgDiceAmount)
    let dmgDiceValueLabel: HTMLElement = document.createElement('h4')
    dmgDiceValueLabel.className = 'label'
    dmgDiceValueLabel.innerText = 'Damage Dice Value:'
    li.appendChild(dmgDiceValueLabel)
    let dmgDiceValue: HTMLInputElement = document.createElement('input')
    dmgDiceValue.className = 'number'
    dmgDiceValue.type = 'number'
    dmgDiceValue.value = String(attack.dmgDiceValue)
    li.appendChild(dmgDiceValue)
    let dmgTypeLabel: HTMLElement = document.createElement('h4')
    dmgTypeLabel.className = 'label'
    dmgTypeLabel.innerText = 'Damage Type:'
    li.appendChild(dmgTypeLabel)
    let dmgType: HTMLInputElement = document.createElement('input')
    dmgType.className = 'text'
    dmgType.type = 'text'
    dmgType.value = String(attack.dmgType)
    li.appendChild(dmgType)
    let dmgBonusLabel: HTMLElement = document.createElement('h4')
    dmgBonusLabel.className = 'label'
    dmgBonusLabel.innerText = 'Damage Bonus:'
    li.appendChild(dmgBonusLabel)
    let dmgBonus: HTMLInputElement = document.createElement('input')
    dmgBonus.className = 'number'
    dmgBonus.type = 'number'
    dmgBonus.value = String(attack.dmgBonus)
    li.appendChild(dmgBonus)
    let atkBonusLabel: HTMLElement = document.createElement('h4')
    atkBonusLabel.className = 'label'
    atkBonusLabel.innerText = 'Attack Bonus:'
    li.appendChild(atkBonusLabel)
    let atkBonus: HTMLInputElement = document.createElement('input')
    atkBonus.className = 'number'
    atkBonus.type = 'number'
    atkBonus.value = String(attack.atkBonus)
    li.appendChild(atkBonus)
    let notesLabel: HTMLElement = document.createElement('h4')
    notesLabel.className = 'label'
    notesLabel.innerText = 'Notes:'
    li.appendChild(notesLabel)
    let notes: HTMLTextAreaElement = document.createElement('textarea')
    notes.cols = 80
    notes.rows = 2
    notes.value = String(attack.notes)
    li.appendChild(notes)
    editAttacks.appendChild(li)
  }
}

export function fillPowersEditHTML(): void {
  let maxPowerPoints: HTMLInputElement = <HTMLInputElement>(
    document.getElementById('max-power-points-edit')
  )
  maxPowerPoints.value = String(characterSheet.powerPointsMax)

  for (let i = 0; i <= 9; i++) fillSinglePowerLevelEditHTML(i)
}

function fillNotesEditHTML(): void {
  editNotes.value = characterSheet.notes
}

function fillSinglePowerLevelEditHTML(level: number): void {
  let levelStr = level === 0 ? 'at-will' : `level-${level}`
  let powersAtLevel = document.getElementById(`powers__${levelStr}-edit`)
  powersAtLevel.innerHTML = ''
  powersAtLevel.appendChild(document.createElement('br'))
  let ul: HTMLElement = document.createElement('ul')
  for (let power of characterSheet.powers[`level${level}`]) {
    let li: HTMLElement = document.createElement('li')
    li.className = 'power'
    let deleteBtn: HTMLInputElement = document.createElement('input')
    deleteBtn.className = 'button sheet-delete-btn-txt'
    deleteBtn.type = 'button'
    deleteBtn.value = 'Delete'
    li.appendChild(deleteBtn)
    let name: HTMLInputElement = document.createElement('input')
    name.className = 'text'
    name.type = 'text'
    name.value = power.name
    li.appendChild(name)
    let alignmentLabel: HTMLElement = document.createElement('h4')
    alignmentLabel.className = 'label'
    alignmentLabel.innerText = 'Force Alignment:'
    li.appendChild(alignmentLabel)
    let alignment: HTMLInputElement = document.createElement('input')
    alignment.className = 'text'
    alignment.type = 'text'
    alignment.value = power.alignment
    li.appendChild(alignment)
    let castingPeriodLabel: HTMLElement = document.createElement('h4')
    castingPeriodLabel.className = 'label'
    castingPeriodLabel.innerText = 'Casting Period:'
    li.appendChild(castingPeriodLabel)
    let castingPeriod: HTMLInputElement = document.createElement('input')
    castingPeriod.className = 'text'
    castingPeriod.type = 'text'
    castingPeriod.value = power.casting
    li.appendChild(castingPeriod)
    let rangeLabel: HTMLElement = document.createElement('h4')
    rangeLabel.className = 'label'
    rangeLabel.innerText = 'Range:'
    li.appendChild(rangeLabel)
    let range: HTMLInputElement = document.createElement('input')
    range.className = 'text'
    range.type = 'text'
    range.value = power.range
    li.appendChild(range)
    let durationLabel: HTMLElement = document.createElement('h4')
    durationLabel.className = 'label'
    durationLabel.innerText = 'Duration:'
    li.appendChild(durationLabel)
    let duration: HTMLInputElement = document.createElement('input')
    duration.className = 'text'
    duration.type = 'text'
    duration.value = power.duration
    li.appendChild(duration)
    let concentrationLabel: HTMLElement = document.createElement('h4')
    concentrationLabel.className = 'label'
    concentrationLabel.innerText = 'Concentration:'
    li.appendChild(concentrationLabel)
    let container: HTMLElement = document.createElement('label')
    container.className = 'checkbox-container'
    li.appendChild(container)
    let concentration: HTMLInputElement = document.createElement('input')
    concentration.className = 'checkbox'
    concentration.type = 'checkbox'
    concentration.checked = power.concentration
    container.appendChild(concentration)
    let checkmark: HTMLElement = document.createElement('span')
    checkmark.className = 'checkmark'
    container.appendChild(checkmark)
    let descriptionLabel: HTMLElement = document.createElement('h4')
    descriptionLabel.className = 'label'
    descriptionLabel.innerText = 'Description:'
    li.appendChild(descriptionLabel)
    let description: HTMLTextAreaElement = document.createElement('textarea')
    description.cols = 80
    description.rows = 5
    description.value = power.description
    li.appendChild(description)
    ul.appendChild(li)
    powersAtLevel.appendChild(ul)
  }
}
// #endregion

updateTitle()
fillHTMLOnInitialize()
addAllEventListeners()
