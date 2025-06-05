import { useEffect, useState } from "react";

export default function DeepLinkPage() {
  const [status, setStatus] = useState("");

  const handleDeepLink = (url: string) => {
    setStatus(`Attempting to open: ${url}`);
    window.location.href = url;

    setTimeout(() => {
      setStatus(
        (prev) =>
          prev +
          "<br>If the app didn't open, you might need to install it first."
      );
    }, 2000);
  };

  return (
    <div className="container">
      <h1>🚀 Open Xterium App</h1>
      <p>
        Click the button below to open our mobile app directly from your
        browser!
      </p>

      <a
        href="#"
        className="deep-link-btn"
        onClick={() =>
          handleDeepLink("exp://192.168.0.166:8081/--/connect-wallet")
        }
      >
        Connect Wallet
      </a>

      {status && (
        <div id="status" dangerouslySetInnerHTML={{ __html: status }} />
      )}

      <div className="fallback-links">
        <p>Don't have the app yet?</p>
        <a href="https://apps.apple.com/app/your-app" className="store-link">
          📱 App Store
        </a>
        <a
          href="https://play.google.com/store/apps/details?id=your.app"
          className="store-link"
        >
          🤖 Google Play
        </a>
      </div>

      <style jsx>{`
        body {
          margin: 0;
        }

        .container {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
          max-width: 600px;
          margin: 50px auto;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          color: white;
          background-clip: padding-box;
          box-sizing: border-box;
          text-align: center;
          border-radius: 12px;
        }

        h1 {
          margin-bottom: 20px;
          font-size: 2.5em;
          font-weight: 300;
        }

        p {
          margin-bottom: 30px;
          font-size: 1.1em;
          opacity: 0.9;
        }

        .deep-link-btn {
          background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
          color: white;
          padding: 15px 30px;
          border: none;
          border-radius: 50px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
          margin: 10px;
          text-decoration: none;
          display: inline-block;
        }

        .deep-link-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
        }

        .fallback-links {
          margin-top: 30px;
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .store-link {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 12px 25px;
          border-radius: 25px;
          text-decoration: none;
          margin: 0 10px;
          display: inline-block;
          transition: all 0.3s ease;
        }

        .store-link:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }

        #status {
          margin-top: 20px;
          padding: 10px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.1);
          white-space: pre-line;
        }
      `}</style>
    </div>
  );
}
