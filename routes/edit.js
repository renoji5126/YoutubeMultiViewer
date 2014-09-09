var express = require('express');
var router = express.Router();
var sampleModel;

router.setModel = function(model){
  sampleModel = model;
}

/* GET home page. */
router.get('/', function(req, res) {
  if(!res.req.query.youtubeMovieId){res.redirect('/list');}
  //var movieId = 'lCPA8vXwfcI';
  var movieId = req.query.youtubeMovieId;
  sampleModel.find({moveId: movieId ,deleteFlg: { $ne : true }},function(err, docs){
    if(err) throw err;
    //console.log(docs);
    var sectionEndPoints = [];
    if(docs.length){
      sectionEndPoints = docs[0].sectionEndPoints;
      res.render('edit', { title: 'edit' ,edit:true ,sectionEndPoints: sectionEndPoints});
    }else{ res.send('Not Found Data...'); }
    return true;
  });
});

router.post('/delete', function(req,res){
  if(!req.body.youtubeMovieId) {res.redirect('/list');}
  var movieId = req.body.youtubeMovieId;
  sampleModel.update(
    { moveId: movieId ,deleteFlg: { $ne : true }},
    { $set :{ deleteFlg : true }},
    { upsert: false, multi: true},
    function(err, docs){
      if(err) throw err;
      //console.log(docs, movieId);
      res.redirect('/list');
    });
});
router.post('/', function(req,res){
  if(!req.body.json) {res.redirect('/list');}
  var jsondata = JSON.parse(req.body.json);
  jsondata.sectionEndPoints = jsondata.sectionEndPoints.sort(asc);
  if(jsondata.sectionEndPoints.length > 1){
    jsondata.sectionDiffrents = [];
    jsondata.sectionEndPoints.forEach(function(value, index){
      if( jsondata.sectionEndPoints.length - 1 == index){return false;}
      jsondata.sectionDiffrents.push(jsondata.sectionEndPoints[index + 1] - jsondata.sectionEndPoints[index]);
    });
  }
  console.log(jsondata);
  sampleModel.find({moveId: jsondata.moveId ,deleteFlg: { $ne : true }},function(err, docs){
    if(err) throw err;
    if(docs.length){
      sampleModel.update(
        {moveId: jsondata.moveId ,deleteFlg: { $ne : true }},
        {$set :{
          sectionEndPoints : jsondata.sectionEndPoints,
          sectionDiffrents : jsondata.sectionDiffrents,
        }},
        {upsert: false, multi: true} ,
        function(err){
          if(err) throw err;
        }
      );
    }else{
      db = new sampleModel(jsondata);
      db.save(function(err){
        if(err) throw err;
      });
    }
  });
  res.redirect('/list');
});
//昇順での計算方法
function asc(a,b){
  return (a-b);
}
//降順での計算方法
function desc(a,b){
  return (b-a)
}
module.exports = router;
