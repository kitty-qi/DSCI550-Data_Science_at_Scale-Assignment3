ImageSpace Docker Setup
=======================

Requirements
============
Docker >= 1.9   
[Docker Compose](https://docs.docker.com/compose/install/)

Setup
=====
Execute these commands from `scripts/deploy` (relative to your ImageSpace checkout).

Run the following command to bring up containers for Girder, Mongo, and Solr.
```
IMAGE_DIR=/my/image-dir docker-compose up -d
```

At this point, Solr needs to have records for each image in your IMAGE_DIR, which is accomplished by running this import script:
```
./solr/import-images.sh SOLR-CONTAINER-NAME imagespace /my/image-dir
```

Note: On Mac you will need `sha1sum` for importing images, which can be installed with `brew install md5sha1sum`.

Navigating to [http://localhost:8989](http://localhost:8989) should result in a basic installation
of ImageSpace.
