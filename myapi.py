from transformers import GPT2Tokenizer, GPT2LMHeadModel
import torch
import nltk
from nltk.util import ngrams
from nltk.probability import FreqDist
from collections import Counter
from nltk.corpus import stopwords
import string
from nltk.tokenize.regexp import wordpunct_tokenize
from fastapi import FastAPI, Path
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware

tokenizer=GPT2Tokenizer.from_pretrained('gpt2')

model=GPT2LMHeadModel.from_pretrained('gpt2')

def calculate_perplexity(text):
    encoded_input= tokenizer.encode(text, add_special_tokens=False, return_tensors='pt')
    input_ids=encoded_input[0]

    with torch.no_grad():
        outputs=model(input_ids)
        logits=outputs.logits


    perplexity = torch.exp(torch.nn.functional.cross_entropy(logits.view(-1, logits.size(-1)), input_ids.view(-1)))

    return perplexity.item()

def calculate_burstiness(text):
    tokens=wordpunct_tokenize(text.lower())
    word_freq=FreqDist(tokens)

    repeated_count=sum(count>1 for count in word_freq.values())

    burstiness_score=repeated_count/len(word_freq)

    return burstiness_score

def calculate_burstiness(text):
    tokens=nltk.word_tokenize(text.lower())
    word_freq=FreqDist(tokens)

    repeated_count=sum(count>1 for count in word_freq.values())

    burstiness_score=repeated_count/len(word_freq)

    return burstiness_score

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  
    allow_headers=["*"],  
)

@app.get('/get-perplexity/{text}')  
def get_perplexity(text: str):

  p=calculate_perplexity(text)

  return {"perplexity": p}

@app.get('/get-burstiness/{text}')
def get_burstiness(text: str):

  b=calculate_burstiness(text)

  return {"burstiness": b}



