var express = require('express');
var router = express.Router();
var sampleModel;

router.setModel = function(model){
  sampleModel = model;
}
/* GET home page. */
router.get('/', function(req, res) {
  if(!res.req.query.youtubeMovieIds){res.redirect('/list');}
  //var movieId = 'lCPA8vXwfcI';
  var movieIds = [];
  req.query.youtubeMovieIds.split(",").forEach(function(value,index){
    //select文生成
    movieIds.push({moveId: value });
  });
  sampleModel.find({ $or : movieIds  },{ _id:0, moveId:1, sectionEndPoints:1, sectionDiffrents:1},function(err, docs){
    if(err) throw err;
    //if(err) console.log( err ); res.send('sorry false');
    //console.log(docs);
    var result = [];
    var sectionDiffrentLengthMin = docs[0].sectionDiffrents.length;
    var sectionMax = [];
    if(docs.length > 1){
      for(n = 1; n < docs.length ; n++){
        sectionDiffrentLengthMin = docs[n].sectionDiffrents.length < sectionDiffrentLengthMin ? docs[n].sectionDiffrents.length : sectionDiffrentLengthMin;
      }
      for(i = 0; i < sectionDiffrentLengthMin; i++){
        var tmp = 0;
        for(l = 0; l < docs.length; l++){
          tmp = docs[l].sectionDiffrents[i] > tmp ? docs[l].sectionDiffrents[i] : tmp;
        }
        sectionMax.push(tmp);
      }
      docs.forEach(function(docs_value, docs_index){
        var tmp = {
          moveId: docs_value.moveId,
          sectionDiffrents: docs_value.sectionDiffrents,
          sectionEndPoints: docs_value.sectionEndPoints,
          pauseTimes: [],
        };
        sectionMax.forEach(function(max, maxindex){
          var diff = max - docs_value.sectionDiffrents[maxindex];
          tmp.pauseTimes.push(diff);
          if(sectionMax.length - 1 == maxindex){
            //TODO なぜかpauseTimesが構造体に入らない
            console.log(JSON.stringify(tmp));
            console.log(tmp.pauseTimes);
            result.push(tmp);
            //console.log(docs_value.pauseTimes);
          }
        });
        if(docs.length - 1 == docs_index){
          console.log(JSON.stringify(result));
          res.render('view', { title: 'YoutubeMultiViewer' ,view:true ,dbsInfo :result });
        }
      });
    }else{
      result = docs;
      result[0].pauseTime = [];
      res.render('view', { title: 'YoutubeMultiViewer' ,view:true ,dbsInfo :result });
    }
  });
});

module.exports = router;
