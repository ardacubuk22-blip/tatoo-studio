/* ------------------------------------------------------------
   "Sana Uygun Sanatçıyı Bul" quiz state — persisted to
   localStorage so a page refresh resumes where the customer
   left off. Same storage pattern as FavoritesContext.
   ------------------------------------------------------------ */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'tattoo-archive:match-quiz'

export const EMPTY_ANSWERS = {
  styles: [], // string[] of style slugs, [] = "kararsızım / bana öner"
  bodyPart: null, // not scored — carried into the appointment message
  size: null, // not scored
  colorPref: null, // not scored ("color" | "bw" | null)
  firstTattoo: null, // not scored ("yes" | "no" | null)
  budget: null, // scored — one of BUDGET_BRACKETS values
  city: null, // scored — an Istanbul district
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { answers: EMPTY_ANSWERS, step: 0 }
    const parsed = JSON.parse(raw)
    return {
      answers: { ...EMPTY_ANSWERS, ...(parsed.answers || {}) },
      step: typeof parsed.step === 'number' ? parsed.step : 0,
    }
  } catch {
    return { answers: EMPTY_ANSWERS, step: 0 }
  }
}

const MatchQuizContext = createContext(null)

export function MatchQuizProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [{ answers, step }, setState] = useState(readStored)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, step }))
    } catch {
      /* storage unavailable — quiz still works for this session */
    }
  }, [answers, step])

  const setAnswer = useCallback((key, value) => {
    setState((prev) => ({ ...prev, answers: { ...prev.answers, [key]: value } }))
  }, [])

  const setStep = useCallback((next) => {
    setState((prev) => ({ ...prev, step: typeof next === 'function' ? next(prev.step) : next }))
  }, [])

  const reset = useCallback(() => {
    setState({ answers: EMPTY_ANSWERS, step: 0 })
  }, [])

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  const value = useMemo(
    () => ({ isOpen, open, close, answers, step, setAnswer, setStep, reset }),
    [isOpen, open, close, answers, step, setAnswer, setStep, reset],
  )

  return <MatchQuizContext.Provider value={value}>{children}</MatchQuizContext.Provider>
}

export function useMatchQuiz() {
  const ctx = useContext(MatchQuizContext)
  if (!ctx) throw new Error('useMatchQuiz must be used within <MatchQuizProvider>')
  return ctx
}
