import random
import time
import sys
import os

# allow importing fraud_pipeline from parent folder
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fraud_pipeline import process_transaction

cards = ["C1", "C2", "C3", "C4"]
merchants = ["Amazon", "Flipkart", "Uber", "Swiggy"]
devices = ["D1", "D2", "D3", "D4", "D5"]

while True:
    transaction = {
        "card": random.choice(cards),
        "merchant": random.choice(merchants),
        "amount": random.randint(100, 15000),
        "device_id": random.choice(devices)
    }

    result = process_transaction(transaction)
    print(result)

    time.sleep(1)