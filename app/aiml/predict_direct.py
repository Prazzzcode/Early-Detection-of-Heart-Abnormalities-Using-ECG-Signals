import joblib
import numpy as np
import json
import sys
import os

BASE = os.path.dirname(os.path.realpath(__file__))

model = joblib.load(os.path.join(BASE, "ecg_logistic_model.pkl"))
scaler = joblib.load(os.path.join(BASE, "ecg_scaler.pkl"))

data = json.loads(sys.stdin.read())
ecg = np.array(data["ecg"]).reshape(1, -1)

scaled = scaler.transform(ecg)
result = int(model.predict(scaled)[0])

print(result)
