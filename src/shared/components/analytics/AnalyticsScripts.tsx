"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";

export default function AnalyticsScripts() {
  const [scripts, setScripts] = useState({
    metaPixelId: "",
    googleAnalyticsId: "",
    naverAnalyticsId: "",
  });

  useEffect(() => {
    const fetchScripts = async () => {
      try {
        const docRef = doc(db, "settings", "general");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.scripts) {
            setScripts(data.scripts);
          }
        }
      } catch (error) {
        console.error("Error fetching analytics scripts:", error);
      }
    };

    fetchScripts();
  }, []);

  return (
    <>
      {/* Google Analytics */}
      {scripts.googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${scripts.googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${scripts.googleAnalyticsId}');
            `}
          </Script>
        </>
      )}

      {/* Meta Pixel */}
      {scripts.metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${scripts.metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* Naver Analytics (WCS) */}
      {scripts.naverAnalyticsId && (
        <Script id="naver-analytics" strategy="afterInteractive">
          {`
            if(!wcs_add) var wcs_add = {};
            wcs_add["wa"] = "${scripts.naverAnalyticsId}";
            if(window.wcs) {
              wcs_do();
            }
          `}
        </Script>
      )}
    </>
  );
}
