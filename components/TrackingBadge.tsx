'use client'

import { useTracking } from '@/context/TrackingContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export function TrackingBadge() {
  const { source } = useTracking()
  const [visible, setVisible] = useState(false)
  const [prevSource, setPrevSource] = useState(source)

  useEffect(() => {
    if (source !== 'idle' && source !== prevSource) {
      setVisible(true)
      setPrevSource(source)
      const t = setTimeout(() => setVisible(false), 4000)
      return () => clearTimeout(t)
    }
  }, [source, prevSource])

  const label: Record<string, string> = {
    face:  '● Face tracking',
    gyro:  '● Gyroscope',
    mouse: '● Mouse tracking',
    idle:  '',
  }

  const color: Record<string, string> = {
    face:  'text-emerald-400/50',
    gyro:  'text-yellow-400/50',
    mouse: 'text-white/25',
    idle:  '',
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.4 }}
          className={`fixed bottom-7 right-7 z-50 text-[10px] tracking-widest
                      uppercase font-light pointer-events-none ${color[source]}`}
        >
          {label[source]}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
