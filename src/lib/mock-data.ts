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
  { value: "streaming-box", label: "Streaming Boxen" },
  { value: "receiver", label: "Receiver" },
  { value: "accessories", label: "Zubehör" },
  { value: "remote", label: "Fernbedienungen" },
];

export const CONDITIONS: { value: Condition; label: string }[] = [
  { value: "NEW", label: "Neu" },
  { value: "OPEN_BOX", label: "Geöffnete Verpackung" },
  { value: "USED", label: "Gebraucht" },
  { value: "FOR_PARTS", label: "Ersatzteile" },
];

export const mockListings: Listing[] = [
  {
    id: "1",
    title: "NVIDIA Shield TV Pro 2019",
    description: "Der ultimative Streaming-Media-Player. Dolby Vision HDR, 4K HDR Upscaling und ein eingebauter Plex Media Server. Inklusive Fernbedienung und Netzteil.",
    price: 149.99,
    condition: "USED",
    category: "streaming-box",
    images: [],
    specs: { Auflösung: "4K HDR", Prozessor: "Tegra X1+", RAM: "3GB", Speicher: "16GB", Konnektivität: "Wi-Fi 5, Bluetooth 5.0, Gigabit Ethernet", Betriebssystem: "Android TV" },
    sellerId: "u1",
    sellerName: "TechDeals",
    status: "ACTIVE",
    createdAt: "2026-03-10",
  },
  {
    id: "2",
    title: "Apple TV 4K (3. Generation)",
    description: "Apple TV 4K mit A15 Bionic Chip, HDR10+ und Dolby Atmos. Inklusive Siri Remote. Wie neu, Originalverpackung vorhanden.",
    price: 119.00,
    condition: "OPEN_BOX",
    category: "streaming-box",
    images: [],
    specs: { Auflösung: "4K HDR", Prozessor: "A15 Bionic", RAM: "4GB", Speicher: "64GB", Konnektivität: "Wi-Fi 6, Bluetooth 5.0, Ethernet via USB-C", Betriebssystem: "tvOS" },
    sellerId: "u2",
    sellerName: "StreamKing",
    status: "ACTIVE",
    createdAt: "2026-03-08",
  },
  {
    id: "3",
    title: "Roku Ultra 2024",
    description: "Rokus schnellster und leistungsstärkster Player. Dolby Vision, Atmos, freihändige Sprachsteuerung, wiederaufladbare Voice Remote Pro.",
    price: 79.99,
    condition: "NEW",
    category: "streaming-box",
    images: [],
    specs: { Auflösung: "4K HDR", Prozessor: "Quad-Core", RAM: "2GB", Speicher: "8GB", Konnektivität: "Wi-Fi 6E, Bluetooth, Ethernet", Betriebssystem: "Roku OS" },
    sellerId: "u3",
    sellerName: "BoxedNew",
    status: "ACTIVE",
    createdAt: "2026-03-12",
  },
  {
    id: "4",
    title: "Marantz NR1711 Slim Receiver",
    description: "7.2-Kanal AV-Receiver mit 8K/60Hz und 4K/120Hz Durchleitung. Dolby Atmos, DTS:X, HEOS integriert.",
    price: 449.00,
    condition: "USED",
    category: "receiver",
    images: [],
    specs: { Kanäle: "7.2", Leistung: "50W pro Kanal", HDMI: "6 Eingänge / 1 Ausgang (8K)", Audio: "Dolby Atmos, DTS:X", Konnektivität: "Wi-Fi, Bluetooth, AirPlay 2, HEOS", Abmessungen: "44 x 10,5 x 37,6 cm" },
    sellerId: "u1",
    sellerName: "TechDeals",
    status: "ACTIVE",
    createdAt: "2026-03-05",
  },
  {
    id: "5",
    title: "Amazon Fire TV Stick 4K Max",
    description: "Fire TV Stick 4K Max mit Wi-Fi 6E Unterstützung. Ambient Experience kompatibel. Inklusive Alexa Sprachfernbedienung Enhanced.",
    price: 34.99,
    condition: "NEW",
    category: "streaming-box",
    images: [],
    specs: { Auflösung: "4K Ultra HD", Prozessor: "Quad-Core 2.0 GHz", RAM: "2GB", Speicher: "16GB", Konnektivität: "Wi-Fi 6E, Bluetooth 5.2", Betriebssystem: "Fire OS" },
    sellerId: "u4",
    sellerName: "GadgetVault",
    status: "ACTIVE",
    createdAt: "2026-03-14",
  },
  {
    id: "6",
    title: "Logitech Harmony Elite Fernbedienung",
    description: "Universalfernbedienung mit Hub. Steuert bis zu 15 Geräte. Touchscreen, anpassbare Aktivitäten. Eingestelltes Modell in gutem Zustand.",
    price: 189.00,
    condition: "USED",
    category: "remote",
    images: [],
    specs: { Geräte: "Bis zu 15", Display: "2,4\" Farb-Touchscreen", Reichweite: "IR + RF + Bluetooth + Wi-Fi", Akku: "Wiederaufladbarer Li-Ion", Kompatibilität: "270.000+ Geräte" },
    sellerId: "u2",
    sellerName: "StreamKing",
    status: "ACTIVE",
    createdAt: "2026-03-01",
  },
  {
    id: "7",
    title: "Denon AVR-S760H Receiver",
    description: "7.2-Kanal 8K AV-Receiver mit 3D-Audio, HEOS und Sprachsteuerung. Perfekt für Heimkino-Setups.",
    price: 329.00,
    condition: "OPEN_BOX",
    category: "receiver",
    images: [],
    specs: { Kanäle: "7.2", Leistung: "75W pro Kanal", HDMI: "6 Eingänge / 2 Ausgänge (8K)", Audio: "Dolby Atmos, DTS:X", Konnektivität: "Wi-Fi, Bluetooth, AirPlay 2", Abmessungen: "43,4 x 15,2 x 33,8 cm" },
    sellerId: "u3",
    sellerName: "BoxedNew",
    status: "ACTIVE",
    createdAt: "2026-03-07",
  },
  {
    id: "8",
    title: "HDMI 2.1 Kabel — 1,8m Geflochten",
    description: "Ultra-Hochgeschwindigkeits HDMI 2.1 Kabel. Unterstützt 8K@60Hz und 4K@120Hz. 48Gbps Bandbreite. Vergoldete Anschlüsse.",
    price: 12.99,
    condition: "NEW",
    category: "accessories",
    images: [],
    specs: { Länge: "1,8 m", Version: "HDMI 2.1", Bandbreite: "48Gbps", Auflösung: "8K@60Hz / 4K@120Hz", Material: "Geflochtenes Nylon" },
    sellerId: "u4",
    sellerName: "GadgetVault",
    status: "ACTIVE",
    createdAt: "2026-03-13",
  },
];