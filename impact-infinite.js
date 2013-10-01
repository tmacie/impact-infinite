// The MIT License (MIT)

// Copyright (c) 2013 Tom Macie

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

ig.module(
	'plugins.impact-infinite'
)
.requires(
	'impact.system',
	'impact.game'
)
.defines(function() {

ig.InfiniteLevel = ig.Class.extend({
	levels: null,
	start: null,

	init: function(levels, start) {
		this.levels = levels;
		this.start = !start ? null : start;

		var allLevels = this.levels;
		if(this.start != null) {
			allLevels = allLevels.concat([this.start]);
		}

		// get all layer names
		var layerNames = [];
		for(var i = 0; i < allLevels.length; i++) {
			var level = allLevels[i];
			for(var j = 0; j < level.layer.length; j++) {
				var layer = level.layer[j];
				if(layerNames.indexOf(layer.name) === -1) {
					layerNames.push(layer.name);
				}
			}
		}

		// copy level data to a new variable so the level is refreshed on restart
		var LevelGameData = JSON.parse(JSON.stringify(LevelStart));
		ig.game.loadLevel(LevelGameData);

		for(var i = 0; i < layerNames.length; i++) {
			var map = this.getMap(layerNames[i]);
			if(map === false) {
				// make a new copy of the map
				var existingMap = ig.game.backgroundMaps[0],
					data = this.getEmptyMapData(existingMap.height, existingMap.width);

				var backgroundMap = new ig.BackgroundMap(existingMap.tilesize, data, existingMap.tilesetName);
				backgroundMap.anims = {};
				backgroundMap.repeat = false;
				backgroundMap.distance = existingMap.distance;
				backgroundMap.foreground = false;
				backgroundMap.preRender = false;
				backgroundMap.name = layerNames[i];
				ig.game.backgroundMaps.push(backgroundMap);
			}
		}

		ig.game.collisionMap.name = 'collision';
	},

	getMap: function(layerName) {
		for(var i = 0; i < ig.game.backgroundMaps.length; i++) {
			if(layerName === ig.game.backgroundMaps[i].name) {
				return ig.game.backgroundMaps[i];
			} else if (layerName === 'collision') {
				return ig.game.collisionMap;
			}
		}

		return false;
	},

	getEmptyMapData: function(height, width) {
		var data = [];

		// clear out the data
		for(var j = 0; j < height; j++) {
			var row = [];
			for(var k = 0; k < width; k++) {
				row.push(0);
			}
			data.push(row);
		}

		return data;
	},

	update: function() {
		// load a new set piece if necessary
		if(ig.game.backgroundMaps[0].width * ig.game.backgroundMaps[0].tilesize - ig.game.screen.x <= ig.system.width) {
			var nextLevel = this.getNextLevel();

			// spawn entites
			for(var i = 0; i < nextLevel.entities.length; i++) {
				var entity = nextLevel.entities[i];
				ig.game.spawnEntity(
					entity.type,
				 	entity.x + (ig.game.backgroundMaps[0].width * ig.game.backgroundMaps[0].tilesize),
				 	entity.y,
				 	entity.settings);
			}

			// add the tiles to the level
			for(var i = 0; i < ig.game.backgroundMaps.length; i++) {
				this.extendMap(ig.game.backgroundMaps[i], nextLevel);
			}

			this.extendMap(ig.game.collisionMap, nextLevel);
		}

		// remove tiles that are no longer visible
		if(ig.game.screen.x >= ig.game.backgroundMaps[0].tilesize) {
			for(var i = 0; i < ig.game.backgroundMaps.length; i++) {
				var data = ig.game.backgroundMaps[i].data;
				for(var j = 0; j < data.length; j++) {
					data[j].shift();
				}
				ig.game.backgroundMaps[i].width--;
			}

			for(var i = 0; i < ig.game.collisionMap.data.length; i++) {
				ig.game.collisionMap.data[i].shift();
			}
			ig.game.collisionMap.width--;

			for(var i = 0; i < ig.game.entities.length; i++) {
				ig.game.entities[i].pos.x -= ig.game.backgroundMaps[0].tilesize;
			}
			ig.game.screen.x -= ig.game.backgroundMaps[0].tilesize;
		}

		// remove entities that are no longer visible
		for(var i = 0; i < ig.game.entities.length; i++) {
			var entity = ig.game.entities[i];
			if((entity.pos.x + entity.size.x) - ig.game.screen.x < 0
				|| entity.pos.y > ig.game.screen.y + ig.system.height) {
				entity.kill();
			}
		}
	},

	getNextLevel: function() {
		var nextIdx = Math.floor(Math.random() * this.levels.length);
		return this.levels[nextIdx];
	},

	extendMap: function(map, level) {
		var layer = this.getLayer(map.name, level);

		if(!layer) {
			layer = {
				data: this.getEmptyMapData(
					level.layer[0].data.length,
					level.layer[0].data[0].length),
				width: level.layer[0].data[0].length
			};
		}

		var data = map.data;
		for(var j = 0; j < data.length; j++) {
			data[j].push.apply(data[j], layer.data[j]);
		}
		map.width += layer.width;
	},

	getLayer: function(layerName, level) {
		for(var i = 0; i < level.layer.length; i++) {
			if(layerName === level.layer[i].name) {
				return level.layer[i];
			}
		}

		return false;
	}
});

});