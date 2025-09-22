export const getAppRouteIsActive = (pathname: string, path: string) => {
  if (!path) return false;

  // ตัด dynamic segment ออก เช่น /dashboard/[workspace]
  const dynamicMatch = path.match(/^(\/dashboard\/)\[([^\]]+)\](.*)$/);
  if (dynamicMatch) {
    let afterDynamic = dynamicMatch[3] || "";
    if (afterDynamic && !afterDynamic.startsWith("/")) afterDynamic = "/" + afterDynamic;
    const afterProject = pathname.replace(/^\/dashboard\/[^/]+/, "");

    // ถ้าเป็น route แรก (Overview) ให้ active เฉพาะเมื่ออยู่หน้าแรก workspace เท่านั้น
    if (afterDynamic === "") {
      return afterProject === "" || afterProject === "/";
    }

    // route อื่น ๆ
    return (
      afterProject === afterDynamic ||
      afterProject.startsWith(afterDynamic + "/")
    );
  }

  // Static paths: exact match or nested paths count as active
  const normalize = (p: string) => p.replace(/\/+$/, "") || "/";
  const normPathname = normalize(pathname);
  const normPath = normalize(path);
  return normPathname === normPath || normPathname.startsWith(`${normPath}/`);
};