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
        switch (direction) {
            // case 'up':
            //     // checkUp(entity, board, count)
            //     {

            //         let entityUpPosition = entity.components['board-position'];
            //         let mXY = getNeighborXY('up', entityUpPosition, board.height, board.width);
            //         let x = mXY[0];
            //         let y = mXY[1];
            //         let textIndex = containsText(board.cells[x][y].contents);
            //         if (textIndex != -1) {
            //             entity = board.cells[x][y].contents[textIndex];
            //             dict[entity.id] = entity;
            //             return getPossibleSentances('up', entity, board, dict);
            //         }
            //         else {
            //             return dict;
            //         }
            //     }

            case 'down':
                {
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
            // case 'left':
            //     {
            //         let entityUpPosition = entity.components['board-position'];
            //         let mXY = getNeighborXY('left', entityUpPosition, board.height, board.width);
            //         let x = mXY[0];
            //         let y = mXY[1];
            //         let textIndex = containsText(board.cells[x][y].contents);
            //         if (textIndex != -1) {
            //             count += 1;
            //             entity = board.cells[x][y].contents[textIndex];
            //             return checkEntities('left', entity, board, count);
            //         }
            //         else {
            //             return count;
            //         }
            //     }
            case 'right':
                {
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
        // console
        // let noun = getEntity(sentance[ent1].components.noun, 'noun', entities)
        // let noun = entities[sentance[ent1].id]
        let nouns = getAllNouns(sentance[ent1].components.text.valueType, entities);

        for (let key in nouns) {
            let noun = nouns[key];

            // noun.addComponent(MyGame.components.Properties({ keys: [sentance[ent3].components.text.key] }))
            if (updateList[noun.id]) {

                updateList[noun.id].change.push(sentance[ent3].components.text.key)
            }
            else {
                updateList[noun.id] = { entity: noun, change: [sentance[ent3].components.text.key] }
            }
            if (sentance[ent1].components.text.valueType === 'Flag') {
                console.log(ent3);
                console.log(sentance[ent3].components.text.key)
                console.log(noun);
                console.log(updateList[noun.id])
            }
            // if(sentance[ent1].components.text.valueType === 'Flag'){
            //     console.log(sentance[ent3].components.text.key)
            //     console.log(noun);
            // }
        }

        // console.log(nouns);
    }
    function applyRules(sentance, startIndex, keys, entities, updateList) {
        // console.log(startIndex);
        // console.log(keys.length);

        if (startIndex < keys.length - 2) {
            let ent1 = keys[startIndex];
            let ent2 = keys[startIndex + 1];
            let ent3 = keys[startIndex + 2];
            if (sentance[ent1].components.text.wordType === 'NOUN') {
                if (sentance[ent2].components.text.wordType === 'VERB') {
                    if (sentance[ent3].components.text.wordType === 'ADJECTIVE') {
                        if (sentance[ent1].components.text.valueType === 'Flag') {
                            console.log(sentance[ent1].components.text.valueType)
                            console.log(sentance[ent2].components.text.valueType)
                            console.log(sentance[ent3].components.text.valueType)
                        }

                        // console.log("Sentanace is valid, calling apply rule");
                        applyRule(sentance, startIndex, keys, entities, updateList)
                        // applyRules(sentance, startIndex + 1, keys)
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
    function applyRulesHelper(sentance, entities, updateList) {
        let mKeys = Object.keys(sentance);
        let copy = [...mKeys];
        copy.sort((a, b) => sentance[a].components['board-position'].x - sentance[b].components['board-position'].x)
        copy.sort((a, b) => sentance[a].components['board-position'].y - sentance[b].components['board-position'].y)
        applyRules(sentance, 0, copy, entities, updateList);
    }
    function checkForRules(sentances, entities, updateList) {
        if (Object.keys(sentances.down).length >= 3) {
            applyRulesHelper(sentances.down, entities, updateList);
        }
        if (Object.keys(sentances.right).length >= 3) {
            if (hasIsInMiddle(sentances.right)) {
                applyRulesHelper(sentances.right, entities, updateList);
            }
            applyRulesHelper(sentances.right, entities, updateList);
        }
    }
    function addInputComponent(entity) {
        entity.addComponent(MyGame.components.KeyboardControlled({
            keys: {
                'ArrowUp': MyGame.constants.direction.UP,
                'ArrowDown': MyGame.constants.direction.DOWN,
                'ArrowLeft': MyGame.constants.direction.LEFT,
                'ArrowRight': MyGame.constants.direction.RIGHT,
            },
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
        for (let key in entities) {
            let entity = entities[key];
            if (entity.components.properties) {
                entity.removeComponent(entity.components.properties);
                // console.log(entity);
                if (entity.components.text) {
                    entity.addComponent(MyGame.components.Properties({ keys: ['PUSH'] }))
                }
            }
        }
    }
    function updateEntities(entities, updateList) {
        for (let id in updateList) {
            // let changedEntity = updateList[id];
            let entity = entities[id];

            if (!entity.components.properties) {
                entity.addComponent(MyGame.components.Properties({ keys: updateList[id].change }));
            }
            else {
                entity.components.properties.add(updateList[id].change);
            }
            // console.log(entity.components.properties.keys);
        }
    }
    function addComponents(entities) {
        for (let id in entities) {
            let entity = entities[id];
            if (entity.components.properties) {
                if (entity.components.properties.is('YOU')) {
                    if (!entity.components['keyboard-controlled']) {
                        addInputComponent(entity);
                    }
                    if (!entity.components.movable) {
                        addMovableComponent(entity);
                    }
                }

            }
            else {
                if (entity.components['keyboard-controlled']) {
                    console.log("removing keyabord component")
                    entity.removeComponent(entity.components['keyboard-controlled'])
                    console.log(entity);
                }
                if (entity.components.movable) {
                    console.log("removing keyabord component")
                    entity.removeComponent(entity.components.movable)
                }
            }
        }
    }
    function update(elapsedTime, entities, board) {
        resetDefaults(entities);
        let updateList = {};
        for (let key in entities) {
            let entity = entities[key];

            if (entity.components.text) {
                let sentances = getPossibleSentancesHelper(entity, board);
                checkForRules(sentances, entities, updateList);
            }
        }

        updateEntities(entities, updateList);
        addComponents(entities);
    }
    return {
        update: update
    }
}())