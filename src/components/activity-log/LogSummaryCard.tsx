
import { BarChart3, AlertTriangle, CheckCircle2, XCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogSummaryCardProps } from "@/types/activity-log";

const LogSummaryCard = ({ title, data, keyField, valueField }: LogSummaryCardProps) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.map((item: any, index: number) => (
            <div key={`${item[keyField]}-${index}`} className="flex items-center justify-between">
              <span className="text-xs font-medium">{item[keyField]}</span>
              <span className="text-xs">{item[valueField]}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LogSummaryCard;
