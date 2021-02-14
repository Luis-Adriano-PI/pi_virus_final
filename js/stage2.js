var stage2State = {
    create: function() {
        this.onGame = true;
        this.music = game.add.audio('music');
        this.music.loop = true;
        this.music.volume = 0.5;
        this.music.play();

        this.sndCoin = game.add.audio('getitem');
        this.sndCoin.volume = 0.5;

        this.sndLoseCoin = game.add.audio('loseitem');
        this.sndLoseCoin.volume = 0.5;

        game.add.sprite(0,0,'bg');

        this.maze = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,3,0,0,3,0,1,3,1,0,3,0,0,3,1],
            [1,0,1,1,0,1,1,0,1,1,0,1,1,0,1],
            [1,0,3,1,3,0,0,3,0,0,3,1,3,0,1],
            [1,0,1,1,0,1,1,2,1,1,0,1,1,0,1],
            [1,3,1,0,0,1,3,0,3,1,0,0,1,3,1],
            [1,0,1,3,0,0,0,1,0,0,0,3,1,0,1],
            [1,0,1,1,1,1,0,1,0,1,1,1,1,0,1],
            [1,3,0,3,0,0,3,0,3,0,0,3,0,3,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];

        this.blocks = game.add.group();
        this.blocks.enableBody = true;

        this.coinPosition = [];

        for(var row in this.maze) {
            for(var col in this.maze[row]) {
                var tile = this.maze[row][col];

                var x = col * 50;
                var y = row * 50;

                if(tile == 1) {
                    var block = this.blocks.create(x, y, 'block');
                        block.body.immovable = true;
                }else if(tile === 2) {
                    this.player = game.add.sprite(x + 25, y + 25, 'player');
                    this.player.anchor.set(0.5);
                    game.physics.arcade.enable(this.player);
                    this.player.animations.add('goDown', [0,1,2,3,4,5,6,7], 12, true);
                    this.player.animations.add('goUp', [8,9,10,11,12,13,14,15], 12, true);
                    this.player.animations.add('goLeft', [16,17,18,19,20,21,22,23], 12, true);
                    this.player.animations.add('goRight', [24,25,26,27,28,29,30,31], 12, true);
                }else 
                if(tile === 3) {
                    var position = {
                        x: x + 25,
                        y: y + 25
                    };
                    this.coinPosition.push(position);
                }
            }
        }

        //inimigo
        this.enemy = game.add.sprite(75, 75, 'enemy');
        this.enemy.anchor.set(0.5);
        game.physics.arcade.enable(this.enemy);
        this.enemy.animations.add('goDown', [0,1,2,3,4,5,6,7], 12, true);
        this.enemy.animations.add('goUp', [8,9,10,11,12,13,14,15], 12, true);
        this.enemy.animations.add('goLeft', [16,17,18,19,20,21,22,23], 12, true);
        this.enemy.animations.add('goRight', [24,25,26,27,28,29,30,31], 12, true);
        this.enemy.direction = 'DOWN';

        //moedas
        this.coin = {};
        this.coin.position = this.newPosition();
        this.coin = game.add.sprite(this.coin.position.x, this.coin.position.y, 'coin');
        this.coin.anchor.set(0.5);
        this.coin.animations.add('spin', [0,1,2,3,4,5,6,7,8,9], 10, true).play();
        game.physics.arcade.enable(this.coin);
        
        // coletando moedas
        this.coins = game.global.coinsQuiz;
        this.txtCoins = game.add.text(15, 15, 'MOEDAS: ' + this.getText(this.coins),{font:'15px emulogic', fill: '#fff'});

        //mostrar pontos
        this.txtScore = game.add.text(game.world.centerX,15, 'PONTOS: ' + this.getText(game.global.score), {font: '15px emulogic', fill: '#fff'});
        this.txtScore.anchor.set(0.5, 0);

        // controles
        this.controls = game.input.keyboard.createCursorKeys();

        //particulas
        this.emitter = game.add.emitter(0,0, 15);
        this.emitter.makeParticles('part');
        this.emitter.setXSpeed(-50, 50);
        this.emitter.setYSpeed(-50, 50);
        this.emitter.gravity.y = 0;

        //tempo
        this.time = 60;
        this.txtTime = game.add.text(game.world.width - 15, 15, 'TEMPO: ' + this.getText(this.time), {font: '15px emulogic', fill: '#fff'});
        this.txtTime.anchor.set(1, 0);
        this.timer = game.time.events.loop(1000, function(){
            this.time--;
            this.txtTime.text = 'TEMPO: ' + this.getText(this.time);
        },this);
    },

    update: function() {
        if(this.onGame) {
            game.physics.arcade.collide(this.player, this.blocks);
            game.physics.arcade.overlap(this.player, this.coin, this.getCoin, null, this);
            game.physics.arcade.overlap(this.enemy, this.coin, this.loseCoin, null, this);
            game.physics.arcade.overlap(this.player, this.enemy, this.loseCoin, null, this);
    
            this.moveEnemy();
            this.movePlayer();
    
            if(this.time < 1 || this.coins >= 10) {
                this.gameOver();
            }
        }
    },

    gameOver: function() {
        this.onGame = false;

        game.time.events.remove(this.timer);

        this.player.body.velocity.x = 0;
        this.player.body.velocity.x = 0;
        this.player.animations.stop();
        this.player.frame = 0;
        
        this.enemy.animations.stop();
        this.enemy.frame = 0;

        if(this.coins >= 10) { //passar de fase
            var txtLevelComplete = game.add.text(game.world.centerX, 150, 'CE E O BICHAO MESMO', {font: '20px emulogic', fill: '#fff'});
                txtLevelComplete.anchor.set(0.5);

            var bonus = this.time * 1;
            game.global.score += bonus;
            this.txtScore.text = 'PONTOS: ' + this.getText(game.global.score);

            if(game.global.score > game.global.highScore) {
                game.global.highScore = game.global.score;
            }
            
            var txtBonus = game.add.text(game.world.centerX, 200, 'BONUS DE TEMPO: ' + this.getText(bonus), {font: '20px emulogic', fill: '#fff'});
                txtBonus.anchor.set(0.5);

            var txtFinalScore = game.add.text(game.world.centerX, 250, 'TOTAL DE PONTOS: ' + this.getText(game.global.score),{font: '20px emulogic', fill: '#fff'});
                txtFinalScore.anchor.set(0.5);

        }else { //sem tempo irmao
            var txtGameOver = game.add.text(game.world.centerX, 150, 'GAME OVER', {font: '20px emulogic', fill: '#fff'});
                txtGameOver.anchor.set(0.5);

            var txtPressStart = game.add.text(game.world.centerX, 550, 'DALE NO BOTAOZIN', {font: '20px emulogic', fill: '#fff'});
                txtPressStart.anchor.set(0.5);
                        
            game.add.tween(txtPressStart).to({y: 250}, 1000).start();

            game.time.events.add(1000, function() {
                var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
                    enterKey.onDown.addOnce(this.startMenu, this);
            },this);
        }

        var txtPressStartNext = game.add.text(game.world.centerX, 550, 'DALE NO BOTAOZIN', {font: '20px emulogic', fill: '#fff'});
            txtPressStartNext.anchor.set(0.5);
                
        game.add.tween(txtPressStartNext).to({y: 300}, 1000).start();

        var txtBestScore = game.add.text(game.world.centerX, 350, 'RECORDE: ' + this.getText(game.global.highScore), {font: '20px emulogic', fill: '#90EE90'});
            txtBestScore.anchor.set(0.5);
            txtBestScore.alpha = 0;

        game.time.events.add(1000, function() {
            game.add.tween(txtBestScore).to({alpha: 1}, 500).to({alpha: 0}, 500).loop().start();
                
            this.music.stop();
            var enterKeyStage2 = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
                enterKeyStage2.onDown.addOnce(this.startEnd, this);
        },this);
    },
    
    startEnd: function() {
        this.music.stop();
        game.state.start('end');
    },

    startMenu: function() {
        this.music.stop();
        game.state.start('menu');
    },

    movePlayer: function() {
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;

        if(this.controls.left.isDown && !this.controls.right.isDown) {
            this.player.body.velocity.x = -100;
            this.player.direction = "left";
        } else
        if(this.controls.right.isDown && !this.controls.left.isDown) {
            this.player.body.velocity.x = 100;
            this.player.direction = "right";
        }
        if(this.controls.up.isDown && !this.controls.down.isDown) {
            this.player.body.velocity.y = -100;
            this.player.direction = "up";
        }else
        if(this.controls.down.isDown && !this.controls.up.isDown) {
            this.player.body.velocity.y = 100;
            this.player.direction = "down";
        }

        if(this.player.direction == "left") {
            this.player.animations.play('goLeft');
        }
        if(this.player.direction == "right") {
            this.player.animations.play('goRight');
        }
        if(this.player.direction == "up") {
            this.player.animations.play('goUp');
        }
        if(this.player.direction == "down") {
            this.player.animations.play('goDown');
        }

        if(this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0) {
            this.player.animations.stop();
        }
    },

    moveEnemy: function() {
        if(Math.floor(this.enemy.x - 25)%50 === 0 && Math.floor(this.enemy.y - 25)%50 === 0) {
            var enemyCol = Math.floor(this.enemy.x/50);
            var enemyRow = Math.floor(this.enemy.y/50);
            var validPath = [];

            if(this.maze[enemyRow][enemyCol - 1] !== 1 && this.enemy.direction !== 'RIGHT') {
                validPath.push('LEFT');
            }
            if(this.maze[enemyRow][enemyCol + 1] !== 1 && this.enemy.direction !== 'LEFT') {
                validPath.push('RIGHT');
            }
            if(this.maze[enemyRow - 1][enemyCol] !== 1 && this.enemy.direction !== 'DOWN') {
                validPath.push('UP');
            }
            if(this.maze[enemyRow + 1][enemyCol] !== 1 && this.enemy.direction !== 'UP') {
                validPath.push('DOWN');
            }

            this.enemy.direction = validPath[Math.floor(Math.random()*validPath.length)];
        }

        switch(this.enemy.direction) {
            case 'LEFT':
                this.enemy.x -= 1;
                this.enemy.animations.play('goLeft');
                break;
            case 'RIGHT':
                this.enemy.x += 1;
                this.enemy.animations.play('goRight');
                break;
            case 'UP':
                this.enemy.y -= 1;
                this.enemy.animations.play('goUp');
                break;
            case 'DOWN':
                this.enemy.y += 1;
                this.enemy.animations.play('goDown');
                break;
        }
    },

    loseCoin: function() {
        this.sndLoseCoin.play();

        if(this.coins > 0) {
            this.emitter.x = this.player.position.x;
            this.emitter.y = this.player.position.y;
            this.emitter.start(true, 500, null, 15);

            this.coins--;
            this.txtCoins.text = 'MOEDAS: ' + this.getText(this.coins);
            this.coin.position = this.newPosition();
            game.global.coinsQuiz = this.coins;
        }
    },

    getCoin: function() {
        this.emitter.x = this.coin.position.x;
        this.emitter.y = this.coin.position.y;
        this.emitter.start(true, 500, null, 15);

        this.sndCoin.play();
        this.coins++;
        this.txtCoins.text = 'MOEDAS: ' + this.getText(this.coins);
        game.global.coinsQuiz = this.coins;

        game.global.score += 1;
        this.txtScore.text = 'PONTOS: ' + this.getText(game.global.score);

        if(game.global.score > game.global.highScore) {
            game.global.highScore = game.global.score;
        }
       
        this.coin.position = this.newPosition();
    },

    getText: function(value) {
        if(value < 10) {
            return '00' + value.toString();
        }
        if(value < 100) {
            return '0' + value.toString();
        }
        return value.toString();
    },

    newPosition: function() {
        var pos = this.coinPosition[Math.floor(Math.random() * this.coinPosition.length)];

        while(this.coin.position === pos) {
            pos = this.coinPosition[Math.floor(Math.random() * this.coinPosition.length)];
        }

        return pos;
    }

};
