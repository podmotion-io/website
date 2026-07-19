import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import ProofStrip from "./components/ProofStrip";
import { Features } from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Economics from "./components/Economics";
import GettingStarted from "./components/GettingStarted";
import CLIShowcase from "./components/CLIShowcase";
import Community from "./components/Community";
import About from './components/About';
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 font-sans bg-pm-navy-950">
      <NavBar />
      <main className="flex flex-1 flex-col">
        <Hero />
        <ProofStrip />
        <Features />
        <HowItWorks />
        <Economics />
        <GettingStarted />
        <CLIShowcase />
        <Community />
        <About />
      </main>
      <Footer />
    </div>
  );
}
