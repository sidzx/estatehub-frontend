// import { Bed, Bath, MapPin, Square } from 'lucide-react';
// import { Card, CardContent } from './ui/card';
// import { Badge } from './ui/badge';
// import { ImageWithFallback } from './figma/ImageWithFallback';

// export function PropertyCard({ property, onClick }) {
//   const formatPrice = (price, forSale) => {
//     return forSale=="SALE"
//       ? `₹${price.toLocaleString()}`
//       : `₹${price.toLocaleString()}/mo`;
//   };

//   const getPropertyTypeLabel = (type) => {
//     return type.charAt(0).toUpperCase() + type.slice(1);
//   };


//   return (
//     <Card 
//       className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
//       onClick={onClick}
//     >
//       <div className="relative aspect-[4/3] overflow-hidden">
//         <ImageWithFallback
//           src={property.IMAGES}
//           alt={property.TITLE}
//           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//         />
//         <div className="absolute top-3 left-3 flex gap-2">
//           <Badge className="bg-blue-600 text-white">
//             {getPropertyTypeLabel(property.TYPE)}
//           </Badge>
//           {property.featured && (
//             <Badge className="bg-yellow-500 text-white">Featured</Badge>
//           )}
//         </div>
//         <div className="absolute top-3 right-3">
//           <Badge className="bg-green-600 text-white">
//             {property.RENT_SALE }
//           </Badge>
//         </div>
//       </div>
      
//       <CardContent className="p-4">
//         <div className="mb-2">
//           <h3 className="text-lg mb-1">{property.TITLE}</h3>
//           <div className="flex items-center gap-1 text-sm text-gray-600">
//             <MapPin className="h-4 w-4" />
//             <span>{property.CITY}</span>
//           </div>
//         </div>

//         <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
//           <div className="flex items-center gap-1">
//             <Square className="h-4 w-4" />
//             <span>{property.AREA.toLocaleString()} sq ft</span>
//           </div>
//           {property.BEDROOM >0 && (
//             <div className="flex items-center gap-1">
//               <Bed className="h-4 w-4" />
//               <span>{property.BEDROOM} beds</span>
//             </div>
//           )}
//           {property.BATHROOM >0 && (
//             <div className="flex items-center gap-1">
//               <Bath className="h-4 w-4" />
//               <span>{property.BATHROOM} baths</span>
//             </div>
//           )}
//         </div>

//         <div className="text-2xl text-blue-600">
//           {formatPrice(property.PRICE, property.RENT_SALE)}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
import { Bed, Bath, MapPin, Square } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

const BUCKET_BASE_URL = "https://real-estate-property-image.s3.ap-south-2.amazonaws.com/";

export function PropertyCard({ property, onClick }) {
  // 1. Handle potential stringified JSON and pick the first image
  let firstImageUrl = "/placeholder-property.jpg"; // Default fallback
  try {
    const images = typeof property.IMAGES === 'string' 
      ? JSON.parse(property.IMAGES) 
      : property.IMAGES;

    if (Array.isArray(images) && images.length > 0) {
      firstImageUrl = `${BUCKET_BASE_URL}${images[0]}`;
    }
  } catch (e) {
    console.error("Error parsing property images:", e);
  }

  const formatPrice = (price, forSale) => {
    if (!price) return "Price on Request";
    const numericPrice = Number(price).toLocaleString('en-IN');
    return forSale === "SALE"
      ? `₹${numericPrice}`
      : `₹${numericPrice}/mo`;
  };

  const getPropertyTypeLabel = (type) => {
    if (!type) return "Property";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={firstImageUrl}
          alt={property.TITLE}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-blue-600 text-white">
            {getPropertyTypeLabel(property.TYPE)}
          </Badge>
          {property.FEATURED && (
            <Badge className="bg-yellow-500 text-white">Featured</Badge>
          )}
        </div>
        
        <div className="absolute top-3 right-3">
          <Badge className="bg-green-600 text-white">
            {property.RENT_SALE}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold mb-1 truncate">{property.TITLE}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{property.CITY || property.LOCATION}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Square className="h-4 w-4" />
            <span>{Number(property.AREA || 0).toLocaleString()} sq ft</span>
          </div>
          {Number(property.BEDROOM) > 0 && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.BEDROOM} beds</span>
            </div>
          )}
          {Number(property.BATHROOM) > 0 && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.BATHROOM} baths</span>
            </div>
          )}
        </div>

        <div className="text-xl font-bold text-blue-600">
          {formatPrice(property.PRICE, property.RENT_SALE)}
        </div>
      </CardContent>
    </Card>
  );
}