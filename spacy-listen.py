from html import entities
import json
import spacy
import pytextrank
nlp = spacy.load("en_core_web_sm")
nlp.add_pipe("merge_noun_chunks")
nlp.add_pipe("merge_entities")
nlp.add_pipe("textrank")

targetTags = ['NN', 'NNP', 'NNS', 'JJ']

while True:
  text = input()
  doc = nlp(text)

  # res = {"keywords": [], "tokens": [] }
  res = {"tokens": [] }

  # res["transcription"].append({
  #   "text": text,
  # })

  # for phrase in doc._.phrases:
  #   res["keywords"].append({
  #     "text": phrase.text,
  #     "rank": phrase.rank
  #   })

  for token in doc:
    if token.tag_ in targetTags or len(token.ent_type_):
      res["tokens"].append({
      "text": token.text,
      "tag": token.tag_,
      "ent_type": token.ent_type_
    })

  print(json.dumps(res))