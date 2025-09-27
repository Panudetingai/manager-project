"use client";

import { useState } from "react";
import { createClient } from "../../../../utils/supabase/client";
export default function Cardlistuser() {
  const supabase = createClient();
  const [notProject, setNotProject] = useState(true);

  if (notProject) {
    return (
      <div className="w-full justify-center items-center flex flex-col h-80">
        <h1>Create</h1>
        <p className="text-gray-600 mt-2">Get started by setting up your first task manager to organize projects and tasks efficiently.</p>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Create New Task Manager
        </button>
      </div>
    );
  }

  return (
    <div className="w-full justify-center items-center flex flex-col">
      <h1>Create Project</h1>
    </div>
  );
}
