import { Brand } from "./brand";
import { site } from "@/config/site";
export function SiteFooter() { return <footer className="site-footer site-container"><Brand compact /><p>A little less planning. A lot more celebrating.</p><a href={site.repository} target="_blank" rel="noreferrer">Made open source, with care. ↗</a></footer>; }
