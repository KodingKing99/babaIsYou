MyGame.systems['movement'] = (function(){
    'use strict';
    function moveUp(entity, board){
        let entityPosition = entity.components['board-position'];
        console.log(`in move up. entity position is ${entityPosition}`)
        board[entityPosition.x][entityPosition.y].removeContent(entity);
        if(entityPosition.y > 0){
            entityPosition.y = entityPosition.y - 1;
            board[entityPosition.x][entityPosition.y].addContent(entity);
            let boardCenterY = board[entityPosition.x][entityPosition.y].center.y;
            entity.components.position.y = boardCenterY;
            console.log(entity);
        }
    }
    // let moveFunctions = {
    //     up: moveUp,
    // };
    function moveEntityOnBoard(entity, board){

        // let entityPosition = entity.components.boardPostion;
        let movable = entity.components.movable;
        switch(movable.moveDirection){
            case 'up':
                movable.moveDirection = MyGame.constants.direction.STOPPED;
                console.log('calling moveUp');
                moveUp(entity, board);
        }

    }
    function update(elapsedTime, entities, gameBoard){
        for(let key in entities){
            let entity = entities[key];
            if(entity.components.movable){
                moveEntityOnBoard(entity, gameBoard);
            }
        }
    }

    return{
        update: update
    }
}());