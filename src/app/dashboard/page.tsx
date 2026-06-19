/**
 * Dashboard Home
 * 
 * Central hub for AstroKalki pattern analytics and tracking.
 */

import Link from 'next/link';

export const metadata = {
  title: 'Dashboard - AstroKalki',
  description: 'Track your pattern activations and mood trends',
};

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 sm:px-10 lg:px-16 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <p className="text-[10px] tracking-[0.5em] uppercase text-[#c9a96e]/60 mb-4 font-light">
            Your Pattern Journey
          </p>
          <h1 className="text-[clamp(2rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] font-serif text-[#f0eee9] mb-6">
            Dashboard
          </h1>
          <p className="text-[#9a9a9a] text-base leading-[1.8] max-w-2xl font-light">
            Track your psychological patterns across time. Understand when they activate, how intensely, and what planetary influences shape their appearance.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Mood Trends Card */}
          <Link
            href="/dashboard/mood-trends"
            className="group bg-white/[0.02] border border-white/[0.06] hover:border-[#c9a96e]/30 rounded-lg p-8 transition-all duration-500 cursor-pointer"
          >
            <div className="mb-6">
              <p className="text-[10px] tracking-[0.5em] uppercase text-[#c9a96e]/60 mb-3 font-light">
                Analytics
              </p>
              <h2 className="text-2xl font-serif text-[#f0eee9] group-hover:text-[#c9a96e] transition-colors duration-300">
                Mood Trends
              </h2>
            </div>
            
            <p className="text-[#9a9a9a] text-sm leading-[1.8] mb-6 font-light">
              Visualize which patterns are most active. See intensity curves, distribution across time, and identify your top recurring patterns.
            </p>
            
            <div className="flex items-center gap-2 text-[#c9a96e] text-xs tracking-[0.3em] uppercase font-light group-hover:gap-3 transition-all duration-300">
              <span>View Trends</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Pattern Calendar Card */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-8 opacity-50">
            <div className="mb-6">
              <p className="text-[10px] tracking-[0.5em] uppercase text-[#c9a96e]/60 mb-3 font-light">
                Coming Soon
              </p>
              <h2 className="text-2xl font-serif text-[#f0eee9]">
                Pattern Calendar
              </h2>
            </div>
            
            <p className="text-[#9a9a9a] text-sm leading-[1.8] mb-6 font-light">
              A visual calendar of your activations. Each day shows which pattern dominates and at what intensity.
            </p>
            
            <div className="flex items-center gap-2 text-[#5a5a5a] text-xs tracking-[0.3em] uppercase font-light">
              <span>Coming Soon</span>
            </div>
          </div>

          {/* Pattern Timeline Card */}
          <Link
            href="/dashboard/timeline"
            className="group bg-white/[0.02] border border-white/[0.06] hover:border-[#c9a96e]/30 rounded-lg p-8 transition-all duration-500 cursor-pointer"
          >
            <div className="mb-6">
              <p className="text-[10px] tracking-[0.5em] uppercase text-[#c9a96e]/60 mb-3 font-light">
                Visualization
              </p>
              <h2 className="text-2xl font-serif text-[#f0eee9] group-hover:text-[#c9a96e] transition-colors duration-300">
                Pattern Timeline
              </h2>
            </div>
            
            <p className="text-[#9a9a9a] text-sm leading-[1.8] mb-6 font-light">
              An interactive D3.js timeline of your pattern journey. See sessions, insights, journal entries, and milestones mapped to your patterns.
            </p>
            
            <div className="flex items-center gap-2 text-[#c9a96e] text-xs tracking-[0.3em] uppercase font-light group-hover:gap-3 transition-all duration-300">
              <span>View Timeline</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Practitioner Dashboard Card */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-8 opacity-50">
            <div className="mb-6">
              <p className="text-[10px] tracking-[0.5em] uppercase text-[#c9a96e]/60 mb-3 font-light">
                Coming Soon
              </p>
              <h2 className="text-2xl font-serif text-[#f0eee9]">
                Client Dashboard
              </h2>
            </div>
            
            <p className="text-[#9a9a9a] text-sm leading-[1.8] mb-6 font-light">
              For practitioners: Track clients, manage bookings, view session notes, and monitor pattern work progress.
            </p>
            
            <div className="flex items-center gap-2 text-[#5a5a5a] text-xs tracking-[0.3em] uppercase font-light">
              <span>Coming Soon</span>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="border-t border-white/[0.06] pt-20">
          <p className="text-[10px] tracking-[0.5em] uppercase text-[#c9a96e]/60 mb-8 font-light">
            About These Tools
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-[#c9a96e] font-serif text-lg mb-3">Real-time Data</h3>
              <p className="text-[#9a9a9a] text-sm leading-[1.8] font-light">
                All visualizations pull live transit and pattern activation data. Your patterns update automatically as planetary positions change.
              </p>
            </div>
            
            <div>
              <h3 className="text-[#c9a96e] font-serif text-lg mb-3">Personal Insights</h3>
              <p className="text-[#9a9a9a] text-sm leading-[1.8] font-light">
                The deeper your chart data, the more personalized these insights become. Birth chart activations are more precise than general transits alone.
              </p>
            </div>
            
            <div>
              <h3 className="text-[#c9a96e] font-serif text-lg mb-3">Track Progress</h3>
              <p className="text-[#9a9a9a] text-sm leading-[1.8] font-light">
                Over time, you&apos;ll see how your conscious work with patterns changes their intensity and your response to their activation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
