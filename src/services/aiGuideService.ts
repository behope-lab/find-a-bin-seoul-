import type { SupportedLanguage } from '../types/ai';

export interface AiResponse {
  answer: string;
  recommendedCategory?: 'general' | 'recycle' | 'disposable' | 'cigarette' | 'liquid';
  relatedTips?: string[];
}

export class AiGuideService {
  /**
   * 모드(관광객 vs 거주자) 및 언어에 따른 지능형 AI 답변
   */
  public static async askAiGuide(
    question: string,
    lang: SupportedLanguage = 'ko',
    mode: 'tourist' | 'resident' = 'tourist'
  ): Promise<AiResponse> {
    const qLower = question.toLowerCase();

    // 1. 일회용 플라스틱 컵 / 커피 / 음료 / 얼음 퇴수
    if (
      qLower.includes('컵') ||
      qLower.includes('커피') ||
      qLower.includes('얼음') ||
      qLower.includes('음료') ||
      qLower.includes('퇴수') ||
      qLower.includes('cup') ||
      qLower.includes('coffee') ||
      qLower.includes('drink') ||
      qLower.includes('ice') ||
      qLower.includes('liquid')
    ) {
      return this.getCupResponse(lang);
    }

    // 2. 꼬치류 / 탕후루 / 닭꼬치
    if (
      qLower.includes('꼬치') ||
      qLower.includes('탕후루') ||
      qLower.includes('나무') ||
      qLower.includes('skewer') ||
      qLower.includes('stick') ||
      qLower.includes('tanghulu')
    ) {
      return this.getSkewerResponse(lang);
    }

    // 3. 길거리 음식 포장재 / 비닐 / 기름종이
    if (
      qLower.includes('포장') ||
      qLower.includes('비닐') ||
      qLower.includes('길거리') ||
      qLower.includes('기름종이') ||
      qLower.includes('packaging') ||
      qLower.includes('wrapper') ||
      qLower.includes('street food')
    ) {
      return this.getStreetFoodPackagingResponse(lang);
    }

    // 4. 종로구 안국·서촌 수거 시간대 / 일몰 후 배출 / 배출 요일
    if (
      qLower.includes('시간') ||
      qLower.includes('일몰') ||
      qLower.includes('요일') ||
      qLower.includes('수거') ||
      qLower.includes('schedule') ||
      qLower.includes('time') ||
      qLower.includes('collection') ||
      qLower.includes('sunset')
    ) {
      return this.getResidentScheduleResponse(lang);
    }

    // 5. 종량제 봉투 구매처 / 편의점 봉투
    if (
      qLower.includes('종량제') ||
      qLower.includes('봉투') ||
      qLower.includes('구매') ||
      qLower.includes('편의점') ||
      qLower.includes('bag') ||
      qLower.includes('trash bag') ||
      qLower.includes('where to buy')
    ) {
      return this.getTrashBagResponse(lang);
    }

    // 6. 재활용 품목별 배출 / 페트병 / 캔
    if (
      qLower.includes('재활용') ||
      qLower.includes('페트') ||
      qLower.includes('캔') ||
      qLower.includes('플라스틱') ||
      qLower.includes('병') ||
      qLower.includes('recycle') ||
      qLower.includes('plastic') ||
      qLower.includes('bottle')
    ) {
      return this.getRecycleResponse(lang);
    }

    // 7. 무단투기 과태료 / 벌금
    if (
      qLower.includes('과태료') ||
      qLower.includes('벌금') ||
      qLower.includes('fine') ||
      qLower.includes('penalty')
    ) {
      return this.getFineResponse(lang);
    }

    // 기본 가이드 응답 (모드 반영)
    return this.getDefaultResponse(lang, mode);
  }

  private static getCupResponse(lang: SupportedLanguage): AiResponse {
    const responses = {
      ko: {
        answer: '테이크아웃 일회용 컵은 **남은 음료와 얼음을 반드시 먼저 비운 후** 배출해야 합니다.\n지도에서 💧 [액체 퇴수 가능] 뱃지가 붙은 스마트 쓰레기통을 찾으면 남은 음료수를 버릴 수 있습니다. 비운 플라스틱 컵과 빨대는 재활용함에 버려주세요.',
        tips: ['홀더(종이)는 종이류, 플라스틱 컵과 뚜껑은 플라스틱류로 분리하면 더욱 좋습니다.'],
      },
      en: {
        answer: 'Takeout cups must have **all remaining liquid and ice emptied first** before disposal!\nLook for bins on the map with the 💧 [Liquid Drain] badge to discard leftover drinks. After draining, place the plastic cup in the recyclables bin.',
        tips: ['Paper sleeves go into Paper, while plastic cups and straws go into Plastic.'],
      },
      ja: {
        answer: 'テイクアウトの使い捨てカップは、**必ず残った飲み物と氷を捨ててから**分別してください。\n地図上の 💧 [液体排水可能] バッジが付いたゴミ箱で液体を処理できます。空になったカップ本体はリサイクル用ゴミ箱に捨ててください。',
        tips: ['紙のスリーブは紙類へ、プラスチックの蓋とストローはプラスチックへ。'],
      },
      zh: {
        answer: '外带一次性饮料杯在丢弃前，**必须先将剩余饮料和冰块倒掉**！\n请在地图上寻找带有 💧 [可倒液体] 标识的智能垃圾桶排空液体。空杯请投入塑料可回收垃圾桶。',
        tips: ['纸质杯套投入纸类，塑料杯盖和吸管投入塑料类。'],
      },
    };
    return {
      answer: responses[lang].answer,
      recommendedCategory: 'liquid',
      relatedTips: responses[lang].tips,
    };
  }

  private static getSkewerResponse(lang: SupportedLanguage): AiResponse {
    const responses = {
      ko: {
        answer: '탕후루나 길거리 음식의 나무 꼬치는 재활용이 되지 않으며, 종량제 봉투를 찢거나 보행자를 다치게 할 수 있어 **[일반 쓰레기]**로 배출해야 합니다.\n뾰족한 끝부분을 반으로 부러뜨려 일반 쓰레기통에 넣어주세요.',
        tips: ['길거리 화단이나 골목길에 꽂아두지 마시고 반드시 쓰레기통에 버려주세요.'],
      },
      en: {
        answer: 'Wooden skewers from street food (like tanghulu) are NOT recyclable and must be thrown in **[General Waste]**.\nPlease snap the sharp pointed tip in half before tossing it into a trash bin for pedestrian safety.',
        tips: ['Never stick skewers into street planters or alleys.'],
      },
      ja: {
        answer: 'タンフルや屋台料理の竹串・木串はリサイクルできません。**[一般ゴミ]**として廃棄してください。\nゴミ袋を破いたり歩行者が怪我をしないよう、先端を折ってからゴミ箱に入れてください。',
        tips: ['道端の花壇や路地に放置せず、必ず一般ゴミ箱に捨ててください。'],
      },
      zh: {
        answer: '糖葫芦或街头小吃的竹签不能回收，必须投入 **[一般垃圾 (General Waste)]**。\n丢弃前请折断尖锐的尖端，以免刺破垃圾袋或伤及路人。',
        tips: ['切勿将竹签插在路边花坛或胡同角落，请务必投入垃圾桶。'],
      },
    };
    return {
      answer: responses[lang].answer,
      recommendedCategory: 'general',
      relatedTips: responses[lang].tips,
    };
  }

  private static getStreetFoodPackagingResponse(lang: SupportedLanguage): AiResponse {
    const responses = {
      ko: {
        answer: '음식물이나 기름이 묻은 포장재(핫도그 트레이, 떡볶이 용기, 기름종이 비닐 등)는 재활용이 불가능하므로 **[일반 쓰레기]**로 배출해야 합니다.\n깨끗이 세척된 투명 비닐봉투만 비닐류 재활용이 가능합니다.',
        tips: ['양념이나 국물은 휴지로 닦아 일반 쓰레기로 함께 배출해 주세요.'],
      },
      en: {
        answer: 'Packaging stained with food, sauces, or grease (hotdog trays, tteokbokki cups, greasy wraps) CANNOT be recycled and belongs in **[General Waste]**.\nOnly clean, unstained plastic wraps can be recycled as plastics.',
        tips: ['Wipe away food remnants before tossing into general waste.'],
      },
      ja: {
        answer: '油や食べ物の汚れがついた包装紙・トレイ・ビニールはリサイクルできません。**[一般ゴミ]**に廃棄してください。\n汚れのない透明なビニール袋のみプラスチック・ビニール類としてリサイクル可能です。',
        tips: ['タレや油分がついているものは一般ゴミ箱へ。'],
      },
      zh: {
        answer: '沾有食物油脂或酱料的包装盒、纸托和油纸属于不可回收物，必须投入 **[一般垃圾]**。\n只有清洗干净且无污渍的透明塑料薄膜才可投入塑料回收箱。',
        tips: ['带有浓重油污的包装请直接作为一般垃圾丢弃。'],
      },
    };
    return {
      answer: responses[lang].answer,
      recommendedCategory: 'general',
      relatedTips: responses[lang].tips,
    };
  }

  private static getResidentScheduleResponse(lang: SupportedLanguage): AiResponse {
    const responses = {
      ko: {
        answer: '종로구 삼청·가회·효자·사직동(안국·서촌 일대) 거주자 생활쓰레기 배출 시간은 **[일요일, 화요일, 목요일 18:00 ~ 24:00 (일몰 후)]** 입니다.\n낮 시간대나 토요일 배출은 엄격히 금지되며, 내 집·내 점포 바로 앞 문전에 내놓으셔야 합니다.',
        tips: ['수거 작업 시간: 익일 04:00 이전', '주말(토요일) 배출 시 골목길 방치로 과태료 부과 대상이 됩니다.'],
      },
      en: {
        answer: 'In Jongno-gu (Anguk, Bukchon, Seochon), residential garbage is collected on **[Sunday, Tuesday, Thursday from 18:00 to 24:00 (after sunset)]**.\nPlacing trash out during daytime or on Saturdays is strictly forbidden. Place directly in front of your doorstep.',
        tips: ['Collection finishes before 04:00 next morning', 'Do not dump trash in alleys or around public street bins.'],
      },
      ja: {
        answer: '鍾路区（安国・北村・西村）の家庭ゴミ排出時間帯は **[日・火・木曜日 18:00〜24:00（日没後）]** です。\n昼間や土曜日の排出は固く禁止されており、必ず自宅や店舗の玄関前に出してください。',
        tips: ['回収完了時間：翌朝 04:00 前', '土曜日は回収がありませんので路地に放置しないでください。'],
      },
      zh: {
        answer: '首尔钟路区（安国、北村、西村）居民生活垃圾投放时间为 **[周日、周二、周四 18:00 ~ 24:00（日落后）]**。\n严禁在白天或周六提前将垃圾堆放在胡同路面上，必须摆放在自家门前。',
        tips: ['环卫清运时间：次日凌晨 04:00 前', '周六不收垃圾，切勿提前堆放。'],
      },
    };
    return {
      answer: responses[lang].answer,
      relatedTips: responses[lang].tips,
    };
  }

  private static getTrashBagResponse(lang: SupportedLanguage): AiResponse {
    const responses = {
      ko: {
        answer: '종로구 규격 종량제 봉투는 안국역과 서촌 주변의 **모든 편의점(CU, GS25, 세븐일레븐 등) 및 마트 카운터**에서 낱장으로 구매하실 수 있습니다.\n"종로구 일반 쓰레기 봉투(5L, 10L, 20L)" 또는 "음식물 쓰레기 봉투"를 요청하시면 됩니다.',
        tips: ['타 자치구(예: 마포구, 중구) 봉투는 종로구에서 수거되지 않으니 반드시 종로구 전용 봉투를 사용하세요.'],
      },
      en: {
        answer: 'Standard Jongno-gu volume-based trash bags can be purchased individually at the counter of **any nearby convenience store (CU, GS25, 7-Eleven)**.\nAsk the staff for "Jongno-gu general trash bag" (5L, 10L, 20L).',
        tips: ['Bags from other districts cannot be collected in Jongno-gu.'],
      },
      ja: {
        answer: '規格ゴミ袋（従量制袋）は、安国・西村周辺の**すべてのコンビニ（CU、GS25、セブンイレブンなど）**のレジで1枚から購入できます。\n「鍾路区（チョンノグ）の一般ゴミ袋」をお求めください。',
        tips: ['他の区のゴミ袋は鍾路区では回収されませんのでご注意ください。'],
      },
      zh: {
        answer: '首尔钟路区标准垃圾袋可在附近的**所有便利店（CU、GS25、7-Eleven）收银台**按单张购买。\n直接向店员索取“钟路区一般垃圾袋（5升、10升、20升）”即可。',
        tips: ['其他行政区（如中区、麻浦区）的垃圾袋在钟路区无法收运。'],
      },
    };
    return {
      answer: responses[lang].answer,
      relatedTips: responses[lang].tips,
    };
  }

  private static getRecycleResponse(lang: SupportedLanguage): AiResponse {
    const responses = {
      ko: {
        answer: '종로구 재활용품 배출 수칙:\n1. **투명 페트병**: 라벨 제거 후 압착하여 뚜껑 닫기\n2. **캔·유리병**: 내용물을 물로 세척 후 배출\n3. **비닐류**: 이물질 없는 깨끗한 비닐만 투명 봉투에 모아 배출\n배출 요일(일·화·목 18:00~24:00)에 맞춰 투명/반투명 봉투에 담아 문전에 내놓으세요.',
        tips: ['음식물이 묻은 비닐이나 스티로폼은 일반 종량제 봉투에 버리셔야 합니다.'],
      },
      en: {
        answer: 'Jongno-gu Recycling Rules:\n1. **Clear Plastic Bottles**: Empty, peel off labels, flatten, and cap tightly.\n2. **Cans & Glass**: Rinse clean before disposal.\n3. **Plastics/Vinyl**: Gather clean wraps into a transparent bag.\nPut out on designated days (Sun, Tue, Thu 18:00~24:00).',
        tips: ['Food-stained wraps must be placed in general trash bags.'],
      },
      ja: {
        answer: '鍾路区のリサイクル分別ルール：\n1. **透明ペットボトル**：中身をすすぎ、ラベルを剥がして潰し、蓋を閉める。\n2. **缶・ビン**：中身を水ですすいで排出。\n3. **ビニール類**：汚れのないものを透明袋にまとめて排出。\n指定曜日（日・火・木 18:00〜24:00）に門前に出してください。',
        tips: ['汚れの落ちないビニールや発泡スチロールは一般ゴミ袋へ。'],
      },
      zh: {
        answer: '钟路区资源回收规则：\n1. **透明塑料瓶**：倒空并清洗，撕下塑料标签，压扁后拧紧瓶盖。\n2. **易拉罐/玻璃瓶**：冲洗干净后投放。\n3. **塑料袋类**：干净无油污的塑料袋装入透明袋中。\n在规定投放时间（周日、周二、周四 18:00~24:00）置于自家门前。',
        tips: ['无法洗净的油污塑料请放入一般按量垃圾袋。'],
      },
    };
    return {
      answer: responses[lang].answer,
      recommendedCategory: 'recycle',
      relatedTips: responses[lang].tips,
    };
  }

  private static getFineResponse(lang: SupportedLanguage): AiResponse {
    const responses = {
      ko: {
        answer: '종로구 생활쓰레기 무단 투기 및 배출 시간 위반 시 폐기물관리법에 따라 **최대 10만 원 ~ 20만 원의 과태료**가 부과됩니다.\n특히 토요일이나 일요일 낮 시간 골목길 투기는 집중 단속 구역입니다.',
        tips: ['CCTV 및 주민 신고로 단속되니 정해진 시간(일몰 후)과 장소(문전)를 지켜주세요.'],
      },
      en: {
        answer: 'Illegal waste disposal or violating collection hours in Jongno-gu can incur **fines between 100,000 and 200,000 KRW** under the Waste Management Act.\nDaytime and Saturday dumping in alleys is strictly monitored by CCTV.',
        tips: ['Always use official bags and respect the sunset disposal hours.'],
      },
      ja: {
        answer: 'ゴミの不法投棄や排出時間違反には、廃棄物管理法に基づき**10万〜20万ウォンの過怠金**が科せられます。\n特に昼間や土曜日の路地への投棄はCCTVで重点的に取り締まられています。',
        tips: ['指定時間（日没後）と戸別回収場所を遵守してください。'],
      },
      zh: {
        answer: '在钟路区违反投放时间或非法乱倒垃圾，将根据韩国《废弃物管理法》被处以 **10万至20万韩元罚款**。\n胡同内白天及周六堆放垃圾属于重点监控取缔对象。',
        tips: ['胡同内设有高清监控探头，请务必按时门前投放。'],
      },
    };
    return {
      answer: responses[lang].answer,
      relatedTips: responses[lang].tips,
    };
  }

  private static getDefaultResponse(
    lang: SupportedLanguage,
    mode: 'tourist' | 'resident'
  ): AiResponse {
    if (mode === 'tourist') {
      const touristResponses = {
        ko: {
          answer: '관광객 모드 AI 도우미입니다! 🥤 테이크아웃 컵 남은 음료 퇴수, 🍢 탕후루 꼬치 버리는 법, 길거리 음식 포장재 분리수거 등 여행 중 쓰레기 처리에 대해 물어보세요!',
          tips: ['상단 지도에서 💧 액체 퇴수 뱃지가 있는 쓰레기통을 누르면 남은 음료를 버릴 수 있습니다.'],
        },
        en: {
          answer: 'Tourist Mode AI Guide! Ask about draining takeout cups 🥤, wooden skewers 🍢, street food wrappers, or finding nearby public bins!',
          tips: ['Check the map for bins with the 💧 Liquid Drain icon to empty your drink.'],
        },
        ja: {
          answer: '観光客モードAIガイドです！🥤 テイクアウトカップの残液処理、🍢 竹串の捨て方、屋台の包装容器など、旅行中のゴミ捨てについて何でもご質問ください！',
          tips: ['地図上の 💧 液体排水バッジがあるゴミ箱で飲み残しを処理できます。'],
        },
        zh: {
          answer: '游客模式AI向导！欢迎咨询外带饮料杯倒液 🥤、烤串竹签丢弃 🍢、街头小吃包装处理或附近公共垃圾桶导航！',
          tips: ['在地图上点击带有 💧 可倒液体标识的垃圾桶即可排空残饮。'],
        },
      };
      return { answer: touristResponses[lang].answer, relatedTips: touristResponses[lang].tips };
    } else {
      const residentResponses = {
        ko: {
          answer: '거주자 모드 AI 도우미입니다! ⏰ 종로구 삼청·가회·효자·사직동 배출 요일(일·화·목 18:00~24:00), 🛍️ 종량제 봉투 구매처, ♻️ 품목별 문전 배출 규정에 대해 안내해 드립니다.',
          tips: ['토요일 및 낮 시간 골목길 배출은 과태료 부과 대상입니다.'],
        },
        en: {
          answer: 'Resident Mode AI Guide! Inquire about Jongno-gu collection schedules (Sun/Tue/Thu 18:00~24:00), purchasing Jongnyangje bags, or curbside recycling rules.',
          tips: ['Dumping trash in alleys on Saturdays or during daytime incurs fines.'],
        },
        ja: {
          answer: '居住者モードAIガイドです！⏰ 鍾路区の収集曜日（日・火・木 18:00〜24:00）、🛍️ 従量制ゴミ袋の購入方法、♻️ リサイクル品の戸別排出規則をご案内します。',
          tips: ['土曜日および昼間の路地放置は過怠金対象です。'],
        },
        zh: {
          answer: '居民模式AI向导！为您解答钟路区投放时间（周日/周二/周四 18:00~24:00）、标准按量垃圾袋购买点及门前分类投放规则。',
          tips: ['周六及白天在胡同提前堆放垃圾将被罚款。'],
        },
      };
      return { answer: residentResponses[lang].answer, relatedTips: residentResponses[lang].tips };
    }
  }
}
