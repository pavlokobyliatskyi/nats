import { connect, headers } from "nats";
import { v4 as uuidv4 } from "uuid";

const servers = process.env.NATS_URI;

const main = async () => {
  // Connect to the NATS server
  const nc = await connect({ servers });
  // Create a JetStream manager instance
  const jsm = await nc.jetstreamManager();

  try {
    // Attempt to create a new stream named "EVENTS" with a subject "events.test"
    await jsm.streams.add({
      name: "EVENTS",
      subjects: ["events.test"],
    });
  } catch (e) {
    // Log an error message if stream creation fails
    console.error("Failed to create stream:", e);
  }

  // Create a JetStream instance for publishing messages
  const js = nc.jetstream();

  // Set an interval to publish messages every second
  setInterval(async () => {
    // Generate a unique correlation ID for the message
    const correlationId = uuidv4();

    // Create headers for the message
    const hrds = headers();
    // Set the correlation ID in the headers
    hrds.set("x-correlation-id", correlationId);

    // Get the current time as a string
    const time = new Date().toLocaleTimeString();
    // Publish the current time to the "events.test" subject with the headers
    await js.publish("events.test", time, { headers: hrds });

    // Log the published message and its correlation ID
    console.log("publish:", time, correlationId);
  }, 1000); // Interval set to 1000 milliseconds (1 second)

  console.log("Publisher is running");
};

// Execute the main function
main();
