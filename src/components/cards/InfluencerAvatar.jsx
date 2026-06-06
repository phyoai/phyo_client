export default function InfluencerAvatar({ name, avatar, bgColor = 'bg-[#2f2f2f]', onClick }) {
  return (
    <div
      className="flex flex-col items-center gap-[8px] flex-shrink-0 cursor-pointer w-[120px]"
      onClick={onClick}
    >
      {/* Full-width circle avatar — aspect-square so it's always round */}
      <div className={`w-full aspect-square ${bgColor} rounded-full overflow-hidden flex items-center justify-center`}>
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <span className="text-white text-2xl font-semibold">
            {name?.charAt(0)?.toUpperCase()}
          </span>
        )}
      </div>
      <span
        className="text-[16px] font-normal text-[#9A9A9A] capitalize text-center leading-[1.2] w-full truncate"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {name}
      </span>
    </div>
  );
}
