
import { useState } from "react";
import { Student } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  Edit, 
  Eye, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Trash2
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface StudentTableProps {
  students: Student[];
}

const StudentTable = ({ students }: StudentTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter students based on search term
  const filteredStudents = students.filter((student) =>
    `${student.firstName} ${student.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) || 
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative w-full sm:w-auto flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        <Button className="w-full sm:w-auto">
          <Plus size={16} className="mr-2" />
          New Student
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead className="hidden lg:table-cell">Enrolled</TableHead>
              <TableHead className="hidden lg:table-cell">Classes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.id} className="group">
                  <TableCell className="font-medium">
                    {student.firstName} {student.lastName}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize",
                        student.status === "active" && "border-green-200 bg-green-50 text-green-700",
                        student.status === "inactive" && "border-red-200 bg-red-50 text-red-700",
                        student.status === "pending" && "border-yellow-200 bg-yellow-50 text-yellow-700"
                      )}
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {student.email || "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {student.phone || "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {new Date(student.enrollmentDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {student.classes.length}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-70 group-hover:opacity-100"
                        >
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Student Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link to={`/students/${student.id}`}>
                            <Eye size={16} className="mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link to={`/students/${student.id}/edit`}>
                            <Edit size={16} className="mr-2" />
                            Edit Student
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600 cursor-pointer"
                          onClick={() => {
                            // Handle delete
                            console.log("Delete student", student.id);
                          }}
                        >
                          <Trash2 size={16} className="mr-2" />
                          Delete Student
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StudentTable;
