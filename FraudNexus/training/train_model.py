import pandas as pd
import joblib
import json

from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, roc_auc_score
from imblearn.over_sampling import SMOTE

from xgboost import XGBClassifier
from catboost import CatBoostClassifier


# ===============================
# LOAD DATASET
# ===============================

print("Loading dataset...")

df = pd.read_csv("../data/creditcard.csv").sample(50000, random_state=42)

print("Dataset loaded successfully")
print("Dataset shape:", df.shape)


# ===============================
# SPLIT FEATURES AND LABEL
# ===============================

X = df.drop("Class", axis=1)
y = df["Class"]


# ===============================
# TRAIN TEST SPLIT
# ===============================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

print("Train/Test split completed")


# ===============================
# HANDLE CLASS IMBALANCE
# ===============================

print("Applying SMOTE to handle imbalance...")

smote = SMOTE(random_state=42)

X_resampled, y_resampled = smote.fit_resample(X_train, y_train)

print("SMOTE applied")
print("Resampled shape:", X_resampled.shape)


# ===============================
# TRAIN XGBOOST MODEL
# ===============================

print("\nTraining XGBoost model...\n")

xgb_model = XGBClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1,
    n_jobs=-1,
    eval_metric="logloss"
)

xgb_model.fit(X_resampled, y_resampled)

xgb_preds = xgb_model.predict(X_test)

print("XGBoost Performance")
print(classification_report(y_test, xgb_preds))

accuracy = accuracy_score(y_test, xgb_preds)
print("Accuracy:", accuracy)

probs = xgb_model.predict_proba(X_test)[:, 1]
auc = roc_auc_score(y_test, probs)
print("ROC-AUC:", auc)


# ===============================
# TRAIN CATBOOST MODEL
# ===============================

print("\nTraining CatBoost model...\n")

cat_model = CatBoostClassifier(
    iterations=200,
    depth=6,
    learning_rate=0.1,
    verbose=False
)

cat_model.fit(X_resampled, y_resampled)

cat_preds = cat_model.predict(X_test)

print("CatBoost Performance")
print(classification_report(y_test, cat_preds))


# ===============================
# SAVE TRAINED MODELS
# ===============================

print("\nSaving trained models...")

joblib.dump(xgb_model, "../models/xgboost_model.pkl")
joblib.dump(cat_model, "../models/catboost_model.pkl")

print("Models saved successfully")


# ===============================
# SAVE FEATURE ORDER
# ===============================

with open("../models/features.json", "w") as f:
    json.dump(list(X.columns), f)

print("Feature list saved")


print("\nTraining pipeline completed successfully")