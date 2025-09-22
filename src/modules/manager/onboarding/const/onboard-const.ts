type OnboardStep = {
  title: string;
  desc?: string;
  field: {
    name: string;
    label?: string;
    type: string;
    placeholder?: string;
  }[];
  option?: {
    name: string;
  }[];
};

export const steps: OnboardStep[] = [
  {
    title: "User Information",
    desc: "Provide your name and primary contact email.",
    field: [
      {
        name: "name",
        label: "Full Name",
        placeholder: "Jane Doe",
        type: "text",
      },
      {
        name: "email",
        label: "Work Email",
        placeholder: "jane.doe@example.com",
        type: "email",
      },
    ],
    option: [
      {
        name: "Google",
      },
      {
        name: "Github",
      },
      {
        name: "LinkedIn",
      },
      {
        name: "X",
      },
      {
        name: "Facebook",
      },
      {
        name: "Reddit",
      },
    ],
  },
  {
    title: "Workspace",
    desc: "Create a workspace where your team will collaborate.",
    field: [
      {
        name: "workspaceName",
        label: "Workspace Name",
        placeholder: "Acme Team",
        type: "text",
      },
      {
        name: "companyDomain",
        label: "Company Domain (optional)",
        placeholder: "acme.com",
        type: "text",
      },
      {
        name: "teamSize",
        label: "Team Size (optional)",
        placeholder: "e.g. 1-5, 6-20",
        type: "text",
      },
    ],
  },
  {
    title: "Role & Preferences",
    desc: "Help us tailor the experience to your role and preferences.",
    field: [
      {
        name: "role",
        label: "Your Role",
        placeholder: "Product Manager",
        type: "text",
      },
      {
        name: "preferredLanguage",
        label: "Preferred Language",
        placeholder: "English",
        type: "text",
      },
      {
        name: "primaryUseCase",
        label: "Primary Use Case (what will you use this for?)",
        placeholder: "e.g. roadmap planning, bug tracking, team wiki",
        type: "text",
      },
    ],
  }
];