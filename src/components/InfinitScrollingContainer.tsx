import { cn } from "@/lib/utils";
import {useInView} from "react-intersection-observer"

interface InfinitScrollingContainerProps extends React.PropsWithChildren {
  onBottomHit: () => void;
  className?: string;
}

export default function InfinitScrollingContainer({
  onBottomHit,
  children,
  className,
}: InfinitScrollingContainerProps) {
    const { ref } = useInView({
        rootMargin: "200px",
        onChange(inView, entery) {
            if (inView) {
                onBottomHit(); 
            }
        }
    })

    return <div className={className}>
        {children}
        <div ref={ref} />
    </div>
}
