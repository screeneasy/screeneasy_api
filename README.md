ScreenEasy.me
==========

ScreenEasy app

# Config
/tmp/config.json
```
{
  "twitter": {
    "key": "foo",
    "secret": "bar"
  },
  "github": {
    "key":"foo",
    "secret":"bar"
  },
  "notification": {
    "sendgrid": {
       "apiuser": "foo",
       "apikey": "bar"
    }
  },
  "db": {
    "dsn":"postgres://user:pass@host:port/schema",
    "mongo": "mongodb://user:pass@foo.host.com:port/collection"
  }
}
```

You can also download the config with:
```
run utils/config.py -d
```

See [Config README](utils/README.md) for details

# Import Schema
```
- node utils/schema.js
```

# Run project
```
- npm install
- ./node_modules/nodemon/nodemon.js app.js -e js,css,html
- You may also need to install postgresql-server-dev package (e.g: sudo apt-get install postgresql-server-dev-9.1)
```

# Deploy
```
- git push heroku master
- heroku addons:add shared-database
- heroku run node schema.js
```
