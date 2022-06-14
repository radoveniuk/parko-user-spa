export default 1;
// import React, { useEffect, useState } from 'react';

// import { IUser } from 'interfaces/users.interface';
// import useDebounce from 'hooks/useDebounce';
// import { useGetUserList } from 'api/query/userQuery';
// import Input from 'components/shared/Input';

// import { UserSearchWrapper } from './styles';
// import Autocomplete from 'components/shared/Autocomplete';

// type Props = {
//   onSelect(items: IUser[]): void
// }

// const UserSearch = ({
//   onSelect,
// }: Props) => {
//   const [search, setSearch] = useState('');
//   const debouncedSearch = useDebounce(search);
//   const { data, isFetching, isLoading } = useGetUserList({ search: debouncedSearch });

//   useEffect(() => {
//     if (debouncedSearch) {
//       refetch();
//     }
//   }, [debouncedSearch, refetch]);

//   return (
//     <UserSearchWrapper>
//       <Autocomplete
//         loading={isFetching || isLoading}
//         options={}
//       />
//       <Input onChange={(e) => void setSearch(e.target.value)} />
//       <div className="search-results">
//         {data?.map((item) => (
//           <div key={item._id}>
//             {item.email}
//           </div>
//         ))}
//       </div>
//       <div className="selected-items"></div>
//       <div className="dialog-actions"></div>
//     </UserSearchWrapper>
//   );
// };

// export default UserSearch;
