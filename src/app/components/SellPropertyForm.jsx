import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import userPool from '../../Services/Cognito/Userpool';
import { v4 } from 'uuid'
import { addProperties } from '../../Services/api/apicalls';
export function SellPropertyForm() {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    price: '',
    location: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    forSale: 'sale',
    amenities: '',
    yearBuilt: '',
    image:'',
    imageBase64:''
  });

  const [user,setUser]=useState("")

  const handleFileChange = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  console.log("Selected file:", file);

  // Store raw file
  setFormData((prev) => ({
    ...prev,
    image: file
  }));

  // Convert to Base64 (optional)
  const reader = new FileReader();

  reader.readAsDataURL(file);

  reader.onloadend = () => {
    const base64 = reader.result.split(",")[1];

    setFormData((prev) => ({
      ...prev,
      imageBase64: base64   // separate field if needed
    }));
  };
};




  const handleSubmit = async(e) => {
    console.log(formData)
    

    e.preventDefault();
    if(user){
    const uid= v4()
    const propertyAdd=new FormData()
    propertyAdd.append("propertyId",uid)
    propertyAdd.append('title',formData.title)
    propertyAdd.append("type",formData.type)
    propertyAdd.append("price",formData.price)
    propertyAdd.append("location",formData.location)
    propertyAdd.append("area",formData.area)
    propertyAdd.append("bedrooms",formData.bedrooms)
    propertyAdd.append("bathrooms",formData.bathrooms)
    propertyAdd.append("description",formData.description)
    propertyAdd.append("forSale",formData.forSale)
    propertyAdd.append("amenities",formData.amenities)
    propertyAdd.append("yearBuilt",formData.yearBuilt)
    propertyAdd.append("imageBase64",formData.imageBase64)
    propertyAdd.append("userEmail",user)
    // Mock form submission
    console.log('Property listing details:', user);

    const result= await addProperties(propertyAdd)
    console.log(result)
    if(result.success){
            toast.success('Property listing submitted successfully! Our team will review it shortly.');
            
            // Reset form
            setFormData({
              title: '',
              type: '',
              price: '',
              location: '',
              area: '',
              bedrooms: '',
              bathrooms: '',
              description: '',
              forSale: 'sale',
              amenities: '',
              yearBuilt:'',
              image:'',
              imageBase64:''
            });}}
      else{
        toast.error("Please Login or Register")
      }
  };

  useEffect(()=>{
    const user=userPool.getCurrentUser()
    if (!user) return
     user.getSession((err, session) => {
      if (err || !session?.isValid()) return;

      user.getUserAttributes((err, attributes) => {
        if (err) return;

        const data = {};
        attributes.forEach(attr => {
          data[attr.getName()] = attr.getValue();
        });
        
       setUser(data.email)
       console.log("userdata",user)
      });
    });

   },[])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">List Your Property</CardTitle>
            <p className="text-gray-600">Fill in the details below to list your property</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Property Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      placeholder="e.g., Modern Family Home"
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Property Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                        <SelectItem value="building">Building</SelectItem>
                        <SelectItem value="rental">Rental</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="forSale">Listing Type *</Label>
                    <Select
                      value={formData.forSale}
                      onValueChange={(value) => setFormData({ ...formData, forSale: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="price">{formData.forSale === 'sale' ? 'Sale Price' : 'Monthly Rent'} *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      placeholder="e.g., 450000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                      placeholder="City, State"
                    />
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div>
                <h3 className="text-lg mb-4">Property Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="area">Area (sq ft) *</Label>
                    <Input
                      id="area"
                      type="number"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      required
                      placeholder="e.g., 2500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="yearBuilt">Year Built</Label>
                    <Input
                      id="yearBuilt"
                      type="number"
                      value={formData.yearBuilt}
                      onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value })}
                      placeholder="e.g., 2020"
                      min="1800"
                      max="2026"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      placeholder="e.g., 4"
                      min="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      placeholder="e.g., 3"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={5}
                  placeholder="Describe your property..."
                />
              </div>

              {/* Amenities */}
              <div>
                <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                <Input
                  id="amenities"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  placeholder="e.g., Garage, Garden, Modern Kitchen"
                />
              </div>

                        {/* Images */}
                        <div>
            <Label>Property Images</Label>

            <label
              htmlFor="cover"
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer block"
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />

              <input
                required
                hidden
                type="file"
                id="cover"
                onChange={handleFileChange}
              />

              <p className="text-gray-600 mb-2">
                Click to upload or drag and drop
              </p>

              <p className="text-sm text-gray-500">
                PNG, JPG up to 10MB
              </p>

              {/* Feedback */}
              {formData.image && (
  <img
    src={URL.createObjectURL(formData.image)}
    alt="preview"
    className="mt-4 h-40 object-cover rounded-lg mx-auto"
  />
)}
            </label>
          </div>


              {/* Submit Button */}
              <Button type="submit" size="lg" className="w-full">
                Submit Property Listing
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="mb-2">What happens next?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Our team will review your listing within 24 hours</li>
              <li>• You'll receive a confirmation email once approved</li>
              <li>• Your property will be visible to thousands of potential buyers</li>
              <li>• You can manage your listing anytime from your dashboard</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
