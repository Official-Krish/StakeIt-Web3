export interface MarketplaceNFT {
    id: string;
    name: string;
    uri: string;
    description: string;
    basePrice: string;
    pointPrice: string;
    category: string;
    AskPrice: string;
    Likes: number;
}

export interface OwnedNFT {
    id: string;
    name: string;
    uri: string;
    description: string;
    basePrice: string;
    pointPrice: string;
    category: string;
    AskPrice: string;
    Likes: number;
    MintedBy: string;
    MintedAt: string;
    lastSalePrice: string;
    Listed: boolean;
    lastSalesPrice: "12";
}