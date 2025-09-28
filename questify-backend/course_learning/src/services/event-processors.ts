import { Island } from '../models/island';
import { Level } from '../models/level';
import { Course } from '../models/course';
import { PrerequisiteIsland } from '../models/prerequisite-island';
import { User } from '../models/user';
import { retryService } from './retry-service';
import {
  Subjects,
  CourseCreatedEvent,
  IslandCreatedEvent,
  LevelCreatedEvent,
  PrerequisiteIslandCreatedEvent,
} from '@datn242/questify-common';

// Define the EventData type as expected by ProcessorFunction
// This is likely what ProcessorFunction is expecting
type EventData = Record<string, unknown>;

// Initialize all event processors
export const initializeEventProcessors = () => {
  // Process Course Created event
  retryService.registerProcessor(Subjects.CourseCreated, async (eventData: EventData) => {
    try {
      // Cast the generic EventData to the specific structure we know it should have
      const data = eventData as CourseCreatedEvent['data'];
      const { id, teacherId, status, name, description, backgroundImage } = data;

      // Check if course already exists
      const existingCourse = await Course.findByPk(id);
      if (existingCourse) {
        console.log(`Course already exists with ID: ${id}`);
        return true;
      }

      // Check if teacher exists
      const existingTeacher = await User.findByPk(teacherId);
      if (!existingTeacher) {
        console.log(`Teacher not found with ID: ${teacherId}, deferring course creation`);
        return false;
      }

      // Create course
      const course = Course.build({
        id,
        teacherId,
        status,
        name,
        description,
        backgroundImage,
      });
      await course.save();
      console.log(`Successfully created course ${name} (${id}) on retry`);
      return true;
    } catch (error) {
      console.error('Error processing CourseCreated event:', error);
      return false;
    }
  });

  // Process Island Created event
  retryService.registerProcessor(Subjects.IslandCreated, async (eventData: EventData) => {
    try {
      // Cast the generic EventData to the specific structure we know it should have
      const data = eventData as IslandCreatedEvent['data'];
      const { id, courseId, name, description, position, backgroundImage } = data;

      // Check if island already exists
      const existingIsland = await Island.findByPk(id);
      if (existingIsland) {
        console.log(`Island already exists with ID: ${id}`);
        return true;
      }

      // Check if course exists
      const existingCourse = await Course.findByPk(courseId);
      if (!existingCourse) {
        console.log(`Course not found with ID: ${courseId}, deferring island creation`);
        return false;
      }

      // Create island
      const island = Island.build({
        id,
        courseId,
        name,
        description,
        position,
        backgroundImage,
      });
      await island.save();
      console.log(`Successfully created island ${name} (${id}) on retry`);
      return true;
    } catch (error) {
      console.error('Error processing IslandCreated event:', error);
      return false;
    }
  });

  // Process Level Created event
  retryService.registerProcessor(Subjects.LevelCreated, async (eventData: EventData) => {
    try {
      // Cast the generic EventData to the specific structure we know it should have
      const data = eventData as LevelCreatedEvent['data'];
      const { id, islandId, name, description, position } = data;

      // Check if level already exists
      const existingLevel = await Level.findByPk(id);
      if (existingLevel) {
        console.log(`Level already exists with ID: ${id}`);
        return true;
      }

      // Check if island exists
      const existingIsland = await Island.findByPk(islandId);
      if (!existingIsland) {
        console.log(`Island not found with ID: ${islandId}, deferring level creation`);
        return false;
      }

      // Create level
      const level = Level.build({
        id,
        name,
        description,
        position,
        islandId,
      });
      await level.save();
      console.log(`Successfully created level ${name} (${id}) on retry`);
      return true;
    } catch (error) {
      console.error('Error processing LevelCreated event:', error);
      return false;
    }
  });

  // Process Prerequisite Island Created event
  retryService.registerProcessor(
    Subjects.PrerequisiteIslandCreated,
    async (eventData: EventData) => {
      try {
        // Cast the generic EventData to the specific structure we know it should have
        const data = eventData as PrerequisiteIslandCreatedEvent['data'];
        const { islandId, prerequisiteIslandId } = data;

        // Check if both islands exist
        const [island, prerequisiteIsland] = await Promise.all([
          Island.findByPk(islandId),
          Island.findByPk(prerequisiteIslandId),
        ]);

        if (!island || !prerequisiteIsland) {
          console.log(
            `One or both islands don't exist. islandId: ${islandId}, prerequisiteIslandId: ${prerequisiteIslandId}`,
          );
          return false;
        }

        // Check if relationship already exists
        const existingPrerequisite = await PrerequisiteIsland.findOne({
          where: {
            islandId,
            prerequisiteIslandId,
          },
        });

        if (existingPrerequisite) {
          console.log(`Prerequisite relationship already exists`);
          return true;
        }

        // Create relationship
        const prerequisite = PrerequisiteIsland.build({
          islandId,
          prerequisiteIslandId,
        });
        await prerequisite.save();
        console.log(
          `Successfully created prerequisite relationship: ${islandId} -> ${prerequisiteIslandId} on retry`,
        );
        return true;
      } catch (error) {
        console.error('Error processing PrerequisiteIslandCreated event:', error);
        return false;
      }
    },
  );
};
