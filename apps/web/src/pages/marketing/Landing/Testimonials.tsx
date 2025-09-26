import s from "./Testimonials.module.css";

type Testimonial = {
  name: string;
  role: string;
  location: string;
  quote: string;
};

const primaryTestimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "Solo Traveler",
    location: "New York, USA",
    quote:
      "TripPlannerHQ saved me countless hours. Budget dashboards and the itinerary view gave me confidence to book last-minute detours without panic.",
  },
  {
    name: "Marcus Chen",
    role: "Family Organizer",
    location: "Singapore",
    quote:
      "Managing a family of five is chaos. Shared packing lists kept everyone accountable, and the currency tools meant we never overspent in Tokyo.",
  },
  {
    name: "Emma Rodriguez",
    role: "Creator & Travel Coach",
    location: "Barcelona, Spain",
    quote:
      "I build trips for clients every week. TripPlannerHQ lets me duplicate templates, tweak budgets, and deliver polished itineraries in record time.",
  },
  {
    name: "Liam O'Connor",
    role: "Remote Worker",
    location: "Dublin, Ireland",
    quote:
      "Expense syncing across currencies is unbelievable. I always know how much I’ve spent in both euros and dollars before I submit reports.",
  },
  {
    name: "Anika Patel",
    role: "Group Organizer",
    location: "Mumbai, India",
    quote:
      "Nine friends. Three countries. One planner. Every traveler could see payments, deadlines, and packing in a single shared dashboard.",
  },
  {
    name: "Noah Williams",
    role: "Honeymoon Planner",
    location: "Vancouver, Canada",
    quote:
      "The AI itinerary suggestions gave us hidden gems for Santorini and helped us set a splurge-friendly budget we could actually stick to.",
  },
  {
    name: "Yara El-Sayed",
    role: "Adventure Guide",
    location: "Dubai, UAE",
    quote:
      "Multi-country tours used to be messy. Now I duplicate trip boards, adjust transport, and send out invites in less than ten minutes.",
  },
  {
    name: "Camila Fernández",
    role: "Family Traveler",
    location: "Buenos Aires, Argentina",
    quote:
      "Packing lists finally make sense. Each kid gets their own checklist, and I see progress in real time while we’re rushing to the airport.",
  },
  {
    name: "Jonah Smith",
    role: "College Backpacker",
    location: "Austin, USA",
    quote:
      "Hostel fees, train tickets, random street food—everything lands in one tracker. I stretched my budget across Europe for two extra weeks.",
  },
  {
    name: "Haruka Nishimura",
    role: "Culinary Explorer",
    location: "Kyoto, Japan",
    quote:
      "I catalog every restaurant, market, and tasting. TripPlannerHQ keeps my foodie itineraries tidy and warns me if dining costs drift too high.",
  },
];

const secondaryTestimonials: Testimonial[] = [
  {
    name: "Sofia Rossi",
    role: "Solo Sabbatical",
    location: "Rome, Italy",
    quote:
      "I took a six-month break to travel Europe. Daily spend nudges kept me on track without feeling restrictive.",
  },
  {
    name: "Ethan Nguyen",
    role: "Digital Nomad",
    location: "Ho Chi Minh City, Vietnam",
    quote:
      "Recurring trips are preset now. I copy last month’s plan, tweak coworking dates, and I’m ready to fly.",
  },
  {
    name: "Priya Das",
    role: "Family Adventurer",
    location: "Doha, Qatar",
    quote:
      "Coordinating multiple flights and villas is stressful. With TripPlannerHQ everyone gets automatic reminders and confirmations.",
  },
  {
    name: "Oliver Wright",
    role: "Travel Blogger",
    location: "Cape Town, South Africa",
    quote:
      "After every trip I export a beautiful summary for my followers. It’s become part of my content workflow.",
  },
  {
    name: "Maya Thompson",
    role: "Corporate Retreat Lead",
    location: "Seattle, USA",
    quote:
      "Budgets used to live in spreadsheets. Now finance sees everything in real time, and I focus on the experience.",
  },
  {
    name: "Gabriel Santos",
    role: "Surf Camper",
    location: "Lisbon, Portugal",
    quote:
      "Board rentals, ferries, and remote stays are all tracked in one place. TripPlannerHQ handles the logistics so I can chase waves.",
  },
  {
    name: "Leila Haddad",
    role: "Wellness Retreat Host",
    location: "Marrakesh, Morocco",
    quote:
      "AI packing suggestions helped guests show up prepared with sustainable items—we’ve cut down on emergency shopping runs.",
  },
  {
    name: "Hannah Fischer",
    role: "Festival Hopper",
    location: "Berlin, Germany",
    quote:
      "Friends hop in and out of trips mid-week. The per-segment budget makes splitting expenses easy even during festivals.",
  },
  {
    name: "Carlos Méndez",
    role: "Cycling Enthusiast",
    location: "Madrid, Spain",
    quote:
      "I map long rides, ferry transfers, and gear rentals. Every payment’s documented before we even hit the trail.",
  },
  {
    name: "Sumi Tan",
    role: "Gap Year Traveler",
    location: "Seoul, South Korea",
    quote:
      "My parents love the shared link. They see budgets and packing status without pinging me all day.",
  },
];

function Row({ items, direction }: { items: Testimonial[]; direction: "left" | "right" }) {
  const marqueeClass = direction === "left" ? s.marqueeLeft : s.marqueeRight;
  return (
    <div className={`${s.marquee} ${marqueeClass}`} role="presentation">
      <div className={s.marqueeTrack}>
        {[...items, ...items].map((testimonial, index) => (
          <article key={`${testimonial.name}-${index}`} className={s.card}>
            <p className={s.quote}>“{testimonial.quote}”</p>

            <div className={s.person}>
              <span className={s.avatarFallback}>
                {testimonial.name
                  .split(" ")
                  .map((part) => part.charAt(0))
                  .join("")
                  .slice(0, 2)}
              </span>
              <div className={s.personInfo}>
                <span className={s.personName}>{testimonial.name}</span>
                <span className={s.personMeta}>
                  {testimonial.role} — {testimonial.location}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className={s.section} id="testimonials">
      <div className={s.inner}>
        <header className={s.header}>
          <h2 className={s.title}>Loved by travelers worldwide</h2>
          <p className={s.subtitle}>
            Join thousands of travelers who plan smarter, stay on budget, and feel confident from takeoff to touchdown.
          </p>
        </header>

        <div className={s.rows}>
          <Row items={primaryTestimonials} direction="left" />
          <Row items={secondaryTestimonials} direction="right" />
        </div>
      </div>
    </section>
  );
}
