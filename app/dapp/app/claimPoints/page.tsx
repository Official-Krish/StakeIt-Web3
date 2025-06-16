import Hero from './components/Hero';
import Filters  from './components/Filters';

export default function NFT() {
    return (
        <div className="min-h-screen bg-black pt-20 pb-12">
            <Hero/>
            <Filters/>
        </div>
    );
};