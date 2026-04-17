import React, { useState } from 'react';
import { Plus, X, Edit, Check } from 'lucide-react';

// Multi-select cards component
export const MultiSelectCards: React.FC<{
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  maxSelection?: number;
  title: string;
  description: string;
}> = ({ options, value = [], onChange, maxSelection, title, description }) => {
  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
          <Check className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-sm text-gray-500 flex items-center">
          <span className="mr-2">☑️ Select maximum {maxSelection} options</span>
          <button className="text-blue-500 hover:text-blue-600">🔄 Regenerate options</button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = value.includes(option);
          return (
            <button
              key={option}
              onClick={() => {
                if (isSelected) {
                  onChange(value.filter(v => v !== option));
                } else if (!maxSelection || value.length < maxSelection) {
                  onChange([...value, option]);
                }
              }}
              className={`p-4 text-center border rounded-lg transition-colors ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Problem-Solution mapping component
export const ProblemSolutionMapping: React.FC<{
  problems: string[];
  solutions: { [key: string]: string };
  onChange: (solutions: { [key: string]: string }) => void;
}> = ({ problems, solutions = {}, onChange }) => {
  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
          <Check className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">How does your business solve these problems?</h3>
          <p className="text-gray-600 text-sm">
            Explain how your business solves each problem and the benefits that customers get when using your product or service.
          </p>
        </div>
      </div>
      
      <div className="mb-4">
        <button className="text-blue-500 hover:text-blue-600 text-sm">🔄 Regenerate options</button>
      </div>
      
      <div className="space-y-4">
        {problems.map((problem) => (
          <div key={problem} className="flex gap-4 items-center">
            <div className="flex-1">
              <h4 className="font-medium mb-2">Problems</h4>
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                {problem}
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                ⟷
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Solutions</h4>
                <button className="text-blue-500 hover:text-blue-600">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg bg-blue-500 text-white">
                <textarea
                  value={solutions[problem] || ''}
                  onChange={(e) => onChange({
                    ...solutions,
                    [problem]: e.target.value
                  })}
                  placeholder="Enter solution..."
                  className="w-full bg-transparent text-white placeholder-white/70 resize-none border-none focus:outline-none"
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Ownership table component
export const OwnershipTable: React.FC<{
  owners: Array<{ name: string; percentage: number }>;
  onChange: (owners: Array<{ name: string; percentage: number }>) => void;
}> = ({ owners = [], onChange }) => {
  const addOwner = () => {
    onChange([...owners, { name: '', percentage: 0 }]);
  };

  const updateOwner = (index: number, field: 'name' | 'percentage', value: string | number) => {
    const newOwners = [...owners];
    newOwners[index] = { ...newOwners[index], [field]: value };
    onChange(newOwners);
  };

  const removeOwner = (index: number) => {
    onChange(owners.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
          <Check className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Who are the business owners?</h3>
          <p className="text-gray-600 text-sm">
            List the names of the owners and their percent ownership in the company.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {owners.map((owner, index) => (
          <div key={index} className="flex gap-3 items-center">
            <input
              type="text"
              placeholder="Shareholder name"
              value={owner.name}
              onChange={(e) => updateOwner(index, 'name', e.target.value)}
              className="flex-1 p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <div className="relative">
              <input
                type="number"
                placeholder="80"
                value={owner.percentage}
                onChange={(e) => updateOwner(index, 'percentage', parseInt(e.target.value) || 0)}
                className="w-24 p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
            </div>
            <button
              onClick={() => removeOwner(index)}
              className="p-2 text-gray-400 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addOwner}
        className="mt-4 flex items-center text-blue-500 hover:text-blue-600"
      >
        <Plus className="w-4 h-4 mr-1" />
        Add More
      </button>
    </div>
  );
};

// Competitor matrix component
export const CompetitorMatrix: React.FC<{
  competitors: string[];
  factors: string[];
  ratings: { [key: string]: { [key: string]: 'good' | 'average' | 'poor' } };
  onChange: (ratings: { [key: string]: { [key: string]: 'good' | 'average' | 'poor' } }) => void;
}> = ({ competitors, factors, ratings = {}, onChange }) => {
  const updateRating = (competitor: string, factor: string, rating: 'good' | 'average' | 'poor') => {
    const newRatings = {
      ...ratings,
      [competitor]: {
        ...ratings[competitor],
        [factor]: rating
      }
    };
    onChange(newRatings);
  };

  const getRatingColor = (rating: 'good' | 'average' | 'poor') => {
    switch (rating) {
      case 'good': return 'bg-green-500';
      case 'average': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
          <Check className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Competitor Analysis</h3>
          <p className="text-gray-600 text-sm">
            Compare yourself and each competitor along the critical success factors. Green means best in class. 
            Yellow means average performance. Red means poor performance or not available at all.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 text-left font-medium bg-blue-500 text-white">
                Critical Success Factors
              </th>
              {competitors.map((competitor) => (
                <th key={competitor} className="p-4 text-center font-medium bg-gray-100">
                  {competitor}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {factors.map((factor) => (
              <tr key={factor} className="border-b">
                <td className="p-4 font-medium bg-blue-500 text-white">
                  {factor}
                </td>
                {competitors.map((competitor) => (
                  <td key={competitor} className="p-4 text-center bg-gray-50">
                    <div className="flex justify-center space-x-2">
                      {(['good', 'average', 'poor'] as const).map((rating) => (
                        <button
                          key={rating}
                          onClick={() => updateRating(competitor, factor, rating)}
                          className={`w-8 h-8 rounded-full ${
                            ratings[competitor]?.[factor] === rating
                              ? getRatingColor(rating)
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Location table component
export const LocationTable: React.FC<{
  locations: Array<{ name: string; description: string; size: string; location: string; status: string }>;
  onChange: (locations: Array<{ name: string; description: string; size: string; location: string; status: string }>) => void;
}> = ({ locations = [], onChange }) => {
  const addLocation = () => {
    onChange([...locations, { name: 'Office', description: '', size: '', location: '', status: 'Existing' }]);
  };

  const updateLocation = (index: number, field: string, value: string) => {
    const newLocations = [...locations];
    newLocations[index] = { ...newLocations[index], [field]: value };
    onChange(newLocations);
  };

  const removeLocation = (index: number) => {
    onChange(locations.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">List your company's physical locations.</h3>
        <p className="text-gray-600 text-sm">
          This might be your office, store locations, manufacturing plants, storage facilities, etc.
        </p>
      </div>

      <div className="space-y-4">
        {locations.map((location, index) => (
          <div key={index} className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 border border-gray-200 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={location.name}
                onChange={(e) => updateLocation(index, 'name', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                placeholder="Type here"
                value={location.description}
                onChange={(e) => updateLocation(index, 'description', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
              <input
                type="text"
                placeholder="Type here"
                value={location.size}
                onChange={(e) => updateLocation(index, 'size', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="Type here"
                value={location.location}
                onChange={(e) => updateLocation(index, 'location', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={location.status}
                  onChange={(e) => updateLocation(index, 'status', e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded focus:border-blue-500 focus:outline-none"
                >
                  <option value="Existing">Existing</option>
                  <option value="Planned">Planned</option>
                </select>
              </div>
              <button
                onClick={() => removeLocation(index)}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addLocation}
        className="mt-4 flex items-center text-blue-500 hover:text-blue-600"
      >
        <Plus className="w-4 h-4 mr-1" />
        Add More
      </button>
    </div>
  );
}; 