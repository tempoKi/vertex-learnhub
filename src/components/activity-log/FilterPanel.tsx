import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X, Filter, ArrowDown, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LogFilter, LogSeverity, FilterPanelProps } from "@/types/activity-log";

const FilterPanel = ({ 
  filter, 
  onFilterChange, 
  loading = false, 
  onRefresh = () => {}, 
  activeFilters = {},
  availableCategories = ["user_management", "class_management", "security", "system"],
  availableActions = ["login", "create", "update", "delete", "view"]
}: FilterPanelProps) => {
  const [from, setFrom] = useState<Date | undefined>(
    activeFilters.fromDate ? new Date(activeFilters.fromDate) : undefined
  );
  const [to, setTo] = useState<Date | undefined>(
    activeFilters.toDate ? new Date(activeFilters.toDate) : undefined
  );
  const [search, setSearch] = useState(activeFilters.search || "");
  const [selectedSeverities, setSelectedSeverities] = useState<LogSeverity[]>(
    Array.isArray(activeFilters.severity) ? activeFilters.severity : 
    activeFilters.severity ? [activeFilters.severity] : []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    activeFilters.categories || []
  );
  const [selectedActions, setSelectedActions] = useState<string[]>(
    activeFilters.actions || []
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange({ search });
    }, 500);
    
    return () => clearTimeout(handler);
  }, [search, onFilterChange]);
  
  useEffect(() => {
    const fromDate = from ? format(from, 'yyyy-MM-dd') : undefined;
    const toDate = to ? format(to, 'yyyy-MM-dd') : undefined;
    
    onFilterChange({ 
      fromDate, 
      toDate 
    });
  }, [from, to, onFilterChange]);
  
  const handleSeverityChange = (severity: LogSeverity) => {
    const newSeverities = selectedSeverities.includes(severity)
      ? selectedSeverities.filter(s => s !== severity)
      : [...selectedSeverities, severity];
    
    setSelectedSeverities(newSeverities);
    onFilterChange({ severity: newSeverities.length ? newSeverities : undefined });
  };
  
  const handleCategoryChange = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    onFilterChange({ categories: newCategories.length ? newCategories : undefined });
  };
  
  const handleActionChange = (action: string) => {
    const newActions = selectedActions.includes(action)
      ? selectedActions.filter(a => a !== action)
      : [...selectedActions, action];
    
    setSelectedActions(newActions);
    onFilterChange({ actions: newActions.length ? newActions : undefined });
  };

  const clearFilters = () => {
    setFrom(undefined);
    setTo(undefined);
    setSearch("");
    setSelectedSeverities([]);
    setSelectedCategories([]);
    setSelectedActions([]);
    
    onFilterChange({
      fromDate: undefined,
      toDate: undefined,
      search: "",
      severity: undefined,
      categories: undefined,
      actions: undefined
    });
  };
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const hasActiveFilters = !!activeFilters.search || 
    !!activeFilters.fromDate || 
    !!activeFilters.toDate ||
    (!!activeFilters.severity && 
      (Array.isArray(activeFilters.severity) ? 
        activeFilters.severity.length > 0 : true)) ||
    (!!activeFilters.categories && activeFilters.categories.length > 0) ||
    (!!activeFilters.actions && activeFilters.actions.length > 0);
  
  return (
    <Card className="p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-medium">Filters</h3>
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              Active
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters}
              className="text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
          <Button variant="outline" size="icon" onClick={onRefresh} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleCollapse}>
            <ArrowDown className={cn("h-4 w-4 transition-transform", isCollapsed ? "rotate-180" : "")} />
          </Button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {from ? format(from, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={from}
                    onSelect={setFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {to ? format(to, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={to}
                    onSelect={setTo}
                    initialFocus
                    disabled={(date) => (from ? date < from : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="severity">
              <AccordionTrigger>Severity</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="severity-info" 
                      checked={selectedSeverities.includes('info')}
                      onCheckedChange={() => handleSeverityChange('info')}
                    />
                    <Label htmlFor="severity-info" className="flex items-center">
                      <Badge className="bg-green-500 mr-2">Info</Badge>
                      Information logs
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="severity-warning" 
                      checked={selectedSeverities.includes('warning')}
                      onCheckedChange={() => handleSeverityChange('warning')}
                    />
                    <Label htmlFor="severity-warning" className="flex items-center">
                      <Badge className="bg-yellow-500 mr-2">Warning</Badge>
                      Warning logs
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="severity-error" 
                      checked={selectedSeverities.includes('error')}
                      onCheckedChange={() => handleSeverityChange('error')}
                    />
                    <Label htmlFor="severity-error" className="flex items-center">
                      <Badge className="bg-red-500 mr-2">Error</Badge>
                      Error logs
                    </Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="categories">
              <AccordionTrigger>Categories</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {availableCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category}`} 
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category)}
                      />
                      <Label htmlFor={`category-${category}`}>
                        {category.replace('_', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="actions">
              <AccordionTrigger>Actions</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
                  {availableActions.map((action) => (
                    <div key={action} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`action-${action}`} 
                        checked={selectedActions.includes(action)}
                        onCheckedChange={() => handleActionChange(action)}
                      />
                      <Label htmlFor={`action-${action}`}>
                        {action.replace('_', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </Card>
  );
};

export default FilterPanel;
