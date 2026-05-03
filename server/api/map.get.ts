import type { MapApiResponse } from "~/app/types/map";

export default defineEventHandler((): MapApiResponse => {
  const items = [
    { id: "KH1", name: "Banteay Meanchey", totalReport: 4 },
    { id: "KH2", name: "Battambang", totalReport: 0 },
    { id: "KH3", name: "Kampong Cham", totalReport: 1 },
    { id: "KH4", name: "Kampong Chhnang", totalReport: 3 },
    { id: "KH5", name: "Kampong Speu", totalReport: 0 },
    { id: "KH6", name: "Kampong Thom", totalReport: 5 },
    { id: "KH7", name: "Kampot", totalReport: 0 },
    { id: "KH8", name: "Kandal", totalReport: 10 },
    { id: "KH9", name: "Koh Kong", totalReport: 0 },
    { id: "KH10", name: "Kratie", totalReport: 0 },
    { id: "KH11", name: "Mondul Kiri", totalReport: 33 },
    { id: "KH12", name: "Phnom Penh", totalReport: 21 },
    { id: "KH13", name: "Preah Vihear", totalReport: 9 },
    { id: "KH14", name: "Prey Veng", totalReport: 0 },
    { id: "KH15", name: "Pursat", totalReport: 21 },
    { id: "KH16", name: "Ratanak Kiri", totalReport: 0 },
    { id: "KH17", name: "Siemreap", totalReport: 0 },
    { id: "KH18", name: "Preah Sihanouk", totalReport: 0 },
    { id: "KH19", name: "Stung Treng", totalReport: 12 },
    { id: "KH20", name: "Svay Rieng", totalReport: 0 },
    { id: "KH21", name: "Takeo", totalReport: 0 },
    { id: "KH22", name: "Oddar Meanchey", totalReport: 34 },
    { id: "KH23", name: "Kep", totalReport: 0 },
    { id: "KH24", name: "Pailin", totalReport: 6 },
    { id: "KH25", name: "Tboung Khmum", totalReport: 2 },
  ];

  return {
    totalReport: items.reduce((sum, item) => sum + item.totalReport, 0),
    totalItems: items.length,
    items,
  };
});
