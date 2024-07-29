"use client"

import {Button} from "@/components/ui/button"
import {useState} from "react"
import {client} from "@/http/axios";
import {toast} from "@/components/ui/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import TaskForm from "@/components/task-form";

interface CreateTaskProps {
    onSubmit: () => void
}

export default function CreateTask({onSubmit}: CreateTaskProps) {

    const [open, setOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const createTask = (data: any) => {
        setLoading(true);
        client.post('/task', data)
            .then(response => {
                toast({
                    variant: response.data.variant,
                    title: response.data.title,
                    description: response.data.description
                })
                setLoading(false);
                setOpen(false);
                onSubmit();
            });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Schedule new task</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-xl">Create task</DialogTitle>
                </DialogHeader>
                <TaskForm onSubmit={createTask} isLoading={isLoading}/>
            </DialogContent>
        </Dialog>
    )
}
