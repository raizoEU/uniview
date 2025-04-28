import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UniversityPage({ params }: { params: { id: string } }) {
  // Mock data for university and its listings
  const university = {
    id: params.id,
    name: "Example University",
    description: "A leading institution for higher education.",
    listings: [
      {
        id: 1,
        name: "Student Apartment near Campus",
        price: 550,
        image: "https://source.unsplash.com/random/400x300?dorm",
      },
      {
        id: 2,
        name: "Shared House for Postgrads",
        price: 450,
        image: "https://source.unsplash.com/random/400x300?house",
      },
      {
        id: 3,
        name: "Studio in University District",
        price: 600,
        image: "https://source.unsplash.com/random/400x300?studio",
      },
    ],
  };

  return (

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">{university.name}</h1>
        <p className="mb-8">{university.description}</p>

        <h2 className="text-2xl font-semibold mb-4">
          Available Accommodations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {university.listings.map((listing) => (
            <Card key={listing.id}>
              <CardHeader className="p-0">
                <img
                  src={listing.image || "/placeholder.svg"}
                  alt={listing.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2">{listing.name}</CardTitle>
                <p className="font-bold mb-2">£{listing.price}/month</p>
                <Button>View Details</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

  );
}
