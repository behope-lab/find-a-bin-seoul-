import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Globe, ArrowRight } from 'lucide-react';
import type { SupportedLanguage, ChatMessage } from '../../types/ai';
import { AiGuideService } from '../../services/aiGuideService';
import type { WasteCategory } from '../../types/bin';

interface AiGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode?: 'tourist' | 'resident';
  onSelectCategory?: (category: WasteCategory | 'all') => void;
  initialQuery?: string;
}

// ── 모드 및 언어별 질문 칩 정의 ──
const MODE_FAQ_CHIPS: Record<
  'tourist' | 'resident',
  Record<SupportedLanguage, { label: string; query: string }[]>
> = {
  tourist: {
    ko: [
      { label: '🥤 남은 음료가 든 컵 퇴수', query: '남은 음료와 얼음이 든 테이크아웃 컵은 어떻게 버리나요?' },
      { label: '🍢 탕후루·닭꼬치 나무 막대', query: '탕후루 꼬치나 길거리 음식 나무 꼬치는 어디에 버리나요?' },
      { label: '🥡 길거리 음식 포장재·비닐', query: '양념 묻은 길거리 음식 포장재와 비닐은 어떻게 배출하나요?' },
      { label: '🌏 외국인 관광객 분리수거 수칙', query: '안국·서촌 관광 중 쓰레기통이 없을 때 어떻게 해야 하나요?' },
    ],
    en: [
      { label: '🥤 Takeout Cups & Leftover Drinks', query: 'How do I dispose of a takeout cup with leftover drink and ice?' },
      { label: '🍢 Wooden Skewers & Tanghulu', query: 'Where should I throw away wooden skewers from street food?' },
      { label: '🥡 Greasy Food Wrappers', query: 'Can sauce-stained food packaging and wraps be recycled?' },
      { label: '🌏 Foreign Traveler Rules', query: 'What should tourists do when they cannot find a trash can in Bukchon?' },
    ],
    ja: [
      { label: '🥤 飲み残しカップの処理', query: '飲み残しや氷が入ったテイクアウトカップの捨て方は？' },
      { label: '🍢 タンフルや焼き鳥の竹串', query: '屋台で食べた竹串や木串はどこに捨てればいいですか？' },
      { label: '🥡 食べ物・油のついた包装紙', query: 'ソースや油がついた屋台の容器やビニールはリサイクルできますか？' },
      { label: '🌏 観光客のゴミ分別ルール', query: '安国・北村でゴミ箱が見当たらない時はどうすればいいですか？' },
    ],
    zh: [
      { label: '🥤 外带奶茶咖啡杯倒液', query: '带有残余饮料和冰块的外带杯该怎么丢弃？' },
      { label: '🍢 糖葫芦与烤串竹签', query: '吃完的糖葫芦竹签和烤串签子属于什么垃圾？' },
      { label: '🥡 沾油小吃包装袋', query: '沾有酱料的街头小吃包装盒与油纸可以回收吗？' },
      { label: '🌏 外国游客垃圾投放须知', query: '在北村或西村街头找不到垃圾桶时该如何处理？' },
    ],
  },
  resident: {
    ko: [
      { label: '⏰ 안국·서촌 수거 시간 (일몰 후)', query: '종로구 안국·서촌 생활쓰레기 일몰 후 배출 시간대가 언제인가요?' },
      { label: '🛍️ 종량제 봉투 구매처', query: '안국역과 서촌 근처에서 종량제 봉투는 어디서 사나요?' },
      { label: '📅 재활용 품목별 배출 요일', query: '종로구 삼청·가회·효자동 재활용품 배출 요일과 수칙은 어떻게 되나요?' },
      { label: '⚠️ 토요일 배출 금지 & 과태료', query: '토요일에 쓰레기를 배출하면 과태료가 나오나요?' },
    ],
    en: [
      { label: '⏰ Sunset Collection Hours', query: 'What are the sunset garbage collection hours in Jongno-gu?' },
      { label: '🛍️ Where to Buy Trash Bags', query: 'Where can I purchase official Jongno-gu trash bags nearby?' },
      { label: '📅 Recycling Days Schedule', query: 'Which days are designated for recycling collection in Seochon?' },
      { label: '⚠️ Saturday Dumping Fines', query: 'Is dumping trash on Saturdays subject to fines in Jongno-gu?' },
    ],
    ja: [
      { label: '⏰ 収集時間帯（日没後）', query: '鍾路区安国・西村の家庭ゴミ排出時間（日没後）は何時からですか？' },
      { label: '🛍️ 規格ゴミ袋の購入場所', query: '安国駅や西村周辺で従量制ゴミ袋はどこで買えますか？' },
      { label: '📅 リサイクル品収集曜日', query: '鍾路区のリサイクルゴミ収集曜日と分別ルールを教えてください。' },
      { label: '⚠️ 土曜排出禁止と過怠金', query: '土曜日にゴミを出すと過怠金（罰金）が科せられますか？' },
    ],
    zh: [
      { label: '⏰ 门前清运时间（日落后）', query: '首尔钟路区安国与西村日落后生活垃圾投放时间是几点？' },
      { label: '🛍️ 按量垃圾袋购买点', query: '安国站或西村附近在哪里可以买到钟路区专用垃圾袋？' },
      { label: '📅 资源回收日投放规则', query: '钟路区三清洞和西村的可回收物品收集星期与规则是什么？' },
      { label: '⚠️ 周六禁投与罚款规定', query: '周六在胡同道路堆放垃圾会被罚款吗？' },
    ],
  },
};

const LANGUAGES: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: 'ko', label: 'KR', flag: '🇰🇷' },
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'ja', label: 'JP', flag: '🇯🇵' },
  { code: 'zh', label: 'CN', flag: '🇨🇳' },
];

export const AiGuideModal: React.FC<AiGuideModalProps> = ({
  isOpen,
  onClose,
  currentMode = 'tourist',
  onSelectCategory,
  initialQuery,
}) => {
  const [lang, setLang] = useState<SupportedLanguage>('ko');
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // 모드별 초기 웰컴 메시지 생성
  const getInitialMessage = (mode: 'tourist' | 'resident', language: SupportedLanguage): string => {
    if (mode === 'tourist') {
      const messages = {
        ko: '안녕하세요! 안국·서촌 관광객 전용 스마트 배출 도우미 AI입니다. 🥤 테이크아웃 컵 잔여 음료 퇴수, 🍢 탕후루 꼬치, 길거리 음식 포장재 처리 등 여행 중 쓰레기 배출법을 안내해 드립니다.',
        en: 'Hello! I am your AI Waste Guide for tourists visiting Anguk & Seochon. Ask about emptying drink cups 🥤, skewers 🍢, or sorting street food packaging!',
        ja: 'こんにちは！安国・西村の観光客向けAIゴミ分別ガイドです。🥤 テイクアウトカップの残液処理、🍢 竹串、屋台の容器包装など旅行中のゴミ捨てについてご質問ください。',
        zh: '您好！我是首尔安国与西村的游客智能垃圾分类AI向导。为您解答外带饮料杯倒液 🥤、烤串竹签 🍢 及街头小吃包装处理方法！',
      };
      return messages[language];
    } else {
      const messages = {
        ko: '안녕하세요! 안국·서촌 거주자 전용 배출 도우미 AI입니다. ⏰ 종로구 일몰 후 배출 시간대, 🛍️ 종량제 봉투 구매처, 📅 재활용 품목별 요일 안내 등을 도와드립니다.',
        en: 'Welcome! I am your Resident Waste AI Guide for Anguk & Seochon. Ask about sunset collection hours, Jongnyangje bags, and recycling schedules in Jongno-gu.',
        ja: 'こんにちは！安国・西村の居住者向けAIガイドです。⏰ 日没後のゴミ出し時間、🛍️ 規格ゴミ袋の購入場所、📅 リサイクル品収集曜日などをご案内します。',
        zh: '您好！我是钟路区安国与西村居民生活垃圾分类AI向导。为您解答日落后投放时间、标准垃圾袋购买及可回收物品指定收集日！',
      };
      return messages[language];
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      sender: 'assistant',
      text: getInitialMessage(currentMode, 'ko'),
      timestamp: '방금 전',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialHandledRef = useRef<string | null>(null);

  // 모드나 언어가 변경되었을 때 초기 메시지 동기화
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'init-msg') {
        return [
          {
            id: 'init-msg',
            sender: 'assistant',
            text: getInitialMessage(currentMode, lang),
            timestamp: '방금 전',
          },
        ];
      }
      return prev;
    });
  }, [currentMode, lang]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      if (initialQuery && initialHandledRef.current !== initialQuery) {
        initialHandledRef.current = initialQuery;
        handleSendMessage(initialQuery);
      }
    } else {
      initialHandledRef.current = null;
    }
  }, [isOpen, initialQuery]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    try {
      // mode와 lang 전달
      const response = await AiGuideService.askAiGuide(trimmed, lang, currentMode);

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: response.recommendedCategory
          ? [
              {
                label: `지도에서 ${
                  response.recommendedCategory === 'liquid'
                    ? '💧 음료 퇴수함'
                    : response.recommendedCategory === 'disposable'
                      ? '🥤 일회용 컵 수거함'
                      : '해당 쓰레기통'
                } 찾기`,
                actionType: 'find_bin',
                payload: response.recommendedCategory,
              },
            ]
          : undefined,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text:
            lang === 'ko'
              ? '일시적인 오류가 발생했습니다. 잠시 후 다시 질문해 주세요.'
              : 'An error occurred. Please try again in a moment.',
          timestamp: '방금 전',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCategoryAction = (payload?: string) => {
    if (payload && onSelectCategory) {
      const cat = payload as WasteCategory;
      onSelectCategory(cat);
      onClose();
    }
  };

  // 현재 모드와 언어에 따른 추천 질문 칩
  const currentChips = MODE_FAQ_CHIPS[currentMode][lang] || MODE_FAQ_CHIPS[currentMode].ko;

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border-t sm:border border-slate-700/80 rounded-t-[28px] sm:rounded-3xl w-full max-w-lg shadow-2xl flex flex-col h-[82vh] sm:h-[620px] max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모바일 손잡이 */}
        <div className="sm:hidden w-full flex justify-center pt-2.5 pb-1 bg-slate-950/80">
          <div className="w-10 h-1 rounded-full bg-slate-700" />
        </div>

        {/* 상단 모달 헤더 */}
        <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-md ${
                currentMode === 'tourist'
                  ? 'bg-gradient-to-tr from-indigo-600 to-indigo-400 shadow-indigo-500/20'
                  : 'bg-gradient-to-tr from-amber-600 to-amber-400 shadow-amber-500/20'
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm sm:text-base font-bold text-white">다국어 배출 안내 AI</h2>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                    currentMode === 'tourist'
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}
                >
                  {currentMode === 'tourist' ? '관광객 모드' : '거주자 모드'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {currentMode === 'tourist'
                  ? '테이크아웃 컵·길거리 음식 수칙 안내'
                  : '종로구 안국·서촌 수거 요일 & 봉투 안내'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* 언어 스위처 [ 🇰🇷 KR | 🇺🇸 EN | 🇯🇵 JP | 🇨🇳 CN ] */}
            <div className="flex items-center bg-slate-800/90 rounded-xl p-0.5 border border-slate-700">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
              <div className="flex items-center gap-0.5">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`px-1.5 py-1 text-[10px] font-bold rounded-lg transition-all flex items-center gap-0.5 ${
                      lang === l.code
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── 모드별 동적 FAQ 추천 질문 칩 ── */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto flex items-center space-x-2 scrollbar-none">
          <span className="text-[11px] text-indigo-400 font-semibold flex-shrink-0 flex items-center">
            {currentMode === 'tourist' ? '🎒 관광객 추천 질문:' : '🏠 거주자 추천 질문:'}
          </span>
          {currentChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip.query)}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-200 border border-slate-700/70 hover:border-indigo-500/50 whitespace-nowrap transition-all flex items-center gap-1 shadow-sm active:scale-95"
            >
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        {/* 대화 내용 영역 */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-900/60">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20'
                      : 'bg-slate-800/95 text-slate-200 rounded-tl-none border border-slate-700/80 shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* AI 답변 내 액션 버튼 (지도 쓰레기통 필터 연동) */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleCategoryAction(action.payload)}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-sm"
                        >
                          <span>{action.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}

                  <span
                    className={`block text-[10px] mt-1 ${
                      isUser ? 'text-indigo-200 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-700/50 border border-indigo-500/40 flex items-center justify-center text-indigo-200 flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center space-x-2 text-xs text-slate-400 italic">
              <div className="w-6 h-6 rounded-lg bg-indigo-600/30 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
              </div>
              <span>AI가 종로구 배출 규정을 확인하고 있습니다...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 하단 질문 입력 바 */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputQuery);
          }}
          className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={
              currentMode === 'tourist'
                ? '관광객 질문 입력 (예: 커피 컵, 탕후루 꼬치, 잔여 음료)...'
                : '거주자 질문 입력 (예: 오늘 배출 시간, 종량제 봉투 구매처)...'
            }
            className="flex-1 bg-slate-800/90 text-slate-200 placeholder-slate-400 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all shadow-md shadow-indigo-600/20 flex-shrink-0"
            aria-label="전송"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
export default AiGuideModal;
