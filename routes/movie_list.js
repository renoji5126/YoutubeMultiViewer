var express = require('express');
var router = express.Router();
var sampleModel;

router.setModel = function(model){
  sampleModel = model;
};

/* GET home page. */
router.get('/', function(req, res) {
  sampleModel.find({deleteFlg: { $ne : true }},function(err, docs){
    if(err) throw err;
    res.render('list', { title: 'list' ,movie: docs, list:true});
  });
});

router.post('/', function(req, res) {
  if(!req.body.youtubeURL){/*res.redirect('/');*/}
  var jsondata = {};
  jsondata.moveId = extractYoutubeID(req.body.youtubeURL);
  jsondata.sectionEndPoints = [];
  console.log(jsondata);
  sampleModel.find({moveId: jsondata.moveId ,deleteFlg: { $ne : true }},function(err, docs){
    if(err) throw err;
    if(docs.length){
      console.log(docs,"登録済み");
      //res.redirect('/');
    }else{
      db = new sampleModel(jsondata);
      db.save(function(err){
        if(err) throw err;
      });
    }
  })
  res.redirect('/list');
});
function extractYoutubeID(youtubeUrl) {
    var youtubeId = youtubeUrl.replace(/.*v=([\d\w]+).*/, '$1'); 
    return youtubeId; 
} 

module.exports = router;
