import { Star } from "lucide-react";
import s from "./Testimonials.module.css";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Solo traveler",
    location: "New York, USA",
    quote:
      "TripPlannerHQ saved me countless hours. Daily summaries kept my spending in check and the suggested cafes were spot on for each neighborhood.",
  },
  {
    name: "Marcus Chen",
    role: "Family organizer",
    location: "Singapore",
    quote:
      "The budgeting features alone paid for the subscription. I spotted savings for our Japan vacation and kept every receipt organized in one place.",
  },
  {
    name: "Emma Rodriguez",
    role: "Creator and travel coach",
    location: "Barcelona, Spain",
    quote:
      "I plan client itineraries every week. Having smart prompts for budgets and shareable packing lists lets me focus on delivering an amazing experience.",
  },
];

const stars = Array.from({ length: 5 });

export function Testimonials() {
  return (
    <section className={s.section} id="testimonials">
      <div className="container">
        <header className={s.header}>
          <h2 className={s.title}>Loved by travelers worldwide</h2>
          <p className={s.subtitle}>
            Join thousands of travelers who plan smarter, stay on budget, and feel confident from takeoff to touchdown.
          </p>
        </header>

        <div className={s.grid}>
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className={s.card}>
              <div className={s.rating}>
                {stars.map((_, index) => (
                  <Star key={index} size={18} fill="currentColor" strokeWidth={1.5} />
                ))}
              </div>

              <p className={s.quote}>"{testimonial.quote}"</p>

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
                    {testimonial.role} - {testimonial.location}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}



