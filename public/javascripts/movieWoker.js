self.addEventListener('message',function(e){
  var index = e.data.index;
  var secDiff = e.data.sectionDiffrents;
  var secPause = e.data.sectionPauseTime;
  var point = e.data.point;
  console.log(index);
  console.log(secDiff.length);
  console.log(secPause.length);
  //if(secDiff.length != secPause.length){ return false; }
  self.postMessage({switchCase: '', index: index});
  setTimeout(function(){
    console.log('pausing!:' + secDiff[point]);
    self.postMessage({switchCase:'pause', index: index});
    setTimeout(function(){
      console.log('play!:' + secPause[point]);
      //self.postMessage({switchCase:'play', index: index});
    }, secPause[point]);
  }, secDiff[point]);
}, false);
