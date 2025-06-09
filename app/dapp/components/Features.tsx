"use client"
import { motion } from "framer-motion"
import { ArrowRight, Award, Shield, Zap } from "lucide-react";

export function Features () {
    const features = [
        {
          icon: Zap,
          title: 'Real-Time Rewards',
          description: 'Watch your earnings grow every second with our advanced staking algorithm',
          image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=800',
        },
        {
          icon: Shield,
          title: 'Enterprise Security',
          description: 'Bank-grade security protocols protecting your digital assets 24/7',
          image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800',
        },
        {
          icon: Award,
          title: 'Exclusive Collections',
          description: 'Access premium NFT drops and limited edition digital collectibles',
          image: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800',
        },
    ];
    return (
        <div>
            <section className="py-32 bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-5xl font-bold text-white mb-6">
                        Revolutionary <span className="text-cyan-400">Features</span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Experience staking like never before with our cutting-edge technology and user-centric design
                        </p>
                    </motion.div>

                    <div className="space-y-32">
                        {features.map((feature, index) => {
                        const Icon = feature.icon;
                        const isEven = index % 2 === 0;
                        
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16`}
                            >
                                <div className="flex-1">
                                    <motion.div
                                        whileHover={{ scale: 1.02, rotateY: 5 }}
                                        className="relative group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                                        <img
                                            src={feature.image}
                                            alt={feature.title}
                                            className="relative w-full h-96 object-cover rounded-3xl shadow-2xl"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-3xl" />
                                    </motion.div>
                                </div>
                            
                                <div className="flex-1 space-y-8">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center">
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    
                                    <h3 className="text-4xl font-bold text-white">
                                        {feature.title}
                                    </h3>
                                    
                                    <p className="text-xl text-gray-300 leading-relaxed">
                                        {feature.description}
                                    </p>
                                    
                                    <motion.button
                                        whileHover={{ x: 10 }}
                                        className="flex items-center space-x-2 text-blue-400 font-semibold text-lg group"
                                    >
                                        <span>Learn More</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        );
                        })}
                    </div>
                </div>
            </section>
        </div>
    )
}