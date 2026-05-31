import { sortJapanese } from "@/lib/utils/sortJa";

export interface ParrotDetail {
  name: string;
  englishName: string;
  habitat: string;
  description: string;
  imageUrl: string;
}

export const DEFAULT_PARROT_IMAGE_URL =
  "https://images.unsplash.com/vector-1778048385295-f73e72f68161?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export const getParrotImageUrl = (imageUrl: string): string => {
  return imageUrl || DEFAULT_PARROT_IMAGE_URL;
};

export const parrotDetails: Record<string, ParrotDetail> = {
  セキセイインコ: {
    name: "セキセイインコ",
    englishName: "Budgerigar",
    habitat: "オーストラリア内陸部",
    description:
      "小型で人懐っこく、初心者にも飼いやすい人気のインコ。おしゃべりが得意で、言葉を覚えることができます。野生では大群で生活し、草原や低木地帯に生息しています。体長は約18cm、体重は30-40g程度です。",
    imageUrl:
      "https://images.unsplash.com/photo-1703319960774-9b5965701b29?q=80&w=2573&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  オカメインコ: {
    name: "オカメインコ",
    englishName: "Cockatiel",
    habitat: "オーストラリア内陸部",
    description:
      "頭部の冠羽と頬の赤い斑点が特徴的なインコ。穏やかで人懐っこい性格で、口笛を覚えるのが得意です。野生では水場の近くの木に群れで生息しています。体長は約30-35cm、体重は80-100g程度です。",
    imageUrl:
      "https://images.unsplash.com/photo-1644319037301-26243bed1485?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  コザクラインコ: {
    name: "コザクラインコ",
    englishName: "Rosy-faced Lovebird",
    habitat: "アフリカ南西部",
    description:
      "ラブバードとも呼ばれ、パートナーへの愛情深さで知られています。鮮やかな緑色の体と桃色の顔が美しい小型インコです。野生では乾燥地帯の岩場や木の穴に営巣します。体長は約15cm、体重は40-60g程度です。",
    imageUrl:
      "https://images.unsplash.com/photo-1630493999941-772cbf1d1488?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  コガネメキシコインコ: {
    name: "コガネメキシコインコ",
    englishName: "Golden Conure",
    habitat: "ブラジル",
    description:
      "全身が黄金色に輝く美しい中型インコ。穏やかで社交的な性格で、鳥カフェでも人気です。野生では低地の森林に生息し、果実や種子を食べます。体長は約34cm、体重は270-400g程度です。",
    imageUrl:
      "https://images.unsplash.com/photo-1602027439122-724dff5d9bc7?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  コミドリコンゴウインコ: {
    name: "コミドリコンゴウインコ",
    englishName: "Red-shouldered Macaw",
    habitat: "中南米",
    description:
      "緑色の体に赤い額と青い羽が特徴の大型インコ。知能が高く、言葉を覚えることもできます。野生では熱帯雨林や乾燥林に生息し、果実やナッツを食べます。体長は約70cm、体重は900-1100g程度です。",
    imageUrl: "",
  },
  サザナミインコ: {
    name: "サザナミインコ",
    englishName: "Lineolated Parakeet",
    habitat: "オーストラリア",
    description:
      "落ち着いた色合いの小型インコ。穏やかで静かな性格で、初心者にも飼いやすいとされています。野生では乾燥地帯の低木地帯に生息し、地面近くで種子を食べます。体長は約19cm、体重は40-50g程度です。",
    imageUrl: "",
  },
  シロハラインコ: {
    name: "シロハラインコ",
    englishName: "White-bellied Caique",
    habitat: "東南アジア",
    description:
      "頭部が灰色で体が緑色の中型インコ。穏やかな性格で、おしゃべりも比較的得意です。野生では森林や農地に生息し、果実や種子を食べます。体長は約38cm、体重は150-200g程度です。",
    imageUrl:
      "https://images.unsplash.com/photo-1636304836048-4b251df6131c?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  ズグロシロハラインコ: {
    name: "ズグロシロハラインコ",
    englishName: "Black-headed Caique",
    habitat: "南米の熱帯雨林",
    description:
      "頭部が黒く、胸がオレンジ色のカイケ属のインコ。人懐っこく活発な性格で、鳥カフェでもよく見られます。野生では低〜中層の森林に生息します。体長は約23cm、体重は130-170g程度です。",
    imageUrl:
      "https://images.unsplash.com/photo-1711655778781-605663a03c3b?q=80&w=2526&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  タイハクオウム: {
    name: "タイハクオウム",
    englishName: "Umbrella Cockatoo",
    habitat: "インドネシア",
    description:
      "頭頂部の大きな白色の冠羽が特徴的な大型オウム。知能が高く、感情表現も豊かです。野生では低地の森林に生息し、果実や種子を食べます。体長は約46cm、体重は550-700g程度です。",
    imageUrl:
      "https://images.unsplash.com/photo-1618999385326-b98e613ea109?q=80&w=1718&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  ボタンインコ: {
    name: "ボタンインコ",
    englishName: "Fischer's Lovebird",
    habitat: "東アフリカ",
    description:
      "コザクラインコの仲間で、目の周りの白いリング模様が特徴的です。非常に社会性が高く、つがいで行動することが多いインコです。野生ではサバンナや疎林地帯に生息しています。体長は約15cm、体重は40-55g程度です。",
    imageUrl:
      "https://images.unsplash.com/photo-1617374595976-072d1530e429?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  ボウシインコ: {
    name: "ボウシインコ",
    englishName: "Amazon parrot",
    habitat: "ニュージーランド",
    description: "頭部の赤い冠羽が特徴の小型インコ。カカリキとも呼ばれ、穏やかで人懐っこい性格です。野生では森林や低木地帯に生息しています。体長は約27cm、体重は50-60g程度です。",
    imageUrl:
      "https://images.unsplash.com/photo-1751024494405-68bcbc76a608?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  ヒインコ: {
    name: "ヒインコ",
    englishName: "Red Lory",
    habitat: "南米の熱帯雨林",
    description: "胸元の鮮やかな赤色が特徴的な小型インコ。活発で好奇心旺盛な性格です。野生では低〜中層の森林に生息し、果実や種子を食べます。体長は約24cm、体重は60-80g程度です。",
    imageUrl:
      "https://images.unsplash.com/photo-1771643234438-4285a686f543?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  ヨウム: {
    name: "ヨウム",
    englishName: "African Grey Parrot",
    habitat: "中央アフリカの熱帯雨林",
    description:
      "知能が非常に高く、5歳児程度の認知能力を持つとされる大型インコ。灰色の体と鮮やかな赤い尾羽が特徴で、人間の言葉を理解して使い分けることができます。野生では熱帯雨林の高木に生息しています。体長は約33cm、体重は400-600g程度です。",
    imageUrl:
      "https://images.unsplash.com/photo-1626133830160-2d463a6b64a7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  オオハナインコ: {
    name: "オオハナインコ",
    englishName: "Eclectus Parrot",
    habitat: "ニューギニア、オーストラリア北部",
    description:
      "雌雄で羽色が大きく異なる珍しいインコ。オスは鮮やかな緑色、メスは赤と青紫色です。穏やかな性格で、果実を好んで食べます。野生では熱帯雨林の樹冠に生息しています。体長は約35cm、体重は380-475g程度です。",
    imageUrl:
      "https://images.unsplash.com/photo-1697789344805-bc64b0874465?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  ウロコインコ: {
    name: "ウロコインコ",
    englishName: "Conure",
    habitat: "中南米",
    description:
      "頭部に鱗状の模様がある中型インコ。穏やかで静かな性格で、ペットとしても人気です。野生では森林や農地に生息し、果実や種子を食べます。体長は約29cm、体重は200-280g程度です。",
    imageUrl:
      "https://images.unsplash.com/photo-1692317023059-499bf304ef55?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  モモイロインコ: {
    name: "モモイロインコ",
    englishName: "Galah",
    habitat: "オーストラリア全域",
    description:
      "桃色の胸と顔、灰色の背中を持つ美しいインコ。ガラーと呼ばれることもあります。社会性が高く大きな群れを作ります。野生では草原や農地に生息し、地面で種子を食べます。体長は約35cm、体重は300-400g程度です。",
    imageUrl:
      "https://images.unsplash.com/photo-1645758940142-cebf48b4d911?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  ミドリコンゴウインコ: {
    name: "ミドリコンゴウインコ",
    englishName: "Great Green Macaw",
    habitat: "中南米の熱帯雨林",
    description:
      "全身が緑色の大型インコ。ルリコンゴウインコに次ぐ大型種で、知能が高く人懐っこい個体も多いです。野生では高木の樹洞に営巣し、果実やナッツを食べます。体長は約85cm、体重は1000-1300g程度です。",
    imageUrl:
      "https://images.unsplash.com/photo-1775507387052-0ec8e2540a51?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  ルリゴシボタンインコ: {
    name: "ルリゴシボタンインコ",
    englishName: "Fischer's Lovebird",
    habitat: "オーストラリア",
    description:
      "オスは緑色の体に赤い腰羽、メスは緑色一色の小型インコ。穏やかで比較的静かな性格です。野生では開けた森林や草地に生息し、地面で種子を食べます。体長は約28cm、体重は50-70g程度です。",
    imageUrl: "",
  },
  ルリコンゴウインコ: {
    name: "ルリコンゴウインコ",
    englishName: "Blue-and-yellow Macaw",
    habitat: "中南米の熱帯雨林",
    description:
      "鮮やかな青と黄色の羽色が特徴的な大型インコ。とても賢く人懐こい性格です。大きな声で鳴き、言葉を覚えることでも知られています。野生では主に果実や種子を食べ、樹上で生活します。体長は約85cm、体重は900-1300g程度です。",
    imageUrl: "https://images.unsplash.com/photo-1550700499-94bcd45b52df?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  ベニコンゴウインコ: {
    name: "ベニコンゴウインコ",
    englishName: "Scarlet Macaw",
    habitat: "中南米の熱帯雨林",
    description:
      "鮮やかな赤・青・黄の羽色が美しい大型インコ。とても活発で、知能も高いです。長生きで、ペットとしても人気です。野生では果実やナッツを好み、熱帯雨林の樹上で大きな群れを作って暮らします。体長は約85cm、体重は900-1100g程度です。",
    imageUrl:
      "https://images.unsplash.com/photo-1708310945058-d01a27bff936?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  ハネナガインコ: {
    name: "ハネナガインコ",
    englishName: "Brown-necked Parrot",
    habitat: "南アジア～東南アジア",
    description: "長い尾羽と鮮やかな緑色の体が特徴のインコ。知能が高くおしゃべりも得意です。野生では森林や都市部の公園でも見られます。体長は約58cm、体重は200-300g程度です。",
    imageUrl: "",
  },
  白文鳥: {
    name: "白文鳥",
    englishName: "Society Finch",
    habitat: "改良品種（世界各地）",
    description:
      "インコではなくキンパラ属の文鳥の改良品種です。白い羽色が特徴で、穏やかで群れで行動することが多い鳥です。鳥カフェでもよく見られ、小型で扱いやすいことから人気があります。体長は約10-12cm程度です。",
    imageUrl: "",
  },
  桜文鳥: {
    name: "桜文鳥",
    englishName: "Bengalese Finch",
    habitat: "インド・スリランカ（改良品種）",
    description:
      "インコではなくキンパラ属の文鳥の改良品種です。淡い茶色の羽色が桜の花に例えられて名付けられました。穏やかで小型の鳥で、鳥カフェでも人気があります。体長は約12-13cm程度です。",
    imageUrl:
      "https://images.unsplash.com/photo-1656533502228-271e24fd151e?q=80&w=1293&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
};

export const allParrotNames = sortJapanese(Object.keys(parrotDetails));
