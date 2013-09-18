#!/usr/bin/env python
from boto import Config as BotoConfig
from boto.s3.key import Key
import argparse
import boto
import os
import sys

class AwsConfig(BotoConfig):
    """
        Extend BotoConfig.get() to look up environment variables

        @param section str
        @param name str
        @param default str
        @see BotoConfig.get()
        @return string
    """
    def expand_get(self, section, name, default=None):
        val = self.get(section, name, default)

        if not val:
           name = name.upper()
           val = os.getenv(name)

           if not val:
              raise EnvironmentError('Set %s in env or ~/.boto or /etc/boto' % name)

        return val

class ConfigManager():
    """
    Simple build script to manage build process
    """
    def __init__(self):
        aws_config = AwsConfig()
        aws_key     = aws_config.expand_get('Credentials', 'aws_access_key_id')
        aws_secret  = aws_config.expand_get('Credentials', 'aws_secret_access_key')
        s3 = boto.connect_s3(aws_key, aws_secret)
        try:
            self.s3_bucket = s3.get_bucket('screeneasy')
        except boto.exception.S3ResponseError, e:
            sys.exit('Incorrect aws credentails. Please check ~/.boto or environment variables aws_access_key_id and aws_secret_access_key')

    def download_config(self):
        """
            Download latst version of config.json
        """
        bucket = self.s3_bucket
        k = Key(bucket)
        k.key = 'config/latest/config.json'
        content = k.get_contents_as_string()

        with open('/tmp/config.json', 'w') as config_writer:
            config_writer.write(content)
            print "downloaded config to /tmp/config.json"

    def upload_config(self, config_file):
        """
        Upload to s3 with the following formats:
            s3://screeneasy/config/latest/config.json
            s3://screeneasy/config/date/config.json

        e.g:
            s3://screeneasy/config/latest/config.json
            s3://screeneasy/config/2013/09/11/22-55-08/config.json

        Args:
            config_file string - config file path
        """
        import datetime
        now = datetime.datetime.now()

        bucket = self.s3_bucket

        k = Key(bucket)

        # Overrides latest build
        k.key = 'config/latest/config.json'
        k.set_contents_from_filename(config_file)
        print "uploaded to s3://screeneasy/config/latest/config.json"

        # Upload a copy for archiving purpose
        key_name = 'config/%s/config.json' % now.strftime("%Y/%m/%d/%H-%M-%S")
        k.key = key_name
        k.set_contents_from_filename(config_file)
        print "uploaded to s3://screeneasy/%s" % key_name

if __name__ == '__main__':
    def parse_arg_options():
        """
        Parse command line argument
        """
        parser = argparse.ArgumentParser()
        parser.add_argument('-u', '--download', help='download latest config from s3', dest='upload_config', action='store_true')
        parser.add_argument('-d', '--upload', help='upload a config file to s3', dest='download_config', action='store_true')
        parser.add_argument('-c', '--config-file', help='config file location', dest='config_file', default='/tmp/config.json')

        return parser.parse_args()

    args = parse_arg_options()

    config = ConfigManager()

    if args.upload_config:
        config.upload_config(args.config_file)

    if args.download_config:
        config.download_config()
