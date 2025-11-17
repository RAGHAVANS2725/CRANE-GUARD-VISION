import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
// Kill Lovable branding forever
const lovableLink = document.querySelector('link[rel*="icon"]');
if (lovableLink) lovableLink.remove();

const blankFavicon = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 1%22/>';
const link = document.createElement('link');
link.rel = 'icon';
link.href = blankFavicon;
document.head.appendChild(link);