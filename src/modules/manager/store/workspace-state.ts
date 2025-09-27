import { create } from "zustand";

interface WorkspaceState {
    workspaceId: string;
    workspaceName: string;

    setWorkspaceId: (workspaceId: string) => void;
    setWorkspaceName: (workspaceName: string) => void;
}

export const useWorkspaceState = create<WorkspaceState>((set) => ({
    workspaceId: "",
    workspaceName: "",
    setWorkspaceId: (workspaceId) => set({ workspaceId }),
    setWorkspaceName: (workspaceName) => set({ workspaceName }),
}))