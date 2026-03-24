import DiscordPresence from "./DiscordPresence";

export default function GeneralContent() {
  return (
    <div className="animation opacity-0 px-2 pb-32 space-y-6 md:space-y-8 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
      <div id="general-info">
        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mb-4">
          <span className="text-secondary-1">General</span>
          <span className="text-secondary-2 ml-2">Information</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base md:text-xl">
              Hello! I'm FuZa, a passionate developer. I love creating
              beautiful, interactive, and high-performance applications. My
              skill set covers both front-end and back-end development, allowing
              me to build complete solutions from scratch.
            </p>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base md:text-xl">
              When I'm not coding, I enjoy immersing myself in Anime and Gaming.
              These hobbies inspire my creative designs and attention to visual
              detail.
            </p>
          </div>

          <DiscordPresence />
        </div>
      </div>
    </div>
  );
}
