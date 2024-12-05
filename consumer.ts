import { AckPolicy, connect } from "nats";

const servers = process.env.NATS_URI;

const main = async () => {
  // Connect to the NATS server
  const nc = await connect({ servers });

  // Create a JetStream manager instance
  const jsm = await nc.jetstreamManager();

  // Create a JetStream instance for consuming messages
  const js = nc.jetstream();

  // Add a durable consumer to the "EVENTS" stream with explicit acknowledgment policy
  await jsm.consumers.add("EVENTS", {
    durable_name: "my-durable", // Name of the durable consumer
    ack_policy: AckPolicy.Explicit, // Set acknowledgment policy to explicit
    filter_subject: "events.test", // Filter messages by subject
  });

  // Retrieve the durable consumer instance
  const consumerA = await js.consumers.get("EVENTS", "my-durable");

  // Start consuming messages from the consumer
  const messages = await consumerA.consume();

  // Define an asynchronous function to process incoming messages
  (async () => {
    for await (const m of messages) {
      // Iterate over each message
      // Retrieve the correlation ID from the message headers
      const correlationId = m.headers?.get("x-correlation-id");
      // Log the received message details
      console.log(`consume: ${m.data} ${correlationId}`);
      try {
        // Acknowledge the message
        m.ack();
      } catch (err) {
        // Log an error if acknowledgment fails
        console.error(`Failed to acknowledge message: ${err}`);
      }

      // Uncomment the following block to break the loop if no pending messages
      // if (m.info.pending === 0) {
      //   break;
      // }
    }
  })();

  console.log("Consumer is running");
};

main();
