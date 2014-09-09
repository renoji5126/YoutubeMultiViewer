playerObject={};
var config = {
  replaceElemIdStr : "viewer_",
  widthStr      : ((parseInt($('body').css('width')) / 2) - 10).toString() ,
  heightStr     : ($(window).height() / 3).toString(),
  swfVersionStr : "8",
  xiSwfUrlStr   : null,
  flashVarsObj  : null,
  parObj        : { allowScriptAccess: "always" },
  playerObj            : "playerobj_",
  attObj        : { id : "player_" }
};

//var renoji_name = [ "one", "two", "three", "four" ];

$(function(){
  config.widthStr = ((parseInt($('body').css('width')) / 10) * 8.5).toString();
  config.heightStr = ($(window).height() / 2).toString();
  swfobject.embedSWF(
    "http://www.youtube.com/v/" + query.youtubeMovieId + "?enablejsapi=1&playerapiid=" + config.playerObj,
    config.replaceElemIdStr,
    config.widthStr,
    config.heightStr,
    config.swfVersionStr,
    config.xiSwfUrlStr,
    config.flashVarsObj,
    config.parObj,
    {id : config.attObj.id}
  );
  $('input[type=checkbox]').change(function(){
    //console.log($(':checked').val());
    if($(':checked').val()){
      $('form[action="/edit/delete"] input[type=submit]').removeAttr("disabled");
    }else{
      $('form[action="/edit/delete"] input[type=submit]').attr('disabled','');
    }
  });
  $('input[name=youtubeMovieId]').val(query.youtubeMovieId);
});

function onYouTubePlayerReady(playerId){
  //console.log(playerId);
  playerObject = document.getElementById(config.attObj.id);
  controler.setPlayer(playerObject);
  controler.create();
  $('.add_sectionPoint')
    .button({icons:{primary:"ui-icon-carat-1-e"},text:false})
    .click(function(){
      $('select[name=sectionEndPoint]').append("<option value=" + playerObject.getCurrentTime() * 1000 + ">" + playerObject.getCurrentTime() + "</option>");
      sectionPointList();
    });
  $('.del_sectionPoint')
    .button({icons:{primary:"ui-icon-carat-1-w"},text:false})
    .click(function(){
      delete_option();
      sectionPointList();
    });
  $('select[name=sectionEndPoint]').change(function(){
    var value = parseInt($(this).children('option:selected')[0].value) / 1000;
    //console.log(value);
    playerObject.seekTo(value);
    playerObject.pauseVideo();
  });
}

function sectionPointList(){
  var sectionPoint = [];
  $('select[name=sectionEndPoint]').children('option').each(function(){
    //console.log($(this).val());
    sectionPoint.push(parseInt($(this).val()));
  });
  //console.log(sectionPoint);
  $('input[name=json]').val("{\"moveId\":\"" + query.youtubeMovieId + "\", \"sectionEndPoints\":[" + sectionPoint + "]}");
}

function delete_option(){
  $('option:selected').remove();
}
