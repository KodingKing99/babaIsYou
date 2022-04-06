// MyGame.systems.render.renderSystem = (function (animatedSpriteSystem) {
//     function render(entities) {
//         for (let key in entities) {
//             let entity = entities[key];
//             if (entity.components.position && entity.components.sprite && entity.components.size && entity.components.rotation) {
//                 animatedSpriteSystem.render(entity.components.sprite, entity.components.position, entity.components.size, entity.components.rotation);
//             }
//         }
//     }
//     function update(elapsedTime){
//         // do nothing for now
//     }
// }(MyGame.systems.render.renderAnimatedSprite));