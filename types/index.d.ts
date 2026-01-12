export interface Issue {
  id?: string;
  project_id: string;
  title: string;
  description: string;
  status: "todo" | "doing" | "done" | "blocked";
}