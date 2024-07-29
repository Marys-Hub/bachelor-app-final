import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {MultiSelect} from "@/components/ui/multiselect";
import {TaskTag, taskTagFriendlyNames} from "@/domain/Task";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {CalendarIcon, Loader2} from "lucide-react";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {TimePickerDemo} from "@/components/ui/time-picker-demo";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Textarea} from "@/components/ui/textarea";
import {MagicWandIcon} from "@radix-ui/react-icons";
import {client} from "@/http/axios";
import {LoadingSpinner} from "@/components/ui/loading-sprinner";
import {useState} from "react";
import {toast} from "@/components/ui/use-toast";

const FormSchema = z.object({
    title: z.string({
        required_error: "Required"
    }),
    tags: z.array(z.string()).optional(),
    description: z.string({
        required_error: "Required"
    }),
    deadline: z.date({
        required_error: "Required"
    }),
});

export default function TaskForm({task, onSubmit, isLoading}: any) {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: task?.title,
            description: task?.description,
            deadline: task?.deadline,
            tags: task?.tags
        }
    });

    const title = form.watch('title');
    const tags = form.watch('tags');

    const [loadingDescription, setLoadingDescription] = useState(false);
    const generateDescription = () => {

        if (!title) {
            toast({
                title: "Title is required",
                description: "Title is required for generating description",
            })
            return;
        }
        setLoadingDescription(true);
        client.post('/task/description', {
            "tags": tags,
            "title": title
        })
            .then((response) => {
                form.setValue('description', response.data);
                setLoadingDescription(false);
            });
    };

    return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({field}) => (
                            <FormItem>
                                <Label>Title</Label>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tags"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Tags</FormLabel>
                                <FormControl>
                                    <MultiSelect
                                        options={Object.values(TaskTag).map(value => ({
                                            value,
                                            label: taskTagFriendlyNames[value]
                                        }))}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        placeholder="Select any tags"
                                        variant="inverted"
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-row justify-between">
                            <Label className="pt-2">Description</Label>
                            <div className="border-2 border-primary p-2 rounded-full hover:cursor-pointer hover:-translate-y-1 hover:scale-110 duration-300" onClick={() => generateDescription()}>
                                {loadingDescription ? <LoadingSpinner className="h-4 w-4"/> : <MagicWandIcon className="h-4 w-4"/>}
                            </div>
                        </div>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea rows={7} {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="deadline"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="text-left">Deadline</FormLabel>
                                <Popover>
                                    <FormControl>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "justify-start text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4"/>
                                                {field.value ? (
                                                    format(field.value, "PPP HH:mm:ss")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                    </FormControl>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                        <div className="p-3 border-t border-border">
                                            <TimePickerDemo
                                                setDate={field.onChange}
                                                date={field.value}
                                            />
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        {isLoading ? 'Loading' : 'Submit'}
                    </Button>
                </form>
            </Form>
    )
}