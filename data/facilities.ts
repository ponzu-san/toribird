import { sortJapanese } from "@/lib/utils/sortJa";

export interface Facility {
  id: string;
  name: string;
  prefecture: string;
  address: string;
  website: string;
  parrots: string[];
}

export const facilities: Facility[] = [
  {
    id: "1",
    name: "上野動物園",
    prefecture: "東京都",
    address: "東京都台東区上野公園9-83",
    website: "https://www.tokyo-zoo.net/ueno/",
    parrots: [],
  },
  {
    id: "2",
    name: "多摩動物公園",
    prefecture: "東京都",
    address: "東京都日野市程久保7-1-1",
    website: "https://www.tokyo-zoo.net/tama/",
    parrots: ["ルリコンゴウインコ", "ベニコンゴウインコ"],
  },
  {
    id: "3",
    name: "井の頭自然文化園",
    prefecture: "東京都",
    address: "東京都武蔵野市御殿山1-17-6",
    website: "https://www.tokyo-zoo.net/inokashira/",
    parrots: [],
  },
  {
    id: "4",
    name: "板橋こども動物園",
    prefecture: "東京都",
    address: "東京都板橋区板橋3-50-1",
    website: "https://itabashi-park-zoo.com/",
    parrots: [],
  },
  {
    id: "5",
    name: "こども動物園 高島平分園",
    prefecture: "東京都",
    address: "東京都板橋区高島平8-24-1",
    website: "https://itabashi-park-zoo.com/bunen/",
    parrots: ["セキセイインコ"],
  },
  {
    id: "6",
    name: "羽村市動物公園",
    prefecture: "東京都",
    address: "東京都羽村市羽4122番地",
    website: "https://hamurazoo.jp/",
    parrots: ["ベニコンゴウインコ", "ミドリコンゴウインコ", "ルリゴシボタンインコ"],
  },
  {
    id: "7",
    name: "江戸川区自然動物園",
    prefecture: "東京都",
    address: "東京都江戸川区北葛西3-2-1",
    website: "https://www.edogawa-kankyozaidan.jp/zoo/",
    parrots: [],
  },
  {
    id: "8",
    name: "鳥のあるカフェ 谷中本店",
    prefecture: "東京都",
    address: "東京都台東区谷中2-3-16-1F",
    website: "https://toricafe.co.jp/yanaka",
    parrots: [
      "シロハラインコ",
      "ズグロシロハラインコ",
      "ヒインコ",
      "ヨウム",
      "ルリコンゴウインコ",
      "コガネメキシコインコ",
      "オカメインコ",
    ],
  },
  {
    id: "9",
    name: "鳥のあるカフェ 千駄木店",
    prefecture: "東京都",
    address: "東京都文京区千駄木3-42-16-1F",
    website: "https://toricafe.co.jp/sendagi",
    parrots: [
      "タイハクオウム",
      "ウロコインコ",
      "コガネメキシコインコ",
      "シロハラインコ",
      "ズグロシロハラインコ",
      "コミドリコンゴウインコ",
      "モモイロインコ",
      "ボウシインコ",
    ],
  },
  {
    id: "10",
    name: "ことりカフェ上野本店",
    prefecture: "東京都",
    address: "東京都台東区上野桜木1-8-6",
    website: "http://ueno.kotoricafe.jp/",
    parrots: ["タイハクオウム", "サザナミインコ", "オカメインコ", "コザクラインコ", "セキセイインコ", "桜文鳥", "白文鳥"],
  },
  {
    id: "11",
    name: "野毛山動物園",
    prefecture: "神奈川県",
    address: "横浜市西区老松町63-10",
    website: "https://www.hama-midorinokyokai.or.jp/zoo/nogeyama/",
    parrots: ["ボタンインコ"],
  },
  {
    id: "12",
    name: "ズーラシア",
    prefecture: "神奈川県",
    address: "横浜市旭区上白根町1175-1",
    website: "https://www.hama-midorinokyokai.or.jp/zoo/zoorasia/",
    parrots: ["ハネナガインコ", "ベニコンゴウインコ", "ルリコンゴウインコ", "モモイロインコ", "ヨウム"],
  },
  {
    id: "13",
    name: "金沢動物園",
    prefecture: "神奈川県",
    address: "横浜市金沢区釜利谷東5-15-1",
    website: "https://www.hama-midorinokyokai.or.jp/zoo/kanazawa/",
    parrots: [],
  },
];

// 全ての都道府県を重複なしで抽出
export const allPrefectures = Array.from(new Set(facilities.map(f => f.prefecture))).sort();

// 全てのインコの種類を重複なしで抽出
export const allParrotTypes = sortJapanese(Array.from(new Set(facilities.flatMap(f => f.parrots))));
