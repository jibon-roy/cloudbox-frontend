import Link from "next/link";
import Logo from "../../ui-library/logo";

const MarketingFooter = () => {
  return (
    <footer className="mt-24 border-t border-border-subtle bg-surface-soft">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 lg:grid-cols-4 lg:px-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          <p className="text-sm leading-6 text-muted">
            Subscription-based file management platform for teams and
            enterprises with strict storage governance.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-app-text">Product</p>
          <div className="mt-3 space-y-2 text-sm text-muted">
            <Link href="/pricing" className="block hover:text-app-text">
              Pricing
            </Link>
            <Link href="/about" className="block hover:text-app-text">
              About Us
            </Link>
            <Link href="/contact" className="block hover:text-app-text">
              Contact
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-app-text">Use Cases</p>
          <div className="mt-3 space-y-2 text-sm text-muted">
            <p>SMB cloud storage</p>
            <p>Team collaboration</p>
            <p>Controlled file sharing</p>
          </div>
        </div>

        <div className="brand-glass rounded-2xl p-4">
          <p className="text-sm font-semibold text-app-text">Status</p>
          <p className="mt-2 text-sm text-muted">All systems operational</p>
          <p className="mt-4 text-xs text-muted">
            Built for reliable package-driven access controls.
          </p>
        </div>
      </div>
      <div className="border-t border-border-subtle px-5 py-5 text-center text-xs text-muted lg:px-10">
        © {new Date().getFullYear()} CloudBox. All rights reserved.
      </div>
    </footer>
  );
};

export default MarketingFooter;
