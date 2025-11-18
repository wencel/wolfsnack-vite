import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdSave, MdPlaylistAdd } from 'react-icons/md';
import { FaTrashAlt } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { IoIosArrowDropleft } from 'react-icons/io';
import PageContainer from '@/components/Atoms/PageContainer/PageContainer';
import Card from '@/components/Atoms/Card/Card';
import Form from '@/components/Atoms/Form/Form';
import Input from '@/components/Atoms/Input/Input';
import Button from '@/components/Atoms/Button/Button';
import SubCard from '@/components/Atoms/SubCard/SubCard';
import Checkbox from '@/components/Atoms/Checkbox/Checkbox';
import SearchField from '@/components/Molecules/SearchField/SearchField';
import Calendar from '@/components/Atoms/Calendar/Calendar';
import Label from '@/components/Atoms/Label/Label';
import TopActions from '@/components/Organisms/TopActions/TopActions';
import { textConstants } from '@/lib/appConstants';
import { calculateTotalPriceProduct } from '@/lib/utils';
import { useSales } from '@/hooks/useSales';
import useCustomers from '@/hooks/useCustomers';
import useProducts from '@/hooks/useProducts';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { Customer, Product } from '@/lib/data';
import styles from './AddEditSalePage.module.sass';
import { clearAllErrors } from '@/store/slices/errorSlice';
import Loading from '@/components/Atoms/Loading/Loading';

interface SaleProduct {
  product: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

interface SaleFormData {
  totalPrice: number;
  isThirteenDozen: boolean;
  owes: boolean;
  partialPayment: number | '';
  products: SaleProduct[];
  customer: string;
  saleDate: Date;
}

const AddEditSalePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentSale, fetchSale, createSale, updateSale, resetCurrentSale } =
    useSales();
  const { customers, fetchCustomers, resetCustomers } = useCustomers();
  const { products, fetchProducts, resetProducts } = useProducts();
  const { loading, fetching } = useAppSelector(state => state.loading);

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<SaleFormData>({
    totalPrice: 0,
    isThirteenDozen: false,
    owes: false,
    partialPayment: '',
    products: [],
    customer: '',
    saleDate: new Date(),
  });

  const isEditMode = !!id;

  const updateProduct = (index: number, product: SaleProduct) => {
    const productsToUpdate = [...formData.products];
    productsToUpdate[index] = product;
    setFormData(prev => ({ ...prev, products: productsToUpdate }));
  };

  const addProduct = () => {
    // Check if all products have a product selected
    const areAllProductsSet = formData.products.every(p => p.product);
    if (!areAllProductsSet && formData.products.length > 0) return;

    setFormData(prev => ({
      ...prev,
      products: [
        ...prev.products,
        {
          product: '',
          price: 0,
          quantity: 0,
          totalPrice: 0,
        },
      ],
    }));

    // Scroll to bottom after adding product
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }, 400);
  };

  const removeProduct = (index: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => index !== i),
    }));
  };

  const handleSearchCustomers = (textQuery: string) => {
    resetCustomers();
    if (textQuery) {
      fetchCustomers({ limit: 10, textQuery, isFetching: true });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const partialPaymentNum =
      typeof formData.partialPayment === 'number'
        ? formData.partialPayment
        : parseFloat(String(formData.partialPayment)) || 0;

    const saleData = {
      saleId: isEditMode && currentSale ? currentSale.saleId : 0, // Backend will generate for new sales
      saleDate: formData.saleDate.toISOString(),
      customer: formData.customer,
      isThirteenDozen: formData.isThirteenDozen,
      owes: formData.owes,
      partialPayment: partialPaymentNum,
      totalPrice: formData.totalPrice,
      products: formData.products.map(p => ({
        product: p.product,
        price: p.price,
        quantity: p.quantity,
        totalPrice: p.totalPrice,
      })),
    };

    if (isEditMode && id) {
      updateSale({ id, saleData, navigate });
    } else {
      createSale({ saleData, navigate });
    }
  };

  // Transform products for select options
  const productOptions = products.map(product => ({
    value: product._id,
    label:
      product.fullName ||
      `${product.name} ${product.presentation} ${product.weight}g`,
  }));

  // Transform customers for search field
  const customerSearchItems = customers.map(c => ({
    value: c,
    label: `${c.storeName}${c.name ? ` (${c.name})` : ''}`,
  }));

  const customerDisplayValue = customer
    ? `${customer.storeName}${customer.name ? ` (${customer.name})` : ''}`
    : null;

  // Load products and customers on mount
  useEffect(() => {
    resetProducts();
    resetCustomers();
    fetchProducts({ limit: 100 });
    if (id) {
      fetchSale(id);
    } else {
      // Add initial product row for new sales
      setTimeout(() => {
        addProduct();
      }, 0);
    }

    return () => {
      resetCurrentSale();
      resetCustomers();
      resetProducts();
    };
  }, [
    id,
    fetchSale,
    fetchProducts,
    resetCurrentSale,
    resetCustomers,
    resetProducts,
  ]);

  // Update form data when sale is loaded
  useEffect(() => {
    if (currentSale && isEditMode) {
      setCustomer(currentSale.customer);
      setFormData({
        totalPrice: currentSale.totalPrice,
        isThirteenDozen: currentSale.isThirteenDozen,
        owes: currentSale.owes,
        partialPayment: currentSale.partialPayment,
        products: currentSale.products.map(p => ({
          product: typeof p.product === 'string' ? p.product : p.product._id,
          price: p.price,
          quantity: p.quantity,
          totalPrice: p.totalPrice,
        })),
        customer:
          typeof currentSale.customer === 'string'
            ? currentSale.customer
            : currentSale.customer._id,
        saleDate: new Date(currentSale.saleDate),
      });
    }
  }, [currentSale, isEditMode]);

  // Calculate total price when products change
  useEffect(() => {
    const totalPrice = formData.products.reduce(
      (accumulator, p) => accumulator + p.totalPrice,
      0
    );
    setFormData(prev => ({ ...prev, totalPrice }));
  }, [formData.products]);

  // Recalculate product totals when isThirteenDozen changes
  useEffect(() => {
    const productsToUpdate = formData.products.map(p => ({
      ...p,
      totalPrice: calculateTotalPriceProduct(
        p.price,
        p.quantity,
        formData.isThirteenDozen
      ),
    }));
    setFormData(prev => ({ ...prev, products: productsToUpdate }));
  }, [formData.isThirteenDozen]);

  // Update customer when selected
  useEffect(() => {
    if (customer) {
      setFormData(prev => ({ ...prev, customer: customer._id }));
    }
  }, [customer]);

  // Calculate owes when partialPayment or totalPrice changes
  useEffect(() => {
    const partialPaymentNum =
      typeof formData.partialPayment === 'number'
        ? formData.partialPayment
        : parseFloat(String(formData.partialPayment)) || 0;
    const owes = partialPaymentNum < formData.totalPrice;
    setFormData(prev => ({ ...prev, owes }));
  }, [formData.partialPayment, formData.totalPrice]);

  useEffect(() => {
    dispatch(clearAllErrors());
  }, [dispatch]);

  return (
    <PageContainer>
      <Card
        className={styles.AddEditCard}
        title={
          isEditMode
            ? textConstants.editSale.TITLE
            : textConstants.addSale.TITLE
        }
      >
        <Form onSubmit={handleSubmit}>
          <Loading visible={loading} />
          <TopActions
            buttons={[
              {
                text: textConstants.misc.BACK,
                icon: <IoIosArrowDropleft />,
                onClick: () =>
                  navigate(isEditMode && id ? `/sales/${id}` : '/sales'),
                type: 'button',
              },
              {
                text: textConstants.addSale.ADD_PRODUCT,
                icon: <MdPlaylistAdd />,
                type: 'button',
                onClick: addProduct,
              },
              {
                text: textConstants.misc.SAVE,
                icon: <MdSave />,
                type: 'submit',
              },
            ]}
          />

          <SearchField
            onSearch={handleSearchCustomers}
            isLoading={fetching}
            label={
              <div className={styles.label}>
                <FiSearch />
                {textConstants.addSale.SEARCH_CUSTOMER}
              </div>
            }
            onSelect={value => {
              setCustomer(value as Customer);
            }}
            value={customerDisplayValue}
            valueLabel={textConstants.sale.CUSTOMER}
            itemsList={customerSearchItems}
          />

          <Input
            label={textConstants.sale.TOTAL_PRICE}
            type="number"
            prefix="$"
            value={Number.parseInt(String(formData.totalPrice)) || 0}
            disabled
          />

          <Input
            label={textConstants.sale.PARTIAL_PAYMENT}
            prefix="$"
            type="number"
            value={formData.partialPayment}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              setFormData(prev => ({
                ...prev,
                partialPayment: value === '' ? '' : parseFloat(value) || 0,
              }));
            }}
          />

          <Label className={styles.label}>
            {textConstants.salePage.SALE_DATE}
          </Label>
          <Calendar
            isRange={false}
            onChange={value => {
              const dateValue = Array.isArray(value) ? value[0] : value;
              if (dateValue) {
                setFormData(prev => ({
                  ...prev,
                  saleDate: dateValue,
                }));
              }
            }}
            value={formData.saleDate}
          />

          <div className={styles.checkbox}>
            <Checkbox
              label={textConstants.sale.OWES}
              checked={formData.owes}
              disabled
            />
          </div>

          <div className={styles.checkbox}>
            <Checkbox
              label={textConstants.sale.IS_THIRTEEN_DOZEN}
              checked={formData.isThirteenDozen}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData(prev => ({
                  ...prev,
                  isThirteenDozen: e.target.checked,
                }));
              }}
            />
          </div>

          {formData.products.map((product, index) => (
            <SubCard key={`product-${index}`}>
              {formData.products.length > 1 && (
                <Button
                  theme="RoundWithLabel"
                  onClick={() => removeProduct(index)}
                  type="button"
                  className={styles.trashButton}
                >
                  <FaTrashAlt />
                </Button>
              )}
              <Input
                label={textConstants.sale.PRODUCT}
                type="select"
                options={productOptions}
                value={product.product}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const selectedProduct = products.find(
                    p => p._id === e.target.value
                  );
                  if (selectedProduct) {
                    updateProduct(index, {
                      ...product,
                      product: e.target.value,
                      price: selectedProduct.sellingPrice,
                      totalPrice: calculateTotalPriceProduct(
                        selectedProduct.sellingPrice,
                        product.quantity,
                        formData.isThirteenDozen
                      ),
                    });
                  }
                }}
              />
              <Input
                label={textConstants.sale.QUANTITY}
                type="number"
                value={product.quantity || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const quantity = parseFloat(e.target.value) || 0;
                  updateProduct(index, {
                    ...product,
                    quantity,
                    totalPrice: calculateTotalPriceProduct(
                      product.price,
                      quantity,
                      formData.isThirteenDozen
                    ),
                  });
                }}
              />
              <Input
                label={textConstants.sale.PRICE}
                prefix="$"
                type="number"
                value={product.price}
                disabled
              />
              <Input
                label={textConstants.sale.PRODUCT_TOTAL_PRICE}
                prefix="$"
                type="number"
                value={Number.parseInt(String(product.totalPrice)) || 0}
                disabled
              />
            </SubCard>
          ))}
        </Form>
      </Card>
    </PageContainer>
  );
};

export default AddEditSalePage;
