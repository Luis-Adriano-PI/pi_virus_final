var endState = {
    create: function() {
        const giveHint = document.querySelector(".giveHint");
        giveHint.classList.remove("hide");

        game.add.sprite(0, 0, 'bg2');

        var txtCongrat = game.add.text(game.world.centerX, 100, 'Parabens!', {font: '20px emulogic', fill: '#3771c8ff'});
            txtCongrat.anchor.set(0.5);
            
        var txtPlayQuiz = game.add.text(game.world.centerX, 150, 'Jogue nosso quiz', {font: '20px emulogic', fill: '#3771c8ff'});
            txtPlayQuiz.anchor.set(0.5);

        var txtClue = game.add.text(game.world.centerX, 200, 'e confira as dicas acima!', {font: '20px emulogic', fill: '#3771c8ff'});
            txtClue.anchor.set(0.5);

        var txtScoreMatch = game.add.text(game.world.centerX, 300, 'Recorde: ' + game.global.score, {font: '20px emulogic', fill: '#3771c8ff'});
            txtScoreMatch.anchor.set(0.5);
            txtScoreMatch.alpha = 0;

        var txtPressStart = game.add.text(game.world.centerX, 550, 'DALE NO BOTAOZIN', {font: '20px emulogic', fill: '#3771c8ff'});
            txtPressStart.anchor.set(0.5);
            game.add.tween(txtPressStart).to({y: 250}, 1000).start();

        game.time.events.add(1000, function() {
            game.add.tween(txtScoreMatch).to({alpha: 1}, 500).to({alpha: 0}, 500).loop().start();

            var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
                enterKey.onDown.addOnce(this.startMenu, this);
        },this);
    },

    startMenu: function() {
        game.state.start('menu');
    }
};
