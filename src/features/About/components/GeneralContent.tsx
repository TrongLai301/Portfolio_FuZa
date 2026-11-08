import DiscordPresence from "./DiscordPresence";

export default function GeneralContent() {
  return (
    <div className="animation opacity-0 w-full px-2 sm:px-4 py-2">
      {/* Header + Discord */}
      <div id="general-info">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">
          <span className="text-secondary-1">General</span>
          <span className="text-secondary-2 ml-2">Information</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-5">
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg">
              Hello! I'm <span className="text-cyan-400 font-semibold">FuZa</span>, a passionate developer. I love creating
              beautiful, interactive, and high-performance applications. My
              skill set covers both front-end and back-end development, allowing
              me to build complete solutions from scratch.
            </p>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg">
              Beyond coding, life is about <span className="text-cyan-400 font-semibold">memories</span>. I cherish every
              adventure — from exploring new places to late-night hangouts
              with friends. These are the moments that inspire me to keep
              building and growing.
            </p>
          </div>

          <div className="w-full flex justify-center lg:justify-end">
            <DiscordPresence />
          </div>
        </div>
      </div>
    </div>
  );
}
