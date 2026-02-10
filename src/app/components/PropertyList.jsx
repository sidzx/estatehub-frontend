import { PropertyCard } from './PropertyCard';
import { Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { useState } from 'react';

export function PropertyList({ properties, onPropertyClick, title, showFilters = true }) {
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'featured',
    propertyType: 'all',
    priceRange: [0, 5000000],
    bedrooms: 'all',
  });

  const [filteredProperties, setFilteredProperties] = useState(properties);

  const applyFilters = () => {
    let filtered = [...properties];

    // Filter by type
    if (filters.propertyType !== 'all') {
      filtered = filtered.filter(p => p.type === filters.propertyType);
    }

    // Filter by bedrooms
    if (filters.bedrooms !== 'all') {
      const bedroomCount = parseInt(filters.bedrooms);
      filtered = filtered.filter(p => p.bedrooms === bedroomCount);
    }

    // Filter by price
    filtered = filtered.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.yearBuilt || 0) - (a.yearBuilt || 0));
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    setFilteredProperties(filtered);
    setShowFilterPanel(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl mb-2">{title || 'All Properties'}</h2>
          <p className="text-gray-600">
            Showing {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
          </p>
        </div>
        
        {showFilters && (
          <Button
            variant="outline"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilterPanel && showFilters && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <Label>Sort By</Label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Property Type</Label>
                <Select
                  value={filters.propertyType}
                  onValueChange={(value) => setFilters({ ...filters, propertyType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="house">Houses</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                    <SelectItem value="building">Buildings</SelectItem>
                    <SelectItem value="rental">Rentals</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Bedrooms</Label>
                <Select
                  value={filters.bedrooms}
                  onValueChange={(value) => setFilters({ ...filters, bedrooms: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Price Range: €{filters.priceRange[0].toLocaleString()} - €{filters.priceRange[1].toLocaleString()}</Label>
                <Slider
                  min={0}
                  max={5000000}
                  step={50000}
                  value={filters.priceRange}
                  onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button onClick={applyFilters}>Apply Filters</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({
                    sortBy: 'featured',
                    propertyType: 'all',
                    priceRange: [0, 5000000],
                    bedrooms: 'all',
                  });
                  setFilteredProperties(properties);
                }}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Property Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onClick={() => onPropertyClick(property)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No properties found matching your criteria.</p>
          <Button
            variant="outline"
            onClick={() => {
              setFilters({
                sortBy: 'featured',
                propertyType: 'all',
                priceRange: [0, 5000000],
                bedrooms: 'all',
              });
              setFilteredProperties(properties);
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
