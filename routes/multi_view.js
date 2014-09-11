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
    var result = [];
    var sectionMax = [];
    if(docs){
      var sectionDiffrentLengthMin = docs[0].sectionDiffrents.length;
      for(x=0; x < docs.length; x++){
        if(!docs[x].sectionDiffrents.length){
          res.render('view', { title: 'YoutubeMultiViewer' ,view:true ,dbsInfo :docs });
        }
        sectionDiffrentLengthMin = docs[x].sectionDiffrents.length < sectionDiffrentLengthMin ? docs[x].sectionDiffrents.length : sectionDiffrentLengthMin;
      }
    }
    if(docs.length > 1){
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
            result.push(tmp);
          }
        });
        if(docs.length - 1 == docs_index){
          res.render('view', { title: 'YoutubeMultiViewer' ,view:true ,dbsInfo :result });
        }
      });
    }else{
      var tmp = {
        moveId: docs[0].moveId,
        sectionDiffrents: docs[0].sectionDiffrents,
        sectionEndPoints: docs[0].sectionEndPoints,
        pauseTimes: [],
      };
      result.push(tmp);
      res.render('view', { title: 'YoutubeMultiViewer' ,view:true ,dbsInfo :result });
    }
  });
});

module.exports = router;
