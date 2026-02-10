import { Bed, Bath, MapPin, Square } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function PropertyCard({ property, onClick }) {
  const formatPrice = (price, forSale) => {
    return forSale
      ? `$${price.toLocaleString()}`
      : `$${price.toLocaleString()}/mo`;
  };

  const getPropertyTypeLabel = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={property.image_url}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-blue-600 text-white">
            {getPropertyTypeLabel(property.type)}
          </Badge>
          {property.featured && (
            <Badge className="bg-yellow-500 text-white">Featured</Badge>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <Badge className="bg-green-600 text-white">
            {property.for_sale ? 'For Sale' : 'For Rent'}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="text-lg mb-1">{property.title}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{property.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Square className="h-4 w-4" />
            <span>{property.area.toLocaleString()} sq ft</span>
          </div>
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms} beds</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms} baths</span>
            </div>
          )}
        </div>

        <div className="text-2xl text-blue-600">
          {formatPrice(property.price, property.forSale)}
        </div>
      </CardContent>
    </Card>
  );
}
