import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdSave, MdPlaylistAdd } from 'react-icons/md';
import { FaTrashAlt } from 'react-icons/fa';
import { IoIosArrowDropleft } from 'react-icons/io';
import PageContainer from '@/components/Atoms/PageContainer/PageContainer';
import Card from '@/components/Atoms/Card/Card';
import Form from '@/components/Atoms/Form/Form';
import Input from '@/components/Atoms/Input/Input';
import Button from '@/components/Atoms/Button/Button';
import SubCard from '@/components/Atoms/SubCard/SubCard';
import Calendar from '@/components/Atoms/Calendar/Calendar';
import Label from '@/components/Atoms/Label/Label';
import TopActions from '@/components/Organisms/TopActions/TopActions';
import { textConstants } from '@/lib/appConstants';
import { useOrders } from '@/hooks/useOrders';
import useProducts from '@/hooks/useProducts';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import styles from './AddEditOrderPage.module.sass';
import { clearAllErrors } from '@/store/slices/errorSlice';
import Loading from '@/components/Atoms/Loading/Loading';
import type { CreateOrderData } from '@/store/slices/ordersSlice';

interface OrderProduct {
  product: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

interface OrderFormData {
  totalPrice: number;
  products: OrderProduct[];
  orderDate: Date;
}

const AddEditOrderPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentOrder,
    fetchOrder,
    createOrder,
    updateOrder,
    resetCurrentOrder,
  } = useOrders();
  const { products, fetchProducts, resetProducts } = useProducts();
  const { loading } = useAppSelector(state => state.loading);

  const [formData, setFormData] = useState<OrderFormData>({
    totalPrice: 0,
    products: [],
    orderDate: new Date(),
  });

  const isEditMode = !!id;

  const updateProduct = (index: number, product: OrderProduct) => {
    const productsToUpdate = [...formData.products];
    productsToUpdate[index] = product;
    setFormData(prev => ({ ...prev, products: productsToUpdate }));
  };

  const addProduct = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const orderData: Partial<CreateOrderData> = {
      totalPrice: formData.totalPrice,
      products: formData.products.map(p => ({
        product: p.product,
        price: p.price,
        quantity: p.quantity,
        totalPrice: p.totalPrice,
      })),
    };

    if (isEditMode && id) {
      orderData.orderDate = formData.orderDate.toISOString();
      updateOrder({ id, orderData, navigate });
    } else {
      orderData.orderId = 0;
      orderData.orderDate = formData.orderDate.toISOString();
      createOrder({ orderData: orderData as CreateOrderData, navigate });
    }
  };

  // Transform products for select options
  const productOptions = products.map(product => ({
    value: product._id,
    label:
      product.fullName ||
      `${product.name} ${product.presentation} ${product.weight}g`,
  }));

  // Load products on mount
  useEffect(() => {
    resetProducts();
    resetCurrentOrder();
    fetchProducts({ limit: 100 });
  }, [resetProducts, resetCurrentOrder, fetchProducts]);

  useEffect(() => {
    if (id) {
      fetchOrder(id);
    } else {
      // Add initial product when creating new order
      setFormData(prev => ({
        ...prev,
        products: [
          {
            product: '',
            price: 0,
            quantity: 0,
            totalPrice: 0,
          },
        ],
      }));
    }
  }, [id, fetchOrder]);

  // Update form data when order is loaded
  useEffect(() => {
    if (currentOrder && isEditMode) {
      setFormData({
        totalPrice: currentOrder.totalPrice,
        products: currentOrder.products.map(p => ({
          product: p.product,
          price: p.price,
          quantity: p.quantity,
          totalPrice: p.totalPrice,
        })),
        orderDate: new Date(currentOrder.orderDate),
      });
    }
  }, [currentOrder, isEditMode]);

  // Calculate total price when products change
  useEffect(() => {
    const totalPrice = formData.products.reduce(
      (accumulator, p) => accumulator + p.totalPrice,
      0
    );
    setFormData(prev => ({ ...prev, totalPrice }));
  }, [formData.products]);

  useEffect(() => {
    dispatch(clearAllErrors());
  }, [dispatch]);

  return (
    <PageContainer>
      <Card
        className={styles.AddEditCard}
        title={
          isEditMode
            ? textConstants.editOrder.TITLE
            : textConstants.addOrder.TITLE
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
                  navigate(isEditMode && id ? `/orders/${id}` : '/orders'),
                type: 'button',
              },
              {
                text: textConstants.addOrder.ADD_PRODUCT,
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

          <Input
            label={textConstants.order.TOTAL_PRICE}
            type="number"
            prefix="$"
            value={Number.parseInt(String(formData.totalPrice)) || 0}
            disabled
          />

          <Label className={styles.label} htmlFor="order-date">
            {textConstants.orderPage.ORDER_DATE}
          </Label>
          <Calendar
            id="order-date"
            isRange={false}
            onChange={value => {
              const dateValue = Array.isArray(value) ? value[0] : value;
              if (dateValue) {
                setFormData(prev => ({
                  ...prev,
                  orderDate: dateValue,
                }));
              }
            }}
            value={formData.orderDate}
          />

          {formData.products.map((product, index) => (
            <SubCard key={`product-${index}`}>
              {formData.products.length > 1 && (
                <Button
                  theme="RoundWithLabel"
                  onClick={() => removeProduct(index)}
                  type="button"
                  className={styles.trashButton}
                  aria-label={textConstants.product.DELETE_PRODUCT}
                >
                  <FaTrashAlt />
                </Button>
              )}
              <Input
                label={textConstants.order.PRODUCT}
                type="select"
                options={[
                  { value: '', label: 'Seleccione un producto' },
                  ...productOptions,
                ]}
                value={product.product}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const selectedProduct = products.find(
                    p => p._id === e.target.value
                  );
                  if (selectedProduct) {
                    updateProduct(index, {
                      ...product,
                      product: e.target.value,
                      price: selectedProduct.basePrice,
                      totalPrice: selectedProduct.basePrice * product.quantity,
                    });
                  }
                }}
              />
              <Input
                label={textConstants.order.QUANTITY}
                type="number"
                value={product.quantity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const quantity = parseFloat(e.target.value) || 0;
                  updateProduct(index, {
                    ...product,
                    quantity,
                    totalPrice: product.price * quantity,
                  });
                }}
              />
              <Input
                label={textConstants.order.PRICE}
                prefix="$"
                type="number"
                value={product.price}
                disabled
              />
              <Input
                label={textConstants.order.PRODUCT_TOTAL_PRICE}
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

export default AddEditOrderPage;
