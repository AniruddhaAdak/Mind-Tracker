import React from 'react';
import { ButtonGroup, Button, ChipList, Chip } from '@progress/kendo-react-buttons';
import { DropdownList } from '@progress/kendo-react-dropdowns';
import { Input } from '@progress/kendo-react-inputs';
import { Badge } from '@progress/kendo-react-indicators';

const FilterPanel = ({ platforms, selectedPlatform, onPlatformChange, onSearch }) => {
    return (
        <div className="filter-panel">
            <h3>Filter Options</h3>
            <div className="filter-group">
                <label htmlFor="platform-select">Select Platform:</label>
                <DropdownList
                    data={platforms}
                    textField="name"
                    dataItemKey="id"
                    value={selectedPlatform}
                    onChange={onPlatformChange}
                    id="platform-select"
                />
            </div>
            <div className="filter-group">
                <label htmlFor="search-input">Search Posts:</label>
                <Input
                    id="search-input"
                    placeholder="Search by keyword..."
                    onChange={onSearch}
                />
            </div>
            <div className="filter-group">
                <h4>Selected Filters:</h4>
                <ChipList>
                    {/* Example chips, replace with dynamic data as needed */}
                    <Chip>Filter 1</Chip>
                    <Chip>Filter 2</Chip>
                </ChipList>
            </div>
            <ButtonGroup>
                <Button primary onClick={() => console.log('Apply Filters')}>Apply</Button>
                <Button onClick={() => console.log('Reset Filters')}>Reset</Button>
            </ButtonGroup>
            <Badge
                themeColor="success"
                style={{ marginTop: '10px' }}
            >
                Active Filters: 2
            </Badge>
        </div>
    );
};

export default FilterPanel;