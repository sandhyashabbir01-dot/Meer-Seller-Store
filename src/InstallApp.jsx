import { useEffect, useState } from "react";
import { useUiZoom } from "./useUiZoom";

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

export default function InstallApp() {
  const zoom = useUiZoom();

  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(isStandalone());
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const onPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  // App install ho chuki ho to button nahi dikhana
  if (installed) return null;

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      await installPrompt.userChoice;
      setInstallPrompt(null);
      return;
    }
    setShowHelp(true);
  };

  return (
    <div className="install-wrap" style={zoom > 1 ? { zoom } : undefined}>
      {showHelp && (
        <div className="install-help">
          <button type="button" className="install-help-close" onClick={() => setShowHelp(false)}>
            ×
          </button>

          {isIOS ? (
            <p>
              iPhone par: Safari mein <strong>Share</strong> button dabayein, phir{" "}
              <strong>Add to Home Screen</strong> chunein.
            </p>
          ) : (
            <p>
              Browser ke menu (⋮) mein <strong>Install app</strong> ya{" "}
              <strong>Add to Home screen</strong> chunein.
            </p>
          )}
        </div>
      )}

      <button type="button" className="install-button" onClick={handleInstall}>
        ⬇ Install App
      </button>
    </div>
  );
}