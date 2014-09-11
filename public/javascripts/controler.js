var controler = {};
controler.playerList=[];
controler.currentPoint = [];
woker = new Worker('/javascripts/movieWoker.js');
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
    var playing_interval = setInterval(function(){
    },1000);
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
//TODO 時間差駆動をできるようにする
controler.loadMap = function(){
  controler.playerList.forEach(function(player, player_index){
    for(i = controler.currentPoint; i < multiView.list[player_index].sectionDiffrents.length;i++ ){
      player.seekTo(multiView.list[player_index].sectionEndPoints[i] / 1000);
      setTimeout(function(){
        player.pauseVideo();
        setTimeout(function(){
          player.playVideo();
        },multiView.list[player_index].pauseTimes[i]);
      },multiView.list[player_index].sectionDiffrents[i]);
    }
  });
}

controler.woker = function(){
  //終了する場合は以下のものをよぶ
  //woker..terminate();
  woker.addEventListener('message',function(e){
    var switchCase = e.data.switchCase;
    var ctlIndex = e.data.index;
    console.log(ctlIndex, switchCase);
    switch(switchCase){
      /*case 'play':
        controler.playerList[ctlIndex].playVideo();
        break;*/
      case 'pause':
        controler.playerList[ctlIndex].pauseVideo();
        break;
      default:
        controler.playerList[ctlIndex].seekTo(multiView.list[ctlIndex].sectionEndPoints[controler.currentPoint] / 1000);
        controler.currentPoint[ctlIndex]++;
        /*woker.postMessage({
          index: ctlIndex,
          sectionDiffrents: multiView.list[ctlIndex].sectionEndPoints,
          sectionPauseTime: multiView.list[ctlIndex].pauseTimes,
          point: controler.currentPoint,
        });*/
        break;
    }
  });
  //woker.postMessage({player: controler.playerList[0]});
  controler.playerList.forEach(function(player, player_index){
    controler.currentPoint[player_index] = 0;
    // woker登録
    woker.postMessage({
      index: player_index,
      sectionDiffrents: multiView.list[player_index].sectionEndPoints,
      sectionPauseTime: multiView.list[player_index].pauseTimes,
      point: controler.currentPoint[player_index],
    });
  });
}
