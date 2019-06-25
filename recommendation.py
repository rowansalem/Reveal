#!/usr/bin/env python
# coding: utf-8


import pymysql
pymysql.install_as_MySQLdb()

from pandas.io import sql
import MySQLdb
from pandas.io import sql
from sqlalchemy import create_engine
import pandas as pd
import pymysql

# Create a connection object
dbServerName    = "127.0.0.1"
dbUser          = "root"
dbPassword      = "password"
dbName          = "JobPosts"

 
connectionObject   = pymysql.connect(host=dbServerName, user=dbUser, password=dbPassword,

                                     db=dbName)


try:
    # Create a cursor object

    cursorObject = connectionObject.cursor() 
    selectStatement="SELECT Vacancy.Vacancy_id ,Vacancy.City , Job.Job_name ,Vacancy.job_category , Vacancy.job_description ,Vacancy.Job_Date,       Vacancy.num_vacancies, Vacancy.salary_maximum , Vacancy.salary_minimum , Vacancy.career_level       from Vacancy,Job where Vacancy.Job_id2 = Job.Job_id "

    cursorObject.execute(selectStatement)
    table_rows = cursorObject.fetchall()
    vacancy = pd.DataFrame(list(table_rows), columns=['Vacancy_id','City','job_title','job_category','job_description','Job_Date'                                                     ,'num_vacancies','salary_maximum','salary_minimum','career_level'])

except Exception as e:
    

    print("Exeception occured:{}".format(e))

finally:

    connectionObject.commit()

print("new_frequency done reading vacancy table")

import pandas as pd
import nltk
from nltk.tokenize import word_tokenize
from nltk.tag import pos_tag
from bs4 import BeautifulSoup
from nltk.corpus import stopwords
nltk.download('stopwords')

vacancy["job_description"].fillna( ' ', inplace = True) 

"""#TF-IDF"""

#Fetch wordcount for each abstract
vacancy['word_count'] = vacancy['job_description'].apply(lambda x: len(str(x).split(" ")))
vacancy[['job_description','word_count']].head()

vacancy.word_count.describe()

freq = pd.Series(' '.join(vacancy['job_description']).split()).value_counts()[:20]
#freq
#Identify uncommon words
freq1 =  pd.Series(' '.join(vacancy 
         ['job_description']).split()).value_counts()[-20:]
#freq1

from nltk.stem.porter import PorterStemmer
from nltk.stem.wordnet import WordNetLemmatizer
nltk.download('wordnet')
# Libraries for text preprocessing
import re
import nltk
#nltk.download('stopwords')
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
from nltk.tokenize import RegexpTokenizer
#nltk.download('wordnet') 
from nltk.stem.wordnet import WordNetLemmatizer
lem = WordNetLemmatizer()
stem = PorterStemmer()
##Creating a list of stop words and adding custom stopwords
stop_words = set(stopwords.words("english"))
##Creating a list of custom stopwords
new_words = ["bull","nbsp","amp"]
stop_words = stop_words.union(new_words)

def remove_html_tags(text):
 #   """Remove html tags from a string"""
    import re
    clean = re.compile('(\<(\/)?(\w)*(\d)?\>)')
    clean = re.compile('<.*?>')
    return re.sub(clean, '', text)

corpus = []
vacancy_count = len(vacancy)
for i in range(0,vacancy_count ):
        #remove tags
    text = remove_html_tags(vacancy['job_description'][i])
    
    #Remove punctuations
    text = re.sub('[^a-zA-Z]', ' ',text)
    
    #Convert to lowercase
    text = text.lower()
    

    #text=re.sub("&lt;/?.*?&gt;"," &lt;&gt; ",text)
    
    # remove special characters and digits
    text=re.sub("(\\d|\\W)+"," ",text)
    
    ##Convert to list from string
    text = text.split()
    
    ##Stemming
    ps=PorterStemmer()
    #Lemmatisation
    lem = WordNetLemmatizer()
    text = [lem.lemmatize(word) for word in text if not word in  
            stop_words] 
    text = " ".join(text)
    corpus.append(text)


from sklearn.feature_extraction.text import CountVectorizer
import re
cv=CountVectorizer(stop_words=stop_words,max_df=0.4, max_features=10000, ngram_range=(1,3))
#df2['job_description'] = df2['job_description'].apply(lambda x: cv.fit_transform(x))

X=cv.fit_transform(corpus)


from sklearn.feature_extraction.text import TfidfTransformer
 
tfidf_transformer=TfidfTransformer(smooth_idf=True,use_idf=True)
tfidf_transformer.fit(X)
# get feature names
feature_names=cv.get_feature_names()
 
# fetch document for which keywords needs to be extracted

 
#generate tf-idf for the given document
#tf_idf_vector=tfidf_transformer.transform(cv.transform([doc]))


#Function for sorting tf_idf in descending order
from scipy.sparse import coo_matrix
def sort_coo(coo_matrix):
    tuples = zip(coo_matrix.col, coo_matrix.data)
    return sorted(tuples, key=lambda x: (x[1], x[0]), reverse=True)
 
def extract_topn_from_vector(feature_names, sorted_items, topn=10):
    """get the feature names and tf-idf score of top n items"""
    
    #use only topn items from vector
    sorted_items = sorted_items[:topn]
 
    score_vals = []
    feature_vals = []
    
    # word index and corresponding tf-idf score
    for idx, score in sorted_items:
        
        #keep track of feature name and its corresponding score
        score_vals.append(round(score, 3))
        feature_vals.append(feature_names[idx])
 
    #create a tuples of feature,score
    #results = zip(feature_vals,score_vals)
    results= {}
    for idx in range(len(feature_vals)):
        results[feature_vals[idx]]=score_vals[idx]
    
    return results


def get_TF(text):
  tf_idf_vector=tfidf_transformer.transform(cv.transform([text]))
  #sort the tf-idf vectors by descending order of scores
  sorted_items=sort_coo(tf_idf_vector.tocoo())
  #extract only the top n; n here is 10
  keywords=extract_topn_from_vector(feature_names,sorted_items,50)
  keys=[]
  for k in keywords:
    keys.append(k)
  return keys

df2=vacancy
df2['job_description'] = df2['job_description'].apply(lambda x: get_TF(x))


print("new_frequency done get_TF")




import pymysql
pymysql.install_as_MySQLdb()
from pandas.io import sql
import MySQLdb
from pandas.io import sql
from sqlalchemy import create_engine
import pandas as pd
import pymysql

# Create a connection object
dbServerName    = "127.0.0.1"
dbUser          = "root"
dbPassword      = "password"
dbName          = "JobPosts"

 
connectionObject   = pymysql.connect(host=dbServerName, user=dbUser, password=dbPassword,

                                     db=dbName)

try:
    # Create a cursor object

    cursorObject = connectionObject.cursor() 
    selectStatement="SELECT * FROM has_viewed"
    cursorObject.execute(selectStatement)
    table_rows = cursorObject.fetchall()
    has_viewed = pd.DataFrame(list(table_rows), columns=['Vacancy_id3','User_id3'])

except Exception as e:

    print("Exeception occured:{}".format(e))

finally:

    connectionObject.commit()




import pandas as pd
#from rake_nltk import Rake
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer

df=vacancy

def convert(list): 
      
    # Converting integer list to string list 
    s = [str(i) for i in list] 
      
    # Join list items using join() 
    res =" ".join(s)
      
    return(res)
vacancy['job_description'] = vacancy['job_description'].apply(lambda x: convert(x))


from pandas import DataFrame 

temp=vacancy['City'].map(str) + ' ' + df['job_title'].map(str)+ ' ' + df['job_category'].map(str) + ' ' + df['salary_minimum'].map(str) + ' ' + df['salary_maximum'].map(str)+ ' ' + df['career_level'].map(str) + ' ' + df['job_description'].map(str)
df5=pd.DataFrame(columns=['Vacancy_id', 'bag_of_words'])
df5['bag_of_words'] = temp.values
df5['bag_of_words'] = df5['bag_of_words'].str.lower()
df5['Vacancy_id']= vacancy['Vacancy_id'].values




# instantiating and generating the count matrix
count = CountVectorizer()
count_matrix = count.fit_transform(df5['bag_of_words'])

# generating the cosine similarity matrix
cosine_sim = cosine_similarity(count_matrix, count_matrix)






# creating a Series for the movie titles so they are associated to an ordered numerical
# list I will use in the function to match the indexes
indices = pd.Series(df5.Vacancy_id)

#  defining the function that takes in movie title 
# as input and returns the top 10 recommended movies
def recommendations(title, cosine_sim = cosine_sim):
    
    # initializing the empty list of recommended movies
    recommended_movies = []
    
    # gettin the index of the movie that matches the title
    idx = indices[indices == title].index[0]

    # creating a Series with the similarity scores in descending order
    score_series = pd.Series(cosine_sim[idx]).sort_values(ascending = False)

    # getting the indexes of the 10 most similar movies
    top_10_indexes = list(score_series.iloc[1:4].index)
    
    # populating the list with the titles of the best 10 matching movies
    for i in top_10_indexes:
        recommended_movies.append(list(df5.Vacancy_id)[i])
        
    return recommended_movies



recommended_insert_values=[]
for x in range(0, len(has_viewed)):
    r=recommendations(has_viewed.iloc[x]['Vacancy_id3'])
    for i in r: 
        recommended_insert_values.append((i,int(has_viewed.iloc[x]['User_id3']),0))
#     print has_viewed.iloc[i]['Vacancy_id3'], c


connectionObject1   = pymysql.connect(host=dbServerName, user=dbUser, password=dbPassword,db=dbName)
try:
    # Create a cursor object
    cursorObject1 = connectionObject1.cursor() 
    insertStatement="INSERT INTO Recommended (Vacancy_id4,user_id4,sent_email) VALUES (%s,%s,%s)"
    cursorObject1.executemany(insertStatement,recommended_insert_values)

except Exception as e:

    print("Exeception occured:{}".format(e))

finally:

    connectionObject1.commit()
    

