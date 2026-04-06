'use client'
import { Icon } from '@/components/ui/icons'

// Replace this with your actual APK download URL:
// - EAS Build: eas build --platform android --profile preview → copy URL
// - Google Drive: upload APK → share → "Anyone with link"
// - Firebase App Distribution: upload APK → copy invite link
const APK_DOWNLOAD_URL = 'https://expo.dev/@mirzahassan07/notarydesk'

export default function WaitlistStrip() {
  return (
    <div id="download" className="py-14" style={{ background: 'var(--primary)' }}>
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide" style={{ background: 'rgba(201,168,76,0.15)', color: 'var(--accent)', border: '1px solid rgba(201,168,76,0.25)' }}>
              <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'var(--accent)' }} /><span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: 'var(--accent)' }} /></span>
              EARLY ACCESS
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white -tracking-wide mb-1">
            Download NotaryDesk
          </p>
          <p className="text-sm text-white/50 max-w-md">
            Available on Android. Free to start — no credit card required. Join our beta and help shape the future of notary tools.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <a
            href={APK_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-[15px] no-underline transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            style={{ background: 'var(--accent)', color: 'var(--primary)' }}
          >
            <Icon name="smartphone" size={22} />
            Download for Android
            <Icon name="arrow_downward" size={18} />
          </a>
          <div className="flex items-center gap-4">
            <p className="text-[11px] text-white/30 flex items-center gap-1">
              <Icon name="shield" size={12} style={{ opacity: 0.5 }} />
              Safe & verified
            </p>
            <p className="text-[11px] text-white/30 flex items-center gap-1">
              <Icon name="smartphone" size={12} style={{ opacity: 0.5 }} />
              Android 7.0+
            </p>
            <p className="text-[11px] font-bold flex items-center gap-1" style={{ color: 'var(--accent)', opacity: 0.6 }}>
              <Icon name="phone_iphone" size={12} />
              iOS coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
