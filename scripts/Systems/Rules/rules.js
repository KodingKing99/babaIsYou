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
    function checkEntities(direction, entity, board, count) {
        switch (direction) {
            case 'up':
                // checkUp(entity, board, count)
                {
                    let entityUpPosition = entity.components['board-position'];
                    let mXY = getNeighborXY('up', entityUpPosition, board.height, board.width);
                    let x = mXY[0];
                    let y = mXY[1];
                    let textIndex = containsText(board.cells[x][y].contents);
                    if (textIndex != -1) {
                        count += 1;
                        entity = board.cells[x][y].contents[textIndex];
                        return checkEntities('up', entity, board, count);
                    }
                    else {
                        return count;
                    }
                }

            case 'down':
                {
                    let entityUpPosition = entity.components['board-position'];
                    let mXY = getNeighborXY('down', entityUpPosition, board.height, board.width);
                    let x = mXY[0];
                    let y = mXY[1];
                    let textIndex = containsText(board.cells[x][y].contents);
                    if (textIndex != -1) {
                        count += 1;
                        entity = board.cells[x][y].contents[textIndex];
                        return checkEntities('down', entity, board, count);
                    }
                    else {
                        return count;
                    }
                }
            case 'left':
                {
                    let entityUpPosition = entity.components['board-position'];
                    let mXY = getNeighborXY('left', entityUpPosition, board.height, board.width);
                    let x = mXY[0];
                    let y = mXY[1];
                    let textIndex = containsText(board.cells[x][y].contents);
                    if (textIndex != -1) {
                        count += 1;
                        entity = board.cells[x][y].contents[textIndex];
                        return checkEntities('left', entity, board, count);
                    }
                    else {
                        return count;
                    }
                }
            case 'right':
                {
                    let entityUpPosition = entity.components['board-position'];
                    let mXY = getNeighborXY('right', entityUpPosition, board.height, board.width);
                    let x = mXY[0];
                    let y = mXY[1];
                    let textIndex = containsText(board.cells[x][y].contents);
                    if (textIndex != -1) {
                        count += 1;
                        entity = board.cells[x][y].contents[textIndex];
                        return checkEntities('right', entity, board, count);
                    }
                    else {
                        return count;
                    }
                }
        }

    }
    // function getIndexesHelper(entity, board, direction){
        
    // }
    function checkTextRulesHelper(entity, board) {
        let dirCounts = {
            vertCount: 0,
            horCount: 0,
        }
        let dirIndexes = {}
        // et count = 0;
        dirCounts.vertCount += checkEntities('up', entity, board, dirCounts.vertCount);
        dirCounts.vertCount += checkEntities('down', entity, board, dirCounts.vertCount);
        dirCounts.horCount += checkEntities('right', entity, board, dirCounts.horCount);
        dirCounts.horCount += checkEntities('left', entity, board, dirCounts.horCount);
        // console.log(dirCounts);
        if(dirCounts.vertCount >= 3){
            console.log("vertical count of 3 or more");
        }
        if(dirCounts.horCount >= 3){
            // dirIndexes['horizontal'] = getIndexesHelper(entity, board,'horizontal');
        }
        // console.log("count is");
        // console.log(count);

    }
    function update(elapsedTime, entities, board) {
        // for(let i = 0; i < board.cells.length; i++){
        //     for(let j = 0; j < board.cells[i].length; j++){
        //         if()
        //     }
        // }
        for (let key in entities) {
            // console.log(key)
            let entity = entities[key];

            if (entity.components.text) {
                let textCount = checkTextRulesHelper(entity, board);
            }
        }
    }
    return {
        update: update
    }
}())