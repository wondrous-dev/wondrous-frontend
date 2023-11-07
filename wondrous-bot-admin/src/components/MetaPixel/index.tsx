import React from "react";
import { Helmet } from "react-helmet";

const MetaPixel = () => {
  return (
    <Helmet>
      <script id="facebook-pixel-script" key="function">
        {`!function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '1293512184638031');
        fbq('track', 'PageView');`}
      </script>
      <noscript id="facebook-pixel-image">
        {`<img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=1293512184638031&ev=PageView&noscript=1"
        /`}
      </noscript>
    </Helmet>
  );
};

export default MetaPixel;
