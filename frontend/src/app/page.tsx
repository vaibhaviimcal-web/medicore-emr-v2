'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Activity, 
  Calendar, 
  FileText, 
  Users, 
  Video, 
  BarChart3,
  Shield,
  Zap
} from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  const features = [
    {
      icon: Users,
      title: 'Patient Management',
      description: '360° patient view with comprehensive medical history'
    },
    {
      icon: FileText,
      title: 'Clinical Documentation',
      description: 'Voice-to-text, SOAP notes, AI-powered diagnostics'
    },
    {
      icon: Activity,
      title: 'E-Prescribing',
      description: '50,000+ medications with drug interaction alerts'
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'AI-based appointment optimization'
    },
    {
      icon: Video,
      title: 'Telemedicine',
      description: 'HD video consultations with HIPAA compliance'
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Clinical analytics with predictive insights'
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'HIPAA, DISHA, GDPR compliant'
    },
    {
      icon: Zap,
      title: 'AI-Powered',
      description: 'Clinical decision support with GPT-4'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            MediCore EMR
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-300 mb-2">
            Enterprise-Level Electronic Medical Records
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
            Next-Generation Healthcare Platform with AI-Powered Clinical Decision Support
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => router.push('/login')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => router.push('/demo')}
            >
              Request Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-blue-600">99.9%</CardTitle>
              <CardDescription>Uptime SLA</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-blue-600">24/7</CardTitle>
              <CardDescription>Customer Support</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-blue-600">50K+</CardTitle>
              <CardDescription>Medications Database</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-blue-600">AI</CardTitle>
              <CardDescription>Clinical Decision Support</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Pricing Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Choose the plan that fits your practice
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { name: 'Solo', price: '₹2,999', patients: '500', doctors: '1' },
            { name: 'Clinic', price: '₹9,999', patients: '5,000', doctors: '5' },
            { name: 'Multi-Specialty', price: '₹29,999', patients: 'Unlimited', doctors: '20' },
            { name: 'Enterprise', price: 'Custom', patients: 'Unlimited', doctors: 'Unlimited' }
          ].map((plan, index) => (
            <Card key={index} className={index === 2 ? 'border-blue-600 border-2' : ''}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="text-3xl font-bold">{plan.price}</div>
                <CardDescription>per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ {plan.doctors} Doctor(s)</li>
                  <li>✓ {plan.patients} Patients</li>
                  <li>✓ All Core Features</li>
                  <li>✓ 24/7 Support</li>
                </ul>
                <Button className="w-full mt-4" variant={index === 2 ? 'default' : 'outline'}>
                  Choose Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>© 2025 MediCore EMR. All rights reserved.</p>
          <p className="mt-2">Built with ❤️ for Healthcare Professionals</p>
        </div>
      </footer>
    </div>
  )
}
