import React from 'react';
import { X, MapPin, ExternalLink } from 'lucide-react';
import type { Coordinates } from '../../types/bin';

interface ExternalMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  spotName: string;
  coordinates: Coordinates;
}

export const ExternalMapModal: React.FC<ExternalMapModalProps> = ({
  isOpen,
  onClose,
  spotName,
  coordinates,
}) => {
  if (!isOpen) return null;

  const { lat, lng } = coordinates;
  const encodedName = encodeURIComponent(spotName);

  // 1. 카카오맵 딥링크 URL
  const kakaoMapUrl = `https://map.kakao.com/link/to/${encodedName},${lat},${lng}`;

  // 2. 구글맵 딥링크 URL
  const googleMapUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm mx-3 mb-4 sm:mb-0 bg-slate-900 border border-slate-700/80 rounded-3xl p-5 shadow-2xl shadow-black/80 animate-in slide-in-from-bottom-5 duration-300 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>🗺️ 큰 지도로 길찾기</span>
              </h3>
              <p className="text-[11px] text-slate-400 truncate max-w-[190px]">
                {spotName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 목적지 정보 */}
        <div className="my-3.5 px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
          <div className="text-[10px] text-slate-400 mb-0.5 font-medium">목적지 좌표:</div>
          <div className="font-mono text-[11px] text-emerald-400 font-semibold">
            {lat.toFixed(6)}, {lng.toFixed(6)}
          </div>
        </div>

        {/* 딥링크 버튼 리스트 */}
        <div className="space-y-2.5">
          {/* 카카오맵 버튼 */}
          <a
            href={kakaoMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="group flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] font-bold text-xs sm:text-sm shadow-lg shadow-yellow-500/10 transition-all transform active:scale-95"
          >
            <div className="flex items-center space-x-2.5">
              <span className="text-lg">🟡</span>
              <span>카카오맵으로 열기</span>
            </div>
            <ExternalLink className="w-4 h-4 text-[#191919]/70 group-hover:translate-x-0.5 transition-transform" />
          </a>

          {/* 구글맵 버튼 */}
          <a
            href={googleMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="group flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/20 transition-all transform active:scale-95"
          >
            <div className="flex items-center space-x-2.5">
              <span className="text-lg">🌐</span>
              <span>Google Maps로 열기</span>
            </div>
            <ExternalLink className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* 하단 안내 문구 */}
        <p className="mt-3.5 text-center text-[11px] text-slate-500">
          원하시는 지도 앱 또는 웹 브라우저로 목적지가 연동됩니다.
        </p>
      </div>
    </div>
  );
};
