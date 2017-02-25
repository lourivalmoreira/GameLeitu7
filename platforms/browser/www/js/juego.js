// Solucao V7 de Lourival José Passos Moreira
    
var app={
  inicio: function(){
    DIAMETRO_BOLA = 100;
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;
    mensagem=null;
    nivel = 0;
    var mummy;
    var anim;
    var back;
    var introText;
    var nivelText =
    limitesup = 1;


    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;
    
    app.vigilaSensores();




    app.iniciaJuego();

  },

  iniciaJuego: function(){

    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.stage.backgroundColor = '#00b100';

      game.load.image('bola', 'assets/bola.png');
      game.load.image('objetivo', 'assets/objetivo.png');

      game.load.image('pineapple', 'assets/pineapple.png');  // Acrescentado 

      


    }



    function create() {


   lanca();

    
    scoreText = game.add.text(8, 8, 'Pontos: ', { fontSize: '20px', fill: '#757676' });
    scoreText = game.add.text(112, 8, puntuacion, { fontSize: '20px', fill: '#757676' }); //diminuido o tamanho da fonte do score
    msgText = game.add.text(180, 8, mensagem, { fontSize: '20px', fill: '#757676' });
    introText = game.add.text(game.world.centerX, game.world.centerY, '*Jogo do Leiturito*', { font: "30px Arial", fill: "#559911", align: "center" });

    introText.anchor.setTo(0.5, 0.5);




      objetivo = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo');
      bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');

   

      
      game.physics.arcade.enable(bola);
      game.physics.arcade.enable(objetivo);
      game.physics.arcade.enable(pineapples); // acresc
     



      bola.body.collideWorldBounds = true;



//      bola.body.onWorldBounds = new Phaser.Signal();
//      Retirado. Não penaliza, para facilitar para as crianças.
      bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);
 


    }


 function lanca(){
    pineapples = game.add.group();   ///Inicio inclusao - Lanca Asteroides
    pineapples.enableBody = true;
    pineapples.physicsBodyType = Phaser.Physics.ARCADE;

     for (var i = 0; i < limitesup; i++)
    {
        var pineapple = pineapples.create(200 + i * 48,50, 'pineapple');

        //This allows your sprite to collide with the world bounds like they were rigid objects
        pineapple.body.collideWorldBounds=true;
        pineapple.body.gravity.x = game.rnd.integerInRange(-50, 50);
        pineapple.body.gravity.y = 300 + Math.random() * 100;
        pineapple.body.bounce.setTo(1.0, 0.985);

    }    ///Final inclusao
}

    function update(){
      var factorDificultad = (300 + (dificultad * 100*0)); // Constante para as crianças
      bola.body.velocity.y = (velocidadY * factorDificultad);
      bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));
      
      game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion, null, this);

      game.physics.arcade.overlap(bola, pineapples, app.decrementaPuntuacion, null, this);
      
      game.physics.arcade.overlap(objetivo, pineapples, app.saiPreguica, null, this);



    }





    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
  },




  decrementaPuntuacion: function(){
    puntuacion = puntuacion-1;
    scoreText.text = puntuacion;


    mensagem='CUIDADO!!!'; 
    msgText.text = mensagem;

  },


    saiPreguica: function(){
    puntuacion = puntuacion-0;
    scoreText.text = puntuacion;


    mensagem='XÔ PREGUIÇA!!!'; 
    msgText.text = mensagem;

  },

  incrementaPuntuacion: function(){
    puntuacion = puntuacion+5;
    scoreText.text = puntuacion;
    
    mensagem='MUITO BEM!!!';
    msgText.text = mensagem;

    objetivo.body.x = app.inicioX();
    objetivo.body.y = app.inicioY();

    // if (puntuacion > 10){
    //  limitesup = limitesup + 1;
    //  nivel=limitesup;         
    // }


  },

  inicioX: function(){
    return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA );
  },


  inicioY: function(){
    return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA );
  },

  numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function(){
    
    function onError() {
        console.log('onError!');
    }

    function onSuccess(datosAceleracion){
      app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
  },

  detectaAgitacion: function(datosAceleracion){
    var agitacionX = datosAceleracion.x > 10;
    var agitacionY = datosAceleracion.y > 10;

    if (agitacionX || agitacionY){
      setTimeout(app.recomienza, 1000);
    }
  },

  recomienza: function(){
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x ;
    velocidadY = datosAceleracion.y ;
  }

};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}