// src/pages/home/NewsletterSection.tsx
import { Mail } from "lucide-react";
import { Button } from "../../components/Button";

export function NewsletterSection() {
  return (
    <section className="py-16 md:py-24 bg-slate-50 border-y border-slate-200">
      <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-4 text-center">
        
        {/* Centered Heading Block */}
        <div className="mb-10 md:mb-14 flex flex-col items-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-1.5 border border-green-100">
            <Mail className="w-3.5 h-3.5 text-green-700" />
            <span className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-green-700">
              Newsletter
            </span>
          </p>

          <div className="mt-4 flex flex-col items-center justify-center group">
            <h2 className="
              text-xl sm:text-2xl md:text-5xl 
              font-extrabold tracking-tight text-center
              bg-gradient-to-r from-slate-900 via-green-700 to-slate-900
              bg-clip-text text-transparent
              motion-safe:transition-transform motion-safe:duration-500
            ">
              Stay Connected with Ragga
            </h2>
            <span className="
              mt-3 h-1 w-16 rounded-full
              bg-gradient-to-r from-green-500 via-emerald-500 to-green-600
              motion-safe:transition-all motion-safe:duration-500
              group-hover:w-32
            " />
          </div>
        </div>

        <p className="text-base md:text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join our mailing list to receive updates on parliamentary activities,
          community projects, and upcoming town hall meetings.
        </p>

        <form
          className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Email Address"
            className="flex-1 px-6 py-4 rounded-2xl border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none shadow-sm text-base"
            required
          />
          <Button variant="primary" size="lg" className="sm:w-auto w-full py-4 text-base font-bold">
            Subscribe
          </Button>
        </form>
        <p className="text-sm text-slate-400 mt-6">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}