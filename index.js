const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d")

canvas.width = 1024
canvas.height = 576

c.fillRect(0,0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite ({
    position: {
        x:0,
        y:0
    },
    imageSrc: "./images/background.png"
})

const shop = new Sprite ({
    position: {
        x:600,
        y:128
    },
    imageSrc: "./images/shop.png",
    scale: 2.75,
    framesMAX: 6
})

const player = new Fighter({
    position: {
    x: 0,
    y: 0
    },
    velocity: {
        x: 0,
        y: 10
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: "./images/samuraiMack/Idle.png",
    framesMAX: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 156
    },
    sprites: {
        idle: {
            imageSrc: "./images/samuraiMack/Idle.png",
            framesMAX: 8
        },
        run: {
            imageSrc: "./images/samuraiMack/Run.png",
            framesMAX: 8
        },
        jump: {
            imageSrc: "./images/samuraiMack/Jump.png",
            framesMAX: 2
        },
        fall: {
            imageSrc: "./images/samuraiMack/Fall.png",
            framesMAX: 2
        },
        attack1: {
            imageSrc: "./images/samuraiMack/Attack1.png",
            framesMAX: 6
        },
    }

})


const enemy = new Fighter({
    position: {
    x: 400,
    y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: "blue",
    offset: {
        x: -50,
        y: 0
    }

})

console.log(player)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = "black"
    c.fillRect(0,0, canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update()
    // enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //Player Movement
    if (keys.a.pressed && player.lastKey === "a") {
        player.velocity.x = -4
        player.switchSprite("run")
    } else if (keys.d.pressed && player.lastKey === "d") {
        player.velocity.x = 4
        player.switchSprite("run")
    } else {
        player.switchSprite("idle") 
    }

    //jumping
    if(player.velocity.y < 0) {
        player.switchSprite("jump")
    } else if (player.velocity.y > 0) {
        player.switchSprite("fall")
    }

    //Enemy Movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        enemy.velocity.x = 5
    }

    //detect collision
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking
        ) {
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector("#enemyHealth").style.width = enemy.health + "%"
        }

    //detect collision
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking
        ) {
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector("#playerHealth").style.width = player.health + "%";
        }
    

    //end game on health base
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}
    
animate()

window.addEventListener("keydown", (event)=> {
    switch(event.key) {
        //player keys
        case "d":
            keys.d.pressed = true
            player.lastKey = "d"
            break
        case "a":
            keys.a.pressed = true
            player.lastKey = "a"
            break
        case "w":
            player.velocity.y = -20
            break
        case " ":
            player.attack()
            break

        //enemy keys
        case "ArrowRight":
            keys.ArrowRight.pressed = true
            enemy.lastKey = "ArrowRight"
            break
        case "ArrowLeft":
            keys.ArrowLeft.pressed = true
            enemy.lastKey = "ArrowLeft"
            break
        case "ArrowUp":
            enemy.velocity.y = -20
            break
        case "ArrowDown":
            enemy.attack()
            break
    }
})

window.addEventListener("keyup", (event)=> {
//player keys
    switch(event.key) {
        case "d":
            keys.d.pressed = false
            break
        case "a":
            keys.a.pressed = false
            break
    }

//enemy keys
    switch(event.key) {
        case "ArrowRight":
            keys.ArrowRight.pressed = false
            break
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false
            break
    }
})



// Tutorial: https://www.youtube.com/watch?v=vyqbNFMDRGQ&t=56s