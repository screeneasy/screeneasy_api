var pg = require('pg').native;
var client;
var query;

module.exports = function(app, nconf) {
    var connectionString = process.env.DATABASE_URL || nconf.get('db:dsn');
    client = new pg.Client(connectionString);
    client.connect();

    app.options('/v1/interview/question', function(req, res) {
      res.send(200);
    });

    app.post('/v1/interview/question', function(req, res) {
      var now = new Date().toUTCString();
      var title = req.body.title;
      var tags = req.body.tags;
      var body = req.body.body;

      client.query('INSERT INTO interview_questions (title, body, tags, created) VALUES ($1, $2, $3, $4) RETURNING id', [title, body, tags, now], function(err, result) {
          if(err) {
            res.json(err);
          };

          var returnVal = {
            id: result.rows[0].id,
            title: title,
            body: body,
            tags: tags,
            created: now
          };

          res.json(returnVal);
      });
    });

    app.get('/v1/interview/question', function(req, res) {
      query = client.query('SELECT * FROM interview_questions');
      var rows = [];
      query.on('row', function(row) {
          rows.push(row);
      });
      query.on('end', function(result) {
          res.json(rows);
      });
    });

    // Delete a specific interview question
    app.delete('/v1/interview/question/:id', function(req, res) {
      query = client.query('DELETE FROM interview_questions WHERE id = ' + req.params.id);
      query.on('end', function(result) {
          res.json(result.rowCount === 1);
      });
    });
};
