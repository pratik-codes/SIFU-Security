import React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '../ui/button';
import { MinusCircle } from "lucide-react";

const TransactionFilters = ({ daaps, onFilterSelect }: { daaps: Array<string>, onFilterSelect: (type: string, name: string) => void }) => {
  const [selectedDaap, setSelectedDaap] = React.useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>(null)

  const handleFilterSelect = (type: string, name: string) => {
    setSelectedDaap(name);
    setSelectedStatus(type);

    let typeValue = type || selectedStatus || "all";
    let nameValue = name || selectedDaap || "";

    onFilterSelect(typeValue, nameValue)
  }

  return (
    <div className="flex justify-between space-x-4 mb-2 items-center ml-2">
      <div>
        {/* <Badge variant="secondary">Filter</Badge> */}
      </div>
      <div className="flex space-x-1">
        <div>
          <Button variant="ghost" onClick={() => handleFilterSelect("all", "")}>
            <MinusCircle className="w-6 h-6" />
          </Button>
        </div>
        <div>
          <Select onValueChange={(e) => handleFilterSelect(selectedStatus || "all", e)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Daap" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {daaps.map((daap) => (
                  <SelectItem key={daap} value={daap}>
                    {daap}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select onValueChange={(e) => {
            handleFilterSelect(e, selectedDaap || "")
          }}>
            <SelectTrigger className="w-[180px]"> <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="HIGH">HIGH</SelectItem>
                <SelectItem value="MID">MEDIUM</SelectItem>
                <SelectItem value="LOW">LOW</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default TransactionFilters
