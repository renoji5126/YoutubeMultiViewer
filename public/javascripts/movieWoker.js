self.addEventListener('message',function(e){
  var index = e.data.index;
  var secDiff = e.data.sectionDiffrents;
  var secPause = e.data.sectionPauseTime;
  self.postMessage({switchCase: 'play', index: index});
  setTimeout(function(){
    self.postMessage({switchCase:'pause', index: index});
    setTimeout(function(){
      self.postMessage({switchCase:'', index: index});
    }, secPause);
  }, secDiff);
}, false);
