
import os                    
from dotenv import load_dotenv   
import mongoengine as me     

load_dotenv()

_CONNECTED = False


def get_connection():

    global _CONNECTED

    if _CONNECTED:
        return

    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/inventory_db")
    db_name   = os.getenv("DB_NAME",   "inventory_db")

    try:
        me.connect(
            db=db_name,      
            host=mongo_uri,  
            alias="default" 
        )
        _CONNECTED = True    
        print(f"[DB] Connected to {db_name}")

    except Exception as exc:
       
        raise ConnectionError(
            f"Cannot connect to MongoDB.\n"
            f"URI: {mongo_uri}\n"
            f"Is MongoDB running? Try: mongod --dbpath /data/db\n"
            f"Original error: {exc}"
        ) from exc