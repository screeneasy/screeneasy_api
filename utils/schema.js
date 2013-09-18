var pg = require('pg').native;
var fs = require('fs');
var nconf = require('nconf');
//Load up config
nconf.file({ file: '/tmp/config.json' });
var connectionString = process.env.DATABASE_URL || nconf.get('db:dsn');
var client
var query;

client = new pg.Client(connectionString);
client.connect();

schema_file = 'schemas/interviews.sql';
fs.readFile(schema_file, function(err, data) {
    if(err) {
        throw schema_file + " must exists";
    }

    query = client.query(data.toString());
    query.on('end', function() { client.end(); })
});
