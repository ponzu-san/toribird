export interface ParrotDetail {
  name: string;
  scientificName: string;
  habitat: string;
  description: string;
  imageUrl: string;
}

// デフォルトのインコ画像URL
export const DEFAULT_PARROT_IMAGE_URL =
  "https://images.unsplash.com/vector-1778048385295-f73e72f68161?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

// imageUrlが空の場合にデフォルト画像を返すヘルパー関数
export const getParrotImageUrl = (imageUrl: string): string => {
  return imageUrl || DEFAULT_PARROT_IMAGE_URL;
};

export const parrotDetails: Record<string, ParrotDetail> = {
  セキセイインコ: {
    name: "セキセイインコ",
    scientificName: "Melopsittacus undulatus",
    habitat: "オーストラリア内陸部",
    description:
      "小型で人懐っこく、初心者にも飼いやすい人気のインコ。おしゃべりが得意で、言葉を覚えることができます。野生では大群で生活し、草原や低木地帯に生息しています。体長は約18cm、体重は30-40g程度です。",
    imageUrl:
      "https://images.unsplash.com/photo-1703319960774-9b5965701b29?q=80&w=2573&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  オカメインコ: {
    name: "オカメインコ",
    scientificName: "Nymphicus hollandicus",
    habitat: "オーストラリア内陸部",
    description:
      "頭部の冠羽と頬の赤い斑点が特徴的なインコ。穏やかで人懐っこい性格で、口笛を覚えるのが得意です。野生では水場の近くの木に群れで生息しています。体長は約30-35cm、体重は80-100g程度です。",
    imageUrl:
      "https://images.unsplash.com/photo-1644319037301-26243bed1485?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  コザクラインコ: {
    name: "コザクラインコ",
    scientificName: "Agapornis roseicollis",
    habitat: "アフリカ南西部",
    description:
      "ラブバードとも呼ばれ、パートナーへの愛情深さで知られています。鮮やかな緑色の体と桃色の顔が美しい小型インコです。野生では乾燥地帯の岩場や木の穴に営巣します。体長は約15cm、体重は40-60g程度です。",
    imageUrl:
      "https://images.unsplash.com/photo-1630493999941-772cbf1d1488?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  ボタンインコ: {
    name: "ボタンインコ",
    scientificName: "Agapornis fischeri",
    habitat: "東アフリカ",
    description:
      "コザクラインコの仲間で、目の周りの白いリング模様が特徴的です。非常に社会性が高く、つがいで行動することが多いインコです。野生ではサバンナや疎林地帯に生息しています。体長は約15cm、体重は40-55g程度です。",
    imageUrl:
      "https://images.unsplash.com/photo-1617374595976-072d1530e429?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  ヨウム: {
    name: "ヨウム",
    scientificName: "Psittacus erithacus",
    habitat: "中央アフリカの熱帯雨林",
    description:
      "知能が非常に高く、5歳児程度の認知能力を持つとされる大型インコ。灰色の体と鮮やかな赤い尾羽が特徴で、人間の言葉を理解して使い分けることができます。野生では熱帯雨林の高木に生息しています。体長は約33cm、体重は400-600g程度です。",
    imageUrl:
      "https://images.unsplash.com/photo-1626133830160-2d463a6b64a7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  オオハナインコ: {
    name: "オオハナインコ",
    scientificName: "Eclectus roratus",
    habitat: "ニューギニア、オーストラリア北部",
    description:
      "雌雄で羽色が大きく異なる珍しいインコ。オスは鮮やかな緑色、メスは赤と青紫色です。穏やかな性格で、果実を好んで食べます。野生では熱帯雨林の樹冠に生息しています。体長は約35cm、体重は380-475g程度です。",
    imageUrl:
      "https://images.unsplash.com/photo-1697789344805-bc64b0874465?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  モモイロインコ: {
    name: "モモイロインコ",
    scientificName: "Eolophus roseicapilla",
    habitat: "オーストラリア全域",
    description:
      "桃色の胸と顔、灰色の背中を持つ美しいインコ。ガラーと呼ばれることもあります。社会性が高く大きな群れを作ります。野生では草原や農地に生息し、地面で種子を食べます。体長は約35cm、体重は300-400g程度です。",
    imageUrl:
      "https://images.unsplash.com/photo-1645758940142-cebf48b4d911?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  ルリコンゴウインコ: {
    name: "ルリコンゴウインコ",
    scientificName: "Ara ararauna",
    habitat: "中南米の熱帯雨林",
    description:
      "鮮やかな青と黄色の羽色が特徴的な大型インコ。とても賢く人懐こい性格です。大きな声で鳴き、言葉を覚えることでも知られています。野生では主に果実や種子を食べ、樹上で生活します。体長は約85cm、体重は900-1300g程度です。",
    imageUrl: "https://images.unsplash.com/photo-1550700499-94bcd45b52df?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  ベニコンゴウインコ: {
    name: "ベニコンゴウインコ",
    scientificName: "Ara macao",
    habitat: "中南米の熱帯雨林",
    description:
      "鮮やかな赤・青・黄の羽色が美しい大型インコ。とても活発で、知能も高いです。長生きで、ペットとしても人気です。野生では果実やナッツを好み、熱帯雨林の樹上で大きな群れを作って暮らします。体長は約85cm、体重は900-1100g程度です。",
    imageUrl:
      "https://images.unsplash.com/photo-1708310945058-d01a27bff936?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  ハネナガインコ: {
    name: "ハネナガインコ",
    scientificName: "Psittacula eupatria",
    habitat: "南アジア～東南アジア",
    description: "長い尾羽と鮮やかな緑色の体が特徴のインコ。知能が高くおしゃべりも得意です。野生では森林や都市部の公園でも見られます。体長は約58cm、体重は200-300g程度です。",
    imageUrl: "",
  },
};

export const allParrotNames = Object.keys(parrotDetails);
