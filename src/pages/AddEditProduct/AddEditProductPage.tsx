import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdSave } from 'react-icons/md';
import { IoIosArrowDropleft } from 'react-icons/io';
import Card from '@/components/Atoms/Card';
import PageContainer from '@/components/Atoms/PageContainer';
import Form from '@/components/Atoms/Form';
import Input from '@/components/Atoms/Input';
import TopActions from '@/components/Organisms/TopActions';
import { textConstants } from '@/lib/appConstants';
import { getChangedFields } from '@/lib/utils';
import useProducts from '@/hooks/useProducts';
import usePresentations from '@/hooks/usePresentations';
import useProductTypes from '@/hooks/useProductTypes';

interface ProductFormData {
  name: string;
  presentation: string;
  weight: number | '';
  basePrice: number | '';
  sellingPrice: number | '';
  stock: number | '';
}

const AddEditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentProduct, fetchProduct, createProduct, updateProduct } =
    useProducts();
  const { presentations, fetchPresentations } = usePresentations();
  const { productTypes, fetchProductTypes } = useProductTypes();

  // Transform API responses to the format expected by Input component
  const presentationOptions = presentations.map(presentation => ({
    value: presentation,
    label: presentation,
  }));

  const productTypeOptions = productTypes.map(productType => ({
    value: productType,
    label: productType,
  }));

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    presentation: '',
    weight: '',
    basePrice: '',
    sellingPrice: '',
    stock: '',
  });

  // Track original product data for comparison in edit mode
  const [originalProductData, setOriginalProductData] =
    useState<ProductFormData | null>(null);

  const isEditMode = !!id;

  // Load presentations and product types on mount
  useEffect(() => {
    fetchPresentations();
    fetchProductTypes();
  }, [fetchPresentations, fetchProductTypes]);

  // Load product data if in edit mode
  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id, fetchProduct]);

  // Update form data when product data is loaded
  useEffect(() => {
    if (currentProduct && isEditMode) {
      const productFormData = {
        name: currentProduct.name || '',
        presentation: currentProduct.presentation || '',
        weight: currentProduct.weight || ('' as number | ''),
        basePrice: currentProduct.basePrice || ('' as number | ''),
        sellingPrice: currentProduct.sellingPrice || ('' as number | ''),
        stock: currentProduct.stock || ('' as number | ''),
      };
      setFormData(productFormData);
      setOriginalProductData(productFormData);
    }
  }, [currentProduct, isEditMode]);

  const handleInputChange = (
    field: keyof ProductFormData,
    value: string | number
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert empty strings to undefined for optional fields
    const productData = {
      name: formData.name,
      presentation: formData.presentation || undefined,
      weight: formData.weight || undefined,
      basePrice: formData.basePrice || undefined,
      sellingPrice: formData.sellingPrice || undefined,
      stock: formData.stock || undefined,
    };

    if (isEditMode && id) {
      // Only send changed fields in edit mode
      const originalData = originalProductData
        ? {
            name: originalProductData.name,
            presentation: originalProductData.presentation || undefined,
            weight: originalProductData.weight || undefined,
            basePrice: originalProductData.basePrice || undefined,
            sellingPrice: originalProductData.sellingPrice || undefined,
            stock: originalProductData.stock || undefined,
          }
        : {};

      const changedFields = getChangedFields(originalData, productData);
      updateProduct({ id, productData: changedFields, navigate });
      // Navigation and error handling are done by the thunk
    } else {
      createProduct({ productData, navigate });
      // Navigation and error handling are done by the thunk
    }
  };

  return (
    <PageContainer>
      {id && (
        <Card
          title={textConstants.misc.WARNING}
          description={textConstants.addProduct.WARNING_EDIT}
        />
      )}
      <Card
        title={
          isEditMode
            ? textConstants.editProduct.TITLE
            : textConstants.addProduct.TITLE
        }
      >
        <Form onSubmit={handleSubmit}>
          <TopActions
            buttons={[
              {
                text: textConstants.misc.BACK,
                icon: <IoIosArrowDropleft />,
                onClick: () => navigate(-1),
                type: 'button',
              },
              {
                text: textConstants.misc.SAVE,
                icon: <MdSave />,
                type: 'submit',
              },
            ]}
          />

          <Input
            label={textConstants.product.NAME}
            type="select"
            options={productTypeOptions}
            value={formData.name}
            disabled={!!id}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleInputChange('name', e.target.value)
            }
            required
          />

          <Input
            label={textConstants.product.PRESENTATION}
            type="select"
            options={presentationOptions}
            value={formData.presentation}
            disabled={!!id}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleInputChange('presentation', e.target.value)
            }
            required
          />

          <Input
            label={textConstants.product.WEIGHT}
            type="number"
            value={formData.weight}
            suffix=" g"
            disabled={!!id}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange('weight', e.target.value)
            }
            required
          />

          <Input
            label={textConstants.product.BASE_PRICE}
            type="number"
            value={formData.basePrice}
            prefix="$"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange('basePrice', e.target.value)
            }
            required
          />

          <Input
            label={textConstants.product.SELLING_PRICE}
            type="number"
            value={formData.sellingPrice}
            prefix="$"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange('sellingPrice', e.target.value)
            }
            required
          />

          <Input
            label={textConstants.product.STOCK}
            type="number"
            value={formData.stock}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange('stock', e.target.value)
            }
            required
          />
        </Form>
      </Card>
    </PageContainer>
  );
};

export default AddEditProductPage;
