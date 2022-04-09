MyGame.systems['movement'] = (function () {
    'use strict';
    let canMove = false;
    let moveTime = 750;
    function addEntityToBoard(entity, board) {
        let entityPosition = entity.components['board-position'];
        board.cells[entityPosition.x][entityPosition.y].addContent(entity);
        let boardCenterY = board.cells[entityPosition.x][entityPosition.y].center.y;
        entity.components.position.y = boardCenterY;
    }
    function moveUp(entity, board) {
        let entityPosition = entity.components['board-position'];
        // console.log(`in move up. entity position is ${entityPosition}`)
        board.cells[entityPosition.x][entityPosition.y].removeContent(entity);
        if (entityPosition.y > 0) {
            entityPosition.y = entityPosition.y - 1;
            addEntityToBoard(entity, board);
        }
    }
    function moveDown(entity, board) {
        let entityPosition = entity.components['board-position'];
        board.cells[entityPosition.x][entityPosition.y].removeContent(entity);
        if (entityPosition.y < board.height) {
            entityPosition.y = entityPosition.y + 1;
            addEntityToBoard(entity, board);
        }
    }
    // Set the sprite of the bunny to face the right direction
    function setFacing(entity, direction) {
        if (entity.components.sprite) {
            if (entity.components.sprite.key.match(/bunny/)) {
                entity.components.sprite.key = 'bunnyUp';
                // switch (direction) {
                //     case MyGame.constants.direction.UP:
                //         entity.components.sprite.key = 'bunnyUp';
                        // if (entity.components.movable.facing != MyGame.constants.direction.UP) {
                        //     entity.components.movable.facing = MyGame.constants.direction.UP;
                        // }

                // }

            }
        }
    }
    // let moveFunctions = {
    //     up: moveUp,
    // };
    function moveEntityOnBoard(entity, board) {
        // let entityPosition = entity.components.boardPostion;
        let movable = entity.components.movable;
        switch (movable.moveDirection) {
            case MyGame.constants.direction.UP:
                movable.moveDirection = MyGame.constants.direction.STOPPED;
                moveUp(entity, board);
                setFacing(entity, MyGame.constants.direction.UP);
            // case MyGame.constants.direction.DOWN:
            //     movable.moveDirection = MyGame.constants.direction.STOPPED;
            //     moveDown(entity, board);
            //     setFacing(entity, MyGame.constants.direction.DOWN);
            // case 'up': 
            //         movable.moveDirection = MyGame.constants.direction.STOPPED;
            //         moveUp(entity, board);
            //         setSprite(entity, 'up');
            // case 'up': 
            //         movable.moveDirection = MyGame.constants.direction.STOPPED;
            //         moveUp(entity, board);
            //         setSprite(entity, 'up');

        }

    }
    function update(elapsedTime, entities, gameBoard) {
        // moveTime -= elapsedTime;
        // if(moveTime <= 0){
        //     moveTime += 750
        //     canMove = true;
        // }
        for (let key in entities) {
            let entity = entities[key];
            if (entity.components.movable) {
                moveEntityOnBoard(entity, gameBoard);
            }
        }
    }

    return {
        update: update
    }
}());