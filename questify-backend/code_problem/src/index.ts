import { app } from './app';
import { connectDb, closeDbConnection } from './config/db';
import { AttemptCreatedListener } from './events/listeners/attempt-created-listener';
import { AttemptUpdatedListener } from './events/listeners/attempt-updated-listener';
import { LevelCreatedListener } from './events/listeners/level-created-listener';
import { LevelUpdatedListener } from './events/listeners/level-updated-listener';
import { UserCreatedListener } from './events/listeners/user-created-listener';
import { UserUpdatedListener } from './events/listeners/user-updated-listener';
import { natsWrapper } from './nats-wrapper';
import { syncModels } from './scripts/sync';

const start = async () => {
  await connectDb();

  await syncModels();

  process.on('SIGINT', async () => {
    console.log('Gracefully shutting down...');
    await closeDbConnection();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('Shutting down due to SIGTERM...');
    await closeDbConnection();
    process.exit(0);
  });

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL,
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    new LevelCreatedListener(natsWrapper.client).listen();
    new LevelUpdatedListener(natsWrapper.client).listen();
    new UserCreatedListener(natsWrapper.client).listen();
    new UserUpdatedListener(natsWrapper.client).listen();
    new AttemptCreatedListener(natsWrapper.client).listen();
    new AttemptUpdatedListener(natsWrapper.client).listen();

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
  } catch (err) {
    console.error(err);
  }
};

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});

start();
