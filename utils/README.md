#### config.py usage
```
./config.py -h
usage: config.py [-h] [-u] [-d] [-c CONFIG_FILE]

optional arguments:
  -h, --help            show this help message and exit
  -u, --download        download latest config from s3
  -d, --upload          upload a config file to s3
  -c CONFIG_FILE, --config-file CONFIG_FILE
                                config file location
```

To upload a config:
```
Upload config (default to /tmp/config.json)
./config.py -u

Upload config from a specific path:
./config.py -u -c /tmp/config.json

Output:
> ./config.py -u
uploaded to s3://screeneasy/config/latest/config.json
uploaded to s3://screeneasy/config/2013/09/11/22-55-08/config.json
```


To download the config:
```
./config.py -d
```
