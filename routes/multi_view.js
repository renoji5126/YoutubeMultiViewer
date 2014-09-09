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
  sampleModel.find({ $or : movieIds  },{ _id:0, moveId:1, sectionEndPoints:1},function(err, docs){
    if(err) throw err;
    //if(err) console.log( err ); res.send('sorry false'); 
    var sectionEndPoints = [];
    var sectionMax = [];
    docs.forEach(function(db_value, db_index){
      //TODO
      db_value.difference = [];
      db_value.sectionEndPoints.forEach(function(value, index){
        var deff = value;
        db_value.difference.push(deff);
      });
    });
    res.render('view', { title: 'YoutubeMultiViewer' ,view:true ,dbsInfo :docs});
  });
});

module.exports = router;
