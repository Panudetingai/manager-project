import { NotificationType } from "../components/app-notify";

export function getTimeAgo({ item }: { item: Date }) {
  const now = new Date();
  const diff = now.getTime() - new Date(item).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const years = Math.floor(diff / (86400000 * 365));

  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "Just now";
}

export function countNotify(notifications: NotificationType[]) {
  if (notifications.length > 99) {
      return "99+";
    }
    return notifications.length;
}