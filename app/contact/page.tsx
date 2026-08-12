import { ContactForm } from "@/components/contact-form"
import { Mail, ShieldAlert, Clock, MessageSquare } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us | AfroSecured",
  description:
    "Get in touch with the AfroSecured team. Report scams, ask questions, explore partnerships, or reach our support team.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">Contact Us</h1>
            <p className="text-slate-400">
              Have a question, tip, or partnership idea? Send us a message and our team will respond as soon as
              possible.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Send Us a Message</h2>
                <ContactForm />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Direct email */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Reach Us Directly</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-400">Email</p>
                      <a href="mailto:afrosecured@gmail.com" className="text-white hover:text-teal-400 break-all">
                        afrosecured@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-400">Response Time</p>
                      <p className="text-white">Within 1&ndash;2 business days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-400">Want to report a scam?</p>
                      <a href="/report" className="text-white hover:text-teal-400">
                        Use our dedicated report form &rarr;
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                  <h3 className="text-lg font-semibold text-red-400">Emergency?</h3>
                </div>
                <p className="text-slate-300 text-sm mb-4">
                  If you&apos;re currently being scammed or in immediate danger, contact local authorities first.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nigeria:</span>
                    <span className="text-white">199</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">South Africa:</span>
                    <span className="text-white">10111</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kenya:</span>
                    <span className="text-white">999</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
