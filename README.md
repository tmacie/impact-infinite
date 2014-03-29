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
		this.infiniteLevel = new ig.InfiniteLevel([Level1, Level2], LevelStart);
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

For a more complex example, see the example/ folder, or go to http://impact-infinite-example.azurewebsites.net/
