import Link from "next/link"
import {Bell, CircleUser} from "lucide-react"
import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {UserContext, UserContextType} from "@/app/userContext";
import {useContext, useState} from "react"
import {useRouter} from "next/navigation"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";
import Notification from "@/domain/Notification";
import {useInterval} from "@/lib/interval";
import {format} from "date-fns"

export function Header() {

    let {user, logoutUser} = useContext(UserContext) as UserContextType;
    let router = useRouter();
    let [notifications, setNotifications] = useState<Notification[]>([]);

    const logout = () => {
        logoutUser();
        router.push("/");
    }

    useInterval(() => fetchNotifications(), 1000);

    function fetchNotifications() {
        if (user) {
            fetch('http://localhost:8080/notifications', {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + user.token
                }
            })
                .then(res => {
                    if (res.status === 200) {
                        res.json().then(data => setNotifications(data as Notification[]))
                    }
                })
        }
    }

    return (
        <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b px-4 bg-primary md:px-6">
            <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold text-white"
            >
                <div>ADHD Handler</div>
            </Link>
            <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <div className="ml-auto flex-initial inline-flex gap-2">
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="rounded-full">
                                    <CircleUser className="h-5 w-5"/>
                                    <span className="sr-only">Toggle user menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {user ?
                                    <div>
                                        <DropdownMenuLabel>{user?.username}</DropdownMenuLabel>
                                        <DropdownMenuLabel>{user?.authority}</DropdownMenuLabel>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuItem onClick={() => logout()}>Log out</DropdownMenuItem>
                                    </div> : <div>
                                        <DropdownMenuItem>
                                            <Link href="/login">Login</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Link href="/signup">Sign up</Link>
                                        </DropdownMenuItem>
                                    </div>
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div>
                        {user &&
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="secondary" size="icon" className="rounded-full">
                                        <Bell className="h-5 w-5"/>
                                        <span className="sr-only">Toggle notifications</span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <h4 className="p-2 text-sm font-semibold leading-none">Notifications</h4>
                                    <Separator className="my-2"/>
                                    {notifications.length == 0 && <p className="px-2 text-sm font-normal">No result</p>}
                                    {notifications.length > 0 &&
                                        <ScrollArea className="h-72 rounded-md">
                                            <div className="px-4">
                                                {notifications.map((notification) => (
                                                    <div key={notification.id}>
                                                        <div
                                                            className="flex flex-row py-2">
                                                            <div className="text-sm font-medium">
                                                                {notification.message}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-row justify-between">
                                                            <p className="text-xs text-muted-foreground pt-2">
                                                                {format(notification.sentAt, 'dd-MM-yyyy HH:mm')}
                                                            </p>
                                                        </div>
                                                        <Separator className="my-2"/>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    }
                                </PopoverContent>
                            </Popover>}
                    </div>
                </div>
            </div>
        </header>
    )
}
