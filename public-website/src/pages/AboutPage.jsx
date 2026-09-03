import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import PageHero from '../components/PageHero.jsx';

const capabilities = [
  {
    title: 'RFID Readers & Scanners',
    description:
      'Handheld and fixed readers manufactured across different purposes, categories and communication interfaces, so the hardware matches how a customer actually works.',
  },
  {
    title: 'Antenna Design & Fabrication',
    description:
      'In-house R&D on RFID antennas, from simulation through to fabrication — covering UHF gain profiles from 6dBi to 12dBi plus near-field designs.',
  },
  {
    title: 'Custom RFID Solutions',
    description:
      "No two operations track inventory the same way. Our customization feasibility lets us configure hardware to a client's environment instead of forcing a one-size-fits-all box.",
  },
  {
    title: 'Third-Party Reader Manufacturing',
    description:
      'Beyond our own product line, we manufacture RFID readers on a contract basis for other businesses, built to their specifications and demand.',
  },
  {
    title: 'SDKs & Integration Support',
    description:
      'Every reader ships with SDKs and demo software so engineering teams can integrate our hardware into their own applications without starting from scratch.',
  },
];

const antennaRange = ['UHF 9dBi', 'UHF 6dBi', 'UHF 12dBi', 'Near-Field'];

const industries = [
  'Retail & Inventory',
  'Warehousing & Logistics',
  'Libraries & Archives',
  'Manufacturing Lines',
  'Asset Tracking',
  'Access Control',
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <PageHero
        eyebrow="About Us"
        title="RFID hardware, designed and manufactured in-house"
        subtitle="We're an RFID hardware manufacturer with our own R&D and production setup — we build the readers and antennas behind the scenes so businesses can track what matters without stitching together parts from a dozen vendors."
      />

      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-semibold text-slate-900">Who we are</h2>
          <p className="mt-4 leading-relaxed text-slate-600">
            Virtualsphere Technologies builds RFID hardware from the ground up. Rather than reselling
            off-the-shelf components, we run our own manufacturing and R&D setup — engineering antennas in
            house and manufacturing our own readers — and we stand behind every device with the SDKs and demo
            software teams need to put it to work quickly. RFID is the one thing we focus on, and it shows in
            the range of hardware we ship and the support we give the companies that deploy it.
          </p>
          <p className="mt-4 leading-relaxed text-slate-600">
            From a single handheld reader for a pilot project to a full fleet of fixed readers across a
            warehouse, we work with businesses at whatever stage they're at — sourcing the right hardware,
            configuring it for their environment, and staying involved after it ships.
          </p>
        </section>

        <section className="bg-white py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-2xl font-semibold text-slate-900">What we do</h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              RFID solutions and hardware devices, end to end — antenna R&D, reader manufacturing, and the
              software support to get it running.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-5">
              {capabilities.map((item) => (
                <div
                  key={item.title}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.834rem)]"
                >
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#0B0B14] py-16">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 85% 20%, #1A73E8 0%, transparent 40%), radial-gradient(circle at 10% 90%, #e11d2e 0%, transparent 35%)',
            }}
          />
          <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 md:grid-cols-2 md:items-center">
            <div>
              <span className="mb-3 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#5b9df9] ring-1 ring-inset ring-white/10">
                Research & Development
              </span>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Antenna design, simulation and fabrication in-house
              </h2>
              <p className="mt-4 leading-relaxed text-slate-300">
                Our team of engineers runs its own R&D on RFID antennas — from early simulation work through
                to physical fabrication in our own unit. That in-house loop lets us test an antenna's
                performance before it ever reaches a customer, and adjust the design when a deployment calls
                for something more specific than an off-the-shelf part.
              </p>
              <p className="mt-4 leading-relaxed text-slate-300">
                That work has produced a working range of UHF antennas across multiple gain profiles, plus
                near-field antennas for close-range and item-level applications.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {antennaRange.map((label) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center text-sm font-semibold text-white"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-2xl font-semibold text-slate-900">
              Readers built for every purpose, category and interface
            </h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">
              Our manufacturing unit doesn't produce a single reader design — it produces readers across
              different purposes, categories and communication interfaces, so the hardware can be matched to
              how a customer actually works rather than the other way around. Because we control the
              manufacturing process ourselves, we can push customization further than a typical off-the-shelf
              vendor, configuring readers to give a deployment its maximum capacity for the end solution it's
              built for.
            </p>

            <div className="mt-8 rounded-2xl border border-[#1A73E8]/20 bg-blue-50 p-6 sm:p-8">
              <h3 className="font-semibold text-slate-900">Third-Party RFID Reader Manufacturing</h3>
              <p className="mt-2 max-w-3xl leading-relaxed text-slate-700">
                Alongside our own product line, we also manufacture RFID readers on a contract basis for
                other businesses — built to their specifications and demand, so partners get purpose-built
                hardware without setting up a manufacturing line of their own.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-semibold text-slate-900">Trusted across industries</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            We work alongside companies of every size to plan, deploy and support their RFID hardware —
            from a first pilot reader to a multi-site rollout.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {industries.map((industry) => (
              <span
                key={industry}
                className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-[#1A73E8]"
              >
                {industry}
              </span>
            ))}
          </div>
        </section>

        <section className="bg-[#12121A] py-14">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 text-center sm:px-6">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Looking for an RFID hardware partner?</h2>
            <p className="max-w-xl text-slate-300">
              Browse our reader lineup or get in touch and we'll help you find the right hardware for your
              project.
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/"
                className="rounded-md bg-[#1A73E8] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#1560c9]"
              >
                BROWSE READERS
              </Link>
              <a
                href="https://virtualspheretechnologies.in/contact"
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-white/20 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                CONTACT US
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
