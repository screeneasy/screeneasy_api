var GitHubApi = require("github");

//Build up developer profile
// @TODO cache result with redis to avoid necessary hit
// cache key should be built base on timestamp, invalidate every day
module.exports = function(app) {
    var github = new GitHubApi({
        // required
        version: "3.0.0",
        // optional
        timeout: 5000
    });

    // Enforces user name
    app.get('/v1/developer/', function(req, res) {
        var message = {
            'error' : {
                'message' : 'username is required',
                'code' : 'INVALID_ENDPOINT',
                'link' : 'fixme'
            }
        };

        res.json(message);
    });

    app.options('/v1/developer/:name/gists', function(req,res) {
       res.send(200);
    });

    app.get('/v1/developer/:user/gists', function(req, res) {
       var github_handle = req.params.user;
       github.gists.getFromUser({
           user: github_handle
       }, function(err, data) {
           gists_result = {}
           gists = [];
           data.forEach(function(gist, idx) {
               delete gist.user;
               gists.push(gist);
           });
           gists_result.gists = gists;
           res.json(gists_result);
       });
    });

    app.options('/v1/developer/:name/basic', function(req,res) {
       res.send(200);
    });

    app.get('/v1/developer/:user/basic', function(req, res) {
       var github_handle = req.params.user;
       var result = {};
       github.user.getFrom({
           user: github_handle
       }, function(err, data) {
           result.basic = data;
           res.json(result);
       });
    });

    app.options('/v1/developer/:name/repos', function(req,res) {
       res.send(200);
    });

    app.get('/v1/developer/:user/repos', function(req, res) {
       var github_handle = req.params.user;
       var repos = {}
       github.repos.getFromUser({
           user: github_handle
       }, function(err, data) {
           repos.own_repos = [];
           repos.contributed_repos = [];

           data.forEach(function(repo, idx) {
               if(repo.fork == true) {
                  repos.contributed_repos.push(repo);
               } else {
                  repos.own_repos.push(repo);
               }
           });

           res.json(repos);
       });
    });
};
