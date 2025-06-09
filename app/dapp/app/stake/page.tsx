import { Hero } from "./components/Hero";
import Stats from './components/Stats';
import Staking from './components/Staking';

function Stake() {
    return (
        <div className="min-h-screen bg-black pt-20 pb-12">
            <Hero/>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    <Stats/>
                    <Staking/>
                </div>
            </div>
        </div>
    );
};

export default Stake;