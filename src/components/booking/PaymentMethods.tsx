"use client";

import { CreditCard, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface PaymentMethodsProps {
  paymentMethod: string;
  formData: any;
  setFormData: (data: any) => void;
}

export default function PaymentMethods({ paymentMethod, formData, setFormData }: PaymentMethodsProps) {
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-6">Select Payment Method</h3>
      
      {/* Payment Method Selection */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card
          className={`cursor-pointer transition-all border-2 ${
            paymentMethod === "card"
              ? "border-amber-500 ring-2 ring-amber-200"
              : "border-gray-200 hover:border-amber-300"
          }`}
          onClick={() => setFormData({ ...formData, payment_method: "card" })}
        >
          <CardContent className="p-4 text-center">
            <CreditCard className="h-8 w-8 mx-auto mb-2 text-amber-600" />
            <p className="font-semibold text-sm">Credit/Debit Card</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all border-2 ${
            paymentMethod === "telebirr"
              ? "border-amber-500 ring-2 ring-amber-200"
              : "border-gray-200 hover:border-amber-300"
          }`}
          onClick={() => setFormData({ ...formData, payment_method: "telebirr" })}
        >
          <CardContent className="p-4 text-center">
            <Phone className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <p className="font-semibold text-sm">TeleBirr</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all border-2 ${
            paymentMethod === "cbe"
              ? "border-amber-500 ring-2 ring-amber-200"
              : "border-gray-200 hover:border-amber-300"
          }`}
          onClick={() => setFormData({ ...formData, payment_method: "cbe" })}
        >
          <CardContent className="p-4 text-center">
            <CreditCard className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <p className="font-semibold text-sm">CBE Bank</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all border-2 ${
            paymentMethod === "awash"
              ? "border-amber-500 ring-2 ring-amber-200"
              : "border-gray-200 hover:border-amber-300"
          }`}
          onClick={() => setFormData({ ...formData, payment_method: "awash" })}
        >
          <CardContent className="p-4 text-center">
            <CreditCard className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <p className="font-semibold text-sm">Awash Bank</p>
          </CardContent>
        </Card>
      </div>

      {/* Card Payment Form */}
      {paymentMethod === "card" && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-800 mb-2 block">Cardholder Name</label>
            <Input
              value={formData.card_name}
              onChange={(e) => setFormData({ ...formData, card_name: e.target.value })}
              className="border-2 border-gray-300 focus:border-amber-500"
              placeholder="John Doe"
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-semibold text-gray-800 mb-2 block">Card Number</label>
            <Input
              value={formData.card_number}
              onChange={(e) => setFormData({ ...formData, card_number: e.target.value })}
              className="border-2 border-gray-300 focus:border-amber-500"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-800 mb-2 block">Expiry Date</label>
              <Input
                value={formData.card_expiry}
                onChange={(e) => setFormData({ ...formData, card_expiry: e.target.value })}
                className="border-2 border-gray-300 focus:border-amber-500"
                placeholder="MM/YY"
                maxLength={5}
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800 mb-2 block">CVV</label>
              <Input
                value={formData.card_cvv}
                onChange={(e) => setFormData({ ...formData, card_cvv: e.target.value })}
                className="border-2 border-gray-300 focus:border-amber-500"
                placeholder="123"
                maxLength={3}
                type="password"
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* TeleBirr Payment Form */}
      {paymentMethod === "telebirr" && (
        <div className="space-y-4">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-green-800 font-semibold mb-2">TeleBirr Mobile Payment</p>
            <p className="text-xs text-green-700">Enter your TeleBirr registered phone number</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-800 mb-2 block">Phone Number</label>
            <Input
              value={formData.telebirr_phone}
              onChange={(e) => setFormData({ ...formData, telebirr_phone: e.target.value })}
              className="border-2 border-gray-300 focus:border-green-500"
              placeholder="+251 9XX XXX XXX"
              required
            />
          </div>
        </div>
      )}

      {/* CBE Bank Payment Form */}
      {paymentMethod === "cbe" && (
        <div className="space-y-4">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800 font-semibold mb-2">Commercial Bank of Ethiopia</p>
            <p className="text-xs text-blue-700">Enter your CBE account details</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-800 mb-2 block">Account Holder Name</label>
            <Input
              value={formData.bank_holder}
              onChange={(e) => setFormData({ ...formData, bank_holder: e.target.value })}
              className="border-2 border-gray-300 focus:border-blue-500"
              placeholder="Account holder name"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-800 mb-2 block">Account Number</label>
            <Input
              value={formData.bank_account}
              onChange={(e) => setFormData({ ...formData, bank_account: e.target.value })}
              className="border-2 border-gray-300 focus:border-blue-500"
              placeholder="1000XXXXXXXX"
              required
            />
          </div>
        </div>
      )}

      {/* Awash Bank Payment Form */}
      {paymentMethod === "awash" && (
        <div className="space-y-4">
          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-orange-800 font-semibold mb-2">Awash Bank</p>
            <p className="text-xs text-orange-700">Enter your Awash Bank account details</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-800 mb-2 block">Account Holder Name</label>
            <Input
              value={formData.bank_holder}
              onChange={(e) => setFormData({ ...formData, bank_holder: e.target.value })}
              className="border-2 border-gray-300 focus:border-orange-500"
              placeholder="Account holder name"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-800 mb-2 block">Account Number</label>
            <Input
              value={formData.bank_account}
              onChange={(e) => setFormData({ ...formData, bank_account: e.target.value })}
              className="border-2 border-gray-300 focus:border-orange-500"
              placeholder="01XXXXXXXXXX"
              required
            />
          </div>
        </div>
      )}

      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-blue-800">
          <strong>Demo Mode:</strong> This is a simulation. No actual payment will be processed.
        </p>
      </div>
    </div>
  );
}
