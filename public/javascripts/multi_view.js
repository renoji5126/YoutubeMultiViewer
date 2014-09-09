
var config = {
  replaceElemIdStr : "viewer_",
  widthStr      : ((parseInt($('body').css('width')) / 2) - 10).toString() ,
  heightStr     : ($(window).height() / 3).toString(),
  swfVersionStr : "8",
  xiSwfUrlStr   : null,
  flashVarsObj  : null,
  parObj        : { allowScriptAccess: "always" },
  playerObj     : "playerobj_",
  attObj        : { id : "player_" }
};

var renoji_name = [ "one", "two", "three", "four" ];
//var renoji_name = [ "one", "two" ];
var multiView = {};
multiView.setter = function(objectList){
  multiView.list = objectList;
  //console.log(multiView.list);
  var tmp_length = 0;
  $.each(multiView.list, function(index){
    var _self = this;
    if(_self.sectionEndPoints.length > tmp_length){
      tmp_length = _self.sectionEndPoints.length;
      multiView.sectionName = ["Start"];
      $.each(_self.sectionEndPoints, function(sec_indx){
        multiView.sectionName.push("section-" + (sec_indx + 1));
        if( sec_indx == _self.sectionEndPoints.length - 2){return false;}
      });
    }
  });
}

$(function(){
  config.widthStr = ((parseInt($('body').css('width')) / 2) - 10).toString();
  config.heightStr = ($(window).height() / 2).toString();
  var movies = query.youtubeMovieIds.split(",");
  $.each(renoji_name, function(i){
    if(i == multiView.list.length){return false;}
    swfobject.embedSWF(
      "http://www.youtube.com/v/" + multiView.list[i].moveId + "?enablejsapi=1&playerapiid=" + config.playerObj + this,
      config.replaceElemIdStr + this,
      config.widthStr,
      config.heightStr,
      config.swfVersionStr,
      config.xiSwfUrlStr,
      config.flashVarsObj,
      config.parObj,
      {id : config.attObj.id + this }
    );
  });
});

function onYouTubePlayerReady(playerId){
  controler.playerList = [];
  $.each(multiView.list, function(index){
    controler.setPlayer(document.getElementById(config.attObj.id + renoji_name[index]));
  });
  controler.create();
  
  $('select.sectionPoints').html('');
  $.each(multiView.sectionName, function(index){
    $('select.sectionPoints').append('<option value=' + index + '>' + this.toString() + '</option>');
  });
  $('select.sectionPoints').change(function(){
    var value = parseInt($(this).children('option:selected')[0].value);
    console.log(value);
    //console.log(controler.playerList);
    $.each(controler.playerList, function(index){
      //console.log(this);
      var sectPt = multiView.list[index].sectionEndPoints[value] / 1000;
      console.log(sectPt);
      this.seekTo(sectPt,true);
      this.pauseVideo();
    });
  });
  
}
