import { Search, ChevronDown } from "lucide-react";
import { Roles } from "@/generated/prisma/enums";

interface UserFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  roleFilter: Roles | "all";
  setRoleFilter: (role: Roles | "all") => void;
  onFilterChange: () => void; // For resetting pagination to page 1
}

const ALL_ROLES = Object.values(Roles);

export default function UserFilters({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  onFilterChange
}: UserFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-5">
      <div className="relative flex-1">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => { 
            setSearch(e.target.value); 
            onFilterChange(); 
          }}
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      <div className="relative">
        <select
          value={roleFilter}
          onChange={(e) => { 
            setRoleFilter(e.target.value as Roles | "all"); 
            onFilterChange(); 
          }}
          className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
        >
          <option value="all">All Roles</option>
          {ALL_ROLES.map((r) => (
            <option key={r} value={r}>{r.replace("_", " ")}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}