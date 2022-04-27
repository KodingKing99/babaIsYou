MyGame.systems.rules = (function () {
    //------------------------------------------------------------------
    // Returns the first index if contents contains an element with a text component
    // else -1
    //------------------------------------------------------------------
    function containsText(contents) {
        for (let i = 0; i < contents.length; i++) {
            let entity = contents[i];
            if (entity.components.text) {
                return i;
            }
        }
        return -1;
    }

    function getNeighborXY(direction, position, height, width) {
        switch (direction) {
            case 'up':
                {
                    let upX = position.x;
                    let upY = position.y;
                    if (upY > 0) {
                        upY = upY - 1;
                    }
                    return [upX, upY]
                }

            case 'down':
                {
                    let downX = position.x;
                    let downY = position.y;
                    if (downY < height - 1) {
                        downY = downY + 1;
                    }
                    return [downX, downY]
                }
            case 'left':
                {
                    let leftX = position.x;
                    let leftY = position.y;
                    if (leftX > 0) {
                        leftX = leftX - 1;
                    }
                    return [leftX, leftY]
                }
            case 'right':
                {
                    let rightX = position.x;
                    let rightY = position.y;
                    if (rightX < width - 1) {
                        rightX = rightX + 1;
                    }
                    return [rightX, rightY]
                }
        }
    }
    function getPossibleSentances(direction, entity, board, dict) {
        // let rArray;
        if (direction === 'down') {
            let entityUpPosition = entity.components['board-position'];
            let mXY = getNeighborXY('down', entityUpPosition, board.height, board.width);
            let x = mXY[0];
            let y = mXY[1];
            let textIndex = containsText(board.cells[x][y].contents);
            if (textIndex != -1) {
                entity = board.cells[x][y].contents[textIndex];
                dict[entity.id] = entity;
                return getPossibleSentances('down', entity, board, dict);
            }
            else {
                return dict;
            }
        }
        else if (direction === 'right') {
            let entityUpPosition = entity.components['board-position'];
            let mXY = getNeighborXY('right', entityUpPosition, board.height, board.width);
            let x = mXY[0];
            let y = mXY[1];
            let textIndex = containsText(board.cells[x][y].contents);
            if (textIndex != -1) {
                entity = board.cells[x][y].contents[textIndex];
                dict[entity.id] = entity;
                return getPossibleSentances('right', entity, board, dict);
            }
            else {
                return dict;
            }
        }
    }
    function getPossibleSentancesHelper(entity, board) {
        let sentances = {}
        sentances['down'] = {};
        sentances['right'] = {};
        sentances.down[entity.id] = entity;
        sentances.right[entity.id] = entity;
        sentances.down = getPossibleSentances('down', entity, board, sentances.down);
        sentances.right = getPossibleSentances('right', entity, board, sentances.right);
        return sentances;
    }
    function hasIsInMiddle(dict) {
        let isInMiddle = false;
        let i = 0;
        // while()
        // if(i )
        let length = Object.keys(dict).length;
        // won't consider at the beginning or end
        for (let key in dict) {
            if (i != 0 || i != length - 1) {
                let entity = dict[key];
                if (entity.components.text.wordType === 'VERB') {
                    isInMiddle = true;
                }
            }
            i += 1;
        }
        return isInMiddle;
    }
    function getAllNouns(valueType, entities) {
        // console.log(`getting all ${valueType}s` )
        let rDict = {}
        for (let key in entities) {
            let entity = entities[key];
            if (entity.components.noun) {
                if (entity.components.noun.valueType === valueType) {
                    rDict[entity.id] = entity;
                }
            }
        }
        return rDict;
    }
    function applyRule(sentance, startIndex, keys, entities, updateList) {
        let ent1 = keys[startIndex];
        let ent2 = keys[startIndex + 1];
        let ent3 = keys[startIndex + 2];
        let nouns = getAllNouns(sentance[ent1].components.text.valueType, entities);
        for (let key in nouns) {
            let noun = nouns[key];
            if (updateList[noun.id]) {
                updateList[noun.id].change.push(sentance[ent3].components.text.key);

            }
            else {
                updateList[noun.id] = { entity: noun, change: [sentance[ent3].components.text.key] }
            }
            let position1 = sentance[ent1].components['board-position'];
            let position2 = sentance[ent2].components['board-position'];
            let position3 = sentance[ent3].components['board-position'];
            updateList[noun.id].positions = [{ ...position1 }, { ...position2 }, { ...position3 }]
        }

    }
    function applyNounRule(sentance, startIndex, keys, entities, updateList) {
        let ent1 = keys[startIndex];
        let ent2 = keys[startIndex + 1];
        let ent3 = keys[startIndex + 2];
        let nouns = getAllNouns(sentance[ent1].components.text.valueType, entities);
        for (let key in nouns) {
            let noun = nouns[key];
            if (updateList[noun.id]) {
                updateList[noun.id].change.push(sentance[ent3].components.text.valueType);
            }
            else {
                updateList[noun.id] = { entity: noun, change: [sentance[ent3].components.text.valueType] }
            }

            // let position1 = sentance[ent1].components['board-position'];
            // let position2 = sentance[ent2].components['board-position'];
            // let position3 = sentance[ent3].components['board-position'];
            // updateList[noun.id].positions = [{ ...position1 }, { ...position2 }, { ...position3 }]
        }


    }
    function applyRules(sentance, startIndex, keys, entities, updateList, nounList) {
        if (startIndex < keys.length - 2) {
            let ent1 = keys[startIndex];
            let ent2 = keys[startIndex + 1];
            let ent3 = keys[startIndex + 2];
            if (sentance[ent1].components.text.wordType === 'NOUN') {
                if (sentance[ent2].components.text.wordType === 'VERB') {
                    if (sentance[ent3].components.text.wordType === 'ADJECTIVE') {
                        applyRule(sentance, startIndex, keys, entities, updateList)
                    }
                    else if (sentance[ent3].components.text.wordType === 'NOUN') {
                        applyNounRule(sentance, startIndex, keys, entities, nounList)
                    }
                }
            }
            else {
                applyRules(sentance, startIndex + 1, keys, entities, updateList);
            }
        }
        else {
            return;
        }

    }
    function applyRulesHelper(sentance, entities, updateList, nounList) {
        let mKeys = Object.keys(sentance);
        let copy = [...mKeys];
        copy.sort((a, b) => sentance[a].components['board-position'].x - sentance[b].components['board-position'].x)
        copy.sort((a, b) => sentance[a].components['board-position'].y - sentance[b].components['board-position'].y)
        applyRules(sentance, 0, copy, entities, updateList, nounList);
    }
    function checkForRules(sentances, entities, updateList, nounList) {
        if (Object.keys(sentances.down).length >= 3) {
            applyRulesHelper(sentances.down, entities, updateList, nounList);
        }
        if (Object.keys(sentances.right).length >= 3) {
            if (hasIsInMiddle(sentances.right)) {
                applyRulesHelper(sentances.right, entities, updateList, nounList);
            }
            // applyRulesHelper(sentances.right, entities, updateList);
        }
    }
    function addInputComponent(entity) {
        let up = MyGame.systems.keyboardInput.controls[MyGame.constants.direction.UP];
        let down = MyGame.systems.keyboardInput.controls[MyGame.constants.direction.DOWN];
        let left = MyGame.systems.keyboardInput.controls[MyGame.constants.direction.LEFT];
        let right = MyGame.systems.keyboardInput.controls[MyGame.constants.direction.RIGHT];

        entity.addComponent(MyGame.components.KeyboardControlled({
            keys: {
                [up] : MyGame.constants.direction.UP,
                [down] : MyGame.constants.direction.DOWN,
                [left] : MyGame.constants.direction.LEFT,
                [right] : MyGame.constants.direction.RIGHT,
            }
        }))
    }
    function addMovableComponent(entity) {
        //-------------------------------------------------------------
        // Initialize movable componenet 
        // Initially set to be stopped and facing down
        //-------------------------------------------------------------
        entity.addComponent(MyGame.components.Movable(
            {
                moveDirection: MyGame.constants.direction.STOPPED,
                facing: MyGame.constants.direction.RIGHT,
            }
        ))
    }

    function resetDefaults(entities) {
        // console.log(entities)
        for (let key in entities) {
            let entity = entities[key];
            if (entity.components.properties) {
                entity.removeComponent(entity.components.properties);
                // console.log(entity);

            }
            if (entity.components.text) {
                entity.addComponent(MyGame.components.Properties({ keys: ['PUSH'] }))
            }
            else if (entity.components.noun) {
                // console.log(entity.components.noun.valueType)
                if (entity.components.noun.valueType === 'Hedge') {
                    entity.addComponent(MyGame.components.Properties({ keys: ['STOP'] }));
                }
            }
        }
    }
    let oldYou = "none";
    function checkForEvents(entity, newUpdate, particleCalls) {
        for (let i = 0; i < newUpdate.change.length; i++) {
            if (newUpdate.change[i] === 'YOU') {
                if (oldYou !== entity.components.noun.valueType) {
                    oldYou = entity.components.noun.valueType;
                    for (let j = 0; j < newUpdate.positions.length; j++) {
                        particleCalls.push({ effectCall: 'NEWISYOU', position: newUpdate.positions[j] });
                    }
                }
            }
        }
    }
    function updateEntities(entities, updateList, particleCalls) {
        let winList = {};
        let winItemNames = new Set();
        for (let id in updateList) {
            // let changedEntity = updateList[id];
            let entity = entities[id];
            if (updateList[id].change[0] == 'WIN') {
                winList[entity.components.noun.valueType] = updateList[id].positions[0];
                winItemNames.add(entity.components.noun.valueType);
            }
            checkForEvents(entity, updateList[id], particleCalls);
            if (!entity.components.properties) {
                entity.addComponent(MyGame.components.Properties({ keys: updateList[id].change }));
            }
            else {
                entity.components.properties.add(updateList[id].change);
            }
            // for(let i = 0; i < entity.components.properties.keys.length; i++){
            //     let key =entity.components.properties.keys[i]; 
            //     if(key === 'SINK'){
            //         console.log(entity);
            //     }
            // }
            // if(entity.components.properties.)
            // for(let key in)
            // console.log(entity.components.properties.keys);
        }
        checkForNewWin(winList, particleCalls, winItemNames);
    }

    let oldItemNames = new Set();
    function checkForNewWin(currentList, particleCalls, winItemNames) {
        for (let name of winItemNames) {
            if (!oldItemNames.has(name)) {
                let pos = currentList[name];
                particleCalls.push({ effectCall: "NEWWIN", position: pos });
                oldItemNames = winItemNames;
                // console.log(oldItemNames);
            }
        }
        for (let name of oldItemNames) {
            if (!winItemNames.has(name)) {
                oldItemNames.delete(name);
            }
        }
    }

    function checkUndo(entity, undoList, type, nounType=false) {
        if (!undoList[entity.id]) {
            undoList[entity.id] = [{ type: type, entity: { ...entity }, nounType: nounType }]
        }
        else {
            undoList[entity.id].push({ type: type, entity: { ...entity }, nounType: nounType })
        }

    }
    function updateNouns(entities, updateList, particleCalls, nounCommandPat, board, undoList) {
        let deleteList = {};
        let mNew = {};
        let mOld = {};
        for (let id in updateList) {
            let entity = entities[id];
            let entityPosition = { ...entity.components['board-position'] };
            deleteList[entity.id] = true;
            checkUndo(entity, undoList, 'delete');
            mOld = { ...entities };
            nounCommandPat[updateList[id].change[0]](entityPosition.x, entityPosition.y, entities);
            mNew = { ...entities };
            for (let mKey in mNew) {
                if (!mOld[mKey]) {
                    checkUndo(mNew[mKey], undoList, 'add', entity.components.noun.valueType);
                }
            }
        }
        for (let id in deleteList) {
            delete entities[id];
        }
    }
    function removeInputComponent(entity) {
        if (entity.components['keyboard-controlled']) {
            entity.removeComponent(entity.components['keyboard-controlled'])
        }
        if (entity.components.movable) {
            entity.removeComponent(entity.components.movable)
        }
    }
    let isNewYou = false;
    let wasYou;
    function addComponents(entities) {
        // console.log(hasWon);
        for (let id in entities) {
            let entity = entities[id];
            if (entity.components.properties) {
                if (entity.components.properties.is('YOU')) {
                    /// if it's not initialized
                    // if (!hasWon) {
                    if (!entity.components['keyboard-controlled']) {
                        addInputComponent(entity);
                    }
                    if (!entity.components.movable) {
                        addMovableComponent(entity);
                    }
                    if (MyGame.hasWon) {
                        removeInputComponent(entity);
                    }
                }
            }
            else {
                removeInputComponent(entity);
            }
        }
    }
    function update(elapsedTime, entities, board, particleCalls, nounCommandPat, undoList) {
        resetDefaults(entities);
        let updateList = {};
        let nounList = {}
        for (let key in entities) {
            let entity = entities[key];
            if (entity.components.text) {
                let sentances = getPossibleSentancesHelper(entity, board);
                checkForRules(sentances, entities, updateList, nounList);
            }
        }
        // console.log(updateList);
        updateEntities(entities, updateList, particleCalls);
        updateNouns(entities, nounList, particleCalls, nounCommandPat, board, undoList)
        addComponents(entities);
    }
    return {
        update: update
    }
}())