import { characterSheet, skills, getAttributeModifier, calculateAttackBonus, calculateAttackDamage, getPowerSaveDC, getPowerAttackBonus, calculateAC, getSkillMod, getPassiveSkill, getInitiativeBonus, getProficiencyBonus, stringCamelCaseToDashes, stringToCamelCase, addAllEventListeners, updateTitle, } from './char-sheet-script.js';
// html elements that are going to be changing
//
// #region display elements
// #region basic info tab elements
const characterName = document.getElementById('character-name');
const species = document.getElementById('species');
const characterClass = document.getElementById('class');
const archetype = document.getElementById('archetype');
const level = document.getElementById('level');
const background = document.getElementById('background');
const alignment = document.getElementById('alignment');
const proficiencyBonus = document.getElementById('proficiency-bonus');
const speed = document.getElementById('speed');
const armorClass = document.getElementById('armor-class');
const personalityTraits = document.getElementById('personality-traits');
const ideal = document.getElementById('ideal');
const bond = document.getElementById('bond');
const flaw = document.getElementById('flaw');
const initiative = document.getElementById('initiative');
//#endregion
// #region hp tab elements
const currHp = document.getElementById('curr-hp');
const maxHp = document.getElementById('max-hp');
const tempHp = document.getElementById('temp-hp');
const healOrDamageSelect = document.getElementById('heal-or-damage-choice');
const healOrDamageSubmit = document.getElementById('submit-heal-or-damage');
const availableHitDice = (document.getElementById('hit-dice-available-amount'));
const hitDiceMax = document.getElementById('hit-dice-max');
const hitDiceDie = document.getElementById('hit-dice-die');
const deathSavesSucc = document.getElementById('death-saves__successes');
const deathSavesFail = document.getElementById('death-saves__failures');
// #endregion
// #region skills and attributes elements
const strengthMod = document.getElementById('strength-mod');
const strengthScore = (document.getElementById('strength-score'));
const strengthSave = document.getElementById('strength-save');
const dexterityMod = document.getElementById('dexterity-mod');
const dexterityScore = (document.getElementById('dexterity-score'));
const dexteritySave = document.getElementById('dexterity-save');
const constitutionMod = document.getElementById('constitution-mod');
const constitutionScore = (document.getElementById('constitution-score'));
const constitutionSave = document.getElementById('constitution-save');
const intelligenceMod = document.getElementById('intelligence-mod');
const intelligenceScore = (document.getElementById('intelligence-score'));
const intelligenceSave = document.getElementById('intelligence-save');
const wisdomMod = document.getElementById('wisdom-mod');
const wisdomScore = (document.getElementById('wisdom-score'));
const wisdomSave = document.getElementById('wisdom-save');
const charismaMod = document.getElementById('charisma-mod');
const charismaScore = (document.getElementById('charisma-score'));
const charismaSave = document.getElementById('charisma-save');
const passivePerception = document.getElementById('passive-perception-score');
// #endregion
// #region features & traits elements
const otherProficiencies = document.getElementById('proficiencies');
const languages = document.getElementById('languages');
const featuresAndTraits = document.getElementById('features-and-traits');
// #endregion
// #region equipment elements
const credits = (document.getElementById('credits'));
const equipment = document.getElementById('equipment');
// #endregion
// #region attacks elements
const attacksTable = document.getElementById('attacks-table');
// #endregion
// #region powers elements
const techSaveDC = document.getElementById('tech-save-dc');
const techAttackBonus = document.getElementById('tech-attack-bonus');
const darkSideSaveDC = document.getElementById('dark-side-save-dc');
const darkSideAttackBonus = document.getElementById('dark-side-attack-bonus');
const lightSideSaveDC = document.getElementById('light-side-save-dc');
const lightSideAttackBonus = document.getElementById('light-side-attack-bonus');
const currentPowerPoints = (document.getElementById('current-power-points'));
const maxPowerPoints = document.getElementById('max-power-points');
// #endregion
// #region notes elements
const notes = document.getElementById('notes');
// #endregion
// #region bonuses elements
const bonuses = document.getElementById('bonuses-section');
// #endregion
// #endregion
// #region edit elements
// #region basic info tab elements
const editCharacterName = (document.getElementById('character-name-edit'));
const editSpecies = (document.getElementById('species-edit'));
const editClass = (document.getElementById('class-edit'));
const editArchetype = (document.getElementById('archetype-edit'));
const editLevel = (document.getElementById('level-edit'));
const editBackground = (document.getElementById('background-edit'));
const editAlignment = (document.getElementById('alignment-edit'));
const editSpeed = (document.getElementById('speed-edit'));
const editBaseArmorClass = (document.getElementById('armor-class-edit'));
const editPersonalityTraits = (document.getElementById('personality-traits-edit'));
const editIdeal = (document.getElementById('ideal-edit'));
const editBond = (document.getElementById('bond-edit'));
const editFlaw = (document.getElementById('flaw-edit'));
// #endregion
// #region hp tab elements
const editMaxHP = (document.getElementById('max-hp-edit'));
const editHitDiceDie = (document.getElementById('hit-dice-die-edit'));
// #endregion
// #region features & traits elements
const editOtherProficiencies = document.getElementById('proficiencies-edit');
const addProficiencyBtn = (document.getElementById('add-feature'));
const editLanguages = document.getElementById('languages-edit');
const addLanguageBtn = (document.getElementById('add-language'));
const editFeaturesAndTraits = document.getElementById('features-and-traits-edit');
const addFeatureBtn = (document.getElementById('add-feature'));
// #endregion
// #region equipment elements
const editEquipment = document.getElementById('equipment-edit');
const addEquipmentBtn = (document.getElementById('add-equipment'));
// #endregion
// #region attacks elements
const editAttacks = document.getElementById('attacks-edit');
const addAttackBtn = (document.getElementById('add-attack'));
// #endregion
// #region powers elements
const editMaxPowerPoints = (document.getElementById('current-power-points-edit'));
// #endregion
// #region notes elements
const editNotes = (document.getElementById('notes-edit'));
// #endregion
// #endregion
/**
 * Updates ALL fields of the html file.
 */
export function fillHTMLOnInitialize() {
    updateDisplayHTML();
    fillBasicInfoEditHTML();
    fillHPInfoEditHTML();
    fillFeaturesEditHTML();
    fillEquipmentEditHTML();
    fillAttacksEditHTML();
    fillPowersEditHTML();
    fillNotesEditHTML();
    fillBonusesHTML();
}
/**
 * Updates all display fields of the html file.
 */
export function updateDisplayHTML() {
    fillBasicInfoDisplayHTML();
    fillHPInfoDisplayHTML();
    fillFeaturesDisplayHTML();
    fillEquipmentDisplayHTML();
    fillAttacksDisplayHTML();
    fillPowersDisplayHTML();
    fillNotesDisplayHTML();
    fillAttributesAndSkillsHTML();
}
// #region functions filling display sections
function fillBasicInfoDisplayHTML() {
    characterName.innerText = characterSheet.name;
    species.innerText = characterSheet.species;
    characterClass.innerText = characterSheet.class;
    archetype.innerText = characterSheet.archetype;
    level.innerText = String(characterSheet.level);
    background.innerText = characterSheet.background;
    alignment.innerText = characterSheet.alignment;
    proficiencyBonus.innerText = `+${getProficiencyBonus(characterSheet.level)}`;
    speed.innerText = String(characterSheet.speed);
    armorClass.innerText = String(calculateAC());
    personalityTraits.innerText = characterSheet.personalityTraits;
    ideal.innerText = characterSheet.ideal;
    bond.innerText = characterSheet.bond;
    flaw.innerText = characterSheet.flaw;
    initiative.innerText = String(getInitiativeBonus());
}
function fillHPInfoDisplayHTML() {
    currHp.innerText = String(characterSheet.hitPoints.current);
    maxHp.innerText = String(characterSheet.hitPoints.max);
    tempHp.innerText = String(characterSheet.hitPoints.temporary);
    availableHitDice.value = String(characterSheet.hitDice.left);
    hitDiceMax.innerText = String(characterSheet.level);
    hitDiceDie.innerText = String(characterSheet.hitDice.type);
    let displays = ['Take', 'Heal', 'Add'];
    healOrDamageSubmit.innerText = displays[healOrDamageSelect.selectedIndex];
    let successes = deathSavesSucc.children;
    let failures = deathSavesFail.children;
    for (let i = 0; i < 3; i++) {
        let succ = successes[i];
        let fail = failures[i];
        succ.checked = i < characterSheet.deathSaves.succeeded;
        fail.checked = i < characterSheet.deathSaves.failed;
    }
}
function fillFeaturesDisplayHTML() {
    otherProficiencies.innerHTML = '';
    for (let prof of characterSheet.otherProficiencies) {
        let profHTML = document.createElement('li');
        profHTML.innerText = prof;
        otherProficiencies.appendChild(profHTML);
    }
    languages.innerHTML = '';
    for (let lang of characterSheet.languages) {
        let langHTML = document.createElement('li');
        langHTML.innerText = lang;
        languages.appendChild(langHTML);
    }
    featuresAndTraits.innerHTML = '';
    for (let feature of characterSheet.features) {
        let li = document.createElement('li');
        let name = document.createElement('h4');
        name.className = 'label';
        name.innerText = feature.name;
        li.appendChild(name);
        if (feature.usesMax !== 0) {
            let restLabel = document.createElement('h4');
            restLabel.className = 'label';
            restLabel.innerText = 'Rest:';
            li.appendChild(restLabel);
            let rest = document.createElement('h4');
            if (feature.refresh === 'longRest')
                rest.innerText = 'long';
            else if (feature.refresh === 'shortRest')
                rest.innerText = 'short';
            else
                rest.innerText = 'none';
            li.appendChild(rest);
            let usesLabel = document.createElement('h4');
            usesLabel.className = 'label';
            usesLabel.innerText = 'Uses:';
            li.appendChild(usesLabel);
            let limitedUsesWrapper = document.createElement('div');
            limitedUsesWrapper.className = 'limited-uses-wrapper';
            let usesAmount = document.createElement('input');
            usesAmount.type = 'number';
            usesAmount.className = 'number underlined-input__number';
            usesAmount.value = String(feature.usesLeft);
            limitedUsesWrapper.appendChild(usesAmount);
            let slash = document.createElement('h4');
            slash.className = 'slash-separator';
            slash.innerText = '/';
            limitedUsesWrapper.appendChild(slash);
            let maxUses = document.createElement('h4');
            maxUses.className = 'label';
            maxUses.innerText = String(feature.usesMax);
            limitedUsesWrapper.appendChild(maxUses);
            li.appendChild(limitedUsesWrapper);
        }
        let description = document.createElement('p');
        description.innerText = feature.description;
        li.appendChild(description);
        featuresAndTraits.appendChild(li);
    }
}
function fillEquipmentDisplayHTML() {
    credits.value = String(characterSheet.credits);
    equipment.innerHTML = '';
    for (let item of characterSheet.equipment) {
        let li = document.createElement('li');
        li.className = 'equipment__item';
        let amountAndName = document.createElement('div');
        amountAndName.className = 'item-amount-and-name';
        if (item.amount > 1) {
            let amount = document.createElement('h4');
            amount.className = 'label';
            amount.innerText = `${item.amount}x`;
            amountAndName.appendChild(amount);
        }
        let name = document.createElement('h4');
        name.className = 'label';
        name.innerText = item.name;
        amountAndName.appendChild(name);
        li.appendChild(amountAndName);
        if (item.usesMax !== 0) {
            let usesLabel = document.createElement('h4');
            usesLabel.className = 'label';
            usesLabel.innerText = 'Uses:';
            li.appendChild(usesLabel);
            let limitedUsesWrapper = document.createElement('div');
            limitedUsesWrapper.className = 'limited-uses-wrapper';
            let usesAmount = document.createElement('input');
            usesAmount.type = 'number';
            usesAmount.className = 'number underlined-input__number';
            usesAmount.value = String(item.usesLeft);
            limitedUsesWrapper.appendChild(usesAmount);
            let slash = document.createElement('h4');
            slash.className = 'slash-separator';
            slash.innerText = '/';
            limitedUsesWrapper.appendChild(slash);
            let maxUses = document.createElement('h4');
            maxUses.className = 'label';
            maxUses.innerText = String(item.usesMax);
            limitedUsesWrapper.appendChild(maxUses);
            li.appendChild(limitedUsesWrapper);
        }
        let notes = document.createElement('p');
        notes.innerText = item.notes;
        li.appendChild(notes);
        equipment.appendChild(li);
    }
}
function fillAttacksDisplayHTML() {
    let atkTableHeader = attacksTable.firstElementChild;
    if (attacksTable.firstElementChild.nodeName === 'TBODY')
        atkTableHeader = atkTableHeader.firstElementChild;
    attacksTable.innerHTML = '';
    attacksTable.appendChild(atkTableHeader);
    for (let atk of characterSheet.attacks)
        attacksTable.appendChild(createAttackTableRow(atk));
}
function createAttackTableRow(atk) {
    let row = document.createElement('tr');
    let name = document.createElement('td');
    name.className = 'attack-name';
    name.innerText = atk.name;
    row.appendChild(name);
    let atkBonus = document.createElement('td');
    atkBonus.className = 'attack-atk-bonus';
    let attackBonus = calculateAttackBonus(atk);
    let sign = attackBonus >= 0 ? '+' : '';
    atkBonus.innerText = `${sign}${attackBonus}`;
    row.appendChild(atkBonus);
    let dmg = document.createElement('td');
    dmg.className = 'attack-damage';
    dmg.innerText = calculateAttackDamage(atk);
    row.appendChild(dmg);
    let note = document.createElement('td');
    note.className = 'attack-notes';
    note.innerText = atk.notes;
    row.appendChild(note);
    return row;
}
function fillPowersDisplayHTML() {
    maxPowerPoints.innerText = String(characterSheet.powerPointsMax);
    currentPowerPoints.value = String(characterSheet.powerPointsLeft);
    techSaveDC.innerText = String(getPowerSaveDC('tech'));
    let techAtk = getPowerAttackBonus('tech');
    techAttackBonus.innerText = techAtk >= 0 ? `+${techAtk}` : String(techAtk);
    darkSideSaveDC.innerText = String(getPowerSaveDC('dark'));
    let darkAtk = getPowerAttackBonus('dark');
    darkSideAttackBonus.innerText = darkAtk >= 0 ? `+${darkAtk}` : String(darkAtk);
    lightSideSaveDC.innerText = String(getPowerSaveDC('light'));
    let lightAtk = getPowerAttackBonus('light');
    lightSideAttackBonus.innerText =
        lightAtk >= 0 ? `+${lightAtk}` : String(lightAtk);
    for (let i = 0; i <= 9; i++)
        fillSinglePowerLevelDisplayHTML(i);
}
function fillNotesDisplayHTML() {
    notes.innerText = characterSheet.notes;
}
function fillSinglePowerLevelDisplayHTML(level) {
    let levelStr = level === 0 ? 'at-will' : `level-${level}`;
    let powersAtLevel = document.getElementById(`powers__${levelStr}`);
    powersAtLevel.innerHTML = '';
    powersAtLevel.appendChild(document.createElement('br'));
    let ul = document.createElement('ul');
    for (let power of characterSheet.powers[`level${level}`]) {
        let li = document.createElement('li');
        li.className = 'power';
        let name = document.createElement('h3');
        name.className = 'label';
        name.innerText = power.name;
        li.appendChild(name);
        let alignmentDiv = document.createElement('div');
        alignmentDiv.className = 'power__single-line';
        let alignmentLabel = document.createElement('h4');
        alignmentLabel.className = 'label';
        alignmentLabel.innerText = 'Force Alignment:';
        alignmentDiv.appendChild(alignmentLabel);
        let alignment = document.createElement('h4');
        alignment.className = 'label';
        alignment.innerText = power.alignment;
        alignmentDiv.appendChild(alignment);
        li.appendChild(alignmentDiv);
        let castingPeriodDiv = document.createElement('div');
        castingPeriodDiv.className = 'power__single-line';
        let castingPeriodLabel = document.createElement('h4');
        castingPeriodLabel.className = 'label';
        castingPeriodLabel.innerText = 'Casting Period:';
        castingPeriodDiv.appendChild(castingPeriodLabel);
        let castingPeriod = document.createElement('h4');
        castingPeriod.className = 'label';
        castingPeriod.innerText = power.casting;
        castingPeriodDiv.appendChild(castingPeriod);
        li.appendChild(castingPeriodDiv);
        let rangeDiv = document.createElement('div');
        rangeDiv.className = 'power__single-line';
        let rangeLabel = document.createElement('h4');
        rangeLabel.className = 'label';
        rangeLabel.innerText = 'Range:';
        rangeDiv.appendChild(rangeLabel);
        let range = document.createElement('h4');
        range.className = 'label';
        range.innerText = power.range;
        rangeDiv.appendChild(range);
        li.appendChild(rangeDiv);
        let durationDiv = document.createElement('div');
        durationDiv.className = 'power__single-line';
        let durationLabel = document.createElement('h4');
        durationLabel.className = 'label';
        durationLabel.innerText = 'Duration:';
        durationDiv.appendChild(durationLabel);
        let duration = document.createElement('h4');
        duration.className = 'label';
        duration.innerText = power.duration;
        durationDiv.appendChild(duration);
        li.appendChild(durationDiv);
        let concentrationDiv = document.createElement('div');
        concentrationDiv.className = 'power__single-line';
        let concentrationLabel = document.createElement('h4');
        concentrationLabel.className = 'label';
        concentrationLabel.innerText = 'Concentration:';
        concentrationDiv.appendChild(concentrationLabel);
        let concentration = document.createElement('input');
        concentration.className = 'checkbox unclickable-checkbox';
        concentration.type = 'checkbox';
        concentration.checked = power.concentration;
        concentration.disabled = true;
        concentrationDiv.appendChild(concentration);
        li.appendChild(concentrationDiv);
        let descriptionLabel = document.createElement('h4');
        descriptionLabel.className = 'label';
        descriptionLabel.innerText = 'Description:';
        li.appendChild(descriptionLabel);
        let description = document.createElement('p');
        description.innerText = power.description;
        li.appendChild(description);
        ul.appendChild(li);
        powersAtLevel.appendChild(ul);
    }
}
// #endregion
// #region functions filling edit sections
function fillAttributesAndSkillsHTML() {
    strengthScore.value = String(characterSheet.attributes.strength);
    strengthMod.innerText = String(getAttributeModifier('strength'));
    dexterityScore.value = String(characterSheet.attributes.dexterity);
    dexterityMod.innerText = String(getAttributeModifier('dexterity'));
    constitutionScore.value = String(characterSheet.attributes.constitution);
    constitutionMod.innerText = String(getAttributeModifier('constitution'));
    intelligenceScore.value = String(characterSheet.attributes.intelligence);
    intelligenceMod.innerText = String(getAttributeModifier('intelligence'));
    wisdomScore.value = String(characterSheet.attributes.wisdom);
    wisdomMod.innerText = String(getAttributeModifier('wisdom'));
    charismaScore.value = String(characterSheet.attributes.charisma);
    charismaMod.innerText = String(getAttributeModifier('charisma'));
    for (let skill in skills) {
        let camelCase = stringToCamelCase(skill.replace(/-/g, ' '));
        let skillProficiencyHTML = (document.getElementById(`${skill}-prof`));
        let skillExpertiseHTML = (document.getElementById(`${skill}-expertise`));
        let skillScoreHTML = document.getElementById(`${skill}-score`);
        for (let prof of characterSheet.proficiencies) {
            if (prof === camelCase) {
                skillProficiencyHTML.checked = true;
                break;
            }
        }
        for (let prof of characterSheet.expertise) {
            if (prof === camelCase) {
                skillExpertiseHTML.checked = true;
                break;
            }
        }
        if (skillExpertiseHTML != null) {
            skillExpertiseHTML.disabled = !skillProficiencyHTML.checked;
            skillProficiencyHTML.disabled = skillExpertiseHTML.checked;
        }
        skillScoreHTML.innerText = String(getSkillMod(skill));
    }
    passivePerception.innerText = String(getPassiveSkill('perception'));
}
function fillBonusesHTML() {
    bonuses.innerHTML = '';
    for (let bonusName in characterSheet.bonuses) {
        let bonusValue = characterSheet.bonuses[bonusName];
        let wrapper = document.createElement('div');
        wrapper.className = 'bonus-wrapper';
        let name = document.createElement('h4');
        name.className = 'label';
        name.innerText = bonusName;
        wrapper.appendChild(name);
        let input = document.createElement('input');
        input.className = 'number';
        input.type = 'number';
        // change the camel case name to being separated by dashes, so it fits html standard
        input.id = `${stringCamelCaseToDashes(bonusName)}-bonus-value`;
        input.value = String(bonusValue);
        wrapper.appendChild(input);
        bonuses.appendChild(wrapper);
    }
}
export function fillBasicInfoEditHTML() {
    editCharacterName.value = characterSheet.name;
    editSpecies.value = characterSheet.species;
    editClass.value = characterSheet.class;
    editArchetype.value = characterSheet.archetype;
    editLevel.value = String(characterSheet.level);
    editBackground.value = characterSheet.background;
    editAlignment.value = characterSheet.alignment;
    editSpeed.value = String(characterSheet.speed);
    editBaseArmorClass.value = String(characterSheet.baseAc);
    editPersonalityTraits.value = characterSheet.personalityTraits;
    editIdeal.value = characterSheet.ideal;
    editBond.value = characterSheet.bond;
    editFlaw.value = characterSheet.flaw;
}
export function fillHPInfoEditHTML() {
    editMaxHP.value = String(characterSheet.hitPoints.max);
    editHitDiceDie.value = String(characterSheet.hitDice.type);
}
export function fillFeaturesEditHTML() {
    editOtherProficiencies.innerHTML = '';
    for (let prof of characterSheet.otherProficiencies) {
        let profLi = document.createElement('li');
        let deleteBtn = document.createElement('input');
        deleteBtn.className = 'button sheet-delete-btn-txt';
        deleteBtn.type = 'button';
        deleteBtn.value = 'Delete';
        profLi.appendChild(deleteBtn);
        let profInput = document.createElement('input');
        profInput.className = 'text';
        profInput.type = 'text';
        profInput.value = prof;
        profLi.appendChild(profInput);
        editOtherProficiencies.appendChild(profLi);
    }
    editLanguages.innerHTML = '';
    for (let lang of characterSheet.languages) {
        let langLi = document.createElement('li');
        let deleteBtn = document.createElement('input');
        deleteBtn.className = 'button sheet-delete-btn-txt';
        deleteBtn.type = 'button';
        deleteBtn.value = 'Delete';
        langLi.appendChild(deleteBtn);
        let langInput = document.createElement('input');
        langInput.className = 'text';
        langInput.type = 'text';
        langInput.value = lang;
        langLi.appendChild(langInput);
        editLanguages.appendChild(langLi);
    }
    editFeaturesAndTraits.innerHTML = '';
    for (let feature of characterSheet.features) {
        let li = document.createElement('li');
        let deleteBtn = document.createElement('input');
        deleteBtn.className = 'button sheet-delete-btn-txt';
        deleteBtn.type = 'button';
        deleteBtn.value = 'Delete';
        li.appendChild(deleteBtn);
        let name = document.createElement('input');
        name.className = 'text';
        name.type = 'text';
        name.value = feature.name;
        li.appendChild(name);
        let restLabel = document.createElement('h4');
        restLabel.className = 'label';
        restLabel.innerText = 'Recharge:';
        li.appendChild(restLabel);
        let restSelect = document.createElement('select');
        let optionLong = document.createElement('option');
        optionLong.innerText = 'long';
        let optionShort = document.createElement('option');
        optionShort.innerText = 'short';
        let optionNone = document.createElement('option');
        optionNone.innerText = 'none';
        restSelect.appendChild(optionLong);
        restSelect.appendChild(optionShort);
        restSelect.appendChild(optionNone);
        if (feature.refresh === 'longRest')
            restSelect.options.selectedIndex = 0;
        else if (feature.refresh === 'shortRest')
            restSelect.options.selectedIndex = 1;
        else
            restSelect.options.selectedIndex = 2;
        li.appendChild(restSelect);
        let usesLabel = document.createElement('h4');
        usesLabel.className = 'label';
        usesLabel.innerText = 'Max uses:';
        li.appendChild(usesLabel);
        let maxUses = document.createElement('input');
        maxUses.className = 'number';
        maxUses.type = 'number';
        maxUses.value = String(feature.usesMax);
        li.appendChild(maxUses);
        let description = document.createElement('textarea');
        description.cols = 80;
        description.rows = 5;
        description.value = feature.description;
        li.appendChild(description);
        editFeaturesAndTraits.appendChild(li);
    }
}
export function fillEquipmentEditHTML() {
    editEquipment.innerHTML = '';
    for (let item of characterSheet.equipment) {
        let li = document.createElement('li');
        li.className = 'equipment__item';
        let deleteBtn = document.createElement('input');
        deleteBtn.type = 'button';
        deleteBtn.className = 'button sheet-delete-btn-txt';
        deleteBtn.value = 'Delete';
        li.appendChild(deleteBtn);
        let name = document.createElement('input');
        name.className = 'text';
        name.type = 'text';
        name.value = item.name;
        li.appendChild(name);
        let amountLabel = document.createElement('h4');
        amountLabel.className = 'label';
        amountLabel.innerText = 'Amount:';
        li.appendChild(amountLabel);
        let amount = document.createElement('input');
        amount.type = 'number';
        amount.className = 'number underlined-input__number';
        amount.value = String(item.amount);
        li.appendChild(amount);
        let usesLabel = document.createElement('h4');
        usesLabel.className = 'label';
        usesLabel.innerText = 'Max Uses:';
        li.appendChild(usesLabel);
        let maxUses = document.createElement('input');
        maxUses.type = 'number';
        maxUses.className = 'number underlined-input__number';
        maxUses.value = String(item.usesMax);
        li.appendChild(maxUses);
        let notesLabel = document.createElement('h4');
        notesLabel.className = 'label';
        notesLabel.innerText = 'Notes:';
        li.appendChild(notesLabel);
        let notes = document.createElement('textarea');
        notes.cols = 80;
        notes.rows = 5;
        notes.value = item.notes;
        li.appendChild(notes);
        editEquipment.appendChild(li);
    }
}
export function fillAttacksEditHTML() {
    editAttacks.innerHTML = '';
    for (let attack of characterSheet.attacks) {
        let li = document.createElement('li');
        let deleteBtn = document.createElement('input');
        deleteBtn.className = 'button sheet-delete-btn-txt';
        deleteBtn.type = 'button';
        deleteBtn.value = 'Delete';
        li.appendChild(deleteBtn);
        let name = document.createElement('input');
        name.className = 'text';
        name.type = 'text';
        name.value = attack.name;
        li.appendChild(name);
        let proficientLabel = document.createElement('h4');
        proficientLabel.className = 'label';
        proficientLabel.innerText = 'Proficient:';
        li.appendChild(proficientLabel);
        let proficient = document.createElement('input');
        proficient.className = 'checkbox';
        proficient.type = 'checkbox';
        proficient.checked = attack.proficiency;
        li.appendChild(proficient);
        let finesseLabel = document.createElement('h4');
        finesseLabel.className = 'label';
        finesseLabel.innerText = 'Finesse:';
        li.appendChild(finesseLabel);
        let finesse = document.createElement('input');
        finesse.className = 'checkbox';
        finesse.type = 'checkbox';
        finesse.checked = attack.finesse;
        li.appendChild(finesse);
        let rangedLabel = document.createElement('h4');
        rangedLabel.className = 'label';
        rangedLabel.innerText = 'Ranged:';
        li.appendChild(rangedLabel);
        let ranged = document.createElement('input');
        ranged.className = 'checkbox';
        ranged.type = 'checkbox';
        ranged.checked = attack.ranged;
        li.appendChild(ranged);
        let dmgDiceAmountLabel = document.createElement('h4');
        dmgDiceAmountLabel.className = 'label';
        dmgDiceAmountLabel.innerText = 'Damage Dice Amount:';
        li.appendChild(dmgDiceAmountLabel);
        let dmgDiceAmount = document.createElement('input');
        dmgDiceAmount.className = 'number';
        dmgDiceAmount.type = 'number';
        dmgDiceAmount.value = String(attack.dmgDiceAmount);
        li.appendChild(dmgDiceAmount);
        let dmgDiceValueLabel = document.createElement('h4');
        dmgDiceValueLabel.className = 'label';
        dmgDiceValueLabel.innerText = 'Damage Dice Value:';
        li.appendChild(dmgDiceValueLabel);
        let dmgDiceValue = document.createElement('input');
        dmgDiceValue.className = 'number';
        dmgDiceValue.type = 'number';
        dmgDiceValue.value = String(attack.dmgDiceValue);
        li.appendChild(dmgDiceValue);
        let dmgTypeLabel = document.createElement('h4');
        dmgTypeLabel.className = 'label';
        dmgTypeLabel.innerText = 'Damage Type:';
        li.appendChild(dmgTypeLabel);
        let dmgType = document.createElement('input');
        dmgType.className = 'text';
        dmgType.type = 'text';
        dmgType.value = String(attack.dmgType);
        li.appendChild(dmgType);
        let dmgBonusLabel = document.createElement('h4');
        dmgBonusLabel.className = 'label';
        dmgBonusLabel.innerText = 'Damage Bonus:';
        li.appendChild(dmgBonusLabel);
        let dmgBonus = document.createElement('input');
        dmgBonus.className = 'number';
        dmgBonus.type = 'number';
        dmgBonus.value = String(attack.dmgBonus);
        li.appendChild(dmgBonus);
        let atkBonusLabel = document.createElement('h4');
        atkBonusLabel.className = 'label';
        atkBonusLabel.innerText = 'Attack Bonus:';
        li.appendChild(atkBonusLabel);
        let atkBonus = document.createElement('input');
        atkBonus.className = 'number';
        atkBonus.type = 'number';
        atkBonus.value = String(attack.atkBonus);
        li.appendChild(atkBonus);
        let notesLabel = document.createElement('h4');
        notesLabel.className = 'label';
        notesLabel.innerText = 'Notes:';
        li.appendChild(notesLabel);
        let notes = document.createElement('textarea');
        notes.cols = 80;
        notes.rows = 2;
        notes.value = String(attack.notes);
        li.appendChild(notes);
        editAttacks.appendChild(li);
    }
}
export function fillPowersEditHTML() {
    let maxPowerPoints = (document.getElementById('max-power-points-edit'));
    maxPowerPoints.value = String(characterSheet.powerPointsMax);
    for (let i = 0; i <= 9; i++)
        fillSinglePowerLevelEditHTML(i);
}
function fillNotesEditHTML() {
    editNotes.value = characterSheet.notes;
}
function fillSinglePowerLevelEditHTML(level) {
    let levelStr = level === 0 ? 'at-will' : `level-${level}`;
    let powersAtLevel = document.getElementById(`powers__${levelStr}-edit`);
    powersAtLevel.innerHTML = '';
    powersAtLevel.appendChild(document.createElement('br'));
    let ul = document.createElement('ul');
    for (let power of characterSheet.powers[`level${level}`]) {
        let li = document.createElement('li');
        li.className = 'power';
        let deleteBtn = document.createElement('input');
        deleteBtn.className = 'button sheet-delete-btn-txt';
        deleteBtn.type = 'button';
        deleteBtn.value = 'Delete';
        li.appendChild(deleteBtn);
        let name = document.createElement('input');
        name.className = 'text';
        name.type = 'text';
        name.value = power.name;
        li.appendChild(name);
        let alignmentDiv = document.createElement('div');
        alignmentDiv.className = 'power__single-line';
        let alignmentLabel = document.createElement('h4');
        alignmentLabel.className = 'label';
        alignmentLabel.innerText = 'Force Alignment:';
        alignmentDiv.appendChild(alignmentLabel);
        let alignment = document.createElement('input');
        alignment.className = 'text';
        alignment.type = 'text';
        alignment.value = power.alignment;
        alignmentDiv.appendChild(alignment);
        li.appendChild(alignmentDiv);
        let castingPeriodDiv = document.createElement('div');
        castingPeriodDiv.className = 'power__single-line';
        let castingPeriodLabel = document.createElement('h4');
        castingPeriodLabel.className = 'label';
        castingPeriodLabel.innerText = 'Casting Period:';
        castingPeriodDiv.appendChild(castingPeriodLabel);
        let castingPeriod = document.createElement('input');
        castingPeriod.className = 'text';
        castingPeriod.type = 'text';
        castingPeriod.value = power.casting;
        castingPeriodDiv.appendChild(castingPeriod);
        li.appendChild(castingPeriodDiv);
        let rangeDiv = document.createElement('div');
        rangeDiv.className = 'power__single-line';
        let rangeLabel = document.createElement('h4');
        rangeLabel.className = 'label';
        rangeLabel.innerText = 'Range:';
        rangeDiv.appendChild(rangeLabel);
        let range = document.createElement('input');
        range.className = 'text';
        range.type = 'text';
        range.value = power.range;
        rangeDiv.appendChild(range);
        li.appendChild(rangeDiv);
        let durationDiv = document.createElement('div');
        durationDiv.className = 'power__single-line';
        let durationLabel = document.createElement('h4');
        durationLabel.className = 'label';
        durationLabel.innerText = 'Duration:';
        durationDiv.appendChild(durationLabel);
        let duration = document.createElement('input');
        duration.className = 'text';
        duration.type = 'text';
        duration.value = power.duration;
        durationDiv.appendChild(duration);
        li.appendChild(durationDiv);
        let concentrationDiv = document.createElement('div');
        concentrationDiv.className = 'power__single-line';
        let concentrationLabel = document.createElement('h4');
        concentrationLabel.className = 'label';
        concentrationLabel.innerText = 'Concentration:';
        concentrationDiv.appendChild(concentrationLabel);
        let concentration = document.createElement('input');
        concentration.className = 'checkbox';
        concentration.type = 'checkbox';
        concentration.checked = power.concentration;
        concentrationDiv.appendChild(concentration);
        li.appendChild(concentrationDiv);
        let descriptionLabel = document.createElement('h4');
        descriptionLabel.className = 'label';
        descriptionLabel.innerText = 'Description:';
        li.appendChild(descriptionLabel);
        let description = document.createElement('textarea');
        description.cols = 80;
        description.rows = 5;
        description.value = power.description;
        li.appendChild(description);
        ul.appendChild(li);
        powersAtLevel.appendChild(ul);
    }
}
// #endregion
updateTitle();
fillHTMLOnInitialize();
addAllEventListeners();
