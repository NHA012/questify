import { app } from './app';
import { connectDb, closeDbConnection } from './config/db';
import { UserCreatedListener } from './events/listeners/user-created-listener';
import { UserUpdatedListener } from './events/listeners/user-updated-listener';
import { IslandTemplateCreatedListener } from './events/listeners/island-template-created-listener';
import { IslandTemplateUpdatedListener } from './events/listeners/island-template-updated-listener';
import { natsWrapper } from './nats-wrapper';
import { syncModels } from './scripts/sync';
import { CourseUpdatedListener } from './events/listeners/course-updated-listener';

const start = async () => {
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
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new UserCreatedListener(natsWrapper.client).listen();
    new UserUpdatedListener(natsWrapper.client).listen();
    new IslandTemplateCreatedListener(natsWrapper.client).listen();
    new IslandTemplateUpdatedListener(natsWrapper.client).listen();
    new CourseUpdatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.error(err);
  }

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
};

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});

start();
