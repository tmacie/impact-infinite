impact-infinite
===============

This is an infinite runner plugin for ImpactJS.
You can create a series of levels in Weltmeister and these levels will continue in a random order forever.
Each level must use the same tileset and tilesize.

Here is a simple example:

```javascript
ig.module( 
    'game.main' 
)
.requires(
    'impact.game',
    'game.levels.start',
    'game.levels.1',
    'game.levels.2',
    'plugins.impact-infinite'
)
.defines(function(){

MyGame = ig.Game.extend({
    infiniteLevel: null,

    init: function() {
        this.infiniteLevel = new ig.InfiniteLevel([Level1, Level2], {start: LevelStart});
    },
    
    update: function() {
        this.parent();
        this.infiniteLevel.update();
    }
});

});
```

LevelStart (which is optional) will be loaded first, so this is a good place to spawn your player.
After that, Level1 and Level2 will be randomly chosen.
It is up to you to move the screen.  The next level is chosen when the screen reaches the end of the current level.

you can also pass the follow options to the constructor:
* checkX - determines if entities should be killed when they leave the screen on the x-axis (default: true)
* checkY - determines if entities should be killed when they leave the screen on the y-axis (default: true)
* nextLevelFunc - a function that should accept the number of levels as an argument and returns the index of the next file that should be loaded.

For a more complex example, see the example/ folder, or go to http://impact-infinite-example.azurewebsites.net/
