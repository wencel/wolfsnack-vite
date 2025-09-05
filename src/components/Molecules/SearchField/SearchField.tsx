import React, { useState, useEffect } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { idGenerator } from '@/lib/utils';
import classnames from 'classnames';
import styles from './SearchField.module.sass';
import Input from '@/components/Atoms/Input';
import Button from '@/components/Atoms/Button/Button';
import InlineLoading from '@/components/Atoms/InlineLoading';
import type { Customer } from '@/lib/data';

export type SearchItemValue = string | number | null | Customer;
export interface SearchItem {
  value: SearchItemValue;
  label: string;
}

export interface SearchFieldProps {
  className?: string;
  label?: string | React.ReactNode;
  onSearch?: (value: string) => void;
  isLoading?: boolean;
  itemsList: SearchItem[];
  onSelect?: (value: SearchItemValue) => void;
  value?: SearchItemValue;
  valueLabel?: string;
}

const SearchField: React.FC<SearchFieldProps> = ({
  className,
  label = 'Buscar',
  onSearch = () => {},
  isLoading = false,
  itemsList,
  onSelect = () => {},
  value,
  valueLabel,
}) => {
  const [inputValue, setInputValue] = useState('');
  const searchFieldClasses = classnames({
    [className || '']: !!className,
    [styles.SearchField]: true,
  });
  const listClasses = classnames({
    [styles.visible]: isLoading || itemsList.length > 0 || inputValue,
    [styles.listContainer]: true,
  });
  const selectItem = (val: string | number | null) => () => {
    setInputValue('');
    onSelect(val);
  };
  useEffect(() => {
    onSearch(inputValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);
  return (
    <>
      <div className={searchFieldClasses}>
        <Input
          label={label}
          type='text'
          value={inputValue}
          id='search-input'
          className={styles.input}
          options={[]}
          ref={undefined}
          onChange={(
            e: React.ChangeEvent<
              HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
            >
          ) => {
            setInputValue(e.target.value);
          }}
        />
        {(isLoading || itemsList.length > 0 || inputValue) && (
          <button
            className={styles.cancelButton}
            type='button'
            onClick={selectItem(null)}
            aria-label="Limpiar búsqueda"
          >
            <RiCloseLine />
          </button>
        )}
        <div className={listClasses}>
          {isLoading && <InlineLoading />}
          {inputValue && itemsList.length === 0 && !isLoading && (
            <div>No hay resultado de la busqueda</div>
          )}
          {inputValue &&
            itemsList.length > 0 &&
            !isLoading &&
            itemsList.map(item => (
              <Button
                key={idGenerator()}
                type='button'
                theme='Outline'
                onClick={selectItem(item.value as string | number | null)}
                className={styles.button}
              >
                {item.label}
              </Button>
            ))}
        </div>
      </div>
      {value && (
        <div className={styles.relative}>
          <Input
            label={valueLabel}
            type='text'
            value={value as string | number}
            id='search-value-input'
            className={styles.input}
            options={[]}
            ref={undefined}
            disabled
          />
          <button
            className={styles.cancelButton}
            type='button'
            onClick={selectItem(null)}
            aria-label="Limpiar valor seleccionado"
            data-testid="search-cancel-button"
          >
            <RiCloseLine />
          </button>
        </div>
      )}
    </>
  );
};

export default SearchField;
