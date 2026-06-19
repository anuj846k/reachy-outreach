import Image from "next/image";

export default function ProblemSection() {
  return (
    <section className="relative bg-white py-20 px-6 lg:px-8 overflow-hidden">
      <div className="mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-semibold tracking-tight text-gray-900">
            Outreach is{" "}
            <span className="text-[#1A4FFF] italic">
              broken.
            </span>
          </h2>
          <p className="mt-2 text-lg font-normal text-gray-600 max-w-3xl mx-auto">
            Spreadsheets, generic templates, and manual follow-ups don&apos;t scale. Personalizing outreach at volume is a disorganized mess of forgotten messages and low reply rates.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-6">

          <div className="lg:col-span-3 relative bg-gray-50/50 rounded-3xl overflow-hidden flex flex-col border border-gray-200 h-[450px]">
            <div className="p-8 sm:p-10 relative z-10 w-full sm:w-[90%]">
              <h3 className="text-xl font-semibold text-gray-900 tracking-tight">No Outreach CRM</h3>
              <p className="mt-4 text-[15px] font-normal leading-relaxed text-gray-500">
                Most teams use spreadsheets or Notion to track prospects. Reachy replaces them with a dedicated prospect database, outreach history, and relationship tracking.
              </p>
            </div>

            <div className="absolute -bottom-8 -right-8 w-[85%] sm:w-[75%] rounded-tl-2xl shadow-2xl border-t border-l border-gray-200 bg-white overflow-hidden transition-transform duration-500 hover:-translate-y-2 hover:-translate-x-2">
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="text-[11px] text-gray-400 font-medium ml-2">prospects.csv</div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex gap-2 text-[10px]">
                    <div className="w-16 h-5 rounded bg-gray-100 flex items-center px-2 text-gray-500 font-medium">Name</div>
                    <div className="w-20 h-5 rounded bg-gray-100 flex items-center px-2 text-gray-500 font-medium">Company</div>
                    <div className="w-24 h-5 rounded bg-gray-100 flex items-center px-2 text-gray-500 font-medium">Last Contact</div>
                    <div className="w-14 h-5 rounded bg-gray-100 flex items-center px-2 text-gray-500 font-medium">Status</div>
                  </div>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-2 text-[10px]">
                      <div className={`w-16 h-5 rounded flex items-center px-2 ${i % 2 === 0 ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-600'}`}>Prospect {i + 1}</div>
                      <div className={`w-20 h-5 rounded flex items-center px-2 ${i % 2 === 0 ? 'bg-blue-50 text-blue-600/70' : 'bg-gray-50 text-gray-500'}`}>Company {i + 1}</div>
                      <div className={`w-24 h-5 rounded flex items-center px-2 ${i % 2 === 0 ? 'bg-blue-50 text-blue-600/70' : 'bg-gray-50 text-gray-500'}`}>{['2 days ago', '1 week ago', '3 days ago', '2 weeks ago'][i]}</div>
                      <div className={`w-14 h-5 rounded flex items-center px-2 ${i % 2 === 0 ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>{['Pending', 'Replied', 'Pending', 'Follow-up'][i]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>


          <div className="lg:col-span-3 relative bg-blue-50/50 rounded-3xl overflow-hidden flex flex-col border border-blue-100 transition-all h-[450px]">
            <div className="p-8 sm:p-10 relative z-10 w-full sm:w-[90%]">
              <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Generic Templates</h3>
              <p className="mt-4 text-[15px] font-normal leading-relaxed text-gray-500">
                Prospects ignore copy-pasted outreach. Reachy&apos;s AI analyzes each prospect&apos;s profile to write hyper-personalized messages that actually get replies, at scale.
              </p>
            </div>

            <div className="p-2  -mt-6">
              <div className="relative w-full h-64 border rounded-2xl bg-gray-100 overflow-hidden p-4">
                <div className="absolute w-[55%] sm:w-[55%] rounded-tl-2xl border-t border-l border-gray-200 bg-white overflow-hidden flex gap-2 rounded-2xl border p-1 opacity-60 text-sm">
                  <Image src="/logos/logo.svg" alt="logo" width="20" height="20" />
                  Draft message for Acme Corp
                </div>
                <div className="absolute bottom-32 right-10 w-[55%] sm:w-[55%] rounded-tl-2xl border-t border-l border-gray-200 bg-white overflow-hidden flex gap-2 rounded-2xl border p-1 opacity-60 text-sm">
                  <Image src="/logos/logo.svg" alt="logo" width="20" height="20" />
                  Why are they a good fit?
                </div>
                <div className="absolute bottom-20 w-[60%] sm:w-[60%] rounded-tl-2xl border-t border-l border-gray-200 bg-white overflow-hidden flex gap-2 rounded-2xl border p-1 opacity-60 text-sm">
                  <Image src="/logos/logo.svg" alt="logo" width="20" height="20" />
                  Their product aligns with our goals.
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[85%] bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-200/60 p-1.5 flex items-center gap-3 z-10">
                  <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </div>
                  <div className="flex-1 text-[13px] text-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                    Ask Reachy AI
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#1A4FFF] flex items-center justify-center text-white shadow-md hover:bg-[#1A4FFF]/90 transition-colors cursor-pointer shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>


          </div>


          <div className="lg:col-span-2 relative bg-gray-50/50 rounded-3xl overflow-hidden flex flex-col border border-gray-200 h-[450px]">
            <div className="p-8 sm:p-10 relative z-10 w-full sm:w-[90%]">
              <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Lost Follow-ups</h3>
              <p className="mt-4 text-[15px] font-normal leading-relaxed text-gray-500">
                Never drop a conversation again. Reachy automatically tracks contacted prospects, pending responses, and follow-up schedules.
              </p>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="space-y-2">
                {[
                  { name: 'Sarah Chen', status: 'Replied', color: 'bg-green-100 text-green-700' },
                  { name: 'Mike Ross', status: 'Follow-up', color: 'bg-yellow-100 text-yellow-700' },
                  { name: 'Alex Kim', status: 'Not Replied', color: 'bg-red-100 text-red-700' },
                  { name: 'Jane Doe', status: 'Meeting Set', color: 'bg-blue-100 text-blue-700' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/90 rounded-xl px-4 py-2.5 shadow-sm border border-gray-100">
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-semibold text-gray-600">
                      {item.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 text-sm font-medium text-gray-700">{item.name}</div>
                    <div className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${item.color}`}>
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl overflow-hidden flex flex-col border border-blue-200 h-[450px]">
            <div className="p-8 sm:p-10 relative z-10 w-full sm:w-[90%]">
              <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Smart Sequences</h3>
              <p className="mt-4 text-[15px] font-normal leading-relaxed text-gray-500">
                Set up multi-step outreach sequences that automatically pause, adjust, or escalate based on prospect responses.
              </p>
            </div>

            <div className="absolute bottom-8 left-6 right-6">
              <div className="flex items-center gap-1">
                {[
                  { label: 'Intro', done: true },
                  { label: 'Value', done: true },
                  { label: 'Case', done: false },
                  { label: 'Close', done: false },
                ].map((step, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className={`w-full h-1.5 rounded-full ${step.done ? 'bg-[#3461FF]' : 'bg-gray-200'}`} />
                    <div className={`flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold ${
                      step.done ? 'bg-[#3461FF] text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {step.done ? (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </div>
                    <div className="text-[9px] font-medium text-gray-500">{step.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-white/80 rounded-xl p-3 border border-blue-100 shadow-sm">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-gray-600 font-medium">Auto-advancing to next step in 2 days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 relative bg-[#3461FF] rounded-3xl overflow-hidden flex flex-col h-[450px]">
            <div className="p-8 sm:p-10 relative z-10 w-full sm:w-[90%]">
              <h3 className="text-xl font-semibold text-white tracking-tight">Real-time Analytics</h3>
              <p className="mt-4 text-[15px] font-normal leading-relaxed text-white/70">
                See reply rates, campaign performance, interested prospects, and conversion metrics without manual data entry.
              </p>
            </div>

            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[42%] right-6 w-[60%] sm:w-[55%] rounded-2xl bg-white/90 overflow-hidden flex items-center gap-3 p-3 text-sm z-10 pointer-events-auto">
                <div className="flex items-center justify-center rounded-xl bg-linear-to-b from-green-200 to-green-500 shadow-xs p-2 shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .621.504 1.125 1.125 1.125h.75m-1.5-3a1.125 1.125 0 00-1.125 1.125v.75" /></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-900 text-lg font-bold tracking-tight leading-none mb-1">18%</span>
                  <span className="text-gray-500 text-[9px] font-bold uppercase leading-none">Reply Rate</span>
                </div>
              </div>

              <div className="absolute top-[60%] left-6 w-[60%] sm:w-[55%] rounded-2xl bg-white/90 overflow-hidden flex items-center gap-3 p-3 text-sm z-20 pointer-events-auto">
                <div className="flex items-center justify-center rounded-xl bg-linear-to-b from-orange-200 to-orange-500 shadow-xs p-2 shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-900 text-lg font-bold tracking-tight leading-none mb-1">36</span>
                  <span className="text-gray-500 text-[9px] font-bold uppercase leading-none">Interested</span>
                </div>
              </div>

              <div className="absolute bottom-10 right-8 w-[60%] sm:w-[55%] rounded-2xl bg-white/90 overflow-hidden flex items-center gap-3 p-3 text-sm z-30 pointer-events-auto">
                <div className="flex items-center justify-center rounded-xl bg-linear-to-b from-blue-200 to-blue-500 shadow-xs p-2 shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-900 text-lg font-bold tracking-tight leading-none mb-1">2.4k</span>
                  <span className="text-gray-500 text-[9px] font-bold uppercase leading-none">Emails Sent</span>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </section>
  );
}
