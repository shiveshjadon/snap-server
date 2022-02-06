import json
import sys

import json
import spacy

text = sys.argv[-1]

nlp = spacy.load("en_core_web_sm")
nlp.add_pipe("merge_noun_chunks")
nlp.add_pipe("merge_entities")

doc = nlp(text)
# console.log(doc)

res = {"transcription": [], "keywords": [], "entities" : []}
res["transcription"].append({
    "text": text,
})

for chunk in doc.noun_chunks:
    res["keywords"].append(chunk.text)

# for token in doc:
#     res["tokens"].append({
#         "text": token.text,
#         "tag": token.tag_
#     })

for ent in doc.ents:
    res["entities"].append({
        "text": ent.text,
        "label": ent.label_
    })

print(json.dumps(res))