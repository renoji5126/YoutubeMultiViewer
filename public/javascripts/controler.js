var controler = {};
controler.playerList=[];

controler.setPlayer = function(player){
  controler.playerList.push(player);
}

//controler.create = function(player){
controler.create = function(){
  var controle_list=['fast_back','flame_back','start','stop','flame_front','last_front'];
  var htmlStr = "";
  $.each(controle_list, function(){
    htmlStr += "<div class=" + this + ">"+this+"</div>";
  });
  $controler = $('.controler').html(htmlStr);
  $controler.children('.fast_back').button({icons:{primary:"ui-icon-seek-first"},text:false}    ).click(function(){
    //console.log(player.getCurrentTime());
    $.each(controler.playerList, function(){
      this.seekTo(0);
      this.pauseVideo();
    });
  });
  $controler.children('.flame_back').button({icons:{primary:"ui-icon-seek-prev"},text:false}).click(function(){
    //console.log(player.getCurrentTime());
    $.each(controler.playerList, function(){
      this.seekTo(this.getCurrentTime() - 0.06,true);
      this.pauseVideo();
    });
  });
  $controler.children('.start').button({icons:{primary:"ui-icon-play"},text:false}).click(function(){
    //console.log(  this.getCurrentTime());
    $.each(controler.playerList, function(){
      this.playVideo();
    });
  });
  $controler.children('.stop').button({icons:{primary:"ui-icon-pause"},text:false}).click(function(){
    //console.log(  this.getCurrentTime());
    $.each(controler.playerList, function(){
      this.pauseVideo();
    });
  });
  $controler.children('.flame_front').button({icons:{primary:"ui-icon-seek-next"},text:false}).click(function(){
    //console.log(  this.getCurrentTime());
    $.each(controler.playerList, function(){
      this.seekTo(  this.getCurrentTime() + 0.06 ,true);
      this.pauseVideo();
    });
  });
  $controler.children('.last_front').button({icons:{primary:"ui-icon-seek-end"},text:false}).click(function(){
    //console.log(  this.getCurrentTime());
    //  this.seekTo(-1);
    $.each(controler.playerList, function(){
      this.pauseVideo();
    });
  });
}
