import { useState,useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PropertyList } from './components/PropertyList';
import { PropertyDetail } from './components/PropertyDetail';
import { PropertyCard } from './components/PropertyCard';
import { AuthDialog } from './components/AuthDialog';
import { SellPropertyForm } from './components/SellPropertyForm';
import { Footer } from './components/Footer';
import { Toaster } from './components/ui/sonner';
import { fetchProp } from '../Services/api/apicalls';
import userPool from '../Services/Cognito/Userpool';
import { Routes , Route, useNavigate } from 'react-router-dom';

function App() {
  console.log("APP RENDERED")
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [properties,setProperties]=useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user,setUser]=useState(null)
  const navigate= useNavigate()
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const handleSearch = (searchTerm, propertyType) => {
    let filtered = properties;
    
    // Filter by property 
    if (propertyType !== 'all') {
      filtered = filtered.filter(p => p.type === propertyType);
    }

    // Filter by search term (location or title)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.title.toLowerCase().includes(term) ||
          p.location.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }

    setSearchResults(filtered);
    setCurrentPage('buy');
  };

  const handlePropertyClick = (property) => {
    console.log(property)
    setSelectedProperty(property);
    setCurrentPage('detail');
    console.log("zoom")

  };

  const handleNavigate = (page) => {
    console.log("properties:", properties)
    setCurrentPage(page);
    navigate("/")
    
    // Set appropriate property filters based on navigation
    // if (page === 'buy') {
    //   const filtered = properties.filter(p => Number(p.for_sale) === 1);
    //   console.log("buy filtered:", filtered);
    //   setSearchResults(filtered);
    //   // setSearchResults(properties.filter(p => p.for_sale==1));
    //   // console.log("buy:",searchResults)
    // } else if (page === 'rent') {
    //   const filtered = properties.filter(p => Number(p.for_sale) === 0);
    //   console.log("buy filtered:", filtered);
    //   setSearchResults(filtered);
    // } else if (page === 'home') {
    //   setSearchResults(properties);
    // }
  };

  const getFilteredProperties = () => {

  if (currentPage === "buy") {
    return properties.filter(p => p.RENT_SALE === "SALE");
    console.log("buy_properties",properties)
  }

  if (currentPage === "rent") {
    console.log("buy_properties",properties)
    return properties.filter(p => p.RENT_SALE === "RENT");
    
  }

  return properties;
};

  console.log(selectedProperty,"sp")

  useEffect(() => {

  const fetchProperties = async () => {

    try {

      const response = await fetchProp();

      console.log("RAW API:", response);

      // Axios
      const lambdaPayload = response.data;

      // If native fetch use:
      // const lambdaPayload = await response.json();

      console.log("LAMBDA PAYLOAD:", lambdaPayload);

      //const parsed = JSON.parse(lambdaPayload.body);

      //console.log("FINAL DATA:", parsed);

      setProperties(lambdaPayload);        // ✅ array
      setSearchResults(lambdaPayload);     // ✅ array

    } catch (err) {
      console.error(err);
    }

  };

  fetchProperties();

}, []);

  useEffect(() => {
    const cognitoUser = userPool.getCurrentUser();
    
    if (!cognitoUser) {
      setIsAuthLoading(false);
      return;
    }

    cognitoUser.getSession((err, session) => {
      if (err || !session?.isValid()) {
        setIsAuthLoading(false);
        return;
      }

      const payload = session.getIdToken().decodePayload();
      const role = payload["cognito:groups"]?.[0] || payload["custom:role"] || "user";

      cognitoUser.getUserAttributes((err, attributes) => {
        if (!err && attributes) {
          const attrMap = {};
          console.log(attributes)
          attributes.forEach(attr => {
            attrMap[attr.getName()] = attr.getValue();
          });

          setUser({
            firstName: attrMap["custom:firstName"] || "User",
            email: attrMap["email"],
            role: role,
            sub: payload.sub
          });
          console.log(user,"user_details")
        }
        setIsAuthLoading(false); 
      });
    });
  }, []);


  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero onSearch={handleSearch} />
            <div className="container mx-auto px-4 py-12">
              <h2 className="text-3xl mb-2">Featured Properties</h2>
              <p className="text-gray-600 mb-8">Handpicked properties just for you</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(properties) &&
                  properties
                   
                    .slice(0, 6)
                    .map(property => (
                      <PropertyCard
                        key={property.PROPERTY_ID}
                        property={property}
                        onClick={() => handlePropertyClick(property)}
                      />
                ))}

              </div>
            </div>
          </>
        );

      case 'buy':
        return (
          <PropertyList
            key={currentPage}
            properties={getFilteredProperties}
            onPropertyClick={handlePropertyClick}
            title="Properties for Sale"
          />
        );

      case 'rent':
        return (
          <PropertyList
          key={currentPage}
            properties={getFilteredProperties}
            onPropertyClick={handlePropertyClick}
            title="Properties for Rent"
          />
        );

      case 'sell':
        return <SellPropertyForm />;

      case 'detail':
        return selectedProperty ? (
          <PropertyDetail
            property={selectedProperty}
            onBack={() => setCurrentPage('buy')}
          />
        ) : null;

      default:
        return null;
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        user={user}
        isLoading={isAuthLoading}
        onNavigate={handleNavigate}
        currentPage={currentPage}
        
      />
      
      <main className="flex-1">
       <Routes>

    <Route path="/" element={renderContent()} />

    <Route
      path="/auth"
      element={<AuthDialog setUser={setUser} />}
    />

  </Routes>
      </main>

      <Footer />

      {/* <AuthDialog setUser={setUser} /> */}
      
      <Toaster />
    </div>
  );
}

export default App;
