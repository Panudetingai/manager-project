type Params = {
  params: {
    project: Promise<string>;
  };
};

export default async function Page({ params }: Params) {
  const { project } = await params;
  return <div>Page: {project}</div>;
}
