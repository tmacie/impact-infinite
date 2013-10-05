ig.module(
	'game.entities.fireball'
)
.requires(
	'impact.entity',
	'impact.entity-pool'
)
.defines(function(){

EntityFireball = ig.Entity.extend({

	_wmIgnore: true, // This entity will no be available in Weltmeister

	size: {x: 24, y: 24},
	offset: {x: 6, y: 6},
	maxVel: {x: 800, y: 400},
	
	// The fraction of force with which this entity bounces back in collisions
	bounciness: 0.8, 
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.B, // Check Against B - our evil enemy group
	collides: ig.Entity.COLLIDES.PASSIVE,
		
	animSheet: new ig.AnimationSheet( 'media/fireball.png', 36, 36 ),
	sfxSpawn: new ig.Sound( 'media/sounds/fireball.*' ),
	
	bounceCounter: 0,
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
		this.vel.y = 200;
		this.addAnim( 'idle', 1, [0] );
		
		this.sfxSpawn.play();
	},
	
	reset: function( x, y, settings ) {
		// This function is called when an instance of this class is resurrected
		// from the entity pool. (Pooling is enabled at the bottom of this file).
		this.parent( x, y, settings );
		
		this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
		this.vel.y = 200;
		this.sfxSpawn.play();
		
		// Remember, this a used entity, so we have to reset our bounceCounter
		// as well
		this.bounceCounter = 0;
	},

	update: function() {
		this.parent();

		this.currentAnim.angle += ig.system.tick * 10;
	},
		
	handleMovementTrace: function( res ) {
		this.parent( res );
		
		// Kill this fireball if it bounced more than 3 times
		if( res.collision.x || res.collision.y || res.collision.slope ) {
			this.bounceCounter++;
			if( this.bounceCounter > 3 ) {
				this.kill();
			}
		}
	},
	
	// This function is called when this entity overlaps anonther entity of the
	// checkAgainst group. I.e. for this entity, all entities in the B group.
	check: function( other ) {
		other.receiveDamage( 1, this );
		this.kill();
	}	
});


// If you have an Entity Class that instanced and removed rapidly, such as this 
// Fireball class, it makes sense to enable pooling for it. This will reduce
// strain on the GarbageCollector and make your game a bit more fluid.

// With pooling enabled, instances that are removed from the game world are not 
// completely erased, but rather put in a pool and resurrected when needed.

ig.EntityPool.enableFor( EntityFireball );


});
