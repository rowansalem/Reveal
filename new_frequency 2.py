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
    selectStatement="SELECT Vacancy.Vacancy_id ,Vacancy.City , Vacancy.Job_id2 ,Vacancy.job_category , Vacancy.job_description ,Vacancy.Job_Date, Vacancy.num_vacancies, Vacancy.salary_maximum , Vacancy.salary_minimum , Vacancy.career_level from Vacancy"

    cursorObject.execute(selectStatement)
    table_rows = cursorObject.fetchall()
    vacancy = pd.DataFrame(list(table_rows), columns=['Vacancy_id','City','Job_id','job_category','job_description','Job_Date'                                                     ,'num_vacancies','salary_maximum','salary_minimum','career_level'])

except Exception as e:

    print("Exeception occured:{}".format(e))

finally:

    connectionObject.close()



df = pd.DataFrame(columns = ['job_description', 'keywords']) 
df['job_description']=vacancy['job_description']




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
  keysStr = ','.join(keys)
  return keysStr

df2=vacancy
df2['job_description'] = df2['job_description'].apply(lambda x: get_TF(x))



df['keywords']=df2['job_description']



word_frequency = pd.DataFrame(df2.job_description.str.split(',').tolist(), index=df2.Job_id).stack()
word_frequency = word_frequency.reset_index()[[0, 'Job_id']] # var1 variable is currently labeled 0
word_frequency.columns = ['job_description', 'Job_id'] # renaming var1




word_frequency.groupby(['Job_id'])




word_frequency['Job_id'] = word_frequency['Job_id'].astype('str')
word_frequency['job_description'] = word_frequency['job_description'].astype('str')
word_frequency = word_frequency.rename(columns={'job_description': 'skill_name'})
# word_frequency.drop_duplicates(keep=False,inplace=True) 




word_frequency = word_frequency.groupby(['Job_id', 'skill_name']).size().reset_index(name='Freq')
word_frequency=word_frequency.sort_values(by='Freq', ascending=False)
engine = create_engine("mysql+pymysql://{user}:{pw}@localhost/{db}".format(user="root",pw="password",db="JobPosts"))
word_frequency.to_sql(con=engine, name='word_frequency', if_exists='replace', index=False)
