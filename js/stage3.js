var stage3State = {create: function() {
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
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    this.blocks = game.add.group();
    this.blocks.enableBody = true;

    // this.coinPosition = [];

    for(var row in this.maze) {
        for(var col in this.maze[row]) {
            var tile = this.maze[row][col];

            var x = col * 50;
            var y = row * 50;

            if(tile == 1) {
                var block = this.blocks.create(x, y, 'block');
                    block.body.immovable = true;
            }
        }
    }

    //enunciado
    this.txtQuestion = game.add.text(20, 80,'Existem cinco reinos que dividem os seres vivos:', {font: '15px emulogic', fill: '#fff'});
    this.txtQuestion2 = game.add.text(20, 100,'Monera, Protista, Plantae, Fungi e Animalia.', {font: '15px emulogic', fill: '#fff'});
    this.txtQuestion3 = game.add.text(20, 120,'Os virus nao estao incluidos', {font: '15px emulogic', fill: '#fff'});
    this.txtQuestion4 = game.add.text(20, 140,'em nenhum desses grupos, pois nao sao', {font: '15px emulogic', fill: '#fff'});
    this.txtQuestion5 = game.add.text(20, 160,'considerados seres vivos ja que:', {font: '15px emulogic', fill: '#fff'});

    //alternativas
    this.txtAnswerA = game.add.text(20, 250,'a) Sao seres extremamente pequenos.', {font: '15px emulogic', fill: '#fff'});    
    this.txtAnswerB = game.add.text(20, 300,'b) Nunca foram estudados em laboratorio.', {font: '15px emulogic', fill: '#fff'});
    this.txtAnswerC = game.add.text(20, 350,'c) Sao considerados apenas particulas infecciosas.', {font: '15px emulogic', fill: '#fff'});    
    this.txtAnswerD = game.add.text(20, 400,'d) Tem o tempo de vida muito curto.', {font: '15px emulogic', fill: '#fff'});
    
    // escolher alternativa por tecla
    var keyA = game.input.keyboard.addKey(Phaser.Keyboard.A);
    keyA.onDown.addOnce(this.verificQuiz, this);
    
    var keyB = game.input.keyboard.addKey(Phaser.Keyboard.B);
    keyB.onDown.addOnce(this.verificQuiz, this);
    
    var keyC = game.input.keyboard.addKey(Phaser.Keyboard.C);
    keyC.onDown.addOnce(this.verificQuiz, this);
    
    var keyD = game.input.keyboard.addKey(Phaser.Keyboard.D);
    keyD.onDown.addOnce(this.verificQuiz, this);

    // var questionA = game.add.button(20, 100, "blablabla", onClickAction, this);
    
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
    this.time = 20;
    this.txtTime = game.add.text(game.world.width - 15, 15, 'TEMPO: ' + this.getText(this.time), {font: '15px emulogic', fill: '#fff'});
    this.txtTime.anchor.set(1, 0);
    this.timer = game.time.events.loop(1000, function(){
        this.time--;
        this.txtTime.text = 'TEMPO: ' + this.getText(this.time);
    },this);
},

update: function() {
    if(this.onGame) {
        if(this.time < 1 || this.coins >= 2) {
            this.gameOver();
        }
    }
},

// onClickAction: function() {
//     this.verificQuiz();
// },

verificQuiz: function() {
    if(keyA.isDown) {
        this.success = true;
    }
    if(keyB.isDown) {
        this.success = false;
    }
    if(keyC.isDown) {
        this.success = true;
    }
    if(keyD.isDown) {
        this.success = false;
    }
    // pontuar
    if(this.success) {
        this.getCoin;
    }else {
        this.loseCoin;
    }
},

gameOver: function() {
    this.onGame = false;

    game.time.events.remove(this.timer);

    if(this.coins >= 2) { //passar de fase
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
            enterKeyStage2.onDown.addOnce(this.startStage3, this);
    },this);
},

startStage3: function() {
    this.music.stop();
    game.state.start('stage3');
},

startMenu: function() {
    this.music.stop();
    game.state.start('menu');
},

loseCoin: function() {
    this.sndLoseCoin.play();

    if(this.coins > 0) {
        this.emitter.x = this.player.position.x;
        this.emitter.y = this.player.position.y;
        this.emitter.start(true, 500, null, 15);

        this.coins--;
        this.txtCoins.text = 'MOEDAS: ' + this.getText(this.coins);
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

};
