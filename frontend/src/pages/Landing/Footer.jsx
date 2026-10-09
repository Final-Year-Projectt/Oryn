
import { GiKnockedOutStars } from "react-icons/gi";
import { FiArrowUpRight } from "react-icons/fi";

function Footer() {
  return (
    <footer className="bg-[#172124] px-[6%] py-12 text-white sm:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-b border-white/15 pb-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-2xl font-bold text-white no-underline"
            >
              <GiKnockedOutStars size={30} color="#5CC8BD" />
              ORYN
            </a>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">
              Turn business data into meaningful insights, understand
              potential contributors, and make informed decisions.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white">
              EXPLORE
            </h3>

            <div className="mt-4 flex flex-col items-start gap-3">
              <a
                href="#features" 
                className="text-sm text-white/65 !no-underline transition-colors duration-200 hover:text-[#5CC8BD]"
              >
                Capabilities
              </a>

              <a
                href="#workflow"
                className="text-sm text-white/65 !no-underline transition-colors duration-200 hover:text-[#5CC8BD]"
              >
                How It Works
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white">
              GET STARTED
            </h3>

            <p className="mt-4 text-sm leading-6 text-white/65">
              Ready to explore your business data and discover what needs
              attention?
            </p>

            <a
              href="/login"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#5CCBD0] !no-underline transition-colors hover:text-white"
            >
              Explore ORYN
              <FiArrowUpRight size={17} />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ORYN. All rights reserved.</p>

          <p>Built to turn business signals into better decisions.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
