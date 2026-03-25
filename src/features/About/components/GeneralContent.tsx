import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad, faCamera } from "@fortawesome/free-solid-svg-icons";
import { faBilibili } from "@fortawesome/free-brands-svg-icons";
import DiscordPresence from "./DiscordPresence";

export default function GeneralContent() {
  const interests = [
    {
      icon: faBilibili,
      label: "Anime",
      desc: "Exploring favorite anime series — from action-packed battles to deep psychological stories.",
    },
    {
      icon: faGamepad,
      label: "Gaming",
      desc: "Competing in intense games, especially Valorant. Always chasing the next rank.",
    },
    {
      icon: faCamera,
      label: "Celebrates",
      desc: "Capturing unforgettable memories with friends — road trips, hangouts, and every adventure in between.",
    },
  ];

  return (
    <div className="animation opacity-0 h-full overflow-y-auto overflow-x-hidden custom-scrollbar px-2 py-2 space-y-6 md:space-y-8 pb-4">
      {/* Header + Discord */}
      <div id="general-info">
        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mb-4">
          <span className="text-secondary-1">General</span>
          <span className="text-secondary-2 ml-2">Information</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg">
              Hello! I'm <span className="text-indigo-400 font-semibold">FuZa</span>, a passionate developer. I love creating
              beautiful, interactive, and high-performance applications. My
              skill set covers both front-end and back-end development, allowing
              me to build complete solutions from scratch.
            </p>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg">
              Beyond coding, life is about <span className="text-indigo-400 font-semibold">memories</span>. I cherish every
              adventure — from exploring new places to late-night hangouts
              with friends. These are the moments that inspire me to keep
              building and growing.
            </p>
          </div>

          <DiscordPresence />
        </div>
      </div>

      {/* Interests — Including Celebrates */}
      <div>
        <h3 className="text-base sm:text-lg md:text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-indigo-500 rounded-full inline-block"></span>
          <span className="text-secondary-1">Personal</span>
          <span className="text-secondary-2 ml-1">Interests</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {interests.map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={item.icon} className="text-xl md:text-2xl text-indigo-400" />
                <span className="text-white font-bold text-sm md:text-base">
                  {item.label}
                </span>
              </div>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
