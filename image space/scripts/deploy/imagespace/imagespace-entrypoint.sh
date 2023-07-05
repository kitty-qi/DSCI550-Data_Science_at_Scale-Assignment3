#!/bin/bash
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
set -e

# Wait for Mongo to be listening, this assumes the mongo container will
# be imagespace-mongo rather than what's passed to Girder
# @todo this will only work in the context of docker-compose
until nc -z imagespace-mongo 27017; do sleep 1; done;

# Start up Girder in the background
(python -m girder "$@" > entrypoint.log 2>&1) &

# Wait for it to be done starting
until grep -qi 'engine bus started' entrypoint.log; do sleep 1; done;

# Bootstrap with user, assetstore, and ImageSpace plugin enabled
python /bootstrap-imagespace.py

# Tear down Girder
kill $(pgrep -f girder)

# Host on port 8989
sed -i 's/8080/8989/' /girder/girder/conf/girder.local.cfg

# Start Girder for the container process
python -m girder "$@"
