import { sanitizeName } from '@/utils/sanitize-name';

export default function InfluencerAvatar({ name, avatar, bgColor = 'bg-[#2f2f2f]', onClick }) {
  const displayName = sanitizeName(name);
  return (
    <div
      className="flex flex-col items-center gap-[8px] flex-shrink-0 cursor-pointer w-[120px]"
      onClick={onClick}
    >
      <div className={`w-full aspect-square ${bgColor} rounded-full overflow-hidden flex items-center justify-center`}>
        {avatar ? (
          <img
            src={avatar}
            alt={displayName}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <span className="text-white text-2xl font-semibold">
            {displayName?.charAt(0)?.toUpperCase()}
          </span>
        )}
      </div>
      <span className="font-inter text-[16px] font-normal text-white capitalize text-center leading-[1.2] w-full truncate">
        {displayName}
      </span>
    </div>
  );
}
