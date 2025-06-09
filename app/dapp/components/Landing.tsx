import { Stats } from './Stats';
import { Features } from './Features';
import { Testimonials } from './Testimonials';
import { CTA } from './CTA';
import { Hero } from './hero';

export default function LandingPage () {

  return (
    <div className="min-h-screen bg-black overflow-hidden">
        <Hero/>
        <Stats/>
        <Features/>
        <Testimonials/>
        <CTA/>
    </div>
  );
};