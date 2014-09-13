var controler = {};
var worker = [];
controler.playerList=[];
controler.currentPoint = [];
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
      //this.pauseVideo();
    });
  });
  $controler.children('.flame_back').button({icons:{primary:"ui-icon-seek-prev"},text:false}).click(function(){
    //console.log(player.getCurrentTime());
    $.each(controler.playerList, function(){
      this.seekTo(this.getCurrentTime() - 0.06,true);
      //this.pauseVideo();
    });
  });
  $controler.children('.start').button({icons:{primary:"ui-icon-play"},text:false}).click(function(){
    //console.log(  this.getCurrentTime());
    controler.playWorker();
  });
  $controler.children('.stop').button({icons:{primary:"ui-icon-pause"},text:false}).click(function(){
    //console.log(  this.getCurrentTime());
    $.each(controler.playerList, function(index){
      this.pauseVideo();
      worker[index].terminate();
    });
  });
  $controler.children('.flame_front').button({icons:{primary:"ui-icon-seek-next"},text:false}).click(function(){
    //console.log(  this.getCurrentTime());
    $.each(controler.playerList, function(){
      this.seekTo(  this.getCurrentTime() + 0.06 ,true);
      //this.pauseVideo();
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
controler.playWorker = function(){
  controler.playerList.forEach(function(player, player_index){
    worker[player_index] = new Worker('/javascripts/movieWoker.js');
    worker[player_index].addEventListener('message',function(e){
      var switchCase = e.data.switchCase;
      var ctlIndex = e.data.index;
      //console.log(ctlIndex, switchCase, controler.currentPoint[ctlIndex],controler.playerList[ctlIndex].getPlayerState());
      switch(switchCase){
        case 'play':
          controler.playerList[ctlIndex].seekTo(multiView.list[ctlIndex].sectionEndPoints[controler.currentPoint[ctlIndex]] / 1000);
          controler.playerList[ctlIndex].playVideo();
          controler.currentPoint[ctlIndex]++;
          $('option[value=' + controler.currentPoint[ctlIndex] + ']').attr('selected','');
          if(controler.currentPoint[ctlIndex] == multiView.list[ctlIndex].sectionEndPoints.length){
            //強制終了
            console.log('worker terminated...');
            worker[ctlIndex].terminate();
          }
          break;
        case 'pause':
          controler.playerList[ctlIndex].pauseVideo();
          break;
        default:
          worker[ctlIndex].postMessage({
            index: ctlIndex,
            sectionDiffrents: multiView.list[ctlIndex].sectionDiffrents[controler.currentPoint[player_index]],
            sectionPauseTime: multiView.list[ctlIndex].pauseTimes[controler.currentPoint[player_index]],
          });
          break;
      }
    });
    // woker登録
    worker[player_index].postMessage({
      index: player_index,
      sectionDiffrents: multiView.list[player_index].sectionDiffrents[controler.currentPoint[player_index]],
      sectionPauseTime: multiView.list[player_index].pauseTimes[controler.currentPoint[player_index]],
    });
  });
}
