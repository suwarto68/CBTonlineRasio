import React from 'react';
import { MapPin, TrendingUp, Sparkles, Scale, Gauge, FileText, Droplets, Clock, Car } from 'lucide-react';

interface QuestionGraphicProps {
  graphicType?: 'table' | 'map' | 'chart' | 'recipe' | 'infographic';
  data?: any;
  indicator: string;
}

export const QuestionGraphic: React.FC<QuestionGraphicProps> = ({
  graphicType,
  data,
  indicator
}) => {
  if (!graphicType && !data) return null;

  return (
    <div className="my-3 rounded-lg border border-slate-200 bg-slate-50/80 p-3.5 shadow-sm text-slate-800">
      {/* 1. TABLE GRAPHIC */}
      {graphicType === 'table' && data && data.headers && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left border-collapse border border-slate-300 bg-white rounded shadow-xs">
            <thead className="bg-[#e8f1f9] text-[#0f4c81] font-bold border-b border-slate-300">
              <tr>
                {data.headers.map((h: string, idx: number) => (
                  <th key={idx} className="p-2.5 border-r border-slate-300 last:border-r-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row: string[], rIdx: number) => (
                <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                  {row.map((cell: string, cIdx: number) => (
                    <td
                      key={cIdx}
                      className="p-2 border-t border-r border-slate-200 last:border-r-0 text-slate-700 font-medium"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. MAP GRAPHIC */}
      {graphicType === 'map' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-2 mb-3">
            <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{data?.title || 'Peta Wilayah Wanaraya'}</span>
            </div>
            <span className="bg-emerald-600 text-white text-xs font-mono font-bold px-2 py-0.5 rounded">
              SKALA {data?.scaleText || '1 : 150.000'}
            </span>
          </div>

          <div className="relative h-28 bg-emerald-100/70 rounded-md border border-emerald-200 flex items-center justify-around px-4">
            <div className="text-center">
              <div className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center mx-auto mb-1 border border-emerald-300">
                🏛️
              </div>
              <span className="text-[11px] font-bold text-emerald-900">Balai Desa</span>
            </div>

            {/* Connecting Measurement Line */}
            <div className="flex-1 mx-3 flex flex-col items-center">
              <span className="text-xs font-mono font-bold text-emerald-800 bg-white/90 px-2 py-0.5 rounded border border-emerald-300 shadow-xs mb-1">
                ↔ {data?.mapDistance || '4 cm pada peta'}
              </span>
              <div className="w-full border-t-2 border-dashed border-emerald-500 relative">
                <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-emerald-600" />
                <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-emerald-600" />
              </div>
            </div>

            <div className="text-center">
              <div className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center mx-auto mb-1 border border-blue-300">
                🏫
              </div>
              <span className="text-[11px] font-bold text-blue-950">SMPN 1 Wanaraya</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. CHART / SPEED / RATE GRAPHIC */}
      {graphicType === 'chart' && (
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-3.5">
          <div className="flex items-center gap-2 font-bold text-sky-900 text-sm mb-2">
            <TrendingUp className="w-4 h-4 text-sky-600" />
            <span>Infografis Data Laju Perubahan & Perbandingan</span>
          </div>

          {data?.kendaraan && (
            <div className="flex items-center justify-between bg-white p-3 rounded border border-sky-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-sky-100 rounded text-sky-700">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">{data.kendaraan}</div>
                  <div className="text-[11px] text-slate-500">Rute Wanaraya - Banjarmasin</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-blue-800">{data.jarakTempuh}</div>
                <div className="text-[11px] text-slate-600">Durasi: {data.waktuTempuh}</div>
              </div>
            </div>
          )}

          {data?.label && (
            <div className="bg-white p-2.5 rounded border border-sky-200 text-xs text-slate-700">
              <div className="font-bold text-blue-900">{data.label}</div>
              {data.difference && <div className="text-amber-700 font-semibold">{data.difference}</div>}
            </div>
          )}

          {data?.ukuranFile && (
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="bg-white p-2 rounded border border-sky-200 text-xs">
                <div className="text-[11px] text-slate-500">Jalur A (Serat Optik)</div>
                <div className="font-bold text-emerald-700">{data.jalurA}</div>
              </div>
              <div className="bg-white p-2 rounded border border-sky-200 text-xs">
                <div className="text-[11px] text-slate-500">Jalur B (Nirkabel)</div>
                <div className="font-bold text-blue-700">{data.jalurB}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. RECIPE / RATIO GRAPHIC */}
      {graphicType === 'recipe' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5">
          <div className="flex items-center gap-2 font-bold text-amber-900 text-sm mb-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Resep Proporsional Bahan Minuman Teh Manis</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2.5 rounded border border-amber-200">
              <div className="font-bold text-amber-950 mb-1">Takaran Acuan:</div>
              <div className="text-slate-700">{data?.takaranAwal}</div>
              <div className="text-slate-600 mt-0.5">• Gula: {data?.gulaAwal}</div>
              <div className="text-slate-600">• Air: {data?.airAwal}</div>
            </div>
            <div className="bg-white p-2.5 rounded border border-amber-200">
              <div className="font-bold text-blue-950 mb-1">Kebutuhan Tamu Baru:</div>
              <div className="text-blue-800 font-semibold">{data?.targetGelas}</div>
              <div className="text-slate-500 text-[11px] mt-1">
                (Gunakan rasio ekuivalen yang setara)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. INFOGRAPHIC / GENERAL SUMMARY */}
      {graphicType === 'infographic' && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-xs text-indigo-950">
          <div className="flex items-center gap-1.5 font-bold mb-1.5 text-indigo-900">
            <Scale className="w-4 h-4 text-indigo-600" />
            <span>Infografis Ringkasan Besaran Soal:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(data || {}).map(([key, val]: [string, any], idx: number) => (
              <span
                key={idx}
                className="bg-white border border-indigo-200 px-2.5 py-1 rounded font-semibold text-slate-800 shadow-xs"
              >
                <strong className="text-indigo-800 capitalize">{key}: </strong>
                {String(val)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
