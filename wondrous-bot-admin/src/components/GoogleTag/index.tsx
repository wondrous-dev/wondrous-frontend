import React, { useEffect } from "react";

const GoogleTagManager: React.FC = () => {
  useEffect(() => {
    const loadGoogleTagManager = () => {
      const script = document.createElement("script");
      script.src = "https://www.googletagmanager.com/gtag/js?id=AW-11353530066";
      script.async = true;
      document.body.appendChild(script);

      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).gtag = function () {
        ((window as any).dataLayer as any).push(arguments);
      };
      (window as any).gtag("js", new Date());
      (window as any).gtag("config", "AW-11353530066");
    };

    loadGoogleTagManager();

    return () => {
      const scriptElement = document.querySelector(
        'script[src="https://www.googletagmanager.com/gtag/js?id=AW-11353530066"]'
      );
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
    };
  }, []);

  return <div></div>;
};

export default GoogleTagManager;
