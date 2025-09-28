import { app } from './app';
import { connectDb, closeDbConnection } from './config/db';
import { natsWrapper } from './nats-wrapper';
import { syncModels } from './scripts/sync';
import { UserCourseCreatedListener } from './events/listeners/user-course-created-listener';
import { UserCourseUpdatedListener } from './events/listeners/user-course-updated-listener';
import { UserCourseInventoryCreationListener } from './events/listeners/user-course-inventory-creation-listener';

import { LevelCreatedListener } from './events/listeners/level-created-listener';
import { LevelUpdatedListener } from './events/listeners/level-updated-listener';
import { UserCreatedListener } from './events/listeners/user-created-listener';
import { CourseCreatedListener } from './events/listeners/course-created-listener';
import { IslandCreatedListener } from './events/listeners/island-created-listener';
import { IslandUpdatedListener } from './events/listeners/island-updated-listener';
import { PrerequisiteIslandCreatedListener } from './events/listeners/prerequisite-island-created-listener';
import { PrerequisiteIslandDeletedListener } from './events/listeners/prerequisite-island-deleted.listener';
import { UserUpdatedListener } from './events/listeners/user-updated-listener';
import { CourseItemTemplateCreatedListener } from './events/listeners/course-item-template-created-listener';
import { CourseItemTemplateUpdatedListener } from './events/listeners/course-item-templated-updated-listener';
import { ItemTemplateCreatedListener } from './events/listeners/item-template-created-listener';
import { ItemTemplateUpdatedListener } from './events/listeners/item-template-updated-listener';
import { ChallengeCreatedListener } from './events/listeners/challenge-created-listener';
import { ChallengeUpdatedListener } from './events/listeners/challenge-updated-listener';
import { SlideCreatedListener } from './events/listeners/slide-created-listener';
import { SlideUpdatedListener } from './events/listeners/slide-updated-listener';

import { retryService } from './services/retry-service';
import { initializeEventProcessors } from './services/event-processors';

import { AttemptUpdatedListener } from './events/listeners/attempt-updated-listener';

const start = async () => {
  try {
    await connectDb();

    await syncModels();

    // Set up graceful shutdown handlers
    const gracefulShutdown = async () => {
      retryService.stop();

      // Close NATS connection
      if (natsWrapper.client) {
        await natsWrapper.client.close();
      }

      // Close database connection
      await closeDbConnection();

      process.exit(0);
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);

    // Check for required environment variables
    if (!process.env.NATS_CLIENT_ID) {
      throw new Error('NATS_CLIENT_ID must be defined');
    }
    if (!process.env.NATS_URL) {
      throw new Error('NATS_URL must be defined');
    }
    if (!process.env.NATS_CLUSTER_ID) {
      throw new Error('NATS_CLUSTER_ID must be defined');
    }

    // Connect to NATS
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL,
    );

    // Initialize event processors for the retry service
    initializeEventProcessors();

    // Set up NATS close event handler
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    // Initialize and start all listeners
    new UserCourseCreatedListener(natsWrapper.client).listen();
    new UserCourseUpdatedListener(natsWrapper.client).listen();
    new UserCourseInventoryCreationListener(natsWrapper.client).listen();
    new LevelCreatedListener(natsWrapper.client).listen();
    new LevelUpdatedListener(natsWrapper.client).listen();
    new UserCreatedListener(natsWrapper.client).listen();
    new UserUpdatedListener(natsWrapper.client).listen();
    new CourseCreatedListener(natsWrapper.client).listen();
    new IslandCreatedListener(natsWrapper.client).listen();
    new IslandUpdatedListener(natsWrapper.client).listen();
    new PrerequisiteIslandCreatedListener(natsWrapper.client).listen();
    new PrerequisiteIslandDeletedListener(natsWrapper.client).listen();
    new CourseItemTemplateCreatedListener(natsWrapper.client).listen();
    new CourseItemTemplateUpdatedListener(natsWrapper.client).listen();
    new ItemTemplateCreatedListener(natsWrapper.client).listen();
    new ItemTemplateUpdatedListener(natsWrapper.client).listen();
    new ChallengeCreatedListener(natsWrapper.client).listen();
    new ChallengeUpdatedListener(natsWrapper.client).listen();
    new SlideCreatedListener(natsWrapper.client).listen();
    new SlideUpdatedListener(natsWrapper.client).listen();
    new AttemptUpdatedListener(natsWrapper.client).listen();

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
  } catch (err) {
    console.error('Error starting service:', err);
    process.exit(1);
  }
};

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});

start();
