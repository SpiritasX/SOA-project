from app.db.neo4j import Neo4jDriver

class FollowService:

    @staticmethod
    def is_following(follower_id: int, following_id: int):
        query = """
        MATCH (u1:User {id: $follower_id})-[f:FOLLOWS]->(u2:User {id: $following_id})
        RETURN f
        """

        with Neo4jDriver.get_session() as session:
            result = session.run(
                query,
                follower_id=follower_id,
                following_id=following_id
            )

            follows = result.single() is not None
            print(follows)
            return follows

    @staticmethod
    def follow(follower_id: int, following_id: int):
        query = """
        MATCH (u1:User {id: $follower_id})
        MATCH (u2:User {id: $following_id})
        MERGE (u1)-[:FOLLOWS]->(u2)
        """

        with Neo4jDriver.get_session() as session:
            session.run(
                query,
                follower_id=follower_id,
                following_id=following_id
            )

    @staticmethod
    def unfollow(follower_id: int, following_id: int):
        query = """
        MATCH (u1:User {id: $follower_id})-[r:FOLLOWS]->(u2:User {id: $following_id})
        DELETE r
        """

        with Neo4jDriver.get_session() as session:
            session.run(
                query,
                follower_id=follower_id,
                following_id=following_id
            )

    @staticmethod
    def get_following(user_id: int):
        print(f"get_following called by User({user_id})")

        query = """
        MATCH (u:User {id: $user_id})-[:FOLLOWS]->(other:User)
        WHERE other.blocked = false
        RETURN DISTINCT other.id AS id
        """

        with Neo4jDriver.get_session() as session:
            result = session.run(
                query,
                user_id=user_id
            )

            ids = [record["id"] for record in result]
            print(f"get_following returned ids {ids}")
            return ids

    @staticmethod
    def get_follow_recommendations(user_id: int):
        print(f"get_follow_recommendations called by User({user_id})")

        query = """
        MATCH (u:User {id: $user_id})-[:FOLLOWS]->(:User)-[:FOLLOWS]->(other:User)
        WHERE other.id <> u.id
        AND NOT (u)-[:FOLLOWS]->(other)
        AND other.blocked = false
        RETURN DISTINCT other.id AS id
        """

        with Neo4jDriver.get_session() as session:
            result = session.run(
                query,
                user_id=user_id
            )

            ids = [record["id"] for record in result]
            print(f"get_follow_recommendations returned ids {ids}")
            return ids