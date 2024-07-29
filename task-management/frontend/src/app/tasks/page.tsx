"use client"

import {useContext, useEffect, useState} from "react";
import {client} from "@/http/axios";
import {Task, TaskStatus, TaskTag, taskTagFriendlyNames} from "@/domain/Task";
import CreateTask from "@/components/create-task";
import Tasks from "@/components/tasks";
import {UserContext, UserContextType} from "@/app/userContext";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {LoadingSpinner} from "@/components/ui/loading-sprinner";

export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [taskStatus, setTaskStatus] = useState("all");
    const [taskTag, setTaskTag] = useState("all");

    function getTasks() {
        if (user) {
            client.get('/task', {
                params: {
                    "status": taskStatus !== "all" ? taskStatus : undefined,
                    "tag": taskTag !== "all" ? taskTag : undefined
                }
            })
                .then((response) => {
                    setTasks(response.data.map((task: Task) => {
                            return {
                                ...task,
                                deadline: new Date(task.deadline),
                            }
                        }
                    ));
                })
                .finally(() => setLoading(false));
        }
    }

    useEffect(() => {
        getTasks();
    }, [taskStatus]);

    useEffect(() => {
        getTasks();
    }, [taskTag]);

    const [loading, setLoading] = useState(true);
    const {user} = useContext(UserContext) as UserContextType;

    useEffect(() => {
        if (user) {
            getTasks();
        }
    }, [user]);

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-row justify-between pb-6 px-4">
                <div className="flex flex-col gap-3">
                    <Tabs defaultValue="all" onValueChange={value => setTaskStatus(value)}>
                        <TabsList>
                            <TabsTrigger value={"all"}>All tasks</TabsTrigger>
                            <TabsTrigger value={TaskStatus.TO_DO}>To do</TabsTrigger>
                            <TabsTrigger value={TaskStatus.IN_PROGRESS}>In progress</TabsTrigger>
                            <TabsTrigger value={TaskStatus.DONE}>Done</TabsTrigger>
                            <TabsTrigger value={TaskStatus.DONE_AFTER_DEADLINE}>Done after
                                deadline</TabsTrigger>
                            <TabsTrigger value={TaskStatus.CANCELLED}>Cancelled</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Select onValueChange={value => setTaskTag(value)} defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Tag"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All tags</SelectItem>
                            {Object.values(TaskTag).map(tag => {
                                return <SelectItem key={tag}
                                                   value={tag}>{taskTagFriendlyNames[tag]}</SelectItem>
                            })}
                        </SelectContent>
                    </Select>
                </div>
                <CreateTask onSubmit={() => getTasks()}/>
            </div>
            {loading ?
                <div className="w-full flex justify-center">
                    <LoadingSpinner className="h-12 w-12"/>
                </div> :
                <Tasks items={tasks} refreshItems={() => getTasks()}/>}
        </div>
    )
}
