import { Button } from "@/components/ui/button"
import { Bell, Bookmark, Home, Mail } from "lucide-react"
import Link from "next/link"

interface MenuBarProps {
    className?: string
}

export default function MenuBar({ className }: MenuBarProps) {
    return (
        <div className={className}>
            <Button variant="ghost" className="flex items-center justify-start gap-3" title="Home" asChild>
                <Link href={"/"}><Home className="" />
                    <span className="hidden lg:inline">Home</span>
                </Link>
            </Button>
             <Button variant="ghost" className="flex items-center justify-start gap-3" title="Notifications" asChild>
                <Link href={"/notifications"}><Bell className="" />
                    <span className="hidden lg:inline">Notifications</span>
                </Link>
            </Button>
             <Button variant="ghost" className="flex items-center justify-start gap-3" title="Messages" asChild>
                <Link href={"/messages"}><Mail className="" />
                    <span className="hidden lg:inline">Messages</span>
                </Link>
            </Button>
             <Button variant="ghost" className="flex items-center justify-start gap-3" title="Bookmarks" asChild>
                <Link href={"/bookmarks"}><Bookmark className="" />
                    <span className="hidden lg:inline">Bookmarks</span>
                </Link>
                </Button>
        </div>
    )
}