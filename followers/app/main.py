from fastapi import FastAPI
from app.api.routes import router
from app.messaging.rabbit import RabbitConsumer
from app.db.neo4j import Neo4jDriver
from prometheus_fastapi_instrumentator import Instrumentator
import threading

def start_consumer():
    consumer = RabbitConsumer()
    consumer.start()

app = FastAPI()

@app.on_event("startup")
def startup():
    Neo4jDriver.connect()
    thread = threading.Thread(target=start_consumer, daemon=True)
    thread.start()

@app.on_event("shutdown")
def shutdown():
    Neo4jDriver.close()

app.include_router(router)

Instrumentator().instrument(app).expose(app, endpoint="/metrics")