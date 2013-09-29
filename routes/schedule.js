var mongoose = require("mongoose")

module.exports = function(app, nconf) {
   var connectionString = nconf.get('db:mongo');
   var Interview = mongoose.model('Interview',
            {
              interviewer: {
               name: String,
               email: String,
               phone: String
              },
              candidate: {
               name: String,
               email: String,
               phone: String,
               github_handle: String
              },
              interviewDate: Date,
              hash: String
            });

   mongoose.connect(connectionString);

   app.post('/interview', function(req,res) {
      var interview = new Interview(req.body);
      interview.save(function (err) {
           if (err){
              res.send({status: 'error', message: 'failed to save interview'});
           }
           else {
              res.send({status:'success'});
           }
      });

   });

   app.options('/interview', function(req,res) {
      res.send(200);
   });

   app.get('/interview', function(req,res) {

      Interview.find({},function(err, data) {
         if (err) {
            res.send({status: 'error', message: 'failed to find interviews'});
         }
         else {
            var result = {};
            result.data = data;
            res.send(result);
         }
      })
   });

   app.get('/interview/:hash', function(req,res) {
      var searchParam = req.params.hash ? {'hash':req.params.hash} : {};

      Interview.find(searchParam,function(err, data) {
         if (err) {
            res.send({status: 'error', message: 'failed to find interviews'});
         }
         else {
            var result = {};
            result.data = data;
            res.send(result);
         }
      })
   });
}

