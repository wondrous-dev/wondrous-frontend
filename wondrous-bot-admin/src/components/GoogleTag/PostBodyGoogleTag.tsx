import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const PostBodyGoogleTag = () => {
  const [domReady, setDomReady] = useState(false);
  useEffect(() => {
    setDomReady(true);
    // Create a div to be the portal target
    const target = document.createElement("div");
    target.id = "gtm-noscript-container";
    document.body.appendChild(target);

    return () => {
      // Cleanup - remove the target element when the component unmounts or the page changes
      if (document.body.contains(target)) {
        document.body.removeChild(target);
      }
    };
  }, []);
  return domReady
    ? ReactDOM.createPortal(
        <>
          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-W3DT4LQ8"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
          {/* End Google Tag Manager (noscript) */}
        </>,
        document.getElementById("gtm-noscript-container")
      )
    : null;
};

export default PostBodyGoogleTag;
