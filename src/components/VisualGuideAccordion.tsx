import { useState } from 'react'
import type { VisualGuide } from '../data/visualGuides'

interface VisualGuideAccordionProps {
  guide: VisualGuide
  defaultOpen?: boolean
}

export function VisualGuideAccordion({ guide, defaultOpen = false }: VisualGuideAccordionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [fullView, setFullView] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)

  const hasSteps = Boolean(guide.steps && guide.steps.length > 1)
  const currentStep = hasSteps ? guide.steps![stepIndex] : null
  const activeImageUrl = currentStep?.imageUrl ?? guide.imageUrl
  const activeTitle = currentStep ? `Step ${currentStep.stepNumber}: ${currentStep.label}` : guide.title

  const handlePrevStep = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!guide.steps) return
    setStepIndex((idx) => (idx > 0 ? idx - 1 : guide.steps!.length - 1))
  }

  const handleNextStep = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!guide.steps) return
    setStepIndex((idx) => (idx < guide.steps!.length - 1 ? idx + 1 : 0))
  }

  return (
    <div className="mt-2.5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs font-medium text-emerald-400/90 hover:text-emerald-300 py-1 px-2.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 transition-all active:scale-95"
      >
        <span>👁️</span>
        <span>Visual Form Guide</span>
        {hasSteps && (
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full font-semibold">
            {guide.steps!.length} Steps
          </span>
        )}
        <span className={`text-[10px] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {open && (
        <div className="mt-3 rounded-xl border border-white/10 bg-[#0d0d16] p-3 shadow-inner overflow-hidden animate-fadeIn">
          {/* Step Selector Pills for Multi-Step Exercises */}
          {hasSteps && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none border-b border-white/10">
              {guide.steps!.map((step, idx) => (
                <button
                  key={step.stepNumber}
                  onClick={() => setStepIndex(idx)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                    stepIndex === idx
                      ? 'bg-emerald-500 text-black shadow-sm'
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {step.stepNumber}. {step.label}
                </button>
              ))}
            </div>
          )}

          {/* Guide Image with step overlay and tap-to-expand */}
          <div className="relative group cursor-pointer overflow-hidden rounded-lg" onClick={() => setFullView(true)}>
            <img
              src={activeImageUrl}
              alt={activeTitle}
              className="w-full aspect-video object-cover rounded-lg border border-emerald-500/20 shadow-md transition-transform duration-300 group-hover:scale-[1.01]"
              loading="lazy"
            />

            {/* Step Controls Overlay */}
            {hasSteps && (
              <>
                <button
                  onClick={handlePrevStep}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/70 hover:bg-emerald-500 hover:text-black text-white text-base font-bold flex items-center justify-center transition-all opacity-80 group-hover:opacity-100"
                  aria-label="Previous step"
                >
                  ‹
                </button>
                <button
                  onClick={handleNextStep}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/70 hover:bg-emerald-500 hover:text-black text-white text-base font-bold flex items-center justify-center transition-all opacity-80 group-hover:opacity-100"
                  aria-label="Next step"
                >
                  ›
                </button>
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-sm text-[10px] text-emerald-400 font-bold border border-emerald-500/30">
                  Step {stepIndex + 1} of {guide.steps!.length}
                </div>
              </>
            )}

            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 text-[10px] text-white/70 font-medium flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              <span>🔍</span> Tap to expand
            </div>
          </div>

          {/* Guide Title & Key Focus / Step Cue */}
          <div className="mt-2.5">
            <h4 className="text-xs font-bold text-white tracking-wide uppercase">{activeTitle}</h4>
            {currentStep?.cue ? (
              <p className="text-[11px] text-emerald-400/90 font-medium mt-1 leading-snug">
                🎯 <span className="text-white/80">Step Focus:</span> {currentStep.cue}
              </p>
            ) : (
              <p className="text-[11px] text-emerald-400/90 font-medium mt-1 leading-snug">
                💡 <span className="text-white/80">Key Focus:</span> {guide.keyFocus}
              </p>
            )}
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

      {/* Full Screen Image Modal with Step Navigation */}
      {fullView && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4"
          onClick={() => setFullView(false)}
        >
          <button
            onClick={() => setFullView(false)}
            className="absolute top-6 right-6 text-white/80 text-2xl p-2 hover:text-white"
            aria-label="Close full view"
          >
            ✕
          </button>

          <div className="relative max-w-full max-h-[75vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={activeImageUrl}
              alt={activeTitle}
              className="max-w-full max-h-[70vh] object-contain rounded-xl border border-white/20 shadow-2xl"
            />
            {hasSteps && (
              <>
                <button
                  onClick={handlePrevStep}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/80 hover:bg-emerald-500 hover:text-black text-white text-2xl font-bold flex items-center justify-center transition-all"
                  aria-label="Previous step"
                >
                  ‹
                </button>
                <button
                  onClick={handleNextStep}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/80 hover:bg-emerald-500 hover:text-black text-white text-2xl font-bold flex items-center justify-center transition-all"
                  aria-label="Next step"
                >
                  ›
                </button>
              </>
            )}
          </div>

          <div className="mt-4 text-center max-w-md px-4">
            <div className="text-sm font-bold text-white uppercase">{activeTitle}</div>
            <div className="text-xs text-emerald-400 mt-1">
              {currentStep?.cue ?? guide.keyFocus}
            </div>
            {hasSteps && (
              <div className="flex justify-center gap-1.5 mt-2.5">
                {guide.steps!.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      stepIndex === idx ? 'w-6 bg-emerald-400' : 'w-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>
            )}
            <div className="text-[10px] text-white/40 mt-2">Tap outside to close</div>
          </div>
        </div>
      )}
    </div>
  )
}
