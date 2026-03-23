import os
from mongoengine import connect, disconnect
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb://localhost:27017/productdb?uuidRepresentation=standard"
)

TEST_MONGO_URI = "mongodb://localhost:27017/productdb_test?uuidRepresentation=standard"


def init_db(testing: bool = False):
    disconnect()

    if testing:
        connect(host=TEST_MONGO_URI)
    else:
        connect(host=MONGO_URI)