"use client"
import { motion } from 'framer-motion';
import { Coins, TrendingUp, Users, Award } from 'lucide-react';

export function Stats () {
    return (
        <div>
            <section className="relative py-32 bg-gradient-to-b from-black to-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-5xl font-bold text-white mb-6">
                        Trusted by <span className="text-blue-400">Thousands</span>
                        </h2>
                        <p className="text-xl text-gray-400">Join the revolution in decentralized finance</p>
                    </motion.div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: 'Total Value Locked', value: '$2.4B', icon: TrendingUp },
                            { label: 'Active Stakers', value: '127K+', icon: Users },
                            { label: 'NFTs Minted', value: '89K+', icon: Award },
                            { label: 'Average APY', value: '24.7%', icon: Coins },
                            ].map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -10, scale: 1.05 }}
                                    className="text-center group"
                                >
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-all duration-300">
                                        <Icon className="w-10 h-10 text-blue-400" />
                                    </div>
                                    <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
                                    <div className="text-gray-400 font-medium">{stat.label}</div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    )
}