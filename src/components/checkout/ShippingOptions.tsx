
import React from 'react';
import { ShippingOption } from '@/types/shipping.types';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Truck, Clock } from 'lucide-react';

interface ShippingOptionsProps {
  options: ShippingOption[];
  selectedOption: string;
  onOptionChange: (optionId: string) => void;
}

const ShippingOptions: React.FC<ShippingOptionsProps> = ({
  options,
  selectedOption,
  onOptionChange
}) => {
  const formatEstimatedDays = (min: number, max: number) => {
    if (min === max) {
      return `${min} jour${min > 1 ? 's' : ''}`;
    }
    return `${min}-${max} jours`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Truck className="h-5 w-5 text-rose-500" />
        <h3 className="text-lg font-semibold">Options de livraison</h3>
      </div>
      
      <RadioGroup value={selectedOption} onValueChange={onOptionChange}>
        {options.map((option) => (
          <Label
            key={option.id}
            htmlFor={option.id}
            className="cursor-pointer"
          >
            <Card className={`transition-colors ${
              selectedOption === option.id 
                ? 'ring-2 ring-rose-500 bg-rose-50/50' 
                : 'hover:bg-gray-50/50'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{option.name}</p>
                        {option.description && (
                          <p className="text-sm text-gray-600">{option.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {formatEstimatedDays(option.estimated_days_min, option.estimated_days_max)} ouvrés
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        {option.price > 0 ? (
                          <Badge variant="outline" className="text-lg font-semibold">
                            {option.price.toFixed(2)} €
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-lg font-semibold text-green-600">
                            Gratuit
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
};

export default ShippingOptions;
