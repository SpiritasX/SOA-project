import json
import time
import pika
from app.core.config import settings
from app.services.user_projection_service import UserProjectionService



class RabbitConsumer:
    def __init__(self):
        def connect():
            for i in range(10):
                try:
                    return pika.BlockingConnection(
                        pika.ConnectionParameters(
                            host="rabbitmq",
                            port=5672,
                            credentials=pika.PlainCredentials("guest", "guest"),
                        )
                    )
                except Exception:
                    time.sleep(5)

            raise Exception("RabbitMQ not available")

        self.connection = connect()

        self.channel = self.connection.channel()

        self.exchange = "user.exchange"

        self.channel.exchange_declare(
            exchange=self.exchange,
            exchange_type="topic",
            durable=True
        )

        self.setup_queues()

    def setup_queues(self):
        # user registered
        q1 = self.channel.queue_declare(queue="user.registered.followers.queue", durable=True)
        self.channel.queue_bind(
            exchange=self.exchange,
            queue=q1.method.queue,
            routing_key="user.registered"
        )

        # blocked
        q2 = self.channel.queue_declare(queue="user.blocked.followers.queue", durable=True)
        self.channel.queue_bind(
            exchange=self.exchange,
            queue=q2.method.queue,
            routing_key="user.blocked"
        )

        # unblocked
        q3 = self.channel.queue_declare(queue="user.unblocked.followers.queue", durable=True)
        self.channel.queue_bind(
            exchange=self.exchange,
            queue=q3.method.queue,
            routing_key="user.unblocked"
        )

        self.channel.basic_consume(
            queue=q1.method.queue,
            on_message_callback=self.on_registered,
            auto_ack=True
        )

        self.channel.basic_consume(
            queue=q2.method.queue,
            on_message_callback=self.on_blocked,
            auto_ack=True
        )

        self.channel.basic_consume(
            queue=q3.method.queue,
            on_message_callback=self.on_unblocked,
            auto_ack=True
        )

    def on_registered(self, ch, method, properties, body):
        data = json.loads(body)
        UserProjectionService.create_user(data["id"], data["firstName"], data["lastName"])

    def on_blocked(self, ch, method, properties, body):
        user_id = json.loads(body)
        UserProjectionService.set_blocked(user_id, True)

    def on_unblocked(self, ch, method, properties, body):
        user_id = json.loads(body)
        UserProjectionService.set_blocked(user_id, False)

    def start(self):
        self.channel.start_consuming()
