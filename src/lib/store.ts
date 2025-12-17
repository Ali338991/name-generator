// This is a simple in-memory store to simulate a database.
// In a real serverless deployment, this would need to be Redis or a database.
// For a local demo, this global variable works to maintain state between API calls.

import { create } from 'zustand';

interface State {
    latestTargetName: string | null;
    setLatestTargetName: (name: string) => void;
}

export const useStore = create<State>((set) => ({
    latestTargetName: null,
    setLatestTargetName: (name) => set({ latestTargetName: name }),
}));
