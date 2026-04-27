import Image from "next/image";
import OutlineGlowButton from "@/components/shared/OutlineGlowButton";

const LoginModal = ({ onLogin, onLater }) => {
  return (
    <div className="relative h-[566px] w-[520px] max-w-full shrink-0 overflow-hidden rounded-[24px] bg-[#001a0a]">
      <div className="pointer-events-none absolute bottom-[-351px] right-[-350px] h-[830px] w-[824px] rotate-[27.85deg] rounded-full bg-[radial-gradient(circle,rgba(22,163,74,0.38)_0%,rgba(22,163,74,0.14)_38%,rgba(22,163,74,0.04)_58%,transparent_73%)]" />

      <div className="relative z-10 flex h-full w-full flex-col items-center gap-8 px-10 pt-10">
        <Image
          src="/landing/login_modal/loginmodal.svg"
          alt=""
          aria-hidden="true"
          width={220}
          height={240}
          className="h-[240px] w-[220px] shrink-0 object-contain"
        />

        <div className="flex w-full flex-col items-center gap-5">
          <div className="flex w-full flex-col items-center gap-3 text-center">
            <h2 className="font-bricolage text-[36px] font-medium leading-[1.2] capitalize text-white">
              Login <span className="text-[#16a34a]">Required</span>
            </h2>
            <p className="w-[338px] text-[16px] leading-[1.6] text-[#9b9b9b]">
              Please login to use the AI search feature and discover
              influencers.
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-5">
            <OutlineGlowButton
              onClick={onLogin}
              className="h-12 w-full"
              baseSurfaceClassName="bg-[#063d1a]"
              glowSurfaceClassName="bg-[#063d1a]"
            >
              Login To Continue
            </OutlineGlowButton>

            <button
              type="button"
              onClick={onLater}
              className="text-[16px] font-medium leading-[1.2] capitalize text-white transition hover:text-[#d8f5e1]"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
