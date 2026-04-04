"use client";

import { Card, CardContent } from "@/components/ui/card";

interface BookingSummaryProps {
  destinations: any[];
  roomTypes: any[];
  packages: any[];
  formData: any;
  priceCalculation: any;
}

export default function BookingSummary({
  destinations,
  roomTypes,
  packages,
  formData,
  priceCalculation,
}: BookingSummaryProps) {
  const calculateTotal = () => {
    let total = priceCalculation?.room_total_etb || 0;
    
    formData.selected_packages.forEach((pkgId: string) => {
      const pkg = packages.find((p) => p.id === pkgId);
      if (pkg) {
        total += pkg.price_etb;
      }
    });
    
    return total;
  };

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h3>
        
        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Destination</p>
            <p className="font-semibold text-gray-900">
              {destinations.find((d) => d.code === formData.destination_code)?.name}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Room Type</p>
            <p className="font-semibold text-gray-900">
              {roomTypes.find((r) => r.room_type === formData.room_type)?.room_type_name}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Check-In</p>
              <p className="font-semibold text-gray-900">{formData.check_in}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Check-Out</p>
              <p className="font-semibold text-gray-900">{formData.check_out}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Guests</p>
            <p className="font-semibold text-gray-900">
              {formData.adults} Adult{formData.adults > 1 ? "s" : ""}
              {formData.children > 0 && `, ${formData.children} Child${formData.children > 1 ? "ren" : ""}`}
            </p>
          </div>
        </div>

        <div className="border-t-2 border-amber-300 pt-4 space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Room ({priceCalculation?.nights} nights)</span>
            <span className="font-semibold">ETB {priceCalculation?.room_total_etb.toLocaleString()}</span>
          </div>
          
          {formData.selected_packages.length > 0 && (
            <>
              {formData.selected_packages.map((pkgId: string) => {
                const pkg = packages.find((p) => p.id === pkgId);
                return pkg ? (
                  <div key={pkgId} className="flex justify-between text-gray-700">
                    <span>{pkg.name}</span>
                    <span className="font-semibold">ETB {pkg.price_etb.toLocaleString()}</span>
                  </div>
                ) : null;
              })}
            </>
          )}
          
          <div className="border-t-2 border-amber-400 pt-2 flex justify-between text-xl font-bold text-gray-900">
            <span>Total Amount</span>
            <span>ETB {calculateTotal().toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
