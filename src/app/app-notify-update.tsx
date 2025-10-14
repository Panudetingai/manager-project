"use client";

export default function Appnotifyupdate() {
  // useEffect(() => {
  //   fetch("/version.json")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const currentVersion = process.env.NEXT_PUBLIC_VERSION;
  //       const currentShaVersion = process.env.VERCEL_GIT_COMMIT_SHA;
  //       const lastAlertVersion = window.localStorage.getItem("alert-version");
  //       const newAlertVersion = `${data.version}-${data.sha_version}`;

  //       if (
  //         data.version !== currentVersion ||
  //         data.sha_version !== currentShaVersion
  //       ) {
  //         if (lastAlertVersion !== newAlertVersion) {
  //           toast.success("New Version Available! 🎉", {
  //             description: `Version ${data.version} is now live with exciting new features and improvements.`,
  //             duration: 6000,
  //           });
            
  //         }
  //       }
  //     });
  // }, []);

  return null;
}