    import _ from "lodash";

    export default function createBatchProcessor<T>(
    batchSize: number,
    debounceDelay: number,
    processBatch: () => void
    ) {
    let buffer: T[] = [];
    const debouncedProcessBatch = _.debounce(processBatch, debounceDelay);

    // Function to add data to the buffer
    function addToBuffer(item: T): void {
        debugger;
        buffer.push(item);

    console.log("Item added to buffer", item);
    console.log("Current buffer size:", buffer.length);
        if (buffer.length >= batchSize) {
        // If batch size is reached, process immediately
        console.log("Batch size reached, processing immediately...");

        debouncedProcessBatch.cancel(); // Cancel pending debounce
        processBatch(); // Process the batch immediately
        } else {
            debugger;
        // Otherwise, debounce the processing
        debouncedProcessBatch();
        }
    }

    return {
        buffer,
        addToBuffer,
        processBatchImmediately: () => processBatch(), // Allow immediate processing
    };
    }
