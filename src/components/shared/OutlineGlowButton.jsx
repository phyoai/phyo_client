import Link from "next/link";

const baseClassName =
  "group relative isolate inline-flex items-center justify-center overflow-visible rounded-[40px] bg-transparent font-inter text-[16px] font-normal capitalize leading-[1.2] text-white transition-colors duration-300 ease-out hover:bg-[#141615] active:bg-[#16A34A] active:text-white";

function joinClasses(...classNames) {
  return classNames.filter(Boolean).join(" ");
}

function ButtonLayers({
  children,
  baseSurfaceClassName,
  glowSurfaceClassName,
}) {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[40px] bg-[linear-gradient(270deg,#16A34A_0%,#FFF_52.88%,#16A34A_100%)] p-[0.5px] opacity-0 blur-[2px] transition-opacity duration-300 ease-out group-hover:opacity-100 group-active:opacity-0"
      >
        <span
          className={joinClasses(
            "block h-full w-full rounded-[inherit] group-active:bg-transparent",
            glowSurfaceClassName
          )}
        />
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[40px] bg-white p-px transition-all duration-300 ease-out group-hover:bg-[linear-gradient(270deg,#16A34A_0%,#FFF_52.88%,#16A34A_100%)] group-hover:p-[2px] group-active:bg-transparent group-active:p-0 group-active:opacity-0 hover:shadow-[0_0_18px_rgba(22,163,74,0.5)]"
      >
        <span
          className={joinClasses(
            "block h-full w-full rounded-[inherit] group-active:bg-transparent",
            baseSurfaceClassName
          )}
        />
      </span>
      <span className="relative z-10 leading-[1.2]">{children}</span>
    </>
  );
}

export default function OutlineGlowButton({
  href,
  className,
  children,
  baseSurfaceClassName = "bg-[#102919]",
  glowSurfaceClassName = "bg-[#141615]",
  type = "button",
  ...props
}) {
  const mergedClassName = joinClasses(baseClassName, className);

  if (href) {
    return (
      <Link href={href} className={mergedClassName} {...props}>
        <ButtonLayers
          baseSurfaceClassName={baseSurfaceClassName}
          glowSurfaceClassName={glowSurfaceClassName}
        >
          {children}
        </ButtonLayers>
      </Link>
    );
  }

  return (
    <button type={type} className={mergedClassName} {...props}>
      <ButtonLayers
        baseSurfaceClassName={baseSurfaceClassName}
        glowSurfaceClassName={glowSurfaceClassName}
      >
        {children}
      </ButtonLayers>
    </button>
  );
}
