"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Upload,
  Vault,
  Wallet, 
} from "lucide-react";
import { toast } from "react-toastify"
import axios from "axios";
import Image from "next/image";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { ADMIN_PUBLIC_KEY } from "@/config";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectItem } from "@radix-ui/react-select";
import { AddFundsToVault, CreateVaultAccount } from "@/hooks/Staking";
import { PublicKey } from "@solana/web3.js";
import { StakingContract } from "@/hooks/contract";


function adminDashboard() {
    const wallet  = useAnchorWallet();
    const [nfts, setNfts] = useState<[]>([]);
    const router = useRouter();
    const [category, setCategory] = useState("");
    const [vaultBalance, setVaultBalance] = useState(0);

    const categories = ['genesis', 'animals', 'abstract', 'futuristic', 'nature', 'space', 'mythical'];
    
    const [nftForm, setNftForm] = useState({
        name: "",
        description: "",
        uri: "",
        symbol: "",
        PointsCost: "",
        BasePrice: "",
        category: "",
        quantity: "",
    });

    const [fundVaultForm, setFundVaultForm] = useState({
        amount: "",
    });


    // const handleCreateVault = async () => {
    //     try {
    //         await CreateVaultAccount(wallet!);
    //         toast.success("Vault account created successfully!", {
    //             position: "top-right",  
    //             autoClose: 5000,
    //             hideProgressBar: false,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //             theme: "dark",
    //         });
    //     } catch (error) {
    //         console.error("Error creating vault:", error);
    //         toast.error("An error occurred while creating the vault account.");
    //     }
    // };

    const handleFundVault = async () => {
        if (!fundVaultForm.amount || isNaN(Number(fundVaultForm.amount)) || Number(fundVaultForm.amount) <= 0) {
            toast.error("Please enter a valid amount to fund the vault.", {
                position: "top-right",  
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            return;
        }
        try {
            AddFundsToVault(wallet!, Number(fundVaultForm.amount));
            toast.success(`Vault funded with ${fundVaultForm.amount} SOL successfully!`, {
                position: "top-right",  
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setFundVaultForm({ amount: "" });
        } catch (error) {
            console.error("Error funding vault:", error);
            toast.error("An error occurred while funding the vault account.");
        }
    };

    const handleCreateNFT = async () => {
        const res = await axios.post("/api/nft/createNft", {
            name: nftForm.name,
            description: nftForm.description,
            uri: nftForm.uri,
            symbol: nftForm.symbol,
            PointsCost: nftForm.PointsCost,
            BasePrice: nftForm.BasePrice,
            category: category,
            quantity: nftForm.quantity,
        })

        if (res.status === 200) {
            toast.success(
                `NFT "${nftForm.name}" created successfully!`,
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,     
                    draggable: true,
                    progress: undefined,    
                    theme: "dark",
                }
            );
            setNftForm({
                name: "",
                description: "",
                symbol: "",
                PointsCost: "",
                BasePrice: "",
                uri: "",
                category: "",
                quantity: "",
            });
            getNfts();
        } else {
            toast.error("Failed to create NFT. Please try again.");
        }
    };

    const [fetched, setFetched] = useState(false);

    useEffect(() => {
        if (!wallet || fetched) return;

        const pubkey = wallet?.publicKey?.toString();
        if (pubkey !== ADMIN_PUBLIC_KEY) {
            router.push("/");
            toast.error("You do not have permission to access this page.");
            return;
        }

        getNfts();
        getVaultAccount();
        setFetched(true);

    }, [wallet, wallet?.publicKey, fetched]);


    const getNfts = async () => {
        try {
            const response = await axios.get("/api/nft/getNfts");
            setNfts(response.data);
        } catch (error) {
            console.error("Error fetching NFTs:", error);
            toast.error("Failed to fetch NFTs");
        }
    };

    const getVaultAccount = async () => {
        const program = StakingContract(wallet!);
        try {
            const [pda] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault_account"), new PublicKey(ADMIN_PUBLIC_KEY).toBuffer(), Buffer.from("vault")],
                program.programId
            );
            const vaultBalance = await program.provider.connection.getBalance(pda);
            setVaultBalance(vaultBalance / 1e9); 
        } catch (error) {
            console.error("Error fetching vault account:", error);
            toast.error("Failed to fetch vault account.");
        }
    };

    return (
        <div className="min-h-screen bg-black mt-14">
        
            <div className="container mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Admin Dashboard
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Manage your NFT collection, monitor platform statistics, and create new digital assets for your community.
                </p>
                </motion.div>

                <div className="mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-6"
                    >
                        {/* Create Vault */}
                        <Card className="bg-gray-900 backdrop-blur-lg border-border/50">
                        <CardHeader>
                            <CardTitle className="text-xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center">
                            <Vault className="w-5 h-5 mr-2 text-cyan-400" />
                                Vault Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div 
                                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-lg p-4"
                            >
                                {vaultBalance > 0 ? (
                                    <div className="text-white">
                                        Vault Balance: {vaultBalance.toFixed(2)} SOL 
                                    </div>
                                ) : (
                                    <div className="text-red-500">
                                        Vault is empty
                                    </div>
                                )}     
                            </div>
                        </CardContent>
                        </Card>

                        {/* Fund Vault */}
                        <Card className="bg-gray-900 backdrop-blur-lg border-border/50">
                        <CardHeader>
                            <CardTitle className="text-xl bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent flex items-center">
                            <Wallet className="w-5 h-5 mr-2 text-orange-400" />
                                Fund Vault Account
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                            <Label htmlFor="fundAmount" className="text-white">Amount (SOL) *</Label>
                            <Input
                                id="fundAmount"
                                type="number"
                                value={fundVaultForm.amount}
                                onChange={(e) => setFundVaultForm({...fundVaultForm, amount: e.target.value})}
                                placeholder="0.00"
                                className="bg-gray-800 text-white"
                            />
                            </div>
                            <Button 
                            onClick={handleFundVault}
                            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                            >
                            Add Funds
                            </Button>
                        </CardContent>
                        </Card>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* NFT Creation Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="bg-gray-900 backdrop-blur-lg border-border/50 text-white">
                        <CardHeader>
                            <CardTitle className="text-2xl bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent flex items-center">
                            <Plus className="w-6 h-6 mr-2 text-emerald-400" />
                                Create New NFT
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">NFT Name *</Label>
                                <Input
                                    id="name"
                                    value={nftForm.name}
                                    onChange={(e) => setNftForm({...nftForm, name: e.target.value})}
                                    placeholder="Enter NFT name..."
                                    className="bg-gray-800"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">NFT Symbol *</Label>
                                <Input
                                    id="Sumbol"
                                    value={nftForm.symbol}
                                    onChange={(e) => setNftForm({...nftForm, symbol: e.target.value})}
                                    placeholder="Enter NFT name..."
                                    className="bg-gray-800"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={nftForm.description}
                                    onChange={(e) => setNftForm({...nftForm, description: e.target.value})}
                                    placeholder="Describe your NFT..."
                                    className="bg-gray-800 min-h-[100px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className=" text-white">
                                    <Label>Select Category</Label>
                                    <div className="mb-3"></div>
                                    <Select onValueChange={(value) => setCategory(value)} value={category}>
                                        <SelectTrigger className="w-full text-white bg-gray-800">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-800 text-white border-border/50">
                                            {categories.map((cat, index) => (
                                                <SelectItem 
                                                    key={index} 
                                                    value={cat}
                                                    className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                                                >
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                            <Label htmlFor="image">Image URL </Label>
                                <div className="flex space-x-2">
                                    <Input
                                        id="image"
                                        value={nftForm.uri}
                                        onChange={(e) => setNftForm({...nftForm, uri: e.target.value})}
                                        placeholder="https://example.com/image.jpg"
                                    className="bg-gray-800"
                                    />
                                    <Button variant="outline" size="icon">
                                        <Upload className="w-4 h-4 text-black" />
                                    </Button>
                                </div>
                            </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cost">Cost (Points) *</Label>
                                <Input
                                    id="cost"
                                    type="number"
                                    value={nftForm.PointsCost}
                                    onChange={(e) => setNftForm({...nftForm, PointsCost: e.target.value})}
                                    placeholder="5000"
                                    className="bg-gray-800"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cost">Base Price (Solana) *</Label>
                                    <Input
                                        id="cost"
                                        type="number"
                                        value={nftForm.BasePrice}
                                        onChange={(e) => setNftForm({...nftForm, BasePrice: e.target.value})}
                                        placeholder="10"
                                        className="bg-gray-800"
                                    />
                                </div>
                            </div>

                            <Button 
                                onClick={handleCreateNFT}
                                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                                >
                            Create NFT
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Preview & Recent NFTs */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-6"
                >
                    {/* Preview */}
                    <Card className="bg-gray-900 backdrop-blur-lg border-border/50">
                    <CardHeader>
                        <CardTitle className="text-xl text-emerald-400">Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-gray-800 rounded-lg p-6 border border-emerald-500/20">
                        <div className="w-full h-40 bg-muted rounded-lg mb-4 flex items-center justify-center">
                            {nftForm.uri ? (
                            <img src={nftForm.uri} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                            <Upload className="w-8 h-8 text-muted-foreground" />
                            )}
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg text-white">{nftForm.name || "NFT Name"}</h3>
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                {nftForm.symbol}
                            </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                            {nftForm.description || "NFT description will appear here..."}
                            </p>
                            <div className="text-emerald-400 font-bold">
                                {nftForm.BasePrice ? `${parseInt(nftForm.BasePrice).toLocaleString()} SOL` : "0 SOL"}
                            </div>
                            <div className="text-emerald-400 font-bold">
                                {nftForm.PointsCost ? `${parseInt(nftForm.PointsCost).toLocaleString()} Points` : "0 Points"}
                            </div>
                        </div>
                        </div>
                    </CardContent>
                    </Card>

                    {/* Recent NFTs */}
                    <Card className="bg-gray-900 backdrop-blur-lg border-border/50">
                        <CardHeader>
                            <CardTitle className="text-xl text-cyan-400">Recent NFTs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {nfts.map((nft: any, index: number) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                                        <Image
                                            src={nft.uri}
                                            alt={nft.name}
                                            width={50}
                                            height={50} 
                                            className="w-12 h-12 rounded-lg object-cover mr-3"
                                        />
                                        <div>
                                            <div className="font-medium text-white">{nft.name}</div>
                                            <div className="text-sm text-muted-foreground">{nft.description}</div>
                                        </div>
                                        <div className="text-emerald-400 font-bold">{nft.pointPrice} PTS</div>
                                        <div className="text-emerald-400 font-bold">{nft.basePrice} SOL</div>
                                        <div className="text-sm text-muted-foreground">{new Date(nft.createdAt).toLocaleDateString()}</div>
                                    </div>
                                ))}
                                {nfts.length === 0 && (
                                    <div className="text-center text-muted-foreground">
                                        No NFTs created yet.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                </div>
            </div>
        </div>
    );
};

export default adminDashboard;
