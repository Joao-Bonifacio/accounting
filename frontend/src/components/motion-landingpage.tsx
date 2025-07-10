'use client'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import Link from 'next/link'

export default function MotionLandingpage({ auth }: { auth: boolean }) {
  return (
    <section className="flex flex-col items-center justify-center text-center px-4 py-24 space-y-6">
      <motion.h1
        className="text-4xl sm:text-6xl font-bold leading-tight tracking-tight"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Take Control of Your <span className="text-primary">Finances</span>
      </motion.h1>
      <motion.p
        className="text-lg sm:text-xl max-w-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Track your income, manage your expenses, and visualize your future with
        clarity and simplicity.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        {auth ? (
          <Button size="lg" className="px-8 py-6 text-lg">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        ) : (
          <div className="flex space-x-4">
            <Button size="lg" className="px-8 py-6 text-lg">
              <Link href="/sign-up">Get Started for Free</Link>
            </Button>
            <Button size="lg" className="px-8 py-6 text-lg">
              <Link href="/sign-up">Login</Link>
            </Button>
          </div>
        )}
      </motion.div>
    </section>
  )
}
