import MotionLandingpage from '@/components/motion-landingpage'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, Wallet, PieChart } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function Home() {
  const auth = !!(await cookies()).get('access_token')

  return (
    <main className="min-h-[85vh] bg-gradient-to-b from-slate-100 dark:from-slate-900 dark:to-black to-white text-slate-500">
      <MotionLandingpage auth={auth} />

      <section className="px-6 py-16 bg-white dark:bg-slate-800">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Track Everything',
              icon: <Wallet className="text-primary" size={32} />,
              description:
                'Easily record income and expenses in just a few clicks.',
            },
            {
              title: 'Visual Reports',
              icon: <PieChart className="text-primary" size={32} />,
              description: 'See where your money goes with beautiful charts.',
            },
            {
              title: 'Smart Planning',
              icon: <TrendingUp className="text-primary" size={32} />,
              description: 'Set budgets and goals to stay financially fit.',
            },
          ].map((feature, i) => (
            <Card
              key={i}
              className="shadow-lg rounded-2xl hover:scale-[1.02] transition-all"
            >
              <CardContent className="p-6 space-y-4 text-center">
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-slate-100 dark:bg-slate-800 px-6 py-20 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold">
          Start Managing Your Money Today
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Join thousands of users who are taking control of their financial
          future with our intuitive app.
        </p>

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
      </section>
    </main>
  )
}
