var menuState = {
    create: function() {
        this.music = game.add.audio('music');
        this.music.loop = true;
        this.music.volume = 0.5;
        this.music.play();

        game.global.score = 0;
        game.global.coinsQuiz = 0;
        game.add.sprite(0,0,'bg2');

        if(!localStorage.getItem('virus_highScore')) {
            localStorage.setItem('virus_highScore', 0);
        }
        
        if(game.global.highScore > localStorage.getItem('virus_highScore')) {
            localStorage.setItem('virus_highScore', game.global.highScore);
        }else {
            game.global.highScore = localStorage.getItem('virus_highScore');
        }

        var txtHighScore = game.add.text(game.world.centerX, 350, 'Recorde: ' + game.global.highScore,{font: '20px emulogic', fill: '#3771c8ff'});
            txtHighScore.anchor.set(0.5);
            txtHighScore.alpha = 0;

        var txtLabirinto = game.add.text(game.world.centerX, 150, 'Virus Game', {font: '40px emulogic', fill: '#3771c8ff'});
            txtLabirinto.anchor.set(0.5);

        var txtPressStart = game.add.text(game.world.centerX, 550, 'Dale no botaozin', {font: '20px emulogic', fill: '#3771c8ff'});
            txtPressStart.anchor.set(0.5);

        game.add.tween(txtPressStart).to({y: 250}, 1000).start();

        game.time.events.add(1000, function() {
            //fazer o recorde piscar
            game.add.tween(txtHighScore).to({alpha: 1}, 500).to({alpha: 0}, 500).loop().start();

            //iniciar o game apertando enter
            var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            enterKey.onDown.addOnce(this.starGame, this);
        }, this);
    },

    starGame: function() {
        this.music.stop();
        game.state.start('stage1');
    }
};
