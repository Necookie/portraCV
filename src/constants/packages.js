/**
 * Contains configuration and constant data for the PhotoEngine packages.
 * This separates static data from the UI components to improve readability.
 */

// URL for the Hugging Face Space AI Background Removal Service
export const BACKEND_URL = "https://necookie-portracv-backend.hf.space";

// Available photo layout packages. Adding a new package here will automatically 
// populate it in the UI and rendering logic.
export const PACKAGES = [
    {
        id: 'mixed',
        name: 'Starter Mix',
        description: '4pcs 2x2" + 8pcs 1x1"',
        layout: [
            { type: '2x2', count: 4, cols: 4 },
            { type: '1x1', count: 8, cols: 8 }
        ],
        hasGap: true // Keep gaps for the mixed layout to distinguish sizes
    },
    {
        id: 'max_2x2',
        name: 'Max 2x2',
        description: '8pcs 2x2" (Formal)',
        layout: [
            { type: '2x2', count: 8, cols: 4 }
        ],
        hasGap: false // False for tighter, seamless print arrangement
    },
    {
        id: 'passport',
        name: 'Passport / ID',
        description: '10pcs 35x45mm (5x2 Layout)',
        layout: [
            { type: 'passport', count: 10, cols: 5 }
        ],
        hasGap: false // FORCE NO GAP for precise millimeter sizes
    },
    {
        id: 'max_1x1',
        name: 'Max 1x1',
        description: '16pcs 1x1" (School ID)',
        layout: [
            { type: '1x1', count: 16, cols: 8 }
        ],
        hasGap: false
    }
];
