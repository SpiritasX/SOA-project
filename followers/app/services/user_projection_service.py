from app.db.neo4j import Neo4jDriver

class UserProjectionService:

    @staticmethod
    def create_user(user_id: int, first_name: str, last_name: str):
        query = """
        MERGE (u:User {id: $id, first_name: $first_name, last_name: $last_name})
        ON CREATE SET u.blocked = false
        """
        with Neo4jDriver.get_session() as session:
            session.run(query, id=user_id, first_name=first_name, last_name=last_name)

    @staticmethod
    def set_blocked(user_id: int, blocked: bool):
        query = """
        MATCH (u:User {id: $id})
        SET u.blocked = $blocked
        """
        with Neo4jDriver.get_session() as session:
            session.run(query, id=user_id, blocked=blocked)
