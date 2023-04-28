# DSCI550_Assignment3 Team 3

This is the third assignment from the DSCI 550 class. This assignment is collaborated and completed by Team 3. <br>
Team menbers: Jimin Ding, Mingyu Zong, Hui Qi, Xiaoyu Dong

## Group Assignment Allocation
Jimin Ding
> Took charge of one D3 visualizations.(Radial Stacked Bar Chart) <br>
Took charge of Image Space. (Step4) <br>
Took charge of MEMEX Geoparser. (step6)

Mingyu Zong
> D3 Visualizations (Timeseries, Heatmap). <br>
Webpage development. <br>
Discussion in report related to these visualizations.

Hui Qi 
> Took charge of two D3 visualizations. (Index Chart, Zoomable Sunburst) <br>
Wrote reports about visualizations of Radial Stacked Bar Chart, Index Chart, and Zoomable Sunburst.<br>
Took charge of Apache Solr (step 3 & 5)

Xiaoyu Dong
> Wrote reports about Image Space. <br>
Wrote reports about Geoparser and location data. <br>
Took charge of Image Space and Apache Solr. (Before mongo container and create-score.sh)



## Dependencies

A list of all of the dependencies used, included their version number.
```
pandas==1.4.4
pysolr==3.9.0
requests==2.23.0
tqdm==4.64.1
reverse_geocoder==1.5.1
country_converter==1.0.0
```
## Installation

Install the requirements necessary to run this project:  

```
pip install -r requirements.txt
```

## Running the project

All d3 visualizaions are in the D3 folder. If you want to run and open the html files locally, please look at the step2 in Methodology section becasue you need to use a webserver, like python -m http.server <port> in the directory where the html file locates.

We also host a live webpage displaying all the graphs at https://mz0ng.github.io/550-HW3/.


In the step3_Apache_Solr folder, open the pixstory folder and take a look at the jupyter notebook and two .sh files. If you want to run it and re-do the same process, please look at the step3 in Methodology section.





## Methodology

### Step2: D3 visualizations 

Select the plots we want from https://observablehq.com/@d3/gallery . Then, we adjusted our data to fit and input into the existing visualization examples.
After, completing drawing the chart in the d3 website, we downloaded the codes of our d3 visualizations from the observable websites, unzipped the document and opened the terminal of this directory. In the terminal, we typed python -m http.server and opened http://localhost:8000/. 

Notice that : all D3 visualizations need to the webpage locally by using a webserver (to test) like python -m http.server <port> in the directory where the downloaded observable html and JSON locate.

```
python -m http.server 
```

To get datasets used for drawing timeseries (source: http://mlvl.github.io/timeseries/) and heatmaps (source: https://gist.github.com/ChumaA/385a269db46ae56444772b62f1ae82bf), execute all blocks in "Extract Subsets.ipynb" in the D3 folder, make sure "final.tsv" is in the same folder. The execution outputs five files: "toxic_posts.csv", "toxic.json", "allcodes.json", "sarcasm.json", and "hate.json". Next, move the csv file into timeseries folder and all json files into heatmap folder. Then, /heatmap/heatmap.html and timeseries/timeseries.html should display the visualizations properly.

The dataset for the index chart is "df_result.csv" in the indexchart folder inside D3 directory. The original example is https://observablehq.com/@d3/index-chart. The dataset is produced by d3_language.ipynb.

The original example of the Zoomable Sunburst plot is https://observablehq.com/@d3/zoomable-sunburst. The data information we used for this plot is "geolocation_gender.json". This json file is the result of the association between geolocation mentioned and user's gender and can be seen from sunburst.ipynb. 

The orignial example of radial stacked bar chart is https://observablehq.com/@d3/radial-stacked-bar-chart. 
  
### Step3: Ingest your Pixstory into Apache Solr

First, we need to use "git clone" from https://github.com/nasa-jpl-memex/GeoParser. So, "git clone https://github.com/nasa-jpl-memex/GeoParser.git". Then, take a look at this example in https://github.com/nasa-jpl-memex/GeoParser/wiki/Sample:-COVID19-publication-data-parsing. Follow the instruction in this covid example. Notice that possibly need to do the installation in the Docker folder. Then, do the pre-requisties and "Get Data". We need to adjust the jupyter notebook, create_core.sh, and add_fields.sh from the covid example to our date before "Get Data". The order is create_core.sh (changing the folder name), jupyter notebook, add_fields.sh. 
  
At last, open http://localhost:8983/solr/ to see the result.
  
  
  
### Step4: Image Space (Can simply be done the following operations by the instruction on slack)
  
First, input the following command in terminal ('Piximages' folder is on the Google Drive of our team:
```
git clone https://github.com/nasa-jpl-memex/image_space
  
export IMAGE_SPACE=`pwd`/image_space
export IMAGE_DIR=/Piximages 
  
cd $IMAGE_SPACE/imagespace_smqtk && ./smqtk_services.run_images.sh --docker-network deploy_imagespace-network --images $IMAGE_DIR
  
cd $IMAGE_SPACE/scripts/deploy && IMAGE_DIR=$IMAGE_DIR docker-compose up -d
```
  
Then, open http://localhost:8088/opsui and wait for the 100% progress of IngestInPlace. When the progress is completed, run the following command:
```  
cd $IMAGE_SPACE/scripts/deploy && sh ./imagespace/enable-imagespace.sh
```
  
Finally, open http://localhost:8989 and input '*' on the search bar and click the 'Search by Similarity(SMQTK)' button to see all similar images.

  

### Step6: MEMEX GeoParser
  
After downloading all the documents on the webpage (https://github.com/nasa-jpl-memex/GeoParser), open a terminal in the 'Docker' folder of 'GeoParser-master' and enter the following commands according to this webpage (https://github.com/nasa-jpl-memex/GeoParser/wiki/Sample:-COVID19-publication-data-parsing).
```
docker pull nasajplmemex/geo-parser
docker-compose up -d
  
pip install jupyterlab && pip install notebook
pip install pandas pysolr requests tqdm  
```
  
Then, check out GeoParser to $GEOPARSER_HOME, and make a copy of 'covid' folder and rename it and the Ingest COVID data.ipynb (e.g. geo95000 and Ingest_geo95000.ipynb).  Modify the create_core.sh, and add_fields.sh file and add the .csv or .tsv file you want to ingest in the folder. Enter the following command in the terminal:
```
cd $GEOPARSER_HOME/examples/geo95000
./create-core.sh
./add-fields.sh
```
  
Now, modify the df source and the json_doc["text"] source in Ingest_geo95000.ipynb. Finally, open http://localhost:8000/ and follow the Use GeoParser part in https://github.com/nasa-jpl-memex/GeoParser/wiki/Sample:-COVID19-publication-data-parsing to parse and view the data.




