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
    Owner: string;
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
    Owner: string;
    MintedAt: string;
    lastSalePrice: string;
    Listed: boolean;
    lastSalesPrice: string;
}

export interface nfts {
    id: string;
    name: string;
    uri: string;
    description: string;
    basePrice: string;
    pointPrice: string;
    category: string;
    Owner: string;
    MintedAt: string;
    Minted: boolean;
    Listed: boolean;
}