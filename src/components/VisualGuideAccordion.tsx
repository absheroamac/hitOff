import { useState } from 'react'
import type { VisualGuide } from '../data/visualGuides'

interface VisualGuideAccordionProps {
  guide: VisualGuide
  defaultOpen?: boolean
}

export function VisualGuideAccordion({ guide, defaultOpen = false }: VisualGuideAccordionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [fullView, setFullView] = useState(false)

  return (
    <div className="mt-2.5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs font-medium text-emerald-400/90 hover:text-emerald-300 py-1 px-2.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 transition-all active:scale-95"
      >
        <span>👁️</span>
        <span>Visual Form Guide</span>
        <span className={`text-[10px] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {open && (
        <div className="mt-3 rounded-xl border border-white/10 bg-[#0d0d16] p-3 shadow-inner overflow-hidden animate-fadeIn">
          {/* Guide Image with full-screen tap preview */}
          <div className="relative group cursor-pointer" onClick={() => setFullView(true)}>
            <img
              src={guide.imageUrl}
              alt={guide.title}
              className="w-full aspect-video object-cover rounded-lg border border-emerald-500/20 shadow-md transition-transform duration-300 group-hover:scale-[1.01]"
              loading="lazy"
            />
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 text-[10px] text-white/70 font-medium flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              <span>🔍</span> Tap to expand
            </div>
          </div>

          {/* Guide Title & Key Focus */}
          <div className="mt-2.5">
            <h4 className="text-xs font-bold text-white tracking-wide uppercase">{guide.title}</h4>
            <p className="text-[11px] text-emerald-400/90 font-medium mt-1 leading-snug">
              💡 <span className="text-white/80">Key Focus:</span> {guide.keyFocus}
            </p>
          </div>

          {/* Form Cues List */}
          <div className="mt-2.5 space-y-1.5 border-t border-white/10 pt-2.5">
            {guide.cues.map((cue, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[11px] text-white/70 leading-snug">
                <span className="text-emerald-400 font-bold shrink-0 text-xs">✓</span>
                <span>{cue}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Screen Image Modal */}
      {fullView && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4"
          onClick={() => setFullView(false)}
        >
          <button
            onClick={() => setFullView(false)}
            className="absolute top-6 right-6 text-white/80 text-2xl p-2 hover:text-white"
          >
            ✕
          </button>
          <img
            src={guide.imageUrl}
            alt={guide.title}
            className="max-w-full max-h-[75vh] object-contain rounded-xl border border-white/20 shadow-2xl"
          />
          <div className="mt-4 text-center max-w-md px-4">
            <div className="text-sm font-bold text-white uppercase">{guide.title}</div>
            <div className="text-xs text-emerald-400 mt-1">{guide.keyFocus}</div>
            <div className="text-[10px] text-white/40 mt-2">Tap anywhere to close</div>
          </div>
        </div>
      )}
    </div>
  )
}
