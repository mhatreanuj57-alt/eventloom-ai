import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Asterisk, Check, Sparkles, MoveUpRight } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { eventTypes } from "@/config/event-types";
export default function Home() {
  return <>
    <SiteHeader />
    <main id="main-content">
      <section className="landing-hero site-container">
        <div className="hero-copy"><span className="eyebrow"><span className="olive-dot" /> A THOUGHTFUL WAY TO CELEBRATE</span><h1>For the moments<br />worth <em>gathering.</em></h1><p>The big days. The little get-togethers. Bring your ideas,<br className="desktop-break" /> and we’ll help weave the details into something lovely.</p><div className="hero-actions"><Button asChild size="lg"><Link href="/planner">Let’s plan something <ArrowUpRight size={17} /></Link></Button><Link href="/dashboard" className="text-link">Explore the studio <ArrowRight size={16} /></Link></div><div className="hero-footnote"><span className="small-star">✳</span> Your ideas. A little AI magic. Entirely your celebration.</div></div>
        <div className="hero-visual"><div className="hero-photo"><Image src="/images/wedding.jpg" alt="A thoughtfully set outdoor wedding table with seasonal flowers" fill loading="eager" fetchPriority="high" sizes="(max-width: 760px) 100vw, 46vw" /><span className="photo-overline">THE ART OF COMING TOGETHER</span><span className="photo-caption">A beautiful day starts<br />with a thoughtful plan.</span></div><div className="hero-note"><span className="note-icon"><Sparkles size={21} /></span><div>A little less planning.<strong>A lot more being there.</strong></div><span className="note-scribble">↗</span></div><div className="hero-seal"><Asterisk size={25} strokeWidth={1} /><span>MADE FOR<br />YOUR MOMENTS</span></div></div>
      </section>
      <div className="promise-strip"><div className="site-container"><span>THE DETAILS, BEAUTIFULLY CONNECTED</span><span><Check size={15} /> A budget that makes sense</span><span><Check size={15} /> A timeline you can breathe in</span><span><Check size={15} /> Ideas that feel like you</span></div></div>
      <section id="occasions" className="occasions-section site-container"><div className="section-heading"><div><span className="eyebrow">WHATEVER BRINGS YOU TOGETHER</span><h2>There’s always a reason<br />to <em>make a little magic.</em></h2></div><p>From once-in-a-lifetime to just-because.<br />Every gathering deserves a little thought.</p></div><div className="occasion-grid">{eventTypes.map((occasion, i) => <Link href={`/planner?type=${occasion.value}`} className="occasion-card" key={occasion.value}><div className="occasion-photo"><Image src={occasion.image} alt={i === 0 ? "Elegant floral wedding table setting" : i === 1 ? "A bright and joyful birthday celebration" : "Friends gathered outdoors in warm evening light"} fill sizes="(max-width: 640px) 100vw, 33vw" /><span className="occasion-number">0{i + 1}</span><span className="occasion-arrow"><MoveUpRight size={22} /></span></div><div className="occasion-caption"><h3>{occasion.label === "Community" ? "Better together" : occasion.label === "Wedding" ? "The big “I do”" : "Another trip around the sun"}</h3><p>{occasion.description}</p></div></Link>)}</div></section>
      <section id="how-it-works" className="how-section"><div className="site-container how-inner"><div className="how-intro"><span className="eyebrow">FROM A LITTLE IDEA TO A LOVELY DAY</span><h2>You dream it.<br />We help <em>weave it.</em></h2><p>No sprawling spreadsheets. No blank-page feeling. Just a clear path from “what if” to “it’s happening.”</p><Button asChild variant="outline"><Link href="/planner">Find your starting point <ArrowUpRight size={15} /></Link></Button></div><div className="how-steps">{[
        ["Tell us what’s on your mind", "An occasion, a few preferences, and the people you want around. Start with what you know."],
        ["Give the details a little shape", "Get a personalized plan, a considered budget, a timeline, and the right vendor questions."],
        ["Make it yours, then make it happen", "Refine your ideas, track your spending, and check things off. We’ll keep the details together."],
      ].map(([title, description], i) => <div className="how-step" key={title}><span>0{i + 1}</span><div><h3>{title}</h3><p>{description}</p></div></div>)}</div></div></section>
      <section className="closing-section site-container"><Asterisk size={54} strokeWidth={1.1} /><span className="eyebrow">THE BEST PART IS BEING THERE</span><h2>Let’s make room for<br /><em>something wonderful.</em></h2><Button asChild size="lg"><Link href="/planner">Your next celebration starts here <ArrowUpRight size={17} /></Link></Button><p>Open source. Yours to explore. Powered by Gemini.</p></section>
    </main>
    <SiteFooter />
  </>;
}
