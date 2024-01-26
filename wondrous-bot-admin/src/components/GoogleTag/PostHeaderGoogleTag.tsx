import { useEffect } from "react";

const PostHeaderGoogleTag = () => {
  useEffect(() => {
    // Define the script content
    const scriptContent = `(function(w,d,s,l,i){
      w[l]=w[l]||[];
      w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
      var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
      j.async=true;
      j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
      f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-W3DT4LQ8');`;

    // Create script element
    const script = document.createElement("script");
    script.textContent = scriptContent;

    // Append the script to the document
    document.head.appendChild(script);

    // Clean up function to remove the script when the component unmounts
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Return nothing as it doesn't render anything
  return null;
};

export default PostHeaderGoogleTag;
