import { useEffect, useState } from "react";

// Phone par site desktop width par dikhti hai, is liye naye floating buttons ko phone ke size ka karta hai
export function useUiZoom() {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const calculate = () => {
      const deviceWidth = window.screen.width;
      const layoutWidth = window.innerWidth;

      setZoom(
        deviceWidth && layoutWidth > deviceWidth * 1.2
          ? Math.min(layoutWidth / deviceWidth, 4)
          : 1
      );
    };

    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, []);

  return zoom;
}