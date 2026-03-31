export type Condition = "NEW" | "OPEN_BOX" | "USED" | "FOR_PARTS";
export type Category = "streaming-box" | "receiver" | "accessories" | "remote";
export type ListingStatus = "ACTIVE" | "SOLD" | "ARCHIVED";

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  condition: Condition;
  category: Category;
  images: string[];
  specs: Record<string, string>;
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  status: ListingStatus;
  createdAt: string;
  stock: number;
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
    title: "Apple AirPods Pro 3 Kabellose In-Ear Kopfhörer mit Ladecase (USB-C)",
    description: "Apple AirPods Pro 3 mit USB-C Ladecase. Aktive Geräuschunterdrückung, Transparenzmodus und räumliches Audio für ein immersives Klangerlebnis.",
    price: 180.00,
    originalPrice: 239.00,
    condition: "NEW",
    category: "accessories",
    images: ["https://images.sumup.com/img_0F8QDCRY0Q9Q9B9DJK33X86ADB/image.png"],
    specs: { Typ: "In-Ear Kopfhörer", Anschluss: "USB-C", Features: "ANC, Transparenzmodus, Räumliches Audio", Marke: "Apple" },
    sellerId: "b-electronics",
    sellerName: "B-Electronics",
    status: "ACTIVE",
    createdAt: "2026-03-15",
    stock: 10,
  },
  {
    id: "2",
    title: "Formuler Z11 PRO BT1-Edition Android 11 OTT Medien Player 2GB RAM 16GB Flash",
    description: "Formuler Z11 PRO BT1-Edition mit Android 11. Leistungsstarker OTT Medien Player mit 2GB RAM und 16GB internem Speicher. Perfekt für Streaming.",
    price: 137.00,
    originalPrice: 155.00,
    condition: "NEW",
    category: "streaming-box",
    images: ["https://images.sumup.com/img_10ZBR20YJ28JGA2YSYAVJX781P/image.png"],
    specs: { Betriebssystem: "Android 11", RAM: "2GB", Speicher: "16GB Flash", Fernbedienung: "BT1-Edition", Typ: "OTT Medien Player" },
    sellerId: "b-electronics",
    sellerName: "B-Electronics",
    status: "ACTIVE",
    createdAt: "2026-03-15",
    stock: 5,
  },
  {
    id: "3",
    title: "Formuler Z11 PRO MAX BT1-Edition Android 11 OTT Medien Player 4GB RAM 32GB Flash",
    description: "Die MAX-Variante des Formuler Z11 PRO. Android 11 OTT Medien Player mit 4GB RAM und 32GB Flash-Speicher für maximale Leistung.",
    price: 157.00,
    originalPrice: 179.00,
    condition: "NEW",
    category: "streaming-box",
    images: ["https://images.sumup.com/img_0AGD4R8C859KA8AJ40BRJV33G4/image.png"],
    specs: { Betriebssystem: "Android 11", RAM: "4GB", Speicher: "32GB Flash", Fernbedienung: "BT1-Edition", Typ: "OTT Medien Player" },
    sellerId: "b-electronics",
    sellerName: "B-Electronics",
    status: "ACTIVE",
    createdAt: "2026-03-15",
    stock: 3,
  },
  {
    id: "4",
    title: "Formuler Z12 ULTRA Android 12 OTT Medien Player 4GB DDR4 RAM 128GB Flash, BT3",
    description: "Das Flaggschiff von Formuler. Android 12 mit 4GB DDR4 RAM und großzügigen 128GB Flash-Speicher. BT3 Fernbedienung inklusive.",
    price: 198.00,
    originalPrice: 209.00,
    condition: "NEW",
    category: "streaming-box",
    images: ["https://images.sumup.com/img_5B8VCH0EY58FM816Y0FD7RXVCE/image.png"],
    specs: { Betriebssystem: "Android 12", RAM: "4GB DDR4", Speicher: "128GB Flash", Fernbedienung: "BT3", Typ: "OTT Medien Player" },
    sellerId: "b-electronics",
    sellerName: "B-Electronics",
    status: "ACTIVE",
    createdAt: "2026-03-15",
    stock: 7,
  },
  {
    id: "5",
    title: "Formuler Z Mini Android 12 Multimedia 4K-Box 2GB RAM 8GB Flash, BT Fernbedienung",
    description: "Kompakte 4K Multimedia-Box von Formuler mit Android 12. Ideal als Einstiegsgerät mit BT Fernbedienung.",
    price: 114.00,
    originalPrice: 124.00,
    condition: "NEW",
    category: "streaming-box",
    images: ["https://images.sumup.com/img_7BKND0YBB88YGBP31NWMEA8JHX/image.png"],
    specs: { Betriebssystem: "Android 12", RAM: "2GB", Speicher: "8GB Flash", Auflösung: "4K", Fernbedienung: "BT", Typ: "Multimedia Box" },
    sellerId: "b-electronics",
    sellerName: "B-Electronics",
    status: "ACTIVE",
    createdAt: "2026-03-15",
    stock: 4,
  },
  {
    id: "6",
    title: "OCTAGON SPIRIT NANO 4K UHD HDR10+ ANDROID TV Stick",
    description: "Kompakter Android TV Stick mit 4K UHD, HDR10+, WLAN 5G und Bluetooth. IPTV und OTT Media Streaming in einem handlichen Format.",
    price: 70.00,
    originalPrice: 79.99,
    condition: "NEW",
    category: "streaming-box",
    images: ["https://images.sumup.com/img_4F72QHC1TA8BVSG35RM0FTJ348/image.png"],
    specs: { Auflösung: "4K UHD", HDR: "HDR10+", WLAN: "5G", Bluetooth: "Ja", Typ: "Android TV Stick" },
    sellerId: "b-electronics",
    sellerName: "B-Electronics",
    status: "SOLD",
    createdAt: "2026-03-15",
    stock: 0,
  },
  {
    id: "7",
    title: "Octagon SPIRIT V2 PRO 4K UHD Android 11 IPTV-Receiver",
    description: "Octagon SPIRIT V2 PRO mit 4K UHD Auflösung und Android 11. Vielseitiger IPTV-Receiver für Streaming-Enthusiasten.",
    price: 100.00,
    originalPrice: 119.00,
    condition: "NEW",
    category: "receiver",
    images: ["https://images.sumup.com/img_4W7H172NSW962VMJGF853PQBZ6/image.png"],
    specs: { Auflösung: "4K UHD", Betriebssystem: "Android 11", Typ: "IPTV-Receiver", Marke: "Octagon" },
    sellerId: "b-electronics",
    sellerName: "B-Electronics",
    status: "SOLD",
    createdAt: "2026-03-15",
    stock: 0,
  },
  {
    id: "8",
    title: "Octagon SPIRIT V2 PRO Max 8K Android IPTV-Box",
    description: "Die leistungsstärkste IPTV-Box von Octagon mit 8K Unterstützung. Android-basiertes Streaming auf höchstem Niveau.",
    price: 120.00,
    originalPrice: 149.00,
    condition: "NEW",
    category: "receiver",
    images: ["https://images.sumup.com/img_300X6J2MTK8ZFRJDANVSDQPYNX/image.png"],
    specs: { Auflösung: "8K", Betriebssystem: "Android", Typ: "IPTV-Box", Marke: "Octagon" },
    sellerId: "b-electronics",
    sellerName: "B-Electronics",
    status: "SOLD",
    createdAt: "2026-03-15",
  },
  {
    id: "9",
    title: "Octagon SPIRIT White 4K UHD HDR10+ ANDROID TV Streaming Box",
    description: "Octagon SPIRIT in Weiß. 4K UHD mit HDR10+, Android TV, 5G WiFi und Bluetooth. Elegantes Design für jedes Wohnzimmer.",
    price: 90.00,
    originalPrice: 109.00,
    condition: "NEW",
    category: "streaming-box",
    images: ["https://images.sumup.com/img_6BMW34P5MR81X9ET1T4Q5H2KR1/image.png"],
    specs: { Auflösung: "4K UHD", HDR: "HDR10+", WLAN: "5G WiFi", Bluetooth: "Ja", Farbe: "Weiß", Typ: "Android TV Streaming Box" },
    sellerId: "b-electronics",
    sellerName: "B-Electronics",
    status: "ACTIVE",
    createdAt: "2026-03-15",
  },
];
