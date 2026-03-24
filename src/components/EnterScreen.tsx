import { useEnter } from "../commons/EnterContext";

export default function EnterScreen() {
  const { isEntered, enter } = useEnter();

  if (isEntered) return null;

  return (
    <div 
      className="fixed inset-0 z-9999 flex items-center justify-center cursor-pointer transition-opacity duration-1000"
      onClick={enter}
    >
      {/* Lớp sương mù trong suốt đè lên background */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md transition-opacity"></div>
      
      {/* Text Click to enter nằm trên cùng */}
      <span className="relative z-10 text-white text-3xl font-bold tracking-[0.2em] animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
        click to enter...
      </span>
    </div>
  );
}
