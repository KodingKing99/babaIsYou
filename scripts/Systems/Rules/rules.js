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
    function applyRule(sentance, startIndex, keys) {
        let ent1 = keys[startIndex];
        let ent2 = keys[startIndex + 1];
        let ent3 = keys[startIndex + 2];
        getEntity(sentance[ent1].components.noun, entities)
    }
    function applyRules(sentance, startIndex, keys, entities) {
        if (startIndex < keys.length - 3) {
            let ent1 = keys[startIndex];
            let ent2 = keys[startIndex + 1];
            let ent3 = keys[startIndex + 2];
            if (sentance[ent1].components.text.wordType === 'NOUN') {
                if (sentance[ent2.components.text.wordType === 'VERB']) {
                    if (sentance[ent3.components.text.wordType === 'ADJECTIVE']) {
                        applyRule(sentance, startIndex, keys)
                        // applyRules(sentance, startIndex + 1, keys)
                    }
                }
            }
            else {
                applyRules(sentance, startIndex + 1, keys, entities);
            }
        }
        else {
            return;
        }

    }
    function applyRules(sentance, entities) {
        let mKeys = Object.keys(dict);
        // let word = mKeys[0];


    }
    function checkForRules(sentances) {
        if (Object.keys(sentances.down).length >= 3) {
            if (hasIsInMiddle(sentances.down)) {
                applyRules(sentances.down);
            }
            // if(hasIsInMiddle(sentances.down)){
            //     // applyRules(sentances.down);
            // }
        }
    }
    function update(elapsedTime, entities, board) {
        for (let key in entities) {
            // console.log(key)
            let entity = entities[key];

            if (entity.components.text) {
                let sentances = getPossibleSentancesHelper(entity, board);
                checkForRules(sentances);
            }
        }
    }
    return {
        update: update
    }
}())