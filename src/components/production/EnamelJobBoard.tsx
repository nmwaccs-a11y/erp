import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal, Clock, Play, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateJobModal } from "./CreateJobModal";
import { EnamelLogModal } from "./EnamelLogModal";

interface JobCardProps {
    id: string;
    item: string;
    operator: string;
    progress: number;
    priority: "High" | "Normal";
    status: "pending" | "running" | "completed";
}

function JobCard({ job, onAction }: { job: JobCardProps, onAction: (id: string, action: "start" | "finish") => void }) {
    return (
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-2">
                <Badge variant={job.priority === "High" ? "destructive" : "secondary"} className="text-[10px] h-5">
                    {job.priority}
                </Badge>
                <button className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal className="h-4 w-4" />
                </button>
            </div>
            <h4 className="font-medium text-sm text-slate-900 mb-1">{job.item}</h4>
            <div className="text-xs text-slate-500 font-mono mb-3">{job.id}</div>

            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-[10px] bg-blue-100 text-blue-700">
                            {job.operator.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-slate-600">{job.operator}</span>
                </div>
                {job.status === "running" && (
                    <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <Clock className="h-3 w-3" />
                        {job.progress}%
                    </div>
                )}
            </div>

            <div className="mt-3 flex justify-end">
                {job.status === "pending" && (
                    <Button size="sm" variant="outline" className="h-7 text-xs border-blue-200 text-blue-600 hover:bg-blue-50" onClick={() => onAction(job.id, "start")}>
                        <Play className="h-3 w-3 mr-1" /> Start
                    </Button>
                )}
                {job.status === "running" && (
                    <Button size="sm" variant="outline" className="h-7 text-xs border-emerald-200 text-emerald-600 hover:bg-emerald-50" onClick={() => onAction(job.id, "finish")}>
                        <CheckCircle className="h-3 w-3 mr-1" /> Finish
                    </Button>
                )}
            </div>
        </div>
    );
}

export default function EnamelJobBoard() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isLogOpen, setIsLogOpen] = useState(false);
    const [finishingJobId, setFinishingJobId] = useState("");
    const [jobs, setJobs] = useState<JobCardProps[]>([
        { id: "J-101", item: "Enamel 18 SWG", operator: "Ali", progress: 0, priority: "High", status: "pending" },
        { id: "J-104", item: "Enamel 20 SWG", operator: "N/A", progress: 0, priority: "Normal", status: "pending" },
        { id: "J-102", item: "Enamel 24 SWG", operator: "Bilal", progress: 45, priority: "Normal", status: "running" },
        { id: "J-105", item: "Enamel 19 SWG", operator: "Raza", progress: 12, priority: "High", status: "running" },
        { id: "J-099", item: "Enamel 22 SWG", operator: "Ahmed", progress: 100, priority: "Normal", status: "completed" },
    ]);

    const pendingJobs = jobs.filter(j => j.status === "pending");
    const runningJobs = jobs.filter(j => j.status === "running");
    const completedJobs = jobs.filter(j => j.status === "completed");

    const handleCreateJob = (newJob: { item: string, operator: string, priority: "High" | "Normal" }) => {
        const job: JobCardProps = {
            id: `J-${106 + jobs.length}`,
            item: newJob.item,
            operator: newJob.operator,
            progress: 0,
            priority: newJob.priority,
            status: "pending"
        };
        setJobs([...jobs, job]);
    };

    const handleMoveJob = (id: string, action: "start" | "finish") => {
        if (action === "finish") {
            setFinishingJobId(id);
            setIsLogOpen(true);
            return;
        }
        setJobs(jobs.map(job => {
            if (job.id === id && action === "start") {
                return { ...job, status: "running", progress: 0 };
            }
            return job;
        }));
    };

    const handleLogSubmit = (data: any) => {
        console.log("Enamel Production Log:", data);
        setJobs(jobs.map(job => {
            if (job.id === data.jobId) {
                return { ...job, status: "completed", progress: 100 };
            }
            return job;
        }));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[500px]">
            <CreateJobModal open={isCreateOpen} onOpenChange={setIsCreateOpen} onSubmit={handleCreateJob} />
            <EnamelLogModal
                open={isLogOpen}
                onOpenChange={setIsLogOpen}
                jobId={finishingJobId}
                onSubmit={handleLogSubmit}
            />

            {/* Pending Column */}
            <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                        Queue
                    </h3>
                    <Badge variant="outline" className="bg-white">{pendingJobs.length}</Badge>
                </div>
                <div className="flex flex-col gap-3">
                    {pendingJobs.map(job => <JobCard key={job.id} job={job} onAction={handleMoveJob} />)}
                    <div
                        onClick={() => setIsCreateOpen(true)}
                        className="border-2 border-dashed border-slate-200 rounded-lg p-3 text-center text-xs text-slate-400 hover:border-blue-300 hover:text-blue-500 cursor-pointer transition-colors"
                    >
                        + Add New Job
                    </div>
                </div>
            </div>

            {/* Running Column */}
            <div className="bg-blue-50/30 rounded-xl p-4 border border-blue-100 flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                    <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        In Production
                    </h3>
                    <Badge variant="outline" className="bg-white text-blue-700 border-blue-200">{runningJobs.length}</Badge>
                </div>
                <div className="flex flex-col gap-3">
                    {runningJobs.map(job => <JobCard key={job.id} job={job} onAction={handleMoveJob} />)}
                </div>
            </div>

            {/* Completed Column */}
            <div className="bg-emerald-50/30 rounded-xl p-4 border border-emerald-100 flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                    <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Completed
                    </h3>
                    <Badge variant="outline" className="bg-white text-emerald-700 border-emerald-200">{completedJobs.length}</Badge>
                </div>
                <div className="flex flex-col gap-3">
                    {completedJobs.map(job => <JobCard key={job.id} job={job} onAction={() => { }} />)}
                </div>
            </div>
        </div>
    );
}
