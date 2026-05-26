export interface Facility {
  id: string;
  name: string;
  prefecture: string;
  address: string;
  category: string;
  website: string;
  parrots: string[];
}

export const facilities: Facility[] = [
  {
    id: "1",
    name: "上野動物園",
    prefecture: "東京都",
    address: "東京都台東区上野公園9-83",
    category: "動物園",
    website: "https://www.tokyo-zoo.net/ueno/",
    parrots: [],
  },
  {
    id: "2",
    name: "多摩動物公園",
    prefecture: "東京都",
    address: "東京都日野市程久保7-1-1",
    category: "動物園",
    website: "https://www.tokyo-zoo.net/tama/",
    parrots: ["ルリコンゴウインコ", "ベニコンゴウインコ"],
  },
  {
    id: "3",
    name: "野毛山動物園",
    prefecture: "神奈川県",
    address: "横浜市西区老松町63-10",
    category: "動物園",
    website: "https://www.hama-midorinokyokai.or.jp/zoo/nogeyama/",
    parrots: ["ボタンインコ"],
  },
  {
    id: "4",
    name: "ズーラシア",
    prefecture: "神奈川県",
    address: "横浜市旭区上白根町1175-1",
    category: "動物園",
    website: "https://www.hama-midorinokyokai.or.jp/zoo/zoorasia/",
    parrots: ["ハネナガインコ", "ベニコンゴウインコ", "ルリコンゴウインコ", "モモイロインコ", "ヨウム"],
  },
  {
    id: "5",
    name: "金沢動物園",
    prefecture: "神奈川県",
    address: "横浜市金沢区釜利谷東5-15-1",
    category: "動物園",
    website: "https://www.hama-midorinokyokai.or.jp/zoo/kanazawa/",
    parrots: [],
  },
];

// 全ての都道府県を重複なしで抽出
export const allPrefectures = Array.from(new Set(facilities.map(f => f.prefecture))).sort();

// 全てのインコの種類を重複なしで抽出
export const allParrotTypes = Array.from(new Set(facilities.flatMap(f => f.parrots))).sort();
