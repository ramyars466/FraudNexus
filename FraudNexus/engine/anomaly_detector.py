from sklearn.ensemble import IsolationForest

model = IsolationForest(contamination=0.01)

def anomaly_score(features):
    return model.decision_function(features)