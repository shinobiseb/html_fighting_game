class Sprite {
    constructor({
        position, 
        imageSrc, 
        scale = 1, 
        framesMAX = 1, 
        offset = { x: 0, y: 0 } 
    }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMAX = framesMAX
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 10
        this.offset = offset
    }

    draw() {
        c.drawImage(
            this.image,

            this.framesCurrent * (this.image.width / this.framesMAX),
            0,
            this.image.width / this.framesMAX,
            this.image.height,

            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.framesMAX) * this.scale, 
            this.image.height * this.scale
            )
    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
        if (this.framesCurrent < this.framesMAX - 1) {
        this.framesCurrent++
        } else
        this.framesCurrent = 0
        }
    }

    update() {
        this.draw()
        this.animateFrames()
    }
}


class Fighter extends Sprite{
    constructor({ 
        position, 
        velocity, 
        color = "red",  
        imageSrc, 
        scale = 1, 
        framesMAX = 1,
        offset = {x: 0, y: 0},
        sprites,
        attackBox = {
            offset: {

            },
            width: undefined,
            height: undefined
        }
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMAX,
            offset
        })

        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            } ,
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height,
        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 10
        this.sprites = sprites
        this.dead = false

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }

        console.log(this.sprites)
    }

    update() {
        this.draw()

        if (!this.dead) this.animateFrames()

        //attack boxes
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        // draw attackbox
        // c.fillRect(
        //     this.attackBox.position.x, 
        //     this.attackBox.position.y, this.attackBox.width, 
        //     this.attackBox.height
        //     )
        
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        //gravity function
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0
            this.position.y = 330
        } else this.velocity.y += gravity
    }
    

    attack() {
        this.switchSprite("attack1")
        this.isAttacking = true
    }

    takeHit() {
        this.health -= 20

        if (this.health <= 0) {
            this.switchSprite("death")
        } else {
            this.switchSprite("takeHit")
        }
    }

switchSprite(sprite) {
    if (this.image === this.sprites.death.image) {
        if (this.framesCurrent === this.sprites.death.framesMAX - 1) 
            this.dead = true
        return
    }

    //overriding all other animations with the attack animation
    if (
        this.image === this.sprites.attack1.image && 
        this.framesCurrent < this.sprites.attack1.framesMAX - 1
    ) 
        return
    
        //override when fighter gets hit
    if (
        this.image === this.sprites.takeHit.image && 
        this.framesCurrent < this.sprites.takeHit.framesMAX - 1
    ) 
        return


    switch(sprite) {
        case "idle":
            if (this.image !== this.sprites.idle.image) {
            this.image = this.sprites.idle.image
            this.framesMAX = this.sprites.idle.framesMAX
            this.framesCurrent = 0 
        }
            break;

        case "run":
            if (this.image !== this.sprites.run.image) {
            this.image = this.sprites.run.image
            this.framesMAX = this.sprites.run.framesMAX
            this.framesCurrent = 0 
        }
            break;

        case "jump":
            if (this.image !== this.sprites.jump.image) {
                this.image = this.sprites.jump.image
                this.framesMAX = this.sprites.jump.framesMAX
                this.framesCurrent = 0 
            }
            break;

        case "fall":
            if (this.image !== this.sprites.fall.image) {
                this.image = this.sprites.fall.image
                this.framesMAX = this.sprites.fall.framesMAX
                this.framesCurrent = 0 
            }
            break;

        case "attack1":
            if (this.image !== this.sprites.attack1.image) {
                this.image = this.sprites.attack1.image
                this.framesMAX = this.sprites.attack1.framesMAX
                this.framesCurrent = 0 
            }
            break

        case "takeHit":
            if (this.image !== this.sprites.takeHit.image) {
                this.image = this.sprites.takeHit.image
                this.framesMAX = this.sprites.takeHit.framesMAX
                this.framesCurrent = 0 
            }
            break

        case "death":
            if (this.image !== this.sprites.death.image) {
                this.image = this.sprites.death.image
                this.framesMAX = this.sprites.death.framesMAX
                this.framesCurrent = 0 
            }
            break
        }
    }
}
