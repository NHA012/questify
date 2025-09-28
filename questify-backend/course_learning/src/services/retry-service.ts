import { EventEmitter } from 'events';

// Define interface for event data
interface EventData {
  id?: string;
  islandId?: string;
  prerequisiteIslandId?: string;
  levelId?: string;
  challengeId?: string;
  [key: string]: unknown;
}

// Define an interface for events queued for retry
interface RetryEvent {
  eventType: string;
  data: EventData;
  timestamp: number;
  retryCount: number;
}

// Define processor function type
type ProcessorFunction = (data: EventData) => Promise<boolean>;

class RetryService extends EventEmitter {
  private retryQueue: RetryEvent[] = [];
  private isProcessing = false;
  private maxRetries = 10;
  private initialBackoff = 1000; // 1 second
  private processors: Map<string, ProcessorFunction> = new Map();
  private retryInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    // Start processing queue every 5 seconds
    this.retryInterval = setInterval(() => this.processQueue(), 5000);
  }

  // Register event processors
  registerProcessor(eventType: string, processor: ProcessorFunction): void {
    this.processors.set(eventType, processor);
  }

  // Add event to retry queue
  async addEvent(eventType: string, data: EventData): Promise<void> {
    console.log(`Adding ${eventType} to retry queue:`, data.id || data);

    // Check if event already exists in queue
    const existingEventIndex = this.retryQueue.findIndex(
      (event) =>
        event.eventType === eventType &&
        this.getEventIdentifier(event.data) === this.getEventIdentifier(data),
    );

    if (existingEventIndex >= 0) {
      // Update data if event already exists
      this.retryQueue[existingEventIndex].data = data;
      console.log(`Updated existing event in retry queue: ${eventType}`);
    } else {
      // Add new event to queue
      this.retryQueue.push({
        eventType,
        data,
        timestamp: Date.now(),
        retryCount: 0,
      });
      console.log(`Added new event to retry queue: ${eventType}`);
    }

    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  // Get a unique identifier for an event
  private getEventIdentifier(data: EventData): string {
    // Use id if available, otherwise stringify the data
    return (
      data.id ||
      `${data.islandId || ''}-${data.prerequisiteIslandId || ''}-${data.levelId || ''}-${data.challengeId || ''}`
    );
  }

  // Process the retry queue
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.retryQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    console.log(`Processing retry queue (${this.retryQueue.length} events)`);

    // Sort by timestamp (oldest first) and retry count (lowest first)
    this.retryQueue.sort((a, b) => {
      if (a.retryCount !== b.retryCount) {
        return a.retryCount - b.retryCount;
      }
      return a.timestamp - b.timestamp;
    });

    // Process events sequentially
    const processedEventIndices: number[] = [];

    for (let i = 0; i < this.retryQueue.length; i++) {
      const event = this.retryQueue[i];
      const processor = this.processors.get(event.eventType);

      if (!processor) {
        console.warn(`No processor found for event type: ${event.eventType}`);
        processedEventIndices.push(i);
        continue;
      }

      // Calculate exponential backoff
      const backoff = this.initialBackoff * Math.pow(2, event.retryCount);
      const timeElapsed = Date.now() - event.timestamp;

      // Only process if enough time has elapsed since last retry
      if (timeElapsed < backoff) {
        continue;
      }

      try {
        console.log(`Retrying ${event.eventType} (attempt ${event.retryCount + 1})`);
        const success = await processor(event.data);

        if (success) {
          // Remove from queue if successful
          console.log(`Successfully processed ${event.eventType} on retry`);
          processedEventIndices.push(i);

          // Emit success event
          this.emit('eventProcessed', {
            eventType: event.eventType,
            data: event.data,
            retryCount: event.retryCount,
          });
        } else {
          // Increment retry count
          event.retryCount++;

          // Remove if max retries reached
          if (event.retryCount >= this.maxRetries) {
            console.warn(`Max retries reached for event ${event.eventType}:`, event.data);
            processedEventIndices.push(i);

            // Emit failure event
            this.emit('eventFailed', {
              eventType: event.eventType,
              data: event.data,
              retryCount: event.retryCount,
            });
          }
        }
      } catch (error) {
        console.error(`Error processing retry for ${event.eventType}:`, error);

        // Increment retry count
        event.retryCount++;

        // Remove if max retries reached
        if (event.retryCount >= this.maxRetries) {
          console.warn(`Max retries reached for event ${event.eventType}:`, event.data);
          processedEventIndices.push(i);
        }
      }
    }

    // Remove processed events (in reverse order to avoid index issues)
    for (let i = processedEventIndices.length - 1; i >= 0; i--) {
      this.retryQueue.splice(processedEventIndices[i], 1);
    }

    this.isProcessing = false;
  }

  // Stop the retry service
  stop(): void {
    if (this.retryInterval) {
      clearInterval(this.retryInterval);
      this.retryInterval = null;
    }
  }

  // Get current queue size
  getQueueSize(): number {
    return this.retryQueue.length;
  }
}

// Create and export a singleton instance
export const retryService = new RetryService();
