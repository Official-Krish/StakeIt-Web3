"use client"
import { motion } from 'framer-motion';

export function Testimonials () {
    const testimonials = [
        {
          name: 'Sarah Chen',
          role: 'DeFi Investor',
          image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
          quote: 'The most intuitive staking platform I\'ve used. The real-time rewards are incredible.',
        },
        {
          name: 'Marcus Rodriguez',
          role: 'Crypto Trader',
          image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
          quote: 'Finally, a platform that combines high yields with an amazing user experience.',
        },
        {
          name: 'Elena Volkov',
          role: 'NFT Collector',
          image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
          quote: 'The NFT marketplace integration is genius. Earning points to mint is addictive.',
        },
    ];

    return (
        <div>
            <section className="py-32 bg-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-5xl font-bold text-white mb-6">
                        What Our <span className="text-green-400">Community</span> Says
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-3xl border border-gray-700/50 backdrop-blur-sm"
                            >
                                <div className="flex items-center space-x-4 mb-6">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div>
                                        <div className="font-semibold text-white">{testimonial.name}</div>
                                        <div className="text-gray-400 text-sm">{testimonial.role}</div>
                                    </div>
                                </div>
                                <p className="text-gray-300 text-lg leading-relaxed italic">
                                    "{testimonial.quote}"
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}