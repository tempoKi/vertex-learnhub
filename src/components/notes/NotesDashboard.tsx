
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { NoteSummary } from "@/types/notes";
import { Skeleton } from "@/components/ui/skeleton";
import RecentNotesList from "@/components/notes/RecentNotesList";
import { Button } from "@/components/ui/button";
import { FileText, Users, BarChart3, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NotesDashboardProps {
  summary?: NoteSummary;
  isLoading: boolean;
  onStudentSelect: (studentId: string) => void;
  onClassSelect: (classId: string) => void;
}

const NotesDashboard = ({ 
  summary, 
  isLoading,
  onStudentSelect,
  onClassSelect
}: NotesDashboardProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Notes"
          value={summary?.total || 0}
          description="All notes created"
          icon={<FileText className="h-5 w-5 text-blue-500" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Academic Notes"
          value={summary?.byType.academic || 0}
          description="Academic performance notes"
          icon={<BarChart3 className="h-5 w-5 text-green-500" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Behavioral Notes"
          value={summary?.byType.behavioral || 0}
          description="Student behavior notes"
          icon={<Users className="h-5 w-5 text-orange-500" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Attendance Notes"
          value={summary?.byType.attendance || 0}
          description="Attendance related notes"
          icon={<Clock className="h-5 w-5 text-purple-500" />}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Notes</CardTitle>
            <CardDescription>Your most recently created notes</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <RecentNotesList 
                notes={summary?.recent || []} 
                onStudentSelect={onStudentSelect}
                onClassSelect={onClassSelect}
              />
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => navigate("/notes")}>
              View All Notes
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes By Type</CardTitle>
            <CardDescription>Distribution of note categories</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            {isLoading ? (
              <Skeleton className="h-[200px] w-[200px] rounded-full" />
            ) : (
              <div className="space-y-6 w-full">
                <NoteTypeBar 
                  type="Academic" 
                  count={summary?.byType.academic || 0}
                  total={summary?.total || 1}
                  color="bg-green-500"
                />
                <NoteTypeBar 
                  type="Behavioral" 
                  count={summary?.byType.behavioral || 0}
                  total={summary?.total || 1}
                  color="bg-orange-500"
                />
                <NoteTypeBar 
                  type="Attendance" 
                  count={summary?.byType.attendance || 0}
                  total={summary?.total || 1}
                  color="bg-purple-500"
                />
                <NoteTypeBar 
                  type="General" 
                  count={summary?.byType.general || 0}
                  total={summary?.total || 1}
                  color="bg-blue-500"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  isLoading: boolean;
}

const StatCard = ({ title, value, description, icon, isLoading }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-7 w-16" />
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

// Note Type Bar Component
interface NoteTypeBarProps {
  type: string;
  count: number;
  total: number;
  color: string;
}

const NoteTypeBar = ({ type, count, total, color }: NoteTypeBarProps) => {
  const percentage = Math.round((count / total) * 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{type}</span>
        <span className="text-muted-foreground">{count} ({percentage}%)</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full ${color}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default NotesDashboard;
