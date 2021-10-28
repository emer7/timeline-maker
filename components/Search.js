import React from 'react';
import { Search as SearchIcon } from '@material-ui/icons';

export const Search = ({ handleSearch }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchResultOrder, setSearchResultOrder] = React.useState(0);
  const handleOnSearchTermChange = e => {
    const { value } = e.target;

    setSearchTerm(value);
    setSearchResultOrder(0);
    handleSearch(value, 0);
  };
  const handleOnSearchKeyDown = e => {
    const { code } = e;

    if (code === 'Enter') {
      setSearchResultOrder(searchResultOrder + 1);
      handleSearch(searchTerm, searchResultOrder + 1);
    }
  };

  return (
    <div className="py-2 px-4 w-[250px] rounded-lg bg-white shadow-lg text-center">
      <SearchIcon className="mr-4" />
      <input
        className="focus:outline-none"
        placeholder="Search"
        value={searchTerm}
        onChange={handleOnSearchTermChange}
        onKeyDown={handleOnSearchKeyDown}
      />
    </div>
  );
};
