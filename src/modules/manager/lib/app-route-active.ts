export const getAppRouteIsActive = (pathname: string, path: string) => {
  if (!path) return false;

  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const ensureLeadingSlash = (s: string) => (s.startsWith("/") ? s : "/" + s);

  // Remove dynamic segments like /dashboard/[workspace]...
  const dynamicMatch = path.match(/^\/dashboard\/\[([^\]]+)\](.*)$/);
  if (dynamicMatch) {
    let afterDynamic = dynamicMatch[2] || "";
    if (afterDynamic && !afterDynamic.startsWith("/")) afterDynamic = "/" + afterDynamic;

    // For the first route (Overview), activate only when on the workspace home page
    if (afterDynamic === "") {
      // Match /dashboard/:workspace or /dashboard/:workspace/
      return /^\/dashboard\/[^/]+\/?$/.test(pathname);
    }

    // Other routes: must be under /dashboard/:workspace + afterDynamic (exact match)
    const pattern =
      "^/dashboard/[^/]+" + escapeRegExp(ensureLeadingSlash(afterDynamic)) + "/?$";
    return new RegExp(pattern).test(pathname);
  }

  // Static paths: exact match to avoid parent activating on subpaths
  const normalize = (p: string) => p.replace(/\/+$/, "") || "/";
  const normPathname = normalize(pathname);
  const normPath = normalize(path);
  return normPathname === normPath;
};