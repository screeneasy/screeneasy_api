module.exports = function(app, mailservice) {

   app.options('/email', function(req,res) {
      res.send(200);
   });

   app.post('/email', function(req, res) {
      // @TODO parameterize these fields
      mailservice.send({
        to:       req.body.to,
        from:     'support@screeneasy.me',
        subject:  'Hello World',
        text:     req.body.message
      }, function(err, json) {
        if (err) {
            return console.error(err);
        }

        res.json(json);
      });
   })
}
