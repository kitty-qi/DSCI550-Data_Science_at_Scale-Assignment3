# DSCI550_Assignment3 Team 3

This is the third assignment from the DSCI 550 class. This assignment is collaborated and completed by Team 3. <br>
Team menbers: Jimin Ding, Mingyu Zong, Hui Qi, Xiaoyu Dong

## Group Assignment Allocation
Jimin Ding
> 

Mingyu Zong
> 

Hui Qi 
> Took charge of two D3 visualizations. <br>
Wrote reports about these two visualizations. 

Xiaoyu Dong
> 



## Dependencies

A list of all of the dependencies used, included their version number.
```



```
## Installation

Install the requirements necessary to run this project:  

```
pip install -r requirements.txt
```

## Running the project

In the 
```
.ipynb
```


```
.ipynb
```




## Methodology

#### Step1: D3 visualizations 

All D3 visualizations need to the webpage locally by using a webserver (to test) like python -m http.server <port> in the directory where the downloaded observable html and JSON locate.

download the codes of our d3 visualizations from the observable websites. upzip the document and open the terminal of this directory. In the terminal, we typed python -m http.server and opened http://localhost:8000/. 
```
python -m http.server 
```


#### Step8: Language detection by using Tika’s language identifier and Google LangDetect/Python
Since the narrative part of the post has a lot of tags, we wrote the remove_tag function to remove tags from the text. Then we called tika.language.from_buffer and langdetect.detect to detect the language of the text, and store the detection results into 'tika_language' and 'google_language'columns.

``` 
tika.language.from_buffer
langdetect.detect
``` 

#### Step9: RTG Translation
First, we use the results of Step8 to put the non-English post index into the Trans_list. Then remove tags and urls from the post with remove_tag and find_regular (because of the possibility of a timeout error). Then we use docker tp create RTG localhost and translate the text using tika.translate.auto_from_buffer(txt,'en').

It is easy to generate a timeout error while translating because the text is too long or in certain languages (such as Hindi and Mali). For text longer than 120, we cut it into multiple texts according to punctuation marks, then translated thoses pieces and integrated. The result is stored in 'rtg_translate' column.

``` 
tika.translate.auto_from_buffer
```

#### Step10: Location nname entity recognition by Tika GeoTopicParser with REST service of lucene-geo-gazetteer to find Lat/Lng
Following instructions on slack and GeoTopicParser website to set up the REST service of lucene-geo-gazetteer, NER location model, geotopic-parser, and geotopic-server. The core code running in python is listed below.
```
parser.from_buffer
```



#### Step11: Detoxify Scores Generation
This step uses the 'rtg_translate' column derived from RTG Translation. A script written in Python iterates through each value within the column, passes it as input string into detoxify, and saves score from each category into corresponding columns. Since RTG translated most of the posts into English, we ruled out the 'multilingual' model. Considering the additional 'sexual_explicit' category would provide more insights about these Pixstory posts, we determined to use the 'unbiased' model for all entries.

With combine_add_geo.csv (in folder Step10 - GeoTopicParser) and detoxify_scores.py (in folder Step11 - Detoxify) in the same folder, running the following command will generate a final.tsv with 7 more columns for scores: 'Toxicity', 'Severe_Toxicity', 'Obscenity', 'Identity_Attack', 'Insult', 'Threat', 'Sexual_Explicit'. For the posts that cannot be handled by RTG, which means they have a null value for 'rtg_translate', the scores are assigned to be null as well.
```
python3 detoxify_scores.py
```




