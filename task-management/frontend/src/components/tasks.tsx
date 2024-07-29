"use client"

import {
    Task,
    TaskStatus,
    taskStatusColor,
    taskStatusFriendlyName,
    taskTagColor,
    taskTagFriendlyNames
} from "@/domain/Task";
import {useState} from "react";
import {cn} from "@/lib/utils";
import {formatDistanceToNow} from "date-fns/formatDistanceToNow";
import {Badge} from "@/components/ui/badge";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreVertical, TimerOffIcon} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import TaskForm from "@/components/task-form";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {client} from "@/http/axios";
import {toast} from "@/components/ui/use-toast";
import {differenceInMilliseconds, format} from "date-fns";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {LoadingSpinner} from "@/components/ui/loading-sprinner";

interface TasksList {
    items: Task[],
    refreshItems: () => void
}

interface TaskSelected {
    selected: number
}

export default function Tasks({items, refreshItems}: TasksList) {
    const edit = (task: Task) => {
        setSelected(task);
    };

    const [selected, setSelected] = useState<Task | undefined>();
    const [isLoading, setLoading] = useState(false);
    const [itemIsLoading, setItemIsLoading] = useState<number | undefined>();

    const onSubmit = (data: any) => {
        setLoading(true);
        client.put('/task/' + selected?.id, data)
            .then(response => {
                toast({
                    variant: response.data.variant,
                    title: response.data.title,
                    description: response.data.description
                })
                setLoading(false);
                setSelected(undefined);
                refreshItems();
            });
    }

    const start = (item: Task) => {
        setItemIsLoading(item?.id);
        client.put('/task/' + item?.id + '/start')
            .then(response => {
                toast({
                    variant: response.data.variant,
                    title: response.data.title,
                    description: response.data.description
                })
                setItemIsLoading(undefined);
                refreshItems();
            });

    };
    const cancel = (item: Task) => {

        setItemIsLoading(item?.id);
        client.put('/task/' + item?.id + '/cancel')
            .then(response => {
                toast({
                    variant: response.data.variant,
                    title: response.data.title,
                    description: response.data.description
                })
                setItemIsLoading(undefined);
                refreshItems();
            });
    };

    const [selectedDelete, setSelectedDelete] = useState<Task | undefined>(undefined);

    const onDelete = () => {

        setItemIsLoading(selectedDelete?.id);
        client.delete('/task/' + selectedDelete?.id)
            .then(response => {
                toast({
                    variant: response.data.variant,
                    title: response.data.title,
                    description: response.data.description
                })
                setItemIsLoading(undefined);
                refreshItems();
            });
    }

    const complete = (item: Task) => {

        setItemIsLoading(item?.id);
        client.put('/task/' + item?.id + '/complete')
            .then(response => {
                toast({
                    variant: response.data.variant,
                    title: response.data.title,
                    description: response.data.description
                })
                setItemIsLoading(undefined);
                refreshItems();
            });
    };

    return (
        <div className="w-full flex flex-col gap-2 p-4 pt-0">
            <Dialog open={!!selected} onOpenChange={() => setSelected(undefined)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-xl">Update task</DialogTitle>
                    </DialogHeader>
                    <TaskForm task={selected} onSubmit={onSubmit} isLoading={isLoading}/>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!selectedDelete} onOpenChange={() => setSelectedDelete(undefined)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete()}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {items.length == 0 ?
                <div className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm">
                    No tasks available
                </div>
                : items.map((item) => (
                    <div
                        key={item.id}
                        className="flex flex-col items-start gap-3 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent"

                    >
                        <div className="flex w-full flex-col gap-1">
                            <div className="flex items-center">
                                <div className="flex items-center gap-2">
                                    <div className="font-semibold">{item.title}</div>
                                </div>
                                <div className="ml-auto text-xs text-muted-foreground">
                                    {itemIsLoading === item.id ? <LoadingSpinner /> :
                                    ![TaskStatus.DONE, TaskStatus.DONE_AFTER_DEADLINE].includes(item.status) &&
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                aria-haspopup="true"
                                                size="icon"
                                                variant="ghost"
                                            >
                                                <MoreVertical className="h-4 w-4"/>
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {[TaskStatus.TO_DO, TaskStatus.IN_PROGRESS].includes(item.status) &&
                                                <>
                                                    <DropdownMenuItem onClick={() => edit(item)}>Edit</DropdownMenuItem>
                                                    <Separator/>
                                                </>}
                                            {item.status === TaskStatus.TO_DO &&
                                                <>
                                                    <DropdownMenuItem
                                                        onClick={() => start(item)}>Start</DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => setSelectedDelete(item)}>Delete</DropdownMenuItem>
                                                </>}

                                            {item.status === TaskStatus.IN_PROGRESS &&
                                                <>
                                                    <DropdownMenuItem
                                                        onClick={() => cancel(item)}>Cancel</DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => complete(item)}>Complete</DropdownMenuItem>
                                                </>
                                            }

                                            {item.status === TaskStatus.CANCELLED &&
                                                <>
                                                    <DropdownMenuItem
                                                        onClick={() => start(item)}>Restart</DropdownMenuItem>
                                                </>
                                            }
                                        </DropdownMenuContent>
                                    </DropdownMenu>}
                                </div>
                            </div>
                        </div>
                        <div className="line-clamp-2 text-xs text-muted-foreground">
                            {item.description.substring(0, 300)}
                        </div>
                        <div className="flex flex-row gap-2">
                            <TimerOffIcon className="h-4 w-4"/>
                            {format(item.deadline, 'MM/dd/yyyy HH:mm:ss')}
                        </div>
                        <div className="flex w-full flex-row justify-between">
                            <div className="flex items-center gap-2">
                                {item.tags.length > 0 &&
                                    item.tags.map((tag) => (
                                        <Badge variant="outline" key={tag} className={cn(taskTagColor[tag])}>
                                            {taskTagFriendlyNames[tag]}
                                        </Badge>
                                    ))
                                }
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Badge variant="outline"
                                       className={cn("font-semibold text-md uppercase", taskStatusColor[item.status])}>
                                    {taskStatusFriendlyName[item.status]}
                                </Badge>
                                {item.status === TaskStatus.IN_PROGRESS &&
                                    (differenceInMilliseconds(new Date(), new Date(item.deadline)) < 0 ? 'Time remaining: ' + formatDistanceToNow(new Date(item.deadline))
                                    : 'Time passed: ' + formatDistanceToNow(new Date(item.deadline)))}
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    )
}