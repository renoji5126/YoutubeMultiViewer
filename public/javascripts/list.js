$(function(){
  $('input[type=checkbox]').change(function(){
    var list = [];
    $(':checked').each(function(){
      //console.log($(this).val());
      list.push($(this).val());
    });
    $('input[name=youtubeMovieIds]').val(list);
  });
  $('.movieView').button({icons:{primary:"ui-icon-play"}});
});
