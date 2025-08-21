import { Mail, Instagram, Facebook, Globe } from "lucide-react";

function MemberCard({ m }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center">
      <img src={m.avatar} alt={m.name} className="w-24 h-24 rounded-full mb-3" />
      <h2 className="text-lg font-semibold">{m.name}</h2>
      <p className="text-sm text-gray-500 mb-2">{m.role}</p>

      <div className="flex gap-3 mt-2">
        {m.links?.portfolio && (
          <a href={m.links.portfolio} target="_blank" rel="noreferrer">
            <Globe className="w-5 h-5 text-pink-500 hover:text-pink-700" />
          </a>
        )}
        {m.links?.facebook && (
          <a href={m.links.facebook} target="_blank" rel="noreferrer">
            <Facebook className="w-5 h-5 text-blue-600 hover:text-blue-800" />
          </a>
        )}
        {m.links?.instagram && (
          <a href={m.links.instagram} target="_blank" rel="noreferrer">
            <Instagram className="w-5 h-5 text-pink-400 hover:text-pink-600" />
          </a>
        )}
        {m.links?.email && (
          <a href={`mailto:${m.links.email}`} target="_blank" rel="noreferrer">
            <Mail className="w-5 h-5 text-gray-600 hover:text-gray-800" />
          </a>
        )}
      </div>
    </div>
  );
}
