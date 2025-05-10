
import React, { useEffect } from 'react';
import { useProductDetail } from '@/hooks/useProductDetail';
import { useProductInteractions } from '@/hooks/useProductInteractions';

import ProductImageSection from '@/components/product/ProductImageSection';
import ProductOrderSection from '@/components/product/ProductOrderSection';
import CustomizationPanel from '@/components/product/CustomizationPanel';
import DesignGalleryDialog from '@/components/product/DesignGalleryDialog';
import LotterySelector from '@/components/product/LotterySelector';
import ProductDescription from '@/components/product/ProductDescription';
import ProductHeader from '@/components/product/ProductHeader';
import ProductColorSelector from '@/components/product/ProductColorSelector';
import ProductSizeSelector from '@/components/product/ProductSizeSelector';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ProductDetail = () => {
  // Get all state and computed values from the hook
  const productDetailState = useProductDetail();
  
  const {
    product,
    mockup,
    isLoading,
    currentViewSide,
    setCurrentViewSide,
    customizationMode,
    setCustomizationMode,
    designDialogOpen,
    setDesignDialogOpen,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    selectedMockupColor,
    setSelectedMockupColor,
    quantity,
    selectedDesignFront,
    selectedDesignBack,
    designTransformFront,
    designTransformBack,
    textContentFront,
    textContentBack,
    textTransformFront,
    textTransformBack,
    textFontFront,
    textFontBack,
    textColorFront,
    textColorBack,
    textStylesFront,
    textStylesBack,
    isDragging,
    isDraggingText,
    uniqueCategories,
    filteredDesigns,
    activeLotteries,
    setIsDragging,
    setIsDraggingText,
    setStartPos,
    setStartPosText
  } = productDetailState;

  // Get all interaction handlers from the hook
  const {
    fileInputRef,
    productCanvasRef,
    handleMouseDown,
    handleMouseUp,
    handleQuantityChange,
    handleDesignSelect,
    handleDesignTransformChange,
    handleTextTransformChange,
    handleLotteryToggle,
    handleFileUpload,
    calculatePrice,
    handleAddToCart,
    getProductImage,
    getCurrentDesign,
    getCurrentDesignTransform,
    getCurrentTextContent,
    getCurrentTextTransform,
    getCurrentTextFont,
    getCurrentTextColor,
    getCurrentTextStyles
  } = useProductInteractions(productDetailState);

  // Handle mouse movement for dragging
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent | TouchEvent) => {
      let clientX: number, clientY: number;
      
      if ('touches' in event) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }

      if (isDragging) {
        const deltaX = clientX - productDetailState.startPos.x;
        const deltaY = clientY - productDetailState.startPos.y;
        
        if (productDetailState.activeDesignSide === 'front') {
          productDetailState.setDesignTransformFront(prev => ({
            ...prev,
            position: {
              x: prev.position.x + deltaX,
              y: prev.position.y + deltaY
            }
          }));
        } else {
          productDetailState.setDesignTransformBack(prev => ({
            ...prev,
            position: {
              x: prev.position.x + deltaX,
              y: prev.position.y + deltaY
            }
          }));
        }
        
        setStartPos({ x: clientX, y: clientY });
      } else if (isDraggingText) {
        const deltaX = clientX - productDetailState.startPosText.x;
        const deltaY = clientY - productDetailState.startPosText.y;
        
        if (productDetailState.activeTextSide === 'front') {
          productDetailState.setTextTransformFront(prev => ({
            ...prev,
            position: {
              x: prev.position.x + deltaX,
              y: prev.position.y + deltaY
            }
          }));
        } else {
          productDetailState.setTextTransformBack(prev => ({
            ...prev,
            position: {
              x: prev.position.x + deltaX,
              y: prev.position.y + deltaY
            }
          }));
        }
        
        setStartPosText({ x: clientX, y: clientY });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, isDraggingText, productDetailState]);

  // Prevent scroll on touch devices when dragging
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (isDragging || isDraggingText) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchmove', preventScroll, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [isDragging, isDraggingText]);

  if (isLoading || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-700 h-10 w-10"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-700 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Product Header with back button and title */}
          <ProductHeader 
            name={product.name} 
            price={calculatePrice()} 
            isNew={product.is_new}
          />

          {/* Product display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column - Product Image */}
            <ProductImageSection 
              product={product}
              mockup={mockup}
              customizationMode={customizationMode}
              currentViewSide={currentViewSide}
              setCurrentViewSide={setCurrentViewSide}
              selectedMockupColor={selectedMockupColor}
              getProductImage={getProductImage}
              selectedDesignFront={selectedDesignFront}
              selectedDesignBack={selectedDesignBack}
              designTransformFront={designTransformFront}
              designTransformBack={designTransformBack}
              textContentFront={textContentFront}
              textContentBack={textContentBack}
              textTransformFront={textTransformFront}
              textTransformBack={textTransformBack}
              textFontFront={textFontFront}
              textFontBack={textFontBack}
              textColorFront={textColorFront}
              textColorBack={textColorBack}
              textStylesFront={textStylesFront}
              textStylesBack={textStylesBack}
              handleMouseDown={handleMouseDown}
              productCanvasRef={productCanvasRef}
              isDragging={isDragging}
              isDraggingText={isDraggingText}
            />
            
            {/* Right column - Product Info */}
            <div className="space-y-6">
              {/* Product customization */}
              {product.is_customizable && (
                <CustomizationPanel 
                  customizationMode={customizationMode}
                  setCustomizationMode={setCustomizationMode}
                  currentViewSide={currentViewSide}
                  setDesignDialogOpen={setDesignDialogOpen}
                  handleFileUpload={handleFileUpload}
                  fileInputRef={fileInputRef}
                  selectedDesignFront={selectedDesignFront}
                  selectedDesignBack={selectedDesignBack}
                  textContentFront={textContentFront}
                  setTextContentFront={productDetailState.setTextContentFront}
                  textContentBack={textContentBack}
                  setTextContentBack={productDetailState.setTextContentBack}
                  textFontFront={textFontFront}
                  setTextFontFront={productDetailState.setTextFontFront}
                  textFontBack={textFontBack}
                  setTextFontBack={productDetailState.setTextFontBack}
                  textColorFront={textColorFront}
                  setTextColorFront={productDetailState.setTextColorFront}
                  textColorBack={textColorBack}
                  setTextColorBack={productDetailState.setTextColorBack}
                  textShowColorPickerFront={productDetailState.textShowColorPickerFront}
                  setTextShowColorPickerFront={productDetailState.setTextShowColorPickerFront}
                  textShowColorPickerBack={productDetailState.textShowColorPickerBack}
                  setTextShowColorPickerBack={productDetailState.setTextShowColorPickerBack}
                  textStylesFront={textStylesFront}
                  setTextStylesFront={productDetailState.setTextStylesFront}
                  textStylesBack={textStylesBack}
                  setTextStylesBack={productDetailState.setTextStylesBack}
                  designTransformFront={designTransformFront}
                  designTransformBack={designTransformBack}
                  textTransformFront={textTransformFront}
                  textTransformBack={textTransformBack}
                  handleDesignTransformChange={handleDesignTransformChange}
                  handleTextTransformChange={handleTextTransformChange}
                  printSizeFront={productDetailState.printSizeFront}
                  setPrintSizeFront={productDetailState.setPrintSizeFront}
                  printSizeBack={productDetailState.printSizeBack}
                  setPrintSizeBack={productDetailState.setPrintSizeBack}
                  activeDesignSide={productDetailState.activeDesignSide}
                  activeTextSide={productDetailState.activeTextSide}
                  setActiveDesignSide={productDetailState.setActiveDesignSide}
                  setActiveTextSide={productDetailState.setActiveTextSide}
                  getCurrentDesign={getCurrentDesign}
                  getCurrentDesignTransform={getCurrentDesignTransform}
                  getCurrentTextContent={getCurrentTextContent}
                  getCurrentTextTransform={getCurrentTextTransform}
                  getCurrentTextFont={getCurrentTextFont}
                  getCurrentTextColor={getCurrentTextColor}
                  getCurrentTextStyles={getCurrentTextStyles}
                />
              )}

              {/* Color selection */}
              {product.available_colors && product.available_colors.length > 0 && (
                <ProductColorSelector
                  title="Couleur"
                  colors={product.available_colors}
                  selectedColor={selectedColor || ''}
                  onColorSelect={setSelectedColor}
                />
              )}

              {/* Mockup colors */}
              {customizationMode && mockup?.colors && mockup.colors.length > 0 && (
                <ProductColorSelector
                  title="Couleur du produit"
                  colors={mockup.colors}
                  selectedColor={selectedMockupColor || mockup.colors[0]}
                  onColorSelect={setSelectedMockupColor}
                  isMockupColor={true}
                />
              )}

              {/* Size selection */}
              {product.available_sizes && product.available_sizes.length > 0 && (
                <ProductSizeSelector
                  sizes={product.available_sizes}
                  selectedSize={selectedSize}
                  onSizeSelect={setSelectedSize}
                />
              )}

              {/* Quantity and Add to cart */}
              <ProductOrderSection
                quantity={quantity}
                handleQuantityChange={handleQuantityChange}
                handleAddToCart={handleAddToCart}
              />

              {/* Lottery tickets */}
              {product.tickets_offered && product.tickets_offered > 0 && (
                <LotterySelector
                  product={product}
                  activeLotteries={activeLotteries}
                  selectedLotteries={productDetailState.selectedLotteries}
                  handleLotteryToggle={handleLotteryToggle}
                />
              )}
              
              {/* Product description */}
              <ProductDescription 
                product={product}
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* Design gallery dialog */}
      <DesignGalleryDialog
        isOpen={designDialogOpen}
        setIsOpen={setDesignDialogOpen}
        designs={filteredDesigns}
        uniqueCategories={uniqueCategories}
        selectedCategoryFilter={selectedCategoryFilter}
        setSelectedCategoryFilter={setSelectedCategoryFilter}
        handleDesignSelect={handleDesignSelect}
        isLoading={productDetailState.isLoadingDesigns}
      />
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
