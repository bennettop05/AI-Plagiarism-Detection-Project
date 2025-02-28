from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split

app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  
    allow_headers=["*"],  
)

weights_path="lstm.h5"
data_path="train_v2_drcat_02.csv"

class CFG:
    sequence_length = 1024
    vocab_size = 10000
    is_training = True


train_df = pd.read_csv(data_path)
train_data, valid_data = train_test_split(train_df, test_size=0.2, stratify=train_df["label"], random_state=42)

def create_dataset(dataframe, shuffle=True):
    
    dataset = tf.data.Dataset.from_tensor_slices((dataframe["text"], dataframe["label"]))
    if shuffle:
        
        dataset = dataset.shuffle(1024, reshuffle_each_iteration=True)
    
    dataset = dataset.batch(256).cache().prefetch(tf.data.AUTOTUNE)
    
    return dataset

train_ds = create_dataset(train_data)
valid_ds = create_dataset(valid_data, shuffle=False)


vectorizer = tf.keras.layers.TextVectorization(
    max_tokens=CFG.vocab_size, 
    output_sequence_length=CFG.sequence_length, 
    pad_to_max_tokens=True
)


vectorizer.adapt(train_df["text"], batch_size=1024)

model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(), dtype=tf.string),
    vectorizer,
    tf.keras.layers.Embedding(
        input_dim=CFG.vocab_size, 
        output_dim=64,
        input_length=CFG.sequence_length, 
        mask_zero=True
    ),
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(64, return_sequences=True)), 
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(32)), 
    tf.keras.layers.Dense(16, activation="relu"),
    tf.keras.layers.Dense(1, activation="sigmoid")
])
model.compile(
    loss=tf.keras.losses.BinaryCrossentropy(), 
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3), 
    metrics=[
        "accuracy", 
        tf.keras.metrics.AUC(name="auc")
    ]
)

model.load_weights("lstm.h5")


@app.get('/')
def default_route():
    return {"Status: ", "Model ready for prediction"}

@app.get('/predict/{user_input}')
def predict_text(user_input: str):

    data = {"text": [user_input]}  
    input_df = pd.DataFrame(data)

    input_dataset = tf.data.Dataset.from_tensor_slices((input_df["text"]))
    input_dataset = input_dataset.batch(1) 
    input_dataset = input_dataset.cache().prefetch(tf.data.AUTOTUNE)

    predictions = model.predict(input_dataset)
    predictions_list = predictions.tolist()

    return {"Result": predictions_list}
    