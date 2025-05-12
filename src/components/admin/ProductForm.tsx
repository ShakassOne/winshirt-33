
// Fix typing issues with mockups data
useEffect(() => {
  // Filtrer les mockups par catégorie sélectionnée
  if (selectedCategory && mockups && Array.isArray(mockups) && mockups.length > 0) {
    const matchingMockups = mockups.filter(mockup => mockup.category === selectedCategory);
    if (matchingMockups.length === 1) {
      setValue('mockup_id', matchingMockups[0].id);
    }
  }
}, [selectedCategory, mockups, setValue]);

// Fix the mockup selection section
{selectedCategory && mockups && Array.isArray(mockups) && mockups.filter(m => m.category === selectedCategory).length > 0 && (
  <div className="space-y-2">
    <Label htmlFor="mockup_id">Mockup</Label>
    <select 
      id="mockup_id"
      {...register('mockup_id')}
      className="w-full rounded-md bg-background/10 border border-white/20 px-4 py-2"
    >
      <option value="">Sélectionnez un mockup</option>
      {Array.isArray(mockups) &&
        mockups
          .filter(mockup => mockup.category === selectedCategory)
          .map(mockup => (
            <option key={mockup.id} value={mockup.id}>{mockup.name}</option>
          ))
      }
    </select>
  </div>
)}
