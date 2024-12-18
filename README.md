# [NATS JetStream](https://natsbyexample.com/examples/jetstream/api-migration/deno) Publisher and Consumer

This project demonstrates how to use NATS JetStream for publishing and consuming messages with durable consumers. It includes a publisher that sends messages to a specific subject and a consumer that listens for those messages, acknowledging them upon receipt.

Install dependencies

```bash
npm ci
```

Run NATS 

```bash
docker compose up -d
```

Run Publisher

```bash
npm run publisher:serve
```

Run Consumer

```bash
npm run consumer:serve
```