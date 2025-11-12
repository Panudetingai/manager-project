import LinePage from "@/modules/line-service/components/(line)/line-page";

interface Params {
  project: string;
  slug: string;
}
export default async function page({ params }: { params: Params }) {
  const { project, slug } = await params;
  console.log("project", project);
  switch (slug as |"line" | "facebook" | "instagram") {
    case "line": 
      return <LinePage />;
    case "facebook": 
      return <div>Facebook Social Account Settings for project {project}</div>;
    case "instagram": 
      return <div>Instagram Social Account Settings for project {project}</div>;
    default:
      return <div>Unknown Social Account</div>;
  }
}
