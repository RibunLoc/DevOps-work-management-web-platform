import React, { ChangeEvent } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import clsx from 'clsx';
import style from './SearchBar.module.css';

interface SearchBarProps {
  placeHolderString: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeHolderString, value, onChange }) => {
  return (
    <div className={style.container}>
      <SearchIcon className={clsx(style.searchicon)} />
      <input
        type="text"
        placeholder={placeHolderString}
        value={value} // Bind value to the input field
        onChange={onChange} // Handle input change
        className={clsx(style.inputText)}
      />
    </div>
  );
};

export default SearchBar;
