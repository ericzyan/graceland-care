import { Facebook, Instagram, Linkedin } from "lucide-react";

const socialProfiles = [
  { name: "Facebook", icon: <Facebook size={19} /> },
  { name: "Instagram", icon: <Instagram size={19} /> },
  {
    name: "TikTok",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16.6 2c.3 2.6 1.8 4.2 4.4 4.4v4.1a9.2 9.2 0 0 1-4.4-1.3v7.1a6.3 6.3 0 1 1-5.4-6.2v4.2a2.2 2.2 0 1 0 1.3 2V2h4.1Z" />
      </svg>
    ),
  },
  { name: "LinkedIn", icon: <Linkedin size={19} /> },
  {
    name: "X",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.3l7.9-9L.8 2h6.5l4.5 6.8L18.9 2Zm-1.1 18h1.8L6.3 3.9H4.4L17.8 20Z" />
      </svg>
    ),
  },
];

export default function SocialIcons() {
  return (
    <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Social media">
      {socialProfiles.map(({ name, icon }) => (
        // Profile URLs are pending; avoid sending visitors to an unverified account.
        <span
          key={name}
          role="img"
          aria-label={name}
          title={name}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-current/25"
        >
          <span aria-hidden="true">{icon}</span>
        </span>
      ))}
    </div>
  );
}
