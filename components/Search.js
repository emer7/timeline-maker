import React from 'react';
import { Search as SearchIcon } from '@material-ui/icons';

export const Search = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const handleOnSearchTermChange = e => {
    const { value } = e.target;

    setSearchTerm(value);
  };

  return (
    <div className="py-2 px-4 w-[250px] rounded-lg bg-white shadow-lg text-center">
      <SearchIcon className="mr-4" />
      <input
        className="focus:outline-none"
        placeholder="Search"
        value={searchTerm}
        onChange={handleOnSearchTermChange}
      />
    </div>
  );
};
