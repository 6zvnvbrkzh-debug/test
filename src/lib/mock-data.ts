export type Condition = "NEW" | "OPEN_BOX" | "USED" | "FOR_PARTS";
export type Category = "streaming-box" | "receiver" | "accessories" | "remote";
export type ListingStatus = "ACTIVE" | "SOLD" | "ARCHIVED";

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: Condition;
  category: Category;
  images: string[];
  specs: Record<string, string>;
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  status: ListingStatus;
  createdAt: string;
}

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: "streaming-box", label: "Streaming Boxes" },
  { value: "receiver", label: "Receivers" },
  { value: "accessories", label: "Accessories" },
  { value: "remote", label: "Remotes" },
];

export const CONDITIONS: { value: Condition; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "OPEN_BOX", label: "Open Box" },
  { value: "USED", label: "Used" },
  { value: "FOR_PARTS", label: "For Parts" },
];

export const mockListings: Listing[] = [
  {
    id: "1",
    title: "NVIDIA Shield TV Pro 2019",
    description: "The ultimate streaming media player. Dolby Vision HDR, 4K HDR upscaling, and a built-in Plex Media Server. Includes remote and power adapter.",
    price: 149.99,
    condition: "USED",
    category: "streaming-box",
    images: [],
    specs: { Resolution: "4K HDR", Processor: "Tegra X1+", RAM: "3GB", Storage: "16GB", Connectivity: "Wi-Fi 5, Bluetooth 5.0, Gigabit Ethernet", OS: "Android TV" },
    sellerId: "u1",
    sellerName: "TechDeals",
    status: "ACTIVE",
    createdAt: "2026-03-10",
  },
  {
    id: "2",
    title: "Apple TV 4K (3rd Generation)",
    description: "Apple TV 4K with A15 Bionic chip, HDR10+, and Dolby Atmos. Comes with Siri Remote. Like new condition, all original packaging.",
    price: 119.00,
    condition: "OPEN_BOX",
    category: "streaming-box",
    images: [],
    specs: { Resolution: "4K HDR", Processor: "A15 Bionic", RAM: "4GB", Storage: "64GB", Connectivity: "Wi-Fi 6, Bluetooth 5.0, Ethernet via USB-C", OS: "tvOS" },
    sellerId: "u2",
    sellerName: "StreamKing",
    status: "ACTIVE",
    createdAt: "2026-03-08",
  },
  {
    id: "3",
    title: "Roku Ultra 2024",
    description: "Roku's fastest, most powerful player. Dolby Vision, Atmos, hands-free voice, rechargeable voice remote Pro.",
    price: 79.99,
    condition: "NEW",
    category: "streaming-box",
    images: [],
    specs: { Resolution: "4K HDR", Processor: "Quad-Core", RAM: "2GB", Storage: "8GB", Connectivity: "Wi-Fi 6E, Bluetooth, Ethernet", OS: "Roku OS" },
    sellerId: "u3",
    sellerName: "BoxedNew",
    status: "ACTIVE",
    createdAt: "2026-03-12",
  },
  {
    id: "4",
    title: "Marantz NR1711 Slim Receiver",
    description: "7.2-channel AV receiver with 8K/60Hz and 4K/120Hz passthrough. Dolby Atmos, DTS:X, HEOS built-in.",
    price: 449.00,
    condition: "USED",
    category: "receiver",
    images: [],
    specs: { Channels: "7.2", Power: "50W per channel", HDMI: "6 in / 1 out (8K)", Audio: "Dolby Atmos, DTS:X", Connectivity: "Wi-Fi, Bluetooth, AirPlay 2, HEOS", Dimensions: "17.3 x 4.1 x 14.8 in" },
    sellerId: "u1",
    sellerName: "TechDeals",
    status: "ACTIVE",
    createdAt: "2026-03-05",
  },
  {
    id: "5",
    title: "Amazon Fire TV Stick 4K Max",
    description: "Fire TV Stick 4K Max with Wi-Fi 6E support. Ambient Experience ready. Includes Alexa Voice Remote Enhanced.",
    price: 34.99,
    condition: "NEW",
    category: "streaming-box",
    images: [],
    specs: { Resolution: "4K Ultra HD", Processor: "Quad-Core 2.0 GHz", RAM: "2GB", Storage: "16GB", Connectivity: "Wi-Fi 6E, Bluetooth 5.2", OS: "Fire OS" },
    sellerId: "u4",
    sellerName: "GadgetVault",
    status: "ACTIVE",
    createdAt: "2026-03-14",
  },
  {
    id: "6",
    title: "Logitech Harmony Elite Remote",
    description: "Universal remote with hub. Controls up to 15 devices. Touch screen, customizable activities. Discontinued model in great condition.",
    price: 189.00,
    condition: "USED",
    category: "remote",
    images: [],
    specs: { Devices: "Up to 15", Display: "2.4\" Color Touch Screen", Range: "IR + RF + Bluetooth + Wi-Fi", Battery: "Rechargeable Li-Ion", Compatibility: "270,000+ devices" },
    sellerId: "u2",
    sellerName: "StreamKing",
    status: "ACTIVE",
    createdAt: "2026-03-01",
  },
  {
    id: "7",
    title: "Denon AVR-S760H Receiver",
    description: "7.2 channel 8K AV receiver with 3D audio, HEOS, and voice control. Perfect for home theater setups.",
    price: 329.00,
    condition: "OPEN_BOX",
    category: "receiver",
    images: [],
    specs: { Channels: "7.2", Power: "75W per channel", HDMI: "6 in / 2 out (8K)", Audio: "Dolby Atmos, DTS:X", Connectivity: "Wi-Fi, Bluetooth, AirPlay 2", Dimensions: "17.1 x 6 x 13.3 in" },
    sellerId: "u3",
    sellerName: "BoxedNew",
    status: "ACTIVE",
    createdAt: "2026-03-07",
  },
  {
    id: "8",
    title: "HDMI 2.1 Cable — 6ft Braided",
    description: "Ultra high speed HDMI 2.1 cable. Supports 8K@60Hz and 4K@120Hz. 48Gbps bandwidth. Gold-plated connectors.",
    price: 12.99,
    condition: "NEW",
    category: "accessories",
    images: [],
    specs: { Length: "6 ft", Version: "HDMI 2.1", Bandwidth: "48Gbps", Resolution: "8K@60Hz / 4K@120Hz", Material: "Braided Nylon" },
    sellerId: "u4",
    sellerName: "GadgetVault",
    status: "ACTIVE",
    createdAt: "2026-03-13",
  },
];
