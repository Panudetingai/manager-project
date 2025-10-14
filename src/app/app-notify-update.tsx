"use client";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Appnotifyupdate() {
  useEffect(() => {
    fetch("/version.json")
      .then((response) => response.json())
      .then((data) => {
        const currentVersion = process.env.NEXT_PUBLIC_VESIGN;
        const currentShaVersion = process.env.NEXT_PUBLIC_SHA_VERSION;
        const lastAlertVersion = window.localStorage.getItem("alert-version");

        const newAlertVersion = `${data.version}-${data.sha_version}`;

        if (
          data.version !== currentVersion ||
          data.sha_version !== currentShaVersion
        ) {
          if (lastAlertVersion !== newAlertVersion) {
            toast.success("New Version Available! 🎉", {
              description: `Version ${data.version} is now live with exciting new features and improvements.`,
              duration: 6000,
            });
            
          }
        }
      });
  }, []);

  return null;
}