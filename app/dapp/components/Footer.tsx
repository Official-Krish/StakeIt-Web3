"use client";
import { motion } from 'framer-motion';
import { 
  Coins, 
  Github, 
  Mail, 
  MapPin, 
  ArrowUp,
  Shield,
  Award,
  Users,
  TrendingUp,
  Globe
} from 'lucide-react';
import { FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const footerLinks = {
        platform: [
            { name: 'Stake SOL', href: '/stake' },
            { name: 'NFT Marketplace', href: '/nft' },
            { name: 'My Collection', href: '/collection' },
            { name: 'Rewards', href: '/stake' },
        ],
        company: [
            { name: 'About Us', href: '#' },
            { name: 'Careers', href: '#' },
            { name: 'Press Kit', href: '#' },
            { name: 'Blog', href: '#' },
        ],
        resources: [
            { name: 'Documentation', href: '#' },
            { name: 'API Reference', href: '#' },
            { name: 'Help Center', href: '#' },
            { name: 'Community', href: '#' },
        ],
        legal: [
            { name: 'Privacy Policy', href: '#' },
            { name: 'Terms of Service', href: '#' },
            { name: 'Cookie Policy', href: '#' },
            { name: 'Disclaimer', href: '#' },
        ],
    };

    const socialLinks = [
        { icon: FaXTwitter, href: 'https://x.com/KrishAnand0103', label: 'Twitter' },
        { icon: Github, href: 'http://github.com/Official-Krish', label: 'GitHub' },
        { icon: FaDiscord, href: '#', label: 'Discord' },
        { icon: Mail, href: '#', label: 'Email' },
    ];

    const stats = [
        { label: 'Total Value Locked', value: '$2.4B', icon: TrendingUp },
        { label: 'Active Users', value: '127K+', icon: Users },
        { label: 'NFTs Minted', value: '89K+', icon: Award },
        { label: 'Countries', value: '150+', icon: Globe },
    ];

    return (
        <footer className="relative bg-black border-t border-gray-800/50 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-black" />
                    <div className="absolute inset-0 opacity-5">
                        <Image
                            src="https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1600"
                            alt="Background"
                            className="w-full h-full object-cover"
                            height={600}
                            width={1600}
                        />
                    </div>
                
                    {/* Floating particles */}
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ 
                                opacity: [0, 0.3, 0],
                                y: [-50, -150, -250],
                                x: [0, Math.sin(i) * 30, 0],
                            }}
                            transition={{
                                duration: 15 + i * 2,
                                repeat: Infinity,
                                delay: i * 3,
                                ease: "easeOut"
                            }}
                            className="absolute w-1 h-1 bg-blue-400 rounded-full"
                            style={{
                                left: `${5 + (i * 8)}%`,
                                bottom: '0%',
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10">
                    {/* Stats Section */}
                    <div className="border-b border-gray-800/50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-center mb-12"
                            >
                                <h3 className="text-4xl font-black text-white mb-4">
                                    Powering the Future of <span className="text-cyan-400">DeFi</span>
                                </h3>
                                <p className="text-xl text-gray-400">Trusted by thousands of users worldwide</p>
                            </motion.div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                {stats.map((stat, index) => {
                                    const Icon = stat.icon;
                                    return (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        className="text-center group"
                                    >
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-all duration-300">
                                            <Icon className="w-8 h-8 text-blue-400" />
                                        </div>
                                            <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
                                        <div className="text-gray-400 font-medium">{stat.label}</div>
                                    </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Main Footer Content */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="grid lg:grid-cols-6 gap-12">
                            {/* Brand Section */}
                            <div className="lg:col-span-2">
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="mb-8"
                                >
                                    <Link href="/" className="flex items-center space-x-3 mb-6">
                                        <motion.div
                                            whileHover={{ rotate: 360, scale: 1.1 }}
                                            transition={{ duration: 0.6 }}
                                            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg"
                                        >
                                            <Image
                                                src={`/Logo2.png`}
                                                alt="StakeIT Logo"
                                                width={48}
                                                height={48}
                                                className="w-full h-full rounded-2xl"
                                                unoptimized
                                            />
                                        </motion.div>
                                        <div>
                                            <span className="text-2xl font-black text-white">StakeIt</span>
                                            <div className="text-xs text-cyan-400 font-medium">NEXT-GEN STAKING</div>
                                        </div>
                                    </Link>
                                    
                                    <p className="text-gray-400 text-lg leading-relaxed mb-6">
                                        The most advanced Solana staking platform with real-time rewards, 
                                        exclusive NFTs, and enterprise-grade security.
                                    </p>

                                    <div className="flex items-center space-x-2 text-gray-400 mb-4">
                                        <MapPin className="w-5 h-5" />
                                        <span>Delhi, India</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-400">
                                        <Mail className="w-5 h-5" />
                                        <span>support@stakeit.com</span>
                                    </div>
                                </motion.div>

                                {/* Social Links */}
                                <div className="flex space-x-4">
                                    {socialLinks.map((social, index) => {
                                        const Icon = social.icon;
                                        return (
                                            <motion.a
                                            key={social.label}
                                            href={social.href}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ y: -3, scale: 1.1 }}
                                            className="w-12 h-12 bg-gray-800/50 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-600 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 border border-gray-700/50 hover:border-blue-500/50"
                                            >
                                            <Icon className="w-5 h-5" />
                                            </motion.a>
                                        );
                                    })}
                                </div>
                            </div>

                        {/* Links Sections */}
                        {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: categoryIndex * 0.1 }}
                            >
                                <h4 className="text-white font-black text-lg mb-6 capitalize">
                                    {category}
                                </h4>
                                <ul className="space-y-4">
                                    {links.map((link) => (
                                        <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                                        >
                                            <span className="group-hover:translate-x-1 transition-transform duration-200">
                                            {link.name}
                                            </span>
                                        </Link>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="text-gray-400 mb-4 md:mb-0">
                                © 2025 StakeIt. All rights reserved. Built with ❤️ for the Solana community.
                            </div>
                        
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2 text-gray-400">
                                    <Shield className="w-4 h-4" />
                                    <span className="text-sm">Secured by Solana</span>
                                </div>
                                
                                <motion.button
                                    onClick={scrollToTop}
                                    whileHover={{ y: -2, scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 cursor-pointer"
                                >
                                    <ArrowUp className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
