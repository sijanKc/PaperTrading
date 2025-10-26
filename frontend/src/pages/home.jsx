import Header from "../components/header";
import HeroSection from "../components/HeroSection";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTASection />
      <Footer />
    </>
  );
}
