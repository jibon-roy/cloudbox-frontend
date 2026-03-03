"use client";

import { Grid3X3, List, Search, SortAsc, SortDesc } from "lucide-react";
import { ViewMode, SortOption, FilterType } from "./FileManagerPage";

type Props = {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: SortOption;
  onSortByChange: (sort: SortOption) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (order: "asc" | "desc") => void;
  filterType: FilterType;
  onFilterTypeChange: (type: FilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

const FileManagerToolbar = ({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  filterType,
  onFilterTypeChange,
  searchQuery,
  onSearchChange,
}: Props) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search files and folders..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-border-subtle bg-surface py-2 pl-10 pr-4 text-sm text-app-text placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* View & Sort Controls */}
      <div className="flex items-center gap-2">
        {/* Sort Options */}
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as SortOption)}
          className="rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-app-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="name">Name</option>
          <option value="modified">Modified</option>
          <option value="created">Created</option>
          <option value="size">Size</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => onFilterTypeChange(e.target.value as FilterType)}
          className="rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-app-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All</option>
          <option value="file">Files</option>
          <option value="folder">Folders</option>
        </select>

        {/* Sort Order Toggle */}
        <button
          onClick={() =>
            onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")
          }
          className="rounded-lg border border-border-subtle bg-surface p-2 text-muted transition-colors hover:bg-surface-soft hover:text-app-text"
          title={sortOrder === "asc" ? "Ascending" : "Descending"}
        >
          {sortOrder === "asc" ? (
            <SortAsc className="h-4 w-4" />
          ) : (
            <SortDesc className="h-4 w-4" />
          )}
        </button>

        {/* View Mode Toggle */}
        <div className="flex rounded-lg border border-border-subtle bg-surface">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`rounded-l-lg p-2 transition-colors ${
              viewMode === "grid"
                ? "bg-primary text-text-inverse"
                : "text-muted hover:bg-surface-soft hover:text-app-text"
            }`}
            title="Grid view"
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`rounded-r-lg p-2 transition-colors ${
              viewMode === "list"
                ? "bg-primary text-text-inverse"
                : "text-muted hover:bg-surface-soft hover:text-app-text"
            }`}
            title="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileManagerToolbar;
