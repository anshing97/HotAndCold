
function Game () {

  // constants
  var THRESHOLD = 25;
  var MAX = 100; 
  var COLORS = ['#ff1a12','#f73936','#ed522b','#f75f39','#F3795B','#EA8F48','#ffc403','#28B2C9','#30B8C0','#46C7D3','#79e3ed','#97e6ed']

  // game variables
  this.target_num = null; 
  this.last_num = null; 
  this.game_ended = false; 

  // initializer 
  this.init = function () {

    // get a new target num for the game
    this.target_num = this.generate_random_number(MAX);
    this.last_num = null;

    this.game_reset();
  }

  // generate a random number from 1 to argument 
  this.generate_random_number = function ( max_num ) {
    return 1 + Math.floor(Math.random() * max_num );
  }

  // set a new color and size for the circle
  this.animate_circle = function ( diff ) {
    var each_step = ( 100 / COLORS.length ); 
    var this_step = Math.floor(diff / each_step);

    // change the color
    $('#current').css('background-color',COLORS[this_step]);

    var new_percentage = 100 - diff 
    var new_diameter = ( new_percentage / 100 * 400 ) + 100; 

    // calculate a percentage for the frame
    $('#current').height( new_diameter + 'px');
    $('#current').width( new_diameter + 'px');
  }

  // check for valid input, between 1 to MAX  
  this.valid_input = function (input) {

    if ( isNaN(input ) )  {
      this.update_message("Please enter a valid number");
      return false; 
    } else if ( input < 1 || input > MAX ) {
      this.update_message("Please enter a number between 1 to " + MAX);
      return false;
    }

    return true; 
  }

  // hide and fade in message 
  this.update_message = function ( message ) {
    $('#message').html(message);
    $('#message').hide().delay(125).fadeIn(125);
  }

  // different game states
  this.game_reset = function ()  {
    this.update_message("Enter a number between 1 to " + MAX + " and hit Return");

    $('input').val('');  
    $('input').prop('disabled', false); 

    $('#current').height('100px');
    $('#current').width('100px');
    $('#current').css('background-color','#555');

    $('#target').css('border-color','#999');

    this.game_ended = false; 
  }

  this.game_won = function () {
    this.update_message("You got it! Shall we play again?");

    $("input").prop('disabled', true);

    $('#current').height('500px');
    $('#current').width('500px');
    $('#current').css('background-color','#59B122');    

    $('#target').css('border-color','#FFF');

    this.game_finished = true; 
  }

  this.first_guess = function () {
    return (this.last_num === null)
  }

  // test a number, sent to correct game state
  this.test_number = function (testing_num) {

    // do the real work 
    var current_diff = Math.abs(this.target_num - testing_num); 

    // guessed correctly 
    if ( current_diff === 0 ) {

      this.game_won();

    } else {

      this.animate_circle(current_diff);

      if ( this.first_guess() ) {

        if ( current_diff < THRESHOLD ) {
          this.update_message("Nice guess. You almost got it.");
        } else {
          this.update_message("Still got a ways go to");
        }

      } else {

        // has a previous guess to compare
        var last_diff = Math.abs(this.target_num - this.last_num);

        if ( current_diff < last_diff ) {
          this.update_message("Getting hotter");
        } else {
          this.update_message("Getting colder");
        }

      }
    }

    // save this for next interation 
    this.last_num = testing_num; 

  }

  // call initializer
  this.init(); 

}

$(document).ready( function(){

  var this_game = new Game(); 
  var enter_pressed = false; 

  $('input').focus();

  // make sure it's always focused on input
  $(this).click( function() {
    $('input').focus();
  });

  // reset the game
  $('button').click( function () {
    this_game = new Game(); 
    enter_pressed = false;
  });

  // when Enter is pressed, test the input
  $(this).keydown( function (e) {
    if ( e.keyCode === 13 ) {

      enter_pressed = true; 

      // check if game is still ongoing 
      if ( !this_game.game_finished ) {
        var new_num = $('input').val();

        // check if this is a valid input within 1 to MAX 
        if ( this_game.valid_input(new_num) ) {
          this_game.test_number(new_num);
        }
      }
      
    } else {

      if ( e.keyCode === 8 ) {
        // allow delete to function as normal afte enter is pressed 
        enter_pressed = false; 
      } else if ( enter_pressed && !this_game.game_finished) {
        // clear input so users any keyboard press will clear input after a guess  
        $('input').val('');
        enter_pressed = false; 
      }

    }

  });

})