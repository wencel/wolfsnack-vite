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
import useCustomers from '@/hooks/useCustomers';
import useLocalities from '@/hooks/useLocalities';

interface CustomerFormData {
  storeName: string;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
  secondaryPhoneNumber: string;
  locality: string;
  town: string;
  idNumber: string;
}

const AddEditCustomerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentCustomer, fetchCustomer, createCustomer, updateCustomer } =
    useCustomers();
  const { localities, fetchLocalities } = useLocalities();

  const [formData, setFormData] = useState<CustomerFormData>({
    storeName: '',
    name: '',
    address: '',
    email: '',
    phoneNumber: '',
    secondaryPhoneNumber: '',
    locality: '',
    town: '',
    idNumber: '',
  });

  // Track original customer data for comparison in edit mode
  const [originalCustomerData, setOriginalCustomerData] =
    useState<CustomerFormData | null>(null);

  const isEditMode = !!id;

  // Load localities on mount
  useEffect(() => {
    fetchLocalities();
  }, [fetchLocalities]);

  // Load customer data if in edit mode
  useEffect(() => {
    if (id) {
      fetchCustomer(id);
    }
  }, [id, fetchCustomer]);

  // Update form data when customer data is loaded
  useEffect(() => {
    if (currentCustomer && isEditMode) {
      const customerFormData = {
        storeName: currentCustomer.storeName || '',
        name: currentCustomer.name || '',
        address: currentCustomer.address || '',
        email: currentCustomer.email || '',
        phoneNumber: currentCustomer.phoneNumber || '',
        secondaryPhoneNumber: currentCustomer.secondaryPhoneNumber || '',
        locality: currentCustomer.locality || '',
        town: currentCustomer.town || '',
        idNumber: currentCustomer.idNumber || '',
      };
      setFormData(customerFormData);
      setOriginalCustomerData(customerFormData);
    }
  }, [currentCustomer, isEditMode]);

  const handleInputChange = (field: keyof CustomerFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode && id) {
      // Only send changed fields in edit mode
      const originalData = originalCustomerData || {};
      const changedFields = getChangedFields(originalData, formData);
      updateCustomer({ id, customerData: changedFields, navigate });
      // Navigation and error handling are done by the thunk
    } else {
      createCustomer({ customerData: formData, navigate });
      // Navigation and error handling are done by the thunk
    }
  };

  return (
    <PageContainer>
      <Card
        title={
          isEditMode
            ? textConstants.editCustomer.TITLE
            : textConstants.addCustomer.TITLE
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
            label={textConstants.customer.STORE_NAME}
            value={formData.storeName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange('storeName', e.target.value)
            }
            required
          />

          <Input
            label={textConstants.customer.ID_NUMBER}
            type="text"
            value={formData.idNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange('idNumber', e.target.value)
            }
          />

          <Input
            label={textConstants.customer.NAME}
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange('name', e.target.value)
            }
          />

          <Input
            label={textConstants.customer.ADDRESS}
            value={formData.address}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange('address', e.target.value)
            }
            required
          />

          <Input
            label={textConstants.customer.EMAIL}
            type="email"
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange('email', e.target.value)
            }
          />

          <Input
            label={textConstants.customer.PHONE_NUMBER}
            type="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange('phoneNumber', e.target.value)
            }
            required
          />

          <Input
            label={textConstants.customer.SECONDARY_PHONE_NUMBER}
            type="phoneNumber"
            value={formData.secondaryPhoneNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange('secondaryPhoneNumber', e.target.value)
            }
          />

          <Input
            label={textConstants.customer.LOCALITY}
            type="select"
            options={localities}
            value={formData.locality}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleInputChange('locality', e.target.value)
            }
          />

          <Input
            label={textConstants.customer.TOWN}
            value={formData.town}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange('town', e.target.value)
            }
          />
        </Form>
      </Card>
    </PageContainer>
  );
};

export default AddEditCustomerPage;
