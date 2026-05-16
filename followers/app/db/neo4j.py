from neo4j import GraphDatabase
from app.core.config import settings

class Neo4jDriver:
    driver = None

    @classmethod
    def connect(cls):
        cls.driver = GraphDatabase.driver(
            settings.NEO4J_URI,
            auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
        )

    @classmethod
    def close(cls):
        if cls.driver:
            cls.driver.close()

    @classmethod
    def get_session(cls):
        return cls.driver.session()
